import { useMemo } from 'react'
import { camino } from '../../core/traza'
import type { MundoProps } from '../../ejemplos'
import { COLORES, type Color } from '../../ui/estados'
import type { Mapa } from './modelo'

interface Props extends MundoProps<string> {
  mapa: Mapa
  inicio: string
  destino: string
}

const MARGEN = 36
const NEUTRO = { relleno: '#ffffff', borde: '#94a3b8', texto: '#334155' }
// Halo blanco detrás del texto para que no se mezcle con las carreteras.
const halo = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' } as const

/** Mapa de ciudades: dónde está el agente, el camino que lleva y qué ciudades hay en abierta. */
export function MundoGrafo({ mapa, inicio, destino, foto, foco }: Props) {
  const { pos, ancho, alto } = useMemo(() => {
    const xs = mapa.ciudades.map((c) => c.x)
    const ys = mapa.ciudades.map((c) => c.y)
    const minX = Math.min(...xs)
    const maxY = Math.max(...ys)
    const pos = new Map(mapa.ciudades.map((c) => [c.id, { x: c.x - minX + MARGEN, y: maxY - c.y + MARGEN }]))
    return { pos, ancho: Math.max(...xs) - minX + 2 * MARGEN, alto: maxY - Math.min(...ys) + 2 * MARGEN }
  }, [mapa])

  const ruta = foco ? camino(foto, foco.id).map((n) => n.estado) : []
  const tramos = new Set(ruta.slice(1).map((c, i) => [ruta[i], c].sort().join('|')))
  const esSolucion = foto.resultado?.tipo === 'solucion' && foco?.id === foto.resultado.nodoId
  const colorFoco: Color = esSolucion ? COLORES.solucion : COLORES.actual

  const enAbierta = new Map<string, number>()
  for (const id of foto.abierta) {
    const c = foto.nodos[id].estado
    enAbierta.set(c, (enAbierta.get(c) ?? 0) + 1)
  }
  const expandidas = new Set(foto.ordenExpansion.map((id) => foto.nodos[id].estado))

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} className="h-full w-full" role="img" aria-label={`Mapa de ${mapa.nombre}`}>
      {mapa.carreteras.map(([a, b]) => {
        const p = pos.get(a)!
        const q = pos.get(b)!
        const activa = tramos.has([a, b].sort().join('|'))
        return (
          <line
            key={`${a}-${b}`}
            x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke={activa ? colorFoco.borde : '#e2e8f0'}
            strokeWidth={activa ? 4.5 : 2.5}
            strokeLinecap="round"
          />
        )
      })}

      {mapa.carreteras.map(([a, b, d]) => {
        const p = pos.get(a)!
        const q = pos.get(b)!
        return (
          <text key={`${a}-${b}`} x={(p.x + q.x) / 2} y={(p.y + q.y) / 2} fontSize={9} fill="#94a3b8" textAnchor="middle" dominantBaseline="central" style={halo}>
            {d}
          </text>
        )
      })}

      {mapa.ciudades.map((c) => {
        const p = pos.get(c.id)!
        const esFoco = foco?.estado === c.id
        const color = esFoco ? colorFoco : enAbierta.has(c.id) ? COLORES.abierta : expandidas.has(c.id) ? COLORES.expandido : NEUTRO
        const n = enAbierta.get(c.id) ?? 0
        const especial = c.id === inicio ? 's₀' : c.id === destino ? 'meta' : null
        return (
          <g key={c.id}>
            {c.id === destino && <circle cx={p.x} cy={p.y} r={13} fill="none" stroke={COLORES.solucion.borde} strokeWidth={1.5} strokeDasharray="3 2.5" />}
            {esFoco && <circle cx={p.x} cy={p.y} r={14} fill={colorFoco.borde} opacity={0.18} />}
            <circle cx={p.x} cy={p.y} r={esFoco ? 8 : 6} fill={color.relleno} stroke={color.borde} strokeWidth={esFoco ? 2.5 : 2} />
            <text x={p.x} y={p.y + 19} fontSize={11.5} textAnchor="middle" fill={esFoco ? '#0f172a' : '#475569'} fontWeight={esFoco ? 700 : 500} style={halo}>
              {c.nombre}
            </text>
            {especial && (
              <text x={p.x} y={p.y - 17} fontSize={9.5} fontWeight={600} textAnchor="middle" fill="#64748b" style={halo}>
                {especial}
              </text>
            )}
            {n > 1 && (
              <g transform={`translate(${p.x + 10},${p.y - 9})`}>
                <rect x={-1} y={-6.5} width={19} height={13} rx={6.5} fill={COLORES.abierta.borde} />
                <text x={8.5} fontSize={9} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill="#fff">×{n}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
