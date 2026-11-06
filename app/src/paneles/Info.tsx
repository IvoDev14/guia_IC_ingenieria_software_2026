import { useReproductor } from '../reproductor/store'
import { COLORES } from '../ui/estados'
import { CabeceraLateral } from '../ui/Lateral'
import { Tecla } from '../ui/Panel'

const ATAJOS: [string[], string][] = [
  [['←', '→'], 'Paso anterior / siguiente'],
  [['⇧', '←', '→'], 'Iteración anterior / siguiente'],
  [['Inicio', 'Fin'], 'Primer / último paso'],
  [['Espacio'], 'Reproducción automática'],
  [['Ctrl/⌘', 'B'], 'Mostrar / ocultar barra lateral'],
]

/** Vista de la barra lateral con la descripción del algoritmo, del ejemplo, la leyenda y los atajos. */
export function Info() {
  const algoritmo = useReproductor((s) => s.algoritmo)
  const ejemplo = useReproductor((s) => s.ejemplo)
  if (!algoritmo) return null

  return (
    <div className="flex h-full flex-col">
      <CabeceraLateral titulo="Sobre el algoritmo" />
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3.5 pb-4 text-sm">
        <section>
          <h3 className="font-semibold">{algoritmo.nombre}</h3>
          <p className="mt-1 text-slate-600">{algoritmo.resumen}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {algoritmo.caracteristicas.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{c}</span>
            ))}
          </div>
        </section>

        {ejemplo && (
          <section>
            <Subtitulo>Ejemplo</Subtitulo>
            <p className="font-medium">{ejemplo.titulo}</p>
            <p className="mt-1 text-slate-600">{ejemplo.descripcion}</p>
          </section>
        )}

        <section>
          <Subtitulo>Leyenda</Subtitulo>
          <ul className="space-y-1.5 text-[13px] text-slate-600">
            {Object.values(COLORES).map((c) => (
              <li key={c.nombre} className="flex items-center gap-2">
                <span className="h-3.5 w-6 rounded border" style={{ background: c.relleno, borderColor: c.borde }} />
                {c.nombre}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-6 items-center justify-center rounded-full border border-slate-300 text-[9px] font-semibold text-slate-600">3</span>
              Orden de expansión
            </li>
          </ul>
        </section>

        <section>
          <Subtitulo>Atajos de teclado</Subtitulo>
          <ul className="space-y-1.5 text-[13px] text-slate-600">
            {ATAJOS.map(([teclas, texto]) => (
              <li key={texto} className="flex items-center justify-between gap-3">
                <span>{texto}</span>
                <span className="flex shrink-0 gap-1">
                  {teclas.map((t) => <Tecla key={t} siempre>{t}</Tecla>)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

const Subtitulo = ({ children }: { children: string }) => (
  <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{children}</h4>
)
