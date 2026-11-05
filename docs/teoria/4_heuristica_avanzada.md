# Heurística Avanzada

> Versión: *1.0*
> Última modificación: *5/11/26*

En este documento trataremos el tema de la heurística avanzada para dominar y entender los conceptos de teoría

## Encontrar Funciones Heurísticas

Vamos a tratar como encontrar funciones heurísticas optimistas y/o consistentes y como se pueden distinguir entre buenas y malas funciones heurísticas

### Aprendizaje

La idea general del aprendizaje es generar funciones heurísticas sobre la marcha. Los pasos generales a seguir serían los siguientes:

1. Se realizan varias búsquedas dentro del mismo dominio, con ligeras diferencias. 
2. En cada paso, se utiliza el coste real de un paso para mejorar el valor de h* (hay diferentes formas de hacerlo)
3. En la próxima búsqueda se usan los valores de h* actualizados

El ejemplo que hay en las presentaciones (diapositiva 5) lo deja bastante claro:

1. Expande nodo n_i con tres sucesores n_j1 n_j2 y n_j3
2. Ahora tenemos, los costes de desplazarse a cada nodo hijo (c(n_i, n_jk) siendo K perteneciente a {1,2,3}) y h\*jk 
3. Para calcular la nueva función heurística de h\*(n_i) lo que hace es el minimo de la suma de cada coste (c(n_i, n_jk)) con su respectivo h\*jk. Es decir, básicamente lo que está haciendo es calcular la distancia estimada de n_i al nodo meta sumando la distancia estimada del nodo hijo más el coste real de pasar del nodo n_i al nodo hijo, y cogiendo el mínimo de entre todos los hijos, es decir la mínima distancia estimada.

Esto asegura que si h_jk\*(n) para todo k son optimistas, entonces, el valor aprendido $h*(n_i)$ es optimista. Creo que se entiende bien porque, pero basicamente es porque la heurística de $n_i$ será la mínima entre las sumas por cada hijo del coste real en llegarl al hijo y la heuristica del hijo, que sabemos que es menor al coste real. Si cogemos la mínima tendríamos lo que nos cuesta llegar al nodo hijo + lo que se supone que del nodo hijo nos va a costar a llegar a la meta, que es menor o igual a lo que nos va a costar llegar de verdad. Por tanto la heuristica de $n_i$ será igual o menor a lo que nos costaría llegar realmente al nodo meta ($h(n_i)$).

#### Método Propuesto

- Realizamos una búsqueda con $h^*(n) = 0 \ \forall n$ (nos aseguramos que es optimista, de este modo, por lo que acabmos de explicar, seguirá siendo optimista siempre)
- En cada paso de $n_i$ a $n_j$: $$h^*(n_i) := min[h^*(n_j)+c(n_i,n_j)] n_j\in expandir(n_i)$$
- Extensión (opcional): al aprender un nuevo valor $h^*(n)$ para un estado $n$, en caso de que hubiera otras copias de $n$ como hojas en el árbol de búsqueda generado por $A^*$, actualizar sus valores de $f^*$ con la nueva heurística y reordenar en la lista $abierta()$. 


### Diseño

Una opción para diseñar funciones heurísticas es mediante la intuición del diseñador. Pero aquí aprenderemos sobre diseñar las funciones heurísticas mediante un método sistemático de diseño. 

#### Problemas relajados

Dado un problema relajado $P'$ de un problema original $P$:

- $P'$ tiene el mismo conjunto de estados $S$, estado inicial $S_0$ y estados $meta$ 
- Además de las acciones definidas en $P$, $P'$ tiene algunas acciones más. O lo que es lo mismo: $$expandir_P \subseteq expandir_{P'}$$
- Para las acciones compartidas, el coste $c$ es el mismo en $P$ y en $P'$ 

Lo que buscamos con esto es encontrar $h_{P'}(n)<=h_P(n)$ para todo estado $s\in S$, ya que por tanto sería una función heurística optimista efectiva para P (esto si es facilmente computable claro).

##### Encontrar problemas relajados $P'$ 

Para encontrar problemas relajados, lo que tenemos que hacer es un problema que nos de más libertad. Para explicar esto en las diapositivas explica el problema del 8-puzzle

- **Estados**:
	- Posición de cada una de las piezas
- Operadores:
	- Mover pieza adyacente a la posición del "hueco"
- Coste:
	- Realizar una operación tiene coste 1

Dado los operadores podemos sacar que tenemos 2 restricciones para mover una pieza X a una posición Y:

- La posición Y está libre
- La pieza X es adyacente a la posición Y

Se deben cumplir ambas, por lo que podemos sacar los siguientes 3 problemas relajados:

- $P'_1$: no hay ninguna restricción
- $P'_2$: La posición Y debe estar libre
- $P_3'$: La posición X debe ser adyacente a la posición Y

Y con esto podemos sacar su respectiva $h$ dado un estado inicial

- $h^*_1(s)=numero\ de \ piezas \ desordenadas\ en\ s$ -> si podemos mover las piezas a donde queramos en una sola operación y sin importar si está libre o no, lo único que tenemos que hacer es poner cada pieza en su sitio, por tanto el coste sería el númeor de piezas que tenemos que poner en su sitio.
- $h^*_2(s) = suma\ de \ saltos \ necesarios\ en\ s$ 
- $h^*_3(s) = suma\ de\ las\ distancias\ de\ Manhattan\ en\ s$ -> si la única condición es que para mover una pieza a otro lugar es que sea adyacente, entonces deberemos mover la pieza paso a paso por el tablero, cada paso cuesta 1, por tanto sería la distancia de Manhattan (la distancia de Manhattan es llegar de un punto a otro sin poder ir en diagonal) y para calcular todo pues la suma de las distancias de Manhattan por cada pieza descolocada.

Recordemos que para comparar que una función heurística optimista es "mejor" que otra (más informada) debemos comparar cual es mayor. Cuando una función heurística es mayor o igual que otra para todos los estados, entonces esa función es más informada.


## Mejoras de $A^*$ 

El problema del algoritmo $A^*$ es la complejidad en memoria, se queda antes sin RAM que sin tiempo. Para intentar paliaresto en las diapositivas se exponen 3 enfoques.

### Heurísticas débiles

- Objetivo principal: resolver el problema de la memoria masiva de $A^*$ sin perder optimalidad
- Lo que sacrifica: la forma de solucionar mediante heurísticas débiles es basicamente expandir ciertos nodos de manera repetida para almacenar menos nodos en memoria, por tanto se gasta más tiempo a cambio de necesitar menos memoria.

### Heurísticas fuertes

- Objetivo principal: reducir espacio de búsqueda introduciendo conocimiento experto o estructuras sobre el dominio.
- Lo que sacrifica: se sacrifica optimalidad, no se asegura encontrar la solución óptima
- Técnicas principales:
	- Búsqueda por subobjetivos(island driven search): se eligen estados intermedios por los que se asume que toda solución debe pasar ($i_1, i_2,...,i_n$). De esta manera se divide el problema en pequeñas búsquedas $A^*$
	- Búsqueda Jerárquica: es una especie de extensión de la búsqueda por subobjetivos. pero generando los estados intermedios de forma dinámica. Esto se hace definiendo un espacio de estados a un "meta-nivel" (por ejemplo los nodos son ciudades y el meta nivel es pais). Tendremos macro-operadores (por ejemplo ir de un país a otro). Y ahora el problema, si quiero ir de una ciudad a otro, vería por que paises pasar y cada pais de esos sería un subobjetivo. Se pueden definir distintos meta niveles (por ejemplo comunidades autonomas, paises). 
### Búsqueda en línea

Hasta ahora todos los métodos de búsqueda vistor eran offline, es decir, el agente planifica la secuencia de pasos y luego se ejecutan en el mundo real. Es importante entender esto bien.

En la búsqueda offline no estamos realmente pasando de un estado a otro, estamos viendo que pasaría si hago x acciones, por eso tengo que usar más memoria, tengo que recordar todo lo que necesito.

Por ejemplo, dada una lista $abierta$, y un nodo inicial $A$:

- expando $A$ y tengo $B$,$C$ y $D$ -> $abierta=\{B,C,D\}$ 
- expando $B$ y sale de hijos $X$ y $Z$ -> $abierta=\{C,D,X,Z\}$.

Podemos ver que estoy almacenando los nodos para ver que pasaría si voy por otro camino en vez de por el primero que he cogido, esto es posible ya que realmente no estamos cambiando de estado. En la vida real si eliges ir por una ciudad en vez de por otra, la unica forma de ver cuanto tardarías yendo por la otra es retrocediendo. 

La búsqueda online lo que hace es:

1. Percibir el estado actual del mundo $s$
2. Se aplica un método de búsqueda online para decidir siguiente acción $a$
3. Se ejecuta la acción $a$ en el mundo real, dando lugar al nuevo estado $s'$ 

Es decir, diciéndolo mal pero más entendible, estamos pasando de comprobar distintas posibilidades, a tomar una decisión actuar y trabajar a partir de lo que ha generado al decisión actual. 

De esta manera no tenemos que almacenar nodos solo ver a los que podemos acceder desde el estado en el que estamos. 

La búsqueda en línea es indicada cuando el espacio de búsqueda es demasiado grande y no es realista usar un modelo determinista de los efectos de acciones.

*No se puede asegurar ni optimalidad ni completitud*

#### Índice competitivo

Buscamos minimizar el índice competitivo. $$índice\ competitivo=\frac{coste\ del\ camino\ real\ del\ agente}{coste\ del\ camino\ optimo}$$
El índice competitivo puede ser infinito, esto pasa cuando hay acciones que no son reversibles.

#### Búsqueda con Horizonte

##### Problema:

Hasta ahora hemos explicado lo que es la búsqueda en línea, pero no hemos hablado de una pregunta importante: 

**si el agente está en un estado actual $s$, y habiendo $n$ acciones posibles en $s$, ¿a cuál de los estados sucesores $s^1_1, ..., s_n^1$ ir?**

##### Solución:

Combinar el concepto puro de búsqueda online, con la búsqueda offline. 

Lo que hacemos en la búsqueda con horizonte es una búsqueda offline con un árbol de $k$ profundidad. Una vez el agente decida con esa profundidad ejecuta y cambia de estado en el mundo real. 

Dicho de otra forma más parecido a las presentaciones:

##### Método:

- Generar el conjunto $H_k$ de estados a los que se puede llegar con $k$ acciones (es decir en $H_k$ se almacenan todos los nodos de profundidad $k$ desde el nodo en el que está el agente)
- $Heurística(fuerte)$ (lógica) que aplica la búsqueda con horizonte:
	- el mejor camino desde $s$ a un estado meta es a través del estado $s^*$ a nivel $k$ de menor valor de $f^*$ 
- Tras esto se lleva a cabo la acción $a^*$ que lleva al agente al primer estado (desde el estado en el que se encuentra) del camino a $s^*$. ***Importante: no se traslada al estado $s^*$ solo al primer nodo del camino hacia ese estado*** 
- Luego al estar fisicamente en el estado $s_i^1$ se repite el proceso.

Esto se repite hasta que el agente se encuentra con el nodo meta. La manera de generar el conjunto $H_k$ es mediante la búsqueda en profundidad. Si esa búsqueda se topa con la meta entonces se asigna a $n^*$ el nodo meta, si no se asigna a $n^*$ el nodo con menor valor de $f^*$. El agente no sabe si ha recibido el nodo meta o un nodo de paso, solo sabe que tiene que avanzar, es al avanzar cuando comprueba si es meta o no. 

Algoritmicamente esto sería:

1. Percibir estado actual $s$
2. Aplicar búsqueda en profundidad limitada por le nivel $k$
3. En cada nodo hoja $n$ de nivel $k$ actualizar un valor $\alpha$ que representa el mínimo valor de $f^*$ encontrado en nodos de nivel $k$ hasta el momento
4. Si en la búsqueda de profundidad se encuentra un nodo meta $n^*$ será este nodo, de lo contrario $n^*$ será el primer nodo hoja de nivel $k$ con $f^*(n^*) = \alpha$ 
5. Ejecutar la primera acción $a^*$ en el camino que lleva de $s$ a $n^*$ 

##### Optimización mediante podas $\alpha$ (para $h^*$ consistente)

Partiendo del Lema:

> Si $h^*$ es consistente, para cualquier nodo interior de $n'$ del árbol de búsqueda, los sucesores de $n'$ tendrán valor de $f^*$ mayor o igual a $f^*(n')$.

Durante el proceso de búsqueda en profundidad limitada podemos abandonar cualquier rama a partir de un nodo $n'$ con $f^*(n')\le \alpha$  



