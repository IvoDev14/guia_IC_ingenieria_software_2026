import { useEffect, useRef, useState } from 'react'
import { ArbolBusqueda } from './paneles/ArbolBusqueda'
import { Abierta, Historial, Pseudocodigo } from './paneles/PanelPasos'
import { PanelMundo } from './paneles/PanelMundo'
import { algoritmos, buscarAlgoritmo, ejemplosDe } from './registro'
import { Controles } from './reproductor/Controles'
import { useAtajos, useReproduccionAutomatica } from './reproductor/hooks'
import { useReproductor } from './reproductor/store'
import { navegar, useRuta } from './ruta'
import { IconoInfo } from './ui/iconos'

const TIPOS = { 'no-informada': 'No informada', informada: 'Informada' } as const

export default function App() {
  const { algoritmoId, ejemploId } = useRuta()
  const algoritmo = algoritmoId ? buscarAlgoritmo(algoritmoId) : undefined
  const ejemplos = algoritmo ? ejemplosDe(algoritmo.id) : []
  const ejemplo = ejemplos.find((e) => e.id === ejemploId)
  const cargar = useReproductor((s) => s.cargar)
  const cargado = useReproductor((s) => s.ejemplo)

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
    <div className="flex min-h-dvh flex-col bg-slate-100 text-slate-900 lg:h-dvh">
      <header className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <img src="./favicon.svg" alt="" className="h-7 w-7" />
          <div className="leading-tight">
            <h1 className="text-sm font-semibold">Algoritmos de búsqueda</h1>
            <p className="text-[11px] text-slate-500">Ingeniería del Conocimiento</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{TIPOS[algoritmo.tipo]}</span>
          )}
        </div>

        {algoritmo && <Info titulo={algoritmo.nombre} resumen={algoritmo.resumen} caracteristicas={algoritmo.caracteristicas} ejemplo={ejemplo?.descripcion} />}
      </header>

      {algoritmo && ejemplos.length === 0 && <p className="p-4 text-sm text-slate-500">Este algoritmo todavía no tiene ejemplos.</p>}

      {cargado && cargado === ejemplo && (
        <main className="grid min-h-0 flex-1 gap-2.5 p-2.5 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[25rem_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col gap-2.5 lg:overflow-y-auto">
            <Controles />
            <Pseudocodigo />
            <Abierta />
            <Historial />
          </div>
          <div className="grid min-h-0 gap-2.5 lg:grid-rows-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="h-80 min-h-0 lg:h-auto">
              <PanelMundo />
            </div>
            <div className="h-[28rem] min-h-0 lg:h-auto">
              <ArbolBusqueda />
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

function Selector({ etiqueta, valor, alCambiar, children }: { etiqueta: string; valor: string; alCambiar: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center rounded-lg bg-slate-100 pl-2.5 text-xs text-slate-500 ring-1 ring-slate-200 focus-within:ring-slate-400">
      {etiqueta}
      <select
        className="cursor-pointer rounded-r-lg bg-transparent py-1.5 pr-2 pl-2 text-sm font-medium text-slate-900 outline-none"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
      >
        {children}
      </select>
    </label>
  )
}

/** Botón que despliega la descripción del algoritmo y del ejemplo. */
function Info({ titulo, resumen, caracteristicas, ejemplo }: { titulo: string; resumen: string; caracteristicas: string[]; ejemplo?: string }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    const cerrar = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', cerrar)
    return () => document.removeEventListener('mousedown', cerrar)
  }, [abierto])

  return (
    <div ref={caja} className="relative ml-auto">
      <button
        onClick={() => setAbierto(!abierto)}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${abierto ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <IconoInfo /> Sobre el algoritmo
      </button>
      {abierto && (
        <div className="absolute right-0 z-20 mt-2 w-[min(26rem,calc(100vw-2rem))] rounded-xl bg-white p-4 text-sm shadow-lg ring-1 ring-slate-200">
          <h3 className="font-semibold">{titulo}</h3>
          <p className="mt-1 text-slate-600">{resumen}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {caracteristicas.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{c}</span>
            ))}
          </div>
          {ejemplo && (
            <>
              <h4 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Ejemplo</h4>
              <p className="mt-1 text-slate-600">{ejemplo}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
