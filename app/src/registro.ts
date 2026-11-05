// Punto único donde se dan de alta algoritmos y ejemplos. La interfaz se construye a partir de aquí.
import { amplitud } from './algoritmos/amplitud'
import type { Algoritmo } from './core/tipos'
import type { Ejemplo } from './ejemplos'
import { ejemplosGrafo } from './problemas/grafo/ejemplos'

export const algoritmos: Algoritmo[] = [amplitud]

export const ejemplos: Ejemplo<unknown>[] = [...ejemplosGrafo]

export const buscarAlgoritmo = (id: string) => algoritmos.find((a) => a.id === id)

export const ejemplosDe = (algoritmoId: string) => ejemplos.filter((e) => e.algoritmoId === algoritmoId)
