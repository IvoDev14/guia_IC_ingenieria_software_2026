import { camino } from '../core/traza'
import { useFoco, useFoto, useReproductor } from '../reproductor/store'
import { Panel } from '../ui/Panel'

/** Muestra el "mundo real" del problema usando la vista que aporta cada ejemplo. */
export function PanelMundo() {
  const ejemplo = useReproductor((s) => s.ejemplo)
  const seleccionado = useReproductor((s) => s.seleccionado)
  const seleccionar = useReproductor((s) => s.seleccionar)
  const foto = useFoto()
  const foco = useFoco()
  if (!ejemplo || !foto) return null

  const { Mundo, problema } = ejemplo
  const ruta = foco ? camino(foto, foco.id) : []
  const haySeleccion = seleccionado !== null && foto.nodos[seleccionado] !== undefined

  return (
    <Panel
      titulo="Mundo"
      className="h-full"
      extra={
        foco && (
          <div className="flex min-w-0 items-center gap-2 text-xs">
            <span className="shrink-0 text-slate-400">{haySeleccion ? 'Seleccionado' : 'Actual'}</span>
            <span className="truncate font-medium text-slate-700">{ruta.map((n) => problema.etiqueta(n.estado)).join(' → ')}</span>
            <span className="shrink-0 rounded bg-slate-100 px-1.5 py-px font-mono text-[11px] text-slate-600">g = {foco.g}</span>
            {haySeleccion && (
              <button onClick={() => seleccionar(null)} className="shrink-0 rounded px-1.5 py-px text-[11px] text-slate-500 hover:bg-slate-100">
                Quitar selección
              </button>
            )}
          </div>
        )
      }
    >
      <div className="absolute inset-0 px-2 pb-2">
        <Mundo problema={problema} foto={foto} foco={foco} />
      </div>
    </Panel>
  )
}
