import type { Algoritmo, Evento, Foto, IdLinea, Nodo, Problema, Traza } from './tipos'

/** Aplica un evento a la foto anterior y devuelve una foto nueva (sin mutar la anterior). */
export function aplicar<S>(previa: Foto<S> | null, evento: Evento<S>): Foto<S> {
  const foto: Foto<S> = previa
    ? { ...previa, paso: previa.paso + 1, evento }
    : { paso: 0, evento, nodos: [], abierta: [], actual: null, ordenExpansion: [], resultado: null }

  switch (evento.tipo) {
    case 'inicio':
      foto.nodos = [evento.nodo]
      foto.abierta = [evento.nodo.id]
      break
    case 'seleccionar':
      foto.abierta = foto.abierta.filter((id) => id !== evento.nodoId)
      foto.actual = evento.nodoId
      break
    case 'testMeta':
      break
    case 'expandir':
      foto.nodos = [...foto.nodos, ...evento.sucesores]
      foto.ordenExpansion = [...foto.ordenExpansion, evento.nodoId]
      break
    case 'insertar':
      foto.abierta = foto.abierta.toSpliced(evento.posicion, 0, evento.nodoId)
      break
    case 'solucion':
      foto.resultado = { tipo: 'solucion', nodoId: evento.nodoId }
      break
    case 'fallo':
      foto.resultado = { tipo: 'fallo' }
      foto.actual = null
      break
    case 'limite':
      foto.resultado = { tipo: 'limite' }
      break
  }
  return foto
}

/** Nodos desde la raíz hasta `nodoId`, siguiendo los padres. */
export function camino<S>(foto: Foto<S>, nodoId: number): Nodo<S>[] {
  const resultado: Nodo<S>[] = []
  let actual: Nodo<S> | undefined = foto.nodos[nodoId]
  while (actual) {
    resultado.unshift(actual)
    actual = actual.padre === null ? undefined : foto.nodos[actual.padre]
  }
  return resultado
}

/** Líneas del pseudocódigo que corresponden a cada evento. */
export function lineasDeEvento(evento: Evento<unknown>): IdLinea[] {
  switch (evento.tipo) {
    case 'inicio':
      return ['inicio']
    case 'seleccionar':
      return ['vacia', 'primero']
    case 'testMeta':
      return ['meta']
    case 'expandir':
      return ['expandir']
    case 'insertar':
      return ['paraCada', 'padre', 'insertar']
    case 'solucion':
      return ['solucion']
    case 'fallo':
      return ['vacia', 'fallo']
    case 'limite':
      return []
  }
}

function describir<S>(foto: Foto<S>, problema: Problema<S>, criterio: string): string {
  const e = foto.evento
  const nombre = (id: number) => problema.etiqueta(foto.nodos[id].estado)

  switch (e.tipo) {
    case 'inicio':
      return `abierta.añadir(s_0) → abierta = [${nombre(e.nodo.id)}]`
    case 'seleccionar':
      return `nodo = primero(abierta) → ${nombre(e.nodoId)} (sale de abierta)`
    case 'testMeta':
      return `meta?(${nombre(e.nodoId)}) → ${e.esMeta ? 'sí' : 'no'}`
    case 'expandir':
      return e.sucesores.length === 0
        ? `expandir(${nombre(e.nodoId)}) → no tiene sucesores`
        : `expandir(${nombre(e.nodoId)}) → ${e.sucesores.map((s) => problema.etiqueta(s.estado)).join(', ')}`
    case 'insertar': {
      const padre = foto.nodos[e.nodoId].padre!
      return `${nombre(e.nodoId)}.padre = ${nombre(padre)}; ordInsertar(${nombre(e.nodoId)}, abierta, ${criterio}) → posición ${e.posicion + 1} de ${foto.abierta.length}`
    }
    case 'solucion': {
      const nodos = camino(foto, e.nodoId)
      const meta = nodos[nodos.length - 1]
      return `devolver ${nombre(e.nodoId)} → camino: ${nodos.map((n) => problema.etiqueta(n.estado)).join(' → ')} (${meta.profundidad} pasos, coste ${meta.g})`
    }
    case 'fallo':
      return 'vacía?(abierta) → sí: devolver negativo'
    case 'limite':
      return `Búsqueda detenida: se ha alcanzado el límite de ${e.maxNodos} nodos generados`
  }
}

/** Ejecuta el algoritmo completo y guarda una foto y una descripción por evento. */
export function ejecutar<S>(algoritmo: Algoritmo, problema: Problema<S>, maxEventos = 10_000): Traza<S> {
  const traza: Traza<S> = { eventos: [], fotos: [], descripciones: [] }
  let foto: Foto<S> | null = null
  for (const evento of algoritmo.ejecutar(problema)) {
    foto = aplicar(foto, evento)
    traza.eventos.push(evento)
    traza.fotos.push(foto)
    traza.descripciones.push(describir(foto, problema, algoritmo.criterioOrden))
    if (traza.eventos.length >= maxEventos) break
  }
  return traza
}
