import type { ReactNode } from 'react'
import { iteracionDe, useReproductor } from './store'
import {
  IconoAnterior,
  IconoIteracionAnterior,
  IconoIteracionSiguiente,
  IconoPausa,
  IconoPlay,
  IconoSiguiente,
} from '../ui/iconos'
import { Tecla } from '../ui/Panel'

const VELOCIDADES = [
  { nombre: 'Lenta', ms: 1500 },
  { nombre: 'Normal', ms: 800 },
  { nombre: 'Rápida', ms: 300 },
]

/**
 * Navegación compacta para la cabecera. Lo principal es avanzar a mano (Siguiente);
 * la reproducción automática queda en un botón pequeño al lado.
 */
export function BarraPasos() {
  const s = useReproductor()
  if (!s.traza) return null

  const total = s.traza.fotos.length
  const alPrincipio = s.paso === 0
  const alFinal = s.paso >= total - 1
  const iteracion = iteracionDe(s.iteraciones, s.paso)

  return (
    <div className="flex items-center gap-1">
      <BotonIcono onClick={s.anteriorIteracion} disabled={alPrincipio} titulo="Iteración anterior (Mayús + ←)">
        <IconoIteracionAnterior />
      </BotonIcono>
      <BotonIcono onClick={s.anterior} disabled={alPrincipio} titulo="Paso anterior (←)">
        <IconoAnterior />
      </BotonIcono>

      <div className="flex w-24 flex-col items-center leading-none" title="Paso / iteración">
        <span className="text-sm font-semibold tabular-nums">
          {s.paso + 1}
          <span className="font-normal text-slate-400"> / {total}</span>
        </span>
        <span className="mt-0.5 text-[10px] tabular-nums text-slate-400">
          iteración {iteracion}/{s.iteraciones.length - 1}
        </span>
      </div>

      <button
        onClick={s.siguiente}
        disabled={alFinal}
        title="Paso siguiente (→)"
        className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 pr-2 pl-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-40"
      >
        Siguiente <IconoSiguiente /> <Tecla oscura siempre>→</Tecla>
      </button>
      <BotonIcono onClick={s.siguienteIteracion} disabled={alFinal} titulo="Iteración siguiente (Mayús + →)">
        <IconoIteracionSiguiente />
      </BotonIcono>

      <span className="mx-1.5 h-5 w-px bg-slate-200" />

      <button
        onClick={s.alternar}
        title="Reproducción automática (espacio)"
        className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium transition ${s.reproduciendo ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        {s.reproduciendo ? <IconoPausa /> : <IconoPlay />}
        {s.reproduciendo ? 'Pausar' : 'Auto'}
      </button>
      <select
        className="h-8 rounded-lg bg-transparent px-1 text-xs text-slate-500 hover:bg-slate-100"
        value={s.intervaloMs}
        onChange={(e) => s.setIntervalo(Number(e.target.value))}
        aria-label="Velocidad"
      >
        {VELOCIDADES.map((v) => (
          <option key={v.ms} value={v.ms}>{v.nombre}</option>
        ))}
      </select>
    </div>
  )
}

/**
 * Línea de tiempo fina bajo la cabecera, estilo reproductor de vídeo: muestra el progreso
 * y el inicio de cada iteración; se puede pulsar o arrastrar para saltar a cualquier paso.
 */
export function LineaTiempo() {
  const traza = useReproductor((s) => s.traza)
  const paso = useReproductor((s) => s.paso)
  const iteraciones = useReproductor((s) => s.iteraciones)
  const irA = useReproductor((s) => s.irA)
  if (!traza) return null

  const ultimo = Math.max(1, traza.fotos.length - 1)
  const pct = (p: number) => `${(p / ultimo) * 100}%`
  const resultado = traza.fotos[paso].resultado
  const relleno = resultado?.tipo === 'solucion' ? 'bg-emerald-500' : resultado ? 'bg-rose-500' : 'bg-slate-800'

  return (
    <div className="group relative h-2.5 shrink-0 border-b border-slate-200 bg-white">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200 transition-all group-hover:h-2">
        <div className={`absolute inset-y-0 left-0 ${relleno}`} style={{ width: pct(paso) }} />
        {iteraciones.slice(1).map((p) => (
          <span key={p} className="absolute top-0 bottom-0 w-px bg-white/70" style={{ left: pct(p) }} />
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={traza.fotos.length - 1}
        value={paso}
        onChange={(e) => irA(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label="Línea de tiempo de pasos"
      />
    </div>
  )
}

function BotonIcono({ onClick, disabled, titulo, children }: { onClick: () => void; disabled: boolean; titulo: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      aria-label={titulo}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
