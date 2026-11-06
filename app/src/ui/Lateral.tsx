import { useEffect, useRef, type ComponentType, type ReactNode } from 'react'
import { useDisposicion, type VistaLateral } from './disposicion'

export interface DefVistaLateral {
  id: VistaLateral
  titulo: string
  Icono: ComponentType
  Contenido: ComponentType
}

/** Barra de iconos estrecha (como la "activity bar" de VS Code): cada icono abre o cierra una vista lateral. */
export function BarraActividad({ vistas }: { vistas: DefVistaLateral[] }) {
  const vista = useDisposicion((s) => s.vista)
  const alternarVista = useDisposicion((s) => s.alternarVista)

  return (
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-2" aria-label="Vistas laterales">
      {vistas.map(({ id, titulo, Icono }) => {
        const activa = vista === id
        return (
          <button
            key={id}
            onClick={() => alternarVista(id)}
            title={`${titulo} (Ctrl/⌘ + B para ocultar)`}
            aria-label={titulo}
            aria-pressed={activa}
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition ${activa ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            {activa && <span className="absolute -left-1 top-2 bottom-2 w-0.5 rounded-full bg-slate-900" />}
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <Icono />
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/** Barra lateral plegable y redimensionable (arrastrando su borde derecho). Empuja al dashboard. */
export function BarraLateral({ vistas }: { vistas: DefVistaLateral[] }) {
  const { vista, ancho, setAncho, alternarLateral } = useDisposicion()
  const arrastre = useRef<{ x: number; ancho: number } | null>(null)

  // Ctrl/⌘ + B, como en VS Code.
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        alternarLateral()
      }
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [alternarLateral])

  const actual = vistas.find((v) => v.id === vista)
  if (!actual) return null
  const { Contenido } = actual

  return (
    <aside style={{ width: ancho }} className="relative flex shrink-0 flex-col border-r border-slate-200 bg-white">
      <Contenido />
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Redimensionar barra lateral"
        title="Arrastra para cambiar el ancho · doble clic para ocultar"
        className="absolute top-0 -right-1 bottom-0 z-10 w-2 cursor-col-resize transition-colors hover:bg-sky-400/40 active:bg-sky-400/60"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          arrastre.current = { x: e.clientX, ancho }
        }}
        onPointerMove={(e) => {
          if (arrastre.current) setAncho(arrastre.current.ancho + e.clientX - arrastre.current.x)
        }}
        onPointerUp={() => (arrastre.current = null)}
        onDoubleClick={alternarLateral}
      />
    </aside>
  )
}

/** Cabecera de una vista lateral: título en mayúsculas y acciones a la derecha. */
export function CabeceraLateral({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between gap-2 px-3.5">
      <h2 className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{titulo}</h2>
      {children}
    </header>
  )
}
