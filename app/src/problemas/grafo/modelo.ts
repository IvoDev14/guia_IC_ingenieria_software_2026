import type { Problema } from '../../core/tipos'

export interface Ciudad {
  id: string
  nombre: string
  x: number // coordenadas del dibujo (y crece hacia arriba)
  y: number
}

export interface Mapa {
  nombre: string
  ciudades: Ciudad[]
  carreteras: [string, string, number][] // [ciudad, ciudad, distancia]
  /** Distancias en línea recta hasta cada destino: base de la heurística h*. */
  distanciaRecta?: Record<string, Record<string, number>>
}

/** Problema de ir de `inicio` a `destino`. El estado es el id de la ciudad. */
export function crearProblemaGrafo(mapa: Mapa, inicio: string, destino: string): Problema<string> {
  const nombres = new Map(mapa.ciudades.map((c) => [c.id, c.nombre]))
  const vecinos = new Map<string, { id: string; distancia: number }[]>()
  for (const [a, b, distancia] of mapa.carreteras) {
    vecinos.set(a, [...(vecinos.get(a) ?? []), { id: b, distancia }])
    vecinos.set(b, [...(vecinos.get(b) ?? []), { id: a, distancia }])
  }
  // Los sucesores se generan en orden alfabético, como en los ejercicios de clase.
  for (const lista of vecinos.values()) lista.sort((a, b) => nombres.get(a.id)!.localeCompare(nombres.get(b.id)!))

  const rectas = mapa.distanciaRecta?.[destino]

  return {
    s0: inicio,
    expandir: (s) =>
      (vecinos.get(s) ?? []).map((v) => ({
        estado: v.id,
        accion: `${nombres.get(s)} → ${nombres.get(v.id)}`,
        coste: v.distancia,
      })),
    meta: (s) => s === destino,
    clave: (s) => s,
    etiqueta: (s) => nombres.get(s) ?? s,
    heuristicas: rectas ? { 'distancia en línea recta': (s) => rectas[s] ?? 0 } : undefined,
  }
}
