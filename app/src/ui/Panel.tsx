import type { ReactNode } from 'react'
import type { Color } from './estados'

export function Panel({
  titulo,
  extra,
  className = '',
  children,
}: {
  titulo: ReactNode
  extra?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={`flex min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 ${className}`}>
      <header className="flex min-h-8 shrink-0 items-center justify-between gap-3 px-3 py-1">
        <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{titulo}</h2>
        {extra}
      </header>
      <div className="relative min-h-0 flex-1">{children}</div>
    </section>
  )
}

export function Leyenda({ colores }: { colores: Color[] }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
      {colores.map((c) => (
        <span key={c.nombre} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] border" style={{ background: c.relleno, borderColor: c.borde }} />
          {c.nombre}
        </span>
      ))}
    </div>
  )
}

export function Tecla({ children, oscura = false, siempre = false }: { children: ReactNode; oscura?: boolean; siempre?: boolean }) {
  const estilo = oscura ? 'border-white/20 bg-white/10 text-white/70' : 'border-slate-200 bg-slate-50 text-slate-400'
  return (
    <kbd className={`${siempre ? 'inline' : 'hidden xl:inline'} rounded border px-1 font-sans text-[10px] leading-4 font-medium ${estilo}`}>
      {children}
    </kbd>
  )
}
