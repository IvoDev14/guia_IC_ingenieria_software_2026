import { useState } from 'react'
import { lineasDeEvento } from '../core/traza'
import { useFoto, useReproductor } from '../reproductor/store'
import { COLORES, EVENTOS } from '../ui/estados'
import { Panel } from '../ui/Panel'

/** Pseudocódigo del algoritmo con el paso actual explicado arriba y sus líneas resaltadas. */
export function Pseudocodigo() {
  const algoritmo = useReproductor((s) => s.algoritmo)
  const traza = useReproductor((s) => s.traza)
  const paso = useReproductor((s) => s.paso)
  const foto = useFoto()
  if (!algoritmo || !traza || !foto) return null
  const activas = new Set(lineasDeEvento(foto.evento))
  const evento = EVENTOS[foto.evento.tipo]
  const tono = foto.resultado?.tipo === 'solucion' ? 'bg-emerald-50 ring-emerald-200' : foto.resultado ? 'bg-rose-50 ring-rose-200' : 'bg-slate-50 ring-slate-200'

  return (
    <Panel titulo="Pseudocódigo" className="h-full">
      <div className="absolute inset-0 flex flex-col overflow-y-auto px-3 pb-3">
        <div className={`flex shrink-0 items-start gap-2 rounded-lg px-2.5 py-1.5 ring-1 ${tono}`}>
          <span className={`mt-px shrink-0 rounded px-1.5 py-px text-[10.5px] font-semibold ${evento.clase}`}>{evento.texto}</span>
          <p className="min-h-[2.5em] font-mono text-[12px] leading-snug text-slate-800">{traza.descripciones[paso]}</p>
        </div>
        <pre className="mt-1.5 font-mono text-[12px] leading-[1.55]">
          {algoritmo.pseudocodigo.map((l, i) => {
            const activa = l.id !== undefined && activas.has(l.id)
            return (
              <div
                key={i}
                className={`rounded-r-md border-l-2 pr-2 transition-colors ${activa ? 'border-amber-500 bg-amber-50 font-semibold text-amber-900' : 'border-transparent text-slate-600'}`}
                style={{ paddingLeft: `${0.5 + l.nivel * 1.1}rem` }}
              >
                {l.texto}
              </div>
            )
          })}
        </pre>
      </div>
    </Panel>
  )
}

/**
 * Lista abierta como tira desplegable dentro del panel del mundo.
 * Plegada muestra una fila con scroll horizontal; desplegada, todos los nodos.
 */
export function AbiertaDesplegable() {
  const ejemplo = useReproductor((s) => s.ejemplo)
  const foto = useFoto()
  const [desplegada, setDesplegada] = useState(false)
  if (!ejemplo || !foto) return null
  const insertado = foto.evento.tipo === 'insertar' ? foto.evento.nodoId : null

  return (
    <div className="absolute inset-x-2 bottom-2 z-10 flex max-h-[75%] flex-col rounded-lg bg-white/95 shadow-md ring-1 ring-slate-200 backdrop-blur">
      <button
        onClick={() => setDesplegada(!desplegada)}
        className="flex h-8 shrink-0 items-center gap-2 rounded-lg px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        aria-expanded={desplegada}
        title={desplegada ? 'Plegar abierta' : 'Desplegar abierta'}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          abierta <span className="text-slate-700 tabular-nums">{foto.abierta.length}</span>
        </span>
        {!desplegada && <Chips etiqueta={ejemplo.problema.etiqueta} foto={foto} insertado={insertado} enLinea />}
        <span className="ml-auto shrink-0 text-[11px] tabular-nums text-slate-400">
          {foto.nodos.length} gen. · {foto.ordenExpansion.length} exp.
        </span>
        <span className={`shrink-0 text-slate-400 transition-transform ${desplegada ? 'rotate-180' : ''}`}>▴</span>
      </button>
      {desplegada && (
        <div className="min-h-0 overflow-y-auto px-3 pb-2.5">
          <Chips etiqueta={ejemplo.problema.etiqueta} foto={foto} insertado={insertado} />
        </div>
      )}
    </div>
  )
}

function Chips({
  etiqueta,
  foto,
  insertado,
  enLinea = false,
}: {
  etiqueta: (s: unknown) => string
  foto: NonNullable<ReturnType<typeof useFoto>>
  insertado: number | null
  enLinea?: boolean
}) {
  return (
    <ol className={`flex min-w-0 gap-1 ${enLinea ? 'flex-1 overflow-hidden [mask-image:linear-gradient(to_right,black_85%,transparent)]' : 'flex-wrap'}`}>
      {foto.abierta.length === 0 && <li className="text-xs text-slate-400">vacía</li>}
      {foto.abierta.map((id, i) => (
        <li
          key={id}
          title={`nodo ${id}`}
          className={`flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-px text-[11.5px] ${id === insertado ? 'ring-2 ring-sky-300' : ''}`}
          style={{ background: COLORES.abierta.relleno, borderColor: COLORES.abierta.borde, color: COLORES.abierta.texto }}
        >
          <span className="text-[10px] tabular-nums opacity-50">{i + 1}</span>
          {etiqueta(foto.nodos[id].estado)}
        </li>
      ))}
    </ol>
  )
}
