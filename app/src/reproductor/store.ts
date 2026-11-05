import { create } from 'zustand'
import { ejecutar } from '../core/traza'
import type { Algoritmo, Nodo, Traza } from '../core/tipos'
import type { Ejemplo } from '../ejemplos'

interface Reproductor {
  ejemplo: Ejemplo<unknown> | null
  algoritmo: Algoritmo | null
  traza: Traza<unknown> | null
  /** Pasos en los que empieza cada iteración del bucle "repetir" (inicio + cada `seleccionar`). */
  iteraciones: number[]
  paso: number
  reproduciendo: boolean
  intervaloMs: number
  seleccionado: number | null // nodo elegido en el árbol

  cargar(ejemplo: Ejemplo<unknown>, algoritmo: Algoritmo): void
  /** Navegación manual: siempre pausa la reproducción automática. */
  irA(paso: number): void
  siguiente(): void
  anterior(): void
  siguienteIteracion(): void
  anteriorIteracion(): void
  /** Avance de la reproducción automática. */
  avanzar(): void
  alternar(): void
  setIntervalo(ms: number): void
  seleccionar(id: number | null): void
}

const ultimo = (t: Traza<unknown> | null) => (t ? t.fotos.length - 1 : 0)

/** Índice de la iteración que contiene `paso`. */
export const iteracionDe = (iteraciones: number[], paso: number) => iteraciones.findLastIndex((p) => p <= paso)

export const useReproductor = create<Reproductor>((set, get) => {
  const ir = (paso: number) => set((s) => ({ paso: Math.max(0, Math.min(paso, ultimo(s.traza))), reproduciendo: false }))

  return {
    ejemplo: null,
    algoritmo: null,
    traza: null,
    iteraciones: [0],
    paso: 0,
    reproduciendo: false,
    intervaloMs: 800,
    seleccionado: null,

    cargar: (ejemplo, algoritmo) => {
      const traza = ejecutar(algoritmo, ejemplo.problema)
      const iteraciones = [0, ...traza.eventos.flatMap((e, i) => (e.tipo === 'seleccionar' ? [i] : []))]
      set({ ejemplo, algoritmo, traza, iteraciones, paso: 0, reproduciendo: false, seleccionado: null })
    },
    irA: ir,
    siguiente: () => ir(get().paso + 1),
    anterior: () => ir(get().paso - 1),
    siguienteIteracion: () => {
      const { iteraciones, paso, traza } = get()
      ir(iteraciones.find((p) => p > paso) ?? ultimo(traza))
    },
    anteriorIteracion: () => {
      const { iteraciones, paso } = get()
      ir(iteraciones.findLast((p) => p < paso) ?? 0)
    },
    avanzar: () => {
      const { paso, traza } = get()
      if (paso >= ultimo(traza)) set({ reproduciendo: false })
      else set({ paso: paso + 1 })
    },
    alternar: () =>
      set((s) => {
        if (s.reproduciendo) return { reproduciendo: false }
        // Si está al final, vuelve a empezar.
        return { reproduciendo: true, paso: s.paso >= ultimo(s.traza) ? 0 : s.paso }
      }),
    setIntervalo: (intervaloMs) => set({ intervaloMs }),
    seleccionar: (id) => set((s) => ({ seleccionado: s.seleccionado === id ? null : id })),
  }
})

export const useFoto = () => useReproductor((s) => s.traza?.fotos[s.paso] ?? null)

/** Nodo seleccionado en el árbol (si existe en este paso) o, si no, el nodo actual. */
export function useFoco(): Nodo<unknown> | null {
  const foto = useFoto()
  const seleccionado = useReproductor((s) => s.seleccionado)
  if (!foto) return null
  if (seleccionado !== null && foto.nodos[seleccionado]) return foto.nodos[seleccionado]
  return foto.actual !== null ? foto.nodos[foto.actual] : null
}
