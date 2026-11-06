import type { SVGProps } from 'react'

function Icono({ d, ...props }: SVGProps<SVGSVGElement> & { d: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden {...props}>
      <path d={d} />
    </svg>
  )
}

export const IconoAnterior = () => <Icono d="M12.5 4.5 7 10l5.5 5.5" />
export const IconoSiguiente = () => <Icono d="M7.5 4.5 13 10l-5.5 5.5" />
export const IconoIteracionAnterior = () => <Icono d="M10 4.5 4.5 10l5.5 5.5M15.5 4.5 10 10l5.5 5.5" />
export const IconoIteracionSiguiente = () => <Icono d="M4.5 4.5 10 10l-5.5 5.5M10 4.5l5.5 5.5-5.5 5.5" />
export const IconoReiniciar = () => <Icono d="M4 10a6 6 0 1 0 2-4.5M4 3.5v3h3" />
export const IconoPlay = () => <Icono d="M6.5 4.5v11l9-5.5z" fill="currentColor" strokeWidth={1.2} />
export const IconoPausa = () => <Icono d="M7 4.5v11M13 4.5v11" strokeWidth={2.4} />
export const IconoInfo = () => <Icono d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM10 9v4.5M10 6.5v.01" />
export const IconoCentrar = () => <Icono d="M10 3v3M10 14v3M3 10h3M14 10h3M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
export const IconoHistorial = () => <Icono d="M3.5 10a6.5 6.5 0 1 0 1.9-4.6M3.5 3.5v3h3M10 6.5V10l2.5 1.5" />
