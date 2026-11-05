# Búsqueda de Coste Uniforme

> Versión: *1.0*
> Última modificación: *27/10/26*

## Características

Completo *si existe una solución la encuentra*
Óptima *si existen varias soluciones encuentra la mejor*
Búsqueda no informada

## Pseudocódigo explicado

*Misma estrcuctura que el método general de búsqueda, especificando que cada nodo se pone al final. Por tanto, no explciaré en detalle cada parte, solo lo diferencial.*

```
g(n) // es el coste acumulado de n -> el coste acumulado es la distancia del nodo inicial al nodo n (recordar que no es lo mismo nodo que estado A es un estado, nodo es una estructura que representa
// un camino concreto desde el origen hasta ese estado, por lo tanto dos nodos del estado A pueden tener diferente g)

Repetir 
	Si vacio?(abierta) entonces
		devolver negativo

	nodo = primero(abierta)

	Si meta?(nodo) entonces
		devolver nodo

	sucesores = expandir(nodo)

	Para cada sucesor en sucesores hacer
		sucesor.padre = nodo
		ordInsertar(n, abierta, g) // lo que se hace es ordenar en la cola por el coste g del nodo, por lo que siempre se expandirá primero el nodo de menor coste g
	Fin

// El algoritmo debe almacenar cada nodo con su valor g
// El algoritmo debe insertar los nuevos nodos en abierta en orden ascendente según su valor g

```
