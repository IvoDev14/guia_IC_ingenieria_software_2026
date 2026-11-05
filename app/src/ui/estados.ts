import { camino } from '../core/traza'
import type { Evento, Foto } from '../core/tipos'

/** Papel de cada nodo en la foto actual. Lo comparten el árbol, el mundo y la leyenda. */
export type EstadoNodo = 'solucion' | 'actual' | 'abierta' | 'expandido' | 'generado'

export interface Color {
  relleno: string
  borde: string
  texto: string
  nombre: string
}

export const COLORES: Record<EstadoNodo, Color> = {
  actual: { relleno: '#fef3c7', borde: '#f59e0b', texto: '#78350f', nombre: 'Actual' },
  abierta: { relleno: '#e0f2fe', borde: '#38bdf8', texto: '#0c4a6e', nombre: 'En abierta' },
  generado: { relleno: '#f5f3ff', borde: '#a78bfa', texto: '#4c1d95', nombre: 'Generado' },
  expandido: { relleno: '#f8fafc', borde: '#cbd5e1', texto: '#64748b', nombre: 'Expandido' },
  solucion: { relleno: '#d1fae5', borde: '#10b981', texto: '#064e3b', nombre: 'Solución' },
}

/** Etiqueta y estilo (clases Tailwind) de cada tipo de evento. */
export const EVENTOS: Record<Evento<unknown>['tipo'], { texto: string; clase: string; punto: string }> = {
  inicio: { texto: 'Inicio', clase: 'bg-slate-100 text-slate-700', punto: 'bg-slate-400' },
  seleccionar: { texto: 'Seleccionar', clase: 'bg-amber-100 text-amber-800', punto: 'bg-amber-400' },
  testMeta: { texto: 'Test meta', clase: 'bg-orange-100 text-orange-800', punto: 'bg-orange-400' },
  expandir: { texto: 'Expandir', clase: 'bg-violet-100 text-violet-800', punto: 'bg-violet-400' },
  insertar: { texto: 'Insertar', clase: 'bg-sky-100 text-sky-800', punto: 'bg-sky-400' },
  solucion: { texto: 'Solución', clase: 'bg-emerald-100 text-emerald-800', punto: 'bg-emerald-500' },
  fallo: { texto: 'Fallo', clase: 'bg-rose-100 text-rose-800', punto: 'bg-rose-500' },
  limite: { texto: 'Límite', clase: 'bg-rose-100 text-rose-800', punto: 'bg-rose-500' },
}

export function clasificarNodos(foto: Foto<unknown>): EstadoNodo[] {
  const abierta = new Set(foto.abierta)
  const expandidos = new Set(foto.ordenExpansion)
  const solucion =
    foto.resultado?.tipo === 'solucion' ? new Set(camino(foto, foto.resultado.nodoId).map((n) => n.id)) : new Set()

  return foto.nodos.map((n) => {
    if (solucion.has(n.id)) return 'solucion'
    if (n.id === foto.actual) return 'actual'
    if (abierta.has(n.id)) return 'abierta'
    if (expandidos.has(n.id)) return 'expandido'
    return 'generado'
  })
}
