# Búsqueda en Amplitud

> Estado: *1.1*
> Última modificación: *27/10/26*

## Características

Completo *si existe una solución, este algoritmo la encuentra*
Óptimo (solo para operadores de coste uno) *si hay varias soluciones encuentra la más óptima*
Complejidad exponencial tanto en tiempo como en espacio (incluso en el mejor de los casos)
Búsqueda no informada

## Pseudocódigo explicado

*Misma estrcuctura que el método general de búsqueda, especificando que cada nodo se pone al final. Por tanto, no explciaré en detalle cada parte, solo lo diferencial.*

```

abierta.añadir(s_0)

Repetir
	Si vacia?(abierta) entonces
		devolver negativo

	nodo = primero(abierta)

	Si meta?(nodo) entonces
		devolver(nodo)

	sucesores = expandir(nodo)

	Para cada sucesor en sucesores hacer
		sucesor.padre = nodo
		ordInsertar(n, abierta, final) // La función orden en este caso específico introduce el nodo hijo al final de la lista *abierta*
	Fin

```

## Análisis de complejidad 

*b* -> factor de ramificación: número máximo de sucesores posibles que se pueden tomar desde cualquier estado (ejemplo si en un juego te puedes moverte en 4 direcciones, *b* = 4)
*d* -> profundidad de la meta: es el número mínimo de pasos a los que se encuentra el nodo meta más cercano desde la raíz

### Complejidad temporal

La complejidad temporal mide cuantos nodos tiene que expandir/generar el algoritmo hasta dar con la solución.

Teniendo en cuenta que la búsqueda en amplitud explora el árbol estrictamente nivel or nivel:

- Nivel 0 (estado inicial): b^0 = 1 nodo
- Nivel 1: *b^1 = b* nodos
- Nivel d - 1: *b^(d-1)* nodos 
- Nivel *d* (donde está la meta) -> Aquí los nodos se analizan 1 a 1

Sumando todos los nodos hasta alcanzar la meta en el nivel *d*, tenemos 3 escenarios posibles:

- Peor caso: La meta es el último nodo que evaluamos en el nivel *d*
	Nodos = 1 + b ... +b^d -> O(b^d)

- Caso medio: la meta se encuentra hacia la mitad del nivel d
	Nodos = 1+b+...+b^(d-1) + (b^d) / 2 -> O(b^d)

- Mejor caso: la meta es el primer nodo que evaluamos en el nivel d
	Nodos = 1 + b + ... + b^(d-1) + 1 -> O(b^d)

### Complejidad espacial

Mide cuántos nodos deben permanecer guardados en la memoria RAM al mismo tiempo

Cuando el algoritmo llega al nivel d, la cola abiertos contiene en memoria todos los nodos del nivel d que aún no se han expandido (más los del nivel anterior). Por tanto, el número
de nodos guardados en memoria es del mismo orden que los nodos generados: O(b^d)
