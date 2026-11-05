# Algoritmo A Estrella ($A^*$)

> Versión: *2.0*
> Última modificación: *4/11/26*

En este documento se explicará el algoritmo A*

## Características

Completo *si existe una solución la encuentra*
Si h* es optimista entonces el método A* es óptimo *si hay varias soluciones encuentra la mejor*

## Pseudocódigo explicado

La idea del algoritmo estrella es combinar el coste acumulado g (recordamos que g(n) es la distancia del nodo inicial al nodo n) y el coste aproximado para llegar a un nodo meta desde el
nodo n (h*(n))

```

abierta.añadir(s_0)

repetir

	si vacio?(abierta) entonces
		devolver negativo

	nodo = primero(abierta)

	si meta?(nodo) entonces
		devolver nodo

	sucesores = expandir(nodo)

	para cada sucesor en sucesores hacer
		sucesor.padre = nodo
		ordInsertar(n, abierta, f*)
	fin {repetir}

```

Podemos ver que, de nuevo, es la misma estructura básica de los algoritmos de búsqueda, pero con la función f* para insertar los algoritmos en ese orden.

La función f* será -> f*(n) = g(n) + h*(n), es decir, es el coste acumulado (la distancia del nodo inicial al nodo n) + el coste aproximado para llegar del nodo n a un nodo meta. Se ordenará
con este resultado, en base a cual es el menor.

La lista abierta se mantiene ordenada por valores crecientes de f* 

## Análisis De Complejidad

El número de nodos expandidos por $A^*$ depende de la precisión de $h^*$ siendo los dos extremos:

- si $h^*(n)=h(n)$ para todos los nodos $n$ entonces la complejidad es lineal.
- si $h*(n)=0$ para todos los nodos $n$ entonces $A^*$ degenera a la búsqueda de coste uniforme. Esto debido a que en coste uniforme se ordena por $g(n)$ y $f^*(n)= g(n)+h^*(n)$ por tanto si $h^*(n)=0 \implies f^*(n)=g(n)$   

Por tanto:

- En el peor caso $A^*$ es lineal solo si para todos los nodos $n$:$$|h(n)-h^*(n)|<= O(c)$$
- En el pero caso $A*$ es polinomial sólo si para todos los nodos $n$: $$|h(n)-h^*(n)|<= O(log(h(n)))$$
- 