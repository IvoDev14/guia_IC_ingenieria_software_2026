En [[NI_minimax]] vemos como es el algoritmo minimax sin ningún tipo de heurística, recorriendo todo el árbol. Aquí veremos minimax informado.

```JavaScript

function MaxValor(estado)
	// Comprobamos si el estado cumple las características para suspenderse
	if es_suspension(estado) do
		return e(estado) // Devolvemos el valor e, que mide la utilidad
	
	sucesores = expandir(max, estado)
	a = -infinito // Crea un valor inicial poniéndose en el peor de los casos
	
	for sucesor in sucesores do
		a = max(a, MinValor(sucesor)) // Como los sucesores serán turno de min, debe devolver el valor máximo entre el subarbol que beneficiaría a min y el valor que de momento es el máximo 
	
	return a
	Fin{MaxValor}
	

//Esto es igual pero está simulando lo que haría min, es decir elegir lo mejor para min y lo peor, por consecuencia, para max
function MinValor(estado)

	if es_suspension(estado) do
		return e(estado)
		
	sucesores = expandir(min, estado)
	b = +infinito
	
	for sucesor in sucesores do
		b = min(b, MaxValor(sucesor))

	return a
	fin {MinValor}


```


## Análisis de complejidad

Minimax genera el árbol de juego completo, en profunidad primero hasta los nodos o el nivel de suspensión. 
Complejidad $O(b^d)$ donde $b$ es el factor de ramificación y d es el número de $plys$ explorados