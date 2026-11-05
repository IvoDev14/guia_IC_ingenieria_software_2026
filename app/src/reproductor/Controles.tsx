import type { ReactNode } from 'react'
import { useFoto, iteracionDe, useReproductor } from './store'
import { EVENTOS } from '../ui/estados'
import {
  IconoAnterior,
  IconoIteracionAnterior,
  IconoIteracionSiguiente,
  IconoPausa,
  IconoPlay,
  IconoReiniciar,
  IconoSiguiente,
} from '../ui/iconos'
import { Tecla } from '../ui/Panel'

const VELOCIDADES = [
  { nombre: 'Lenta', ms: 1500 },
  { nombre: 'Normal', ms: 800 },
  { nombre: 'Rápida', ms: 300 },
]

/**
 * Tarjeta del paso actual: qué acaba de pasar y cómo moverse.
 * La navegación manual es la protagonista; la reproducción automática queda en segundo plano.
 */
export function Controles() {
  const s = useReproductor()
  const foto = useFoto()
  if (!s.traza || !foto) return null

  const total = s.traza.fotos.length
  const alPrincipio = s.paso === 0
  const alFinal = s.paso >= total - 1
  const evento = EVENTOS[foto.evento.tipo]
  const iteracion = iteracionDe(s.iteraciones, s.paso)
  const tono =
    foto.resultado?.tipo === 'solucion' ? 'ring-emerald-300 bg-emerald-50/60' : foto.resultado ? 'ring-rose-300 bg-rose-50/60' : 'ring-slate-200/80 bg-white'

  return (
    <section className={`shrink-0 rounded-xl p-3 shadow-sm ring-1 ${tono}`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${evento.clase}`}>{evento.texto}</span>
        <span className="ml-auto text-[11px] tabular-nums text-slate-400">
          paso <b className="font-semibold text-slate-700">{s.paso + 1}</b>/{total}
          <span className="mx-1.5 text-slate-300">·</span>
          iteración <b className="font-semibold text-slate-700">{iteracion}</b>/{s.iteraciones.length - 1}
        </span>
      </div>

      <p className="mt-2 min-h-[2.6rem] font-mono text-[12.5px] leading-snug text-slate-800">{s.traza.descripciones[s.paso]}</p>

      <div className="mt-2 flex h-9 gap-1.5">
        <BotonIcono onClick={s.anteriorIteracion} disabled={alPrincipio} titulo="Iteración anterior (Mayús + ←)">
          <IconoIteracionAnterior />
        </BotonIcono>
        <button
          onClick={s.anterior}
          disabled={alPrincipio}
          title="Paso anterior (←)"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <IconoAnterior /> Anterior <Tecla>←</Tecla>
        </button>
        <button
          onClick={s.siguiente}
          disabled={alFinal}
          title="Paso siguiente (→)"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-40"
        >
          <Tecla oscura>→</Tecla> Siguiente <IconoSiguiente />
        </button>
        <BotonIcono onClick={s.siguienteIteracion} disabled={alFinal} titulo="Iteración siguiente (Mayús + →)">
          <IconoIteracionSiguiente />
        </BotonIcono>
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <button
          onClick={s.alternar}
          className={`flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 font-medium transition ${s.reproduciendo ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-100'}`}
          title="Reproducción automática (espacio)"
        >
          {s.reproduciendo ? <IconoPausa /> : <IconoPlay />}
          {s.reproduciendo ? 'Pausar' : 'Auto'}
        </button>
        <select
          className="shrink-0 rounded-md bg-transparent py-1 hover:bg-slate-100"
          value={s.intervaloMs}
          onChange={(e) => s.setIntervalo(Number(e.target.value))}
          aria-label="Velocidad"
        >
          {VELOCIDADES.map((v) => (
            <option key={v.ms} value={v.ms}>{v.nombre}</option>
          ))}
        </select>
        <input
          type="range"
          min={0}
          max={total - 1}
          value={s.paso}
          onChange={(e) => s.irA(Number(e.target.value))}
          className="mx-1 h-1.5 min-w-0 flex-1 cursor-pointer accent-slate-900"
          aria-label="Paso"
        />
        <button onClick={() => s.irA(0)} disabled={alPrincipio} className="shrink-0 rounded-md p-1 hover:bg-slate-100 disabled:opacity-40" title="Volver al inicio (Inicio)" aria-label="Volver al inicio">
          <IconoReiniciar />
        </button>
      </div>
    </section>
  )
}

function BotonIcono({ onClick, disabled, titulo, children }: { onClick: () => void; disabled: boolean; titulo: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      aria-label={titulo}
      className="flex items-center justify-center rounded-lg bg-white px-2.5 text-slate-600 ring-1 ring-slate-300 transition hover:bg-slate-50 disabled:opacity-40"
    >
      {children}
    </button>
  )
}
