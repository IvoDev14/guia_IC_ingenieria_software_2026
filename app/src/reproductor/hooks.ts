import { useEffect } from 'react'
import { useReproductor } from './store'

/** Avanza un paso cada `intervaloMs` mientras está en reproducción automática. */
export function useReproduccionAutomatica() {
  const reproduciendo = useReproductor((s) => s.reproduciendo)
  const intervaloMs = useReproductor((s) => s.intervaloMs)
  const avanzar = useReproductor((s) => s.avanzar)

  useEffect(() => {
    if (!reproduciendo) return
    const t = setInterval(avanzar, intervaloMs)
    return () => clearInterval(t)
  }, [reproduciendo, intervaloMs, avanzar])
}

/**
 * Atajos: ← → paso, Mayús + ← → iteración, Inicio/Fin, espacio reproducir/pausar.
 */
export function useAtajos() {
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, select, textarea, [contenteditable]')) return
      const s = useReproductor.getState()
      const acciones: Record<string, () => void> = {
        ArrowRight: e.shiftKey ? s.siguienteIteracion : s.siguiente,
        ArrowLeft: e.shiftKey ? s.anteriorIteracion : s.anterior,
        Home: () => s.irA(0),
        End: () => s.irA(Infinity),
        ' ': s.alternar,
      }
      const accion = acciones[e.key]
      if (!accion) return
      e.preventDefault()
      accion()
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [])
}
