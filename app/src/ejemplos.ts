import type { ComponentType } from 'react'
import type { Foto, Nodo, Problema } from './core/tipos'

/** Lo que recibe la vista del "mundo real" de cualquier problema. */
export interface MundoProps<S> {
  problema: Problema<S>
  foto: Foto<S>
  /** Nodo cuyo camino se muestra: el seleccionado en el árbol o, si no hay, el actual. */
  foco: Nodo<S> | null
}

/** Combinación concreta de problema + algoritmo que se muestra en la app. */
export interface Ejemplo<S> {
  id: string
  titulo: string
  descripcion: string
  algoritmoId: string
  problema: Problema<S>
  Mundo: ComponentType<MundoProps<S>>
}

/** Borra el tipo del estado para poder guardar ejemplos de distintos problemas en el mismo registro. */
export function definirEjemplo<S>(ejemplo: Ejemplo<S>): Ejemplo<unknown> {
  return ejemplo as unknown as Ejemplo<unknown>
}
