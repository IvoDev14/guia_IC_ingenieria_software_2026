import { useLayoutEffect, useRef, useState } from 'react'
import { lineasDeEvento } from '../core/traza'
import { useFoto, useReproductor } from '../reproductor/store'
import { COLORES, EVENTOS } from '../ui/estados'
import { Panel } from '../ui/Panel'

/** Pseudocódigo del algoritmo con las líneas del paso actual resaltadas. */
export function Pseudocodigo() {
  const algoritmo = useReproductor((s) => s.algoritmo)
  const foto = useFoto()
  if (!algoritmo || !foto) return null
  const activas = new Set(lineasDeEvento(foto.evento))

  return (
    <Panel titulo="Pseudocódigo" className="shrink-0">
      <pre className="overflow-x-auto px-1.5 pb-1.5 font-mono text-[12px] leading-[1.55] [@media(max-height:820px)]:text-[11.5px] [@media(max-height:820px)]:leading-[1.4]">
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
    </Panel>
  )
}

/** Lista abierta en orden: el primero es el siguiente nodo que se seleccionará. */
export function Abierta() {
  const ejemplo = useReproductor((s) => s.ejemplo)
  const foto = useFoto()
  if (!ejemplo || !foto) return null
  const insertado = foto.evento.tipo === 'insertar' ? foto.evento.nodoId : null

  return (
    <Panel
      titulo={<>abierta <span className="text-slate-300">·</span> <span className="tabular-nums text-slate-600">{foto.abierta.length}</span></>}
      extra={
        <span className="text-[11px] tabular-nums text-slate-400">
          {foto.nodos.length} generados · {foto.ordenExpansion.length} expandidos
        </span>
      }
      className="shrink-0"
    >
      <ol className="flex max-h-[4.6rem] [@media(min-height:900px)]:max-h-[6.4rem] flex-wrap content-start gap-1 overflow-y-auto px-3 pb-2.5">
        {foto.abierta.length === 0 && <li className="text-xs text-slate-400">vacía</li>}
        {foto.abierta.map((id, i) => (
          <li
            key={id}
            title={`nodo ${id}`}
            className={`flex items-center gap-1 rounded-md border px-1.5 py-px text-[11.5px] ${id === insertado ? 'ring-2 ring-sky-300' : ''}`}
            style={{ background: COLORES.abierta.relleno, borderColor: COLORES.abierta.borde, color: COLORES.abierta.texto }}
          >
            <span className="text-[10px] tabular-nums opacity-50">{i + 1}</span>
            {ejemplo.problema.etiqueta(foto.nodos[id].estado)}
          </li>
        ))}
      </ol>
    </Panel>
  )
}

/** Historial de pasos. Se desplaza solo dentro de su caja y deja de seguir el paso actual si el usuario sube. */
export function Historial() {
  const traza = useReproductor((s) => s.traza)
  const paso = useReproductor((s) => s.paso)
  const irA = useReproductor((s) => s.irA)
  const lista = useRef<HTMLOListElement>(null)
  const [siguiendo, setSiguiendo] = useState(true)

  // Solo mueve el scroll de la lista (nunca el de la página).
  useLayoutEffect(() => {
    const el = lista.current
    const item = el?.querySelector<HTMLElement>('[data-actual]')
    if (!el || !item || !siguiendo) return
    const arriba = item.offsetTop
    const abajo = arriba + item.offsetHeight
    if (arriba < el.scrollTop) el.scrollTop = arriba
    else if (abajo > el.scrollTop + el.clientHeight) el.scrollTop = abajo - el.clientHeight
  }, [paso, siguiendo])

  const alDesplazar = () => {
    const el = lista.current
    const item = el?.querySelector<HTMLElement>('[data-actual]')
    if (!el || !item) return
    const visible = item.offsetTop + item.offsetHeight > el.scrollTop && item.offsetTop < el.scrollTop + el.clientHeight
    setSiguiendo(visible)
  }

  if (!traza) return null

  return (
    <Panel
      titulo="Historial"
      className="h-64 lg:h-auto lg:min-h-28 lg:flex-1"
      extra={
        !siguiendo && (
          <button onClick={() => setSiguiendo(true)} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200">
            Ir al paso actual
          </button>
        )
      }
    >
      <ol ref={lista} onScroll={alDesplazar} className="absolute inset-0 overflow-y-auto px-1.5 pb-2 text-[12px]">
        {traza.descripciones.slice(0, paso + 1).map((d, i) => {
          const actual = i === paso
          return (
            <li
              key={i}
              data-actual={actual ? '' : undefined}
              onClick={() => irA(i)}
              className={`flex cursor-pointer gap-2 rounded-md px-2 py-1 ${actual ? 'bg-amber-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="w-6 shrink-0 text-right tabular-nums text-slate-300">{i + 1}</span>
              <span className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${EVENTOS[traza.eventos[i].tipo].punto}`} />
              <span className="font-mono leading-snug">{d}</span>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
