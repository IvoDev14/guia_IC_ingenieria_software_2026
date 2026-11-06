import { useEffect } from 'react'
import { ArbolBusqueda } from './paneles/ArbolBusqueda'
import { Historial } from './paneles/Historial'
import { Info } from './paneles/Info'
import { Pseudocodigo } from './paneles/PanelPasos'
import { PanelMundo } from './paneles/PanelMundo'
import { algoritmos, buscarAlgoritmo, ejemplosDe } from './registro'
import { BarraPasos, LineaTiempo } from './reproductor/Controles'
import { useAtajos, useReproduccionAutomatica } from './reproductor/hooks'
import { useReproductor } from './reproductor/store'
import { navegar, useRuta } from './ruta'
import { IconoHistorial, IconoInfo } from './ui/iconos'
import { BarraActividad, BarraLateral, type DefVistaLateral } from './ui/Lateral'

const TIPOS = { 'no-informada': 'No informada', informada: 'Informada' } as const

const VISTAS_LATERALES: DefVistaLateral[] = [
  { id: 'historial', titulo: 'Historial', Icono: IconoHistorial, Contenido: Historial },
  { id: 'info', titulo: 'Sobre el algoritmo', Icono: IconoInfo, Contenido: Info },
]

export default function App() {
  const { algoritmoId, ejemploId } = useRuta()
  const algoritmo = algoritmoId ? buscarAlgoritmo(algoritmoId) : undefined
  const ejemplos = algoritmo ? ejemplosDe(algoritmo.id) : []
  const ejemplo = ejemplos.find((e) => e.id === ejemploId)
  const cargar = useReproductor((s) => s.cargar)
  const cargado = useReproductor((s) => s.ejemplo)
  const listo = cargado !== null && cargado === ejemplo

  useAtajos()
  useReproduccionAutomatica()

  // Ruta incompleta o desconocida → primer algoritmo / primer ejemplo.
  const primerEjemplo = ejemplos[0]?.id
  useEffect(() => {
    if (!algoritmo) navegar(algoritmos[0].id, undefined, true)
    else if (!ejemplo && primerEjemplo) navegar(algoritmo.id, primerEjemplo, true)
  }, [algoritmo, ejemplo, primerEjemplo])

  useEffect(() => {
    if (algoritmo && ejemplo) cargar(ejemplo, algoritmo)
  }, [algoritmo, ejemplo, cargar])

  return (
    // Dashboard de escritorio: ocupa exactamente la ventana y la página nunca se desplaza;
    // solo hacen scroll, si lo necesitan, los paneles por dentro.
    <div className="flex h-dvh min-w-[960px] flex-col overflow-hidden bg-slate-100 text-slate-900">
      <header className="flex h-12 shrink-0 items-center gap-4 bg-white px-3">
        <div className="flex shrink-0 items-center gap-2.5">
          <img src="./favicon.svg" alt="" className="h-7 w-7" />
          <h1 className="hidden text-sm leading-tight font-semibold 2xl:block">
            Algoritmos de búsqueda
            <span className="block text-[11px] font-normal text-slate-500">Ingeniería del Conocimiento</span>
          </h1>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Selector etiqueta="Algoritmo" valor={algoritmo?.id ?? ''} alCambiar={(id) => navegar(id)}>
            {Object.entries(TIPOS).map(([tipo, nombre]) => {
              const delTipo = algoritmos.filter((a) => a.tipo === tipo)
              return (
                delTipo.length > 0 && (
                  <optgroup key={tipo} label={`Búsqueda ${nombre.toLowerCase()}`}>
                    {delTipo.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </optgroup>
                )
              )
            })}
          </Selector>
          <Selector etiqueta="Ejemplo" valor={ejemplo?.id ?? ''} alCambiar={(id) => algoritmo && navegar(algoritmo.id, id)}>
            {ejemplos.map((e) => (
              <option key={e.id} value={e.id}>{e.titulo}</option>
            ))}
          </Selector>
          {algoritmo && (
            <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 xl:inline">{TIPOS[algoritmo.tipo]}</span>
          )}
        </div>

        <div className="ml-auto shrink-0">{listo && <BarraPasos />}</div>
      </header>
      {listo ? <LineaTiempo /> : <div className="h-2.5 shrink-0 border-b border-slate-200 bg-white" />}

      <div className="flex min-h-0 flex-1">
        <BarraActividad vistas={VISTAS_LATERALES} />
        {listo && <BarraLateral vistas={VISTAS_LATERALES} />}

        <main className="min-h-0 min-w-0 flex-1 p-2.5">
          {algoritmo && ejemplos.length === 0 && <p className="p-2 text-sm text-slate-500">Este algoritmo todavía no tiene ejemplos.</p>}

          {listo && (
            // Izquierda: pseudocódigo arriba y mundo abajo. Derecha: árbol a toda la altura.
            <div className="grid h-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] grid-rows-[minmax(0,1.1fr)_minmax(0,1fr)] gap-2.5">
              <div className="min-h-0">
                <Pseudocodigo />
              </div>
              <div className="row-span-2 min-h-0">
                <ArbolBusqueda />
              </div>
              <div className="min-h-0">
                <PanelMundo />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function Selector({ etiqueta, valor, alCambiar, children }: { etiqueta: string; valor: string; alCambiar: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 items-center rounded-lg bg-slate-100 pl-2.5 text-xs text-slate-500 ring-1 ring-slate-200 focus-within:ring-slate-400">
      <span className="shrink-0">{etiqueta}</span>
      <select
        className="max-w-56 min-w-0 cursor-pointer truncate rounded-r-lg bg-transparent py-1.5 pr-2 pl-2 text-sm font-medium text-slate-900 outline-none"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
      >
        {children}
      </select>
    </label>
  )
}
