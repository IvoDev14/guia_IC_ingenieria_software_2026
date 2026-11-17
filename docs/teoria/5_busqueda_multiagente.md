# Búsqueda Multiagente

> Versión: *borrador*
> Última Modificación: *8/11/26*

En este documento se explicarán los conceptos de la búsqueda multiagente.

## Contexto

Hasta ahora, los agentes de búsqueda estaban "solos" en el entorno, ellos eran los únicos que realizan las acciones. En la búsqueda multiagente la cosa cambia.

- Múltiples agentes en el mismo entorno
- Las acciones de los agentes influyen en los demás agentes
- Ningún agente puede controlar las acciones de otro agente
- Hasta cierto punto, un agente puede predecir las acciones del resto de agentes

## Tipos de Problemas

### Escenarios Cooperativos

En los escenarios cooperativos los distintos agentes buscan una misma solución

### Escenarios Parcialmente Cooperativos

En los escenarios parcialmente cooperativos los agentes tienen tanto metas comunes como metas opuestas a las del resto de agentes

### Escenarios Antagónicos

En los escenarios antagónicos los agentes tienen metas opuestas entre sí

#### Juegos

Es el ejemplo que se expone en las presentaciones para explicar los escenarios antagónicos. 

En los juegos el escenario está completamente definido por las reglas del juego. Y se clasifican de distintas formas:

- Número de jugadores (bipersonales/múltiples jugadores)
- Elementos de azar (con elementos de azar / sin elementos de azar)
- Información (información perfecta/información incompleta)

##### Árboles de Juego

Para tratas los juegos, vamos a introducir el concepto de árboles de juego. Los árboles de juego son similares a los árboles de decisión pero teniendo en cuenta que aquí las decisiones no se toman por un único agente.

Un árbol de juego se define como:$$G=(N, E, L)$$ Donde:

- $N$ es el conjunto de nodos
- $E \subseteq N\times N$ es el conjunto de aristas o jugadas
- $L=\{min, max\}$ es el conjunto de etiquetas, indica a cual de los dos agentes le toca jugar

Y para considerarse árbol de juego se debe cumplir:

- $G$ no es vacío
- todos los sucesores de $max$ son etiquetados como $min$
- todos los sucesores de $min$ son etiquetados como $max$ 

*Nota: esta es la definición para los árboles de juego para los juegos bipersonales*

##### Modelos de Juego Bipersonales

En un modelo de Juego Bipersonal, los agentes $min$ y $max$ deben tener los siguientes **conocimientos a priori**:

- $s_0$: estado inicial
- $expandir$: devuelve el conjunto finitio de posiciones sucesores
- $terminal?$: devuelve si es terminal o no (es decir si el estado es un estado final y la partida acaba)
- $U$: es una función de utilidad que solo se ejecuta sobre los estados terminales (comprobar quien ha ganado, recuento de puntos...) -> en los juegos de suma nula max gana si y solo si min pierde y viceversa. Si gana $max$ $U(s) = +\infty$ si gana $min$ -> $U(s)=-\infty$ , si empatan $U(s)=0$   

##### Estrategias

Hasta ahora hemos visto como modelar los juegos, las funciones para desarollar una partida y como representarlo. Pero no hemos hablado de como deciden los agentes que movimiento tomar. Para abarcar esto tomaremos la perspectiva del agente $max$.

**Estrategia Inicial**

Si el agente $max$ aplica métodos de búsqueda estándar estaría asumiendo que el agente $min$ haría lo que le convendría a $max$, y como estamos hablando de un escenario antagónico esto no va a pasar.

Por tanto la estrategia inicial es explorar el árbol de juego, asumiendo que $min$ hará lo mejor para él (es decir lo peor para $max$). Tras esto ejecuta la acción que mejor le viene según la simulación. Esto es la estrategia **minimax**

Estrategía minimax por pasos:

1. Generar árbol de juego completo
2. Aplicar función de utilidad de cada nodo terminal
3. Propagar las utilidades hacia arriba
	1. En los nodos $max$ usar la utilidad máxima de los sucesores (es decir decide ir hacia el nodo que le acerque más a ganar)
	2. En los nodos $min$ usar la utilidad mínima de los sucesores (es decir, asume que el contrincante irá al nodo que más le acerque a ganar a él (es decir a que pierda $max$))
4. Los valores acaban llegando al nodo raíz
5. La jugada óptima de $max$ es la que lleva al sucesor de utilidad máxima. 

**Problema de la estrategia inicial** 

Hay un problema claro con esto y es -> hay que recorrer el árbol por completo. Incluso en juegos pequeños como el tictactoe las posibilidades son muchas. (El árbol de juego del tictac toe acaba con 255168 nodos hoja (es decir terminales) y 549946 en total sin podas)

**Solución: Heurísticas**

Se sustituye la prueba terminal por una *prueba suspensión* que detiene la búsqueda (ya sea por profundidad máxima, posiciones en reposo, mezclas...)

Se aplica una función evaluación $e$ que estima la utilidad esperada del juego. Debe coincidir con la función de utilidad $u$ en los nodos terminales. Por ejemplo en tic tac toe puede devolver el "número de líneas abiertas para líneas max en s"- "número de líneas abiertas para líneas min en s"
##### Juegos Bipersonales con elemento azar

- En los juegos bipersonales con un elemento de azar, la idea es usar el algoritmo minimax con un jugador extra que es "azar" y se incluye siempre que haya un evento independiente de los jugadores y cuyo resultado es aleatorio.
- Cada uno de los sucesores de nodo azar tiene asociado la probabilidad de que este resultado ocurra.
- El objetivo sigue siendo elegir la mejor jugada para max 

