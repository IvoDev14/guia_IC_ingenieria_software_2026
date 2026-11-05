import { metodoGeneral, pseudocodigoMetodoGeneral } from '../core/metodoGeneral'
import type { Algoritmo } from '../core/tipos'

// docs/algoritmos/NI_busqueda_en_amplitud.md
export const amplitud: Algoritmo = {
  id: 'amplitud',
  nombre: 'Búsqueda en amplitud',
  tipo: 'no-informada',
  resumen: 'Explora el árbol nivel a nivel: cada sucesor se inserta al final de abierta (cola FIFO).',
  caracteristicas: ['Completa', 'Óptima solo con operadores de coste uno', 'Tiempo y espacio O(b^d)'],
  criterioOrden: 'final',
  pseudocodigo: pseudocodigoMetodoGeneral('final'),
  ejecutar(problema, opciones) {
    return metodoGeneral(problema, (abierta) => abierta.length, opciones)
  },
}
