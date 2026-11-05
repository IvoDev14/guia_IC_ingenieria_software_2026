// Tipos comunes a todos los problemas y algoritmos.
// La notación sigue la de los apuntes (docs/teoria/1_espacio_de_estados.md y 2_metodo_de_busqueda.md).

/** Resultado de aplicar un operador a un estado. */
export interface Sucesor<S> {
  estado: S
  accion: string
  coste: number // c(s_i, s_j)
}

/** Espacio de estados: s_0, expandir(s), meta?(s) y c(s_i, s_j). */
export interface Problema<S> {
  s0: S
  expandir(s: S): Sucesor<S>[]
  meta(s: S): boolean
  /** Identifica el estado (dos nodos distintos pueden tener el mismo estado). */
  clave(s: S): string
  /** Texto corto para mostrar el estado en la interfaz. */
  etiqueta(s: S): string
  /** Funciones heurísticas h*(s) disponibles para este problema. */
  heuristicas?: Record<string, (s: S) => number>
}

/** Nodo del árbol de búsqueda: representa un camino concreto desde s_0 hasta `estado`. */
export interface Nodo<S> {
  id: number // orden de generación
  estado: S
  padre: number | null
  accion: string | null
  g: number // coste acumulado
  profundidad: number
}

/** Lo que ocurre en cada paso de la ejecución. Los paneles solo leen estos eventos. */
export type Evento<S> =
  | { tipo: 'inicio'; nodo: Nodo<S> }
  | { tipo: 'seleccionar'; nodoId: number }
  | { tipo: 'testMeta'; nodoId: number; esMeta: boolean }
  | { tipo: 'expandir'; nodoId: number; sucesores: Nodo<S>[] }
  | { tipo: 'insertar'; nodoId: number; posicion: number }
  | { tipo: 'solucion'; nodoId: number }
  | { tipo: 'fallo' }
  | { tipo: 'limite'; maxNodos: number }

/** Identificadores de las líneas del pseudocódigo, para resaltarlas según el evento. */
export type IdLinea =
  | 'inicio'
  | 'vacia'
  | 'fallo'
  | 'primero'
  | 'meta'
  | 'solucion'
  | 'expandir'
  | 'paraCada'
  | 'padre'
  | 'insertar'

export interface LineaPseudocodigo {
  texto: string
  nivel: number // sangría
  id?: IdLinea
}

export interface OpcionesBusqueda {
  /** Corta la búsqueda si se generan más nodos (evita árboles infinitos). */
  maxNodos?: number
}

export interface Algoritmo {
  id: string
  nombre: string
  tipo: 'no-informada' | 'informada'
  resumen: string
  caracteristicas: string[]
  /** Texto del tercer argumento de ordInsertar (p. ej. "final", "g", "f*"). */
  criterioOrden: string
  pseudocodigo: LineaPseudocodigo[]
  ejecutar<S>(problema: Problema<S>, opciones?: OpcionesBusqueda): Iterable<Evento<S>>
}

/** Estado completo de la búsqueda tras un evento. */
export interface Foto<S> {
  paso: number
  evento: Evento<S>
  nodos: Nodo<S>[] // nodos generados, indexados por id
  abierta: number[] // ids, en orden
  actual: number | null
  ordenExpansion: number[] // ids en el orden en que se expandieron
  resultado: { tipo: 'solucion'; nodoId: number } | { tipo: 'fallo' } | { tipo: 'limite' } | null
}

export interface Traza<S> {
  eventos: Evento<S>[]
  fotos: Foto<S>[]
  descripciones: string[]
}
