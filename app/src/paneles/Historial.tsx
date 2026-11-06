import { useLayoutEffect, useRef, useState } from 'react'
import { useReproductor } from '../reproductor/store'
import { EVENTOS } from '../ui/estados'
import { CabeceraLateral } from '../ui/Lateral'

/**
 * Historial de pasos (vista de la barra lateral).
 * Se desplaza solo dentro de su lista y deja de seguir el paso actual si el usuario sube.
 */
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
    setSiguiendo(item.offsetTop + item.offsetHeight > el.scrollTop && item.offsetTop < el.scrollTop + el.clientHeight)
  }

  if (!traza) return null

  return (
    <div className="flex h-full flex-col">
      <CabeceraLateral titulo={`Historial · ${paso + 1}/${traza.fotos.length}`}>
        {!siguiendo && (
          <button onClick={() => setSiguiendo(true)} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200">
            Ir al paso actual
          </button>
        )}
      </CabeceraLateral>
      <ol ref={lista} onScroll={alDesplazar} className="relative min-h-0 flex-1 overflow-y-auto px-1.5 pb-2 text-[12px]">
        {traza.descripciones.slice(0, paso + 1).map((d, i) => {
          const actual = i === paso
          return (
            <li
              key={i}
              data-actual={actual ? '' : undefined}
              onClick={() => irA(i)}
              className={`flex cursor-pointer gap-2 rounded-md px-2 py-1 ${actual ? 'bg-amber-50 text-slate-900 ring-1 ring-amber-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="w-6 shrink-0 text-right tabular-nums text-slate-300">{i + 1}</span>
              <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${EVENTOS[traza.eventos[i].tipo].punto}`} />
              <span className="min-w-0 font-mono leading-snug break-words">{d}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
