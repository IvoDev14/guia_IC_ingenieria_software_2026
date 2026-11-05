import type { Evento, LineaPseudocodigo, Nodo, OpcionesBusqueda, Problema } from './tipos'

/** Devuelve la posición de `abierta` en la que se inserta `nuevo`. */
export type OrdInsertar<S> = (abierta: readonly Nodo<S>[], nuevo: Nodo<S>) => number

/**
 * Método general de búsqueda (docs/teoria/2_metodo_de_busqueda.md).
 * Casi todos los algoritmos de la asignatura son este método con otro `ordInsertar`.
 * Emite un evento por cada línea relevante del pseudocódigo.
 */
export function* metodoGeneral<S>(
  problema: Problema<S>,
  ordInsertar: OrdInsertar<S>,
  { maxNodos = 500 }: OpcionesBusqueda = {},
): Generator<Evento<S>> {
  let siguienteId = 0
  const crearNodo = (estado: S, padre: Nodo<S> | null, accion: string | null, coste: number): Nodo<S> => ({
    id: siguienteId++,
    estado,
    padre: padre?.id ?? null,
    accion,
    g: (padre?.g ?? 0) + coste,
    profundidad: padre ? padre.profundidad + 1 : 0,
  })

  const raiz = crearNodo(problema.s0, null, null, 0)
  const abierta: Nodo<S>[] = [raiz]
  yield { tipo: 'inicio', nodo: raiz }

  while (true) {
    if (abierta.length === 0) {
      yield { tipo: 'fallo' }
      return
    }

    const nodo = abierta.shift()!
    yield { tipo: 'seleccionar', nodoId: nodo.id }

    const esMeta = problema.meta(nodo.estado)
    yield { tipo: 'testMeta', nodoId: nodo.id, esMeta }
    if (esMeta) {
      yield { tipo: 'solucion', nodoId: nodo.id }
      return
    }

    if (siguienteId >= maxNodos) {
      yield { tipo: 'limite', maxNodos }
      return
    }

    const sucesores = problema.expandir(nodo.estado).map((s) => crearNodo(s.estado, nodo, s.accion, s.coste))
    yield { tipo: 'expandir', nodoId: nodo.id, sucesores }

    for (const sucesor of sucesores) {
      const posicion = ordInsertar(abierta, sucesor)
      abierta.splice(posicion, 0, sucesor)
      yield { tipo: 'insertar', nodoId: sucesor.id, posicion }
    }
  }
}

/** Pseudocódigo del método general, igual que en los apuntes, con el criterio de orden concreto. */
export function pseudocodigoMetodoGeneral(criterioOrden: string): LineaPseudocodigo[] {
  return [
    { texto: 'abierta.añadir(s_0)', nivel: 0, id: 'inicio' },
    { texto: 'repetir', nivel: 0 },
    { texto: 'si vacía?(abierta) entonces', nivel: 1, id: 'vacia' },
    { texto: 'devolver negativo', nivel: 2, id: 'fallo' },
    { texto: 'nodo = primero(abierta)', nivel: 1, id: 'primero' },
    { texto: 'si meta?(nodo) entonces', nivel: 1, id: 'meta' },
    { texto: 'devolver nodo', nivel: 2, id: 'solucion' },
    { texto: 'sucesores = expandir(nodo)', nivel: 1, id: 'expandir' },
    { texto: 'para cada sucesor en sucesores hacer', nivel: 1, id: 'paraCada' },
    { texto: 'sucesor.padre = nodo', nivel: 2, id: 'padre' },
    { texto: `ordInsertar(sucesor, abierta, ${criterioOrden})`, nivel: 2, id: 'insertar' },
    { texto: 'fin {repetir}', nivel: 0 },
  ]
}
