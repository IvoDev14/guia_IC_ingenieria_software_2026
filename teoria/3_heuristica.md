# Heurística

> Versión: *1.0*
> Última modificación: *27/10/26*

En este documento se explicará lo que es la Heurística y sus términos relacionados

## Que es la heurística

Procede del griego (descrubrir o encontrar).

En inteligencia artificial, representa el conocimiento empírico o práctico sobre un dominio concreto utilizado para guiar la exploración

En las presentaciones aparecen dos interpretaciones, la fuerte (la heurística sustituye por completo al algoritmo de búsqueda) y la débil (se combina con un método de búsqueda sistemático)

- Interpretación fuerte -> se entiende como "atajo" o regla práctica -> por si sola no garantiza la solución
- Interpretación débil -> se combina un métod de búsqueda riguroso con información heurística. La heurística mejora el rendimiento medio del algoritmo pero no asegura una mejora en el peor caso.

## La función heurística

Para integrar conocimiento en un algoritmo se define una función heurística h*(n) que toma un nodo n y devuelve un valor numértico.

- Mide o estima el coste del camino restante desde el nodo actual n hasta el nodo meta más cercano
- El propósito es evaluar la deseabilidad o adecuación de un nodo para decidir cuál extraer y expandir primero
- Notación habitual (hay en libros que aparece distinto)
	- h(n): coste real exacto del nodo n hasta la meta
	- h*(n): coste estimado del nodo n hasta la meta

### Propiedades Fundamentales de las Funciones Heurísticas

#### Optimismo

Una función heuristica es optimista si nunca sobreestima el coste real, es decir -> h*(n) <= h(n) para todo n

Si la heurística es optimista, el algoritmo A*  garantiza encontrar siempre la solución óptima

Un ejemplo clar sería en navegación de rutas -> la distancia en línea recta hasta el destino siempre será menor o igual a la distancia por calles

#### Monotonía

Una función heurística es monotona/consistente <-> para todo nodo n_i y cualquier sucesor directo n_j, la diferencia de estimacuón no supera el coste del paso c(n_i, n_j)

Es decir -> h*(n_i) - h*(n_j) <= c(n_i, n_j) -> se podría decir malamente para entederlo mejor como que el coste de un nodo al otro calculandolo con las distancias estimadas a la meta, sea menor o igual que el coste real de un nodo a otro

Esto signfica que también subestima el coste de cada operador.

Toda heurística consistente es también optimista (pero la inversa no siempre se cumple)

### Calidad y comparación de heurísticas

No todas las heurísticas optimistas son igual de efectivas. Sabemos que las heurísticas optimistas son siempre menores o iguales a la distancia real. Por tanto comparando dos heurísticas optimistas
para saber cual es mejor (se dice "más informada") simplemente tenemos que comparar cual es mayor (creo que se entiende pero basicamente como las dos tienen que ser menores o iguales al valor real
por definición, entonces la más grande será la que esté mas cerca de la distancia real)

Formalmente:

Decimos que h_1* es más informada que h_2* si h_1*(n) >= h_2*(n) para todo n.

#### Teorema de calidad

El algoritmo A* utilizando la heurística más informada (h_1*) expandirá igual o menor número de nodos que h_2*, por tanto, conviente usar siempre la heurísica que devuelva valores más altos, sin
sobrepasar nunca el coste real.

#### Combinación mediante heurísticas

Si tienes varías heurísticas optimistas y ninnguna domina claramente a las demás, se puede definir una nueva heurístca que devuelva el max() entre todas las heurísticas



