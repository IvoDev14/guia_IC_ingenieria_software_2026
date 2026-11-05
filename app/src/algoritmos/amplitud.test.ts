import { describe, expect, it } from 'vitest'
import { camino, ejecutar } from '../core/traza'
import { crearProblemaGrafo, type Mapa } from '../problemas/grafo/modelo'
import { rumania } from '../problemas/grafo/mapas/rumania'
import { amplitud } from './amplitud'

const nombres = (ids: string[]) => ids.map((id) => rumania.ciudades.find((c) => c.id === id)!.nombre)

describe('búsqueda en amplitud', () => {
  it('Rumanía, de Arad a Bucharest: expande nivel a nivel y llega por Sibiu y Fagaras', () => {
    const problema = crearProblemaGrafo(rumania, 'arad', 'bucharest')
    const { fotos } = ejecutar(amplitud, problema)
    const ultima = fotos[fotos.length - 1]

    expect(ultima.resultado?.tipo).toBe('solucion')
    const meta = ultima.resultado!.tipo === 'solucion' ? ultima.resultado!.nodoId : -1
    expect(nombres(camino(ultima, meta).map((n) => n.estado))).toEqual(['Arad', 'Sibiu', 'Fagaras', 'Bucharest'])

    // Sin control de estados repetidos: Arad vuelve a aparecer como hijo de Sibiu.
    const expandidos = nombres(ultima.ordenExpansion.map((id) => ultima.nodos[id].estado))
    expect(expandidos).toEqual([
      'Arad',
      'Sibiu', 'Timisoara', 'Zerind',
      'Arad', 'Fagaras', 'Oradea', 'Rimnicu Vilcea', 'Arad', 'Lugoj', 'Arad', 'Oradea',
      'Sibiu', 'Timisoara', 'Zerind',
    ])
  })

  it('se detiene por límite si la meta es inalcanzable y hay ciclos', () => {
    const mapa: Mapa = {
      nombre: 'islas',
      ciudades: ['a', 'b', 'c'].map((id) => ({ id, nombre: id.toUpperCase(), x: 0, y: 0 })),
      carreteras: [['a', 'b', 1]],
    }
    const { fotos } = ejecutar(amplitud, crearProblemaGrafo(mapa, 'a', 'c'))
    expect(fotos.at(-1)?.resultado).toEqual({ tipo: 'limite' })
  })

  it('devuelve negativo si abierta se vacía', () => {
    const mapa: Mapa = {
      nombre: 'aislado',
      ciudades: ['a', 'c'].map((id) => ({ id, nombre: id.toUpperCase(), x: 0, y: 0 })),
      carreteras: [],
    }
    const { fotos } = ejecutar(amplitud, crearProblemaGrafo(mapa, 'a', 'c'))
    expect(fotos.at(-1)?.resultado).toEqual({ tipo: 'fallo' })
  })
})
