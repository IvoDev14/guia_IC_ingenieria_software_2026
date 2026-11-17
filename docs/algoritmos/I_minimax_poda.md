> versión: *1.0*
> última modificación: 8/11/26

En este documento se explicará la extensión de minimax con poda. Pensado para mejorar la complejidad de minimax

## Pseudocódigo

``` JavaScript

function MaxValor(estado, a, b)
	// Comprobamos si el estado cumple las características para suspenderse
	if es_suspension(estado) do
		return e(estado) // Devolvemos el valor e, que mide la utilidad
	
	sucesores = expandir(max, estado)
	
	for sucesor in sucesores do
		a = max(a, MinValor(sucesor, a, b)) // Como los sucesores serán turno de min, debe devolver el valor máximo entre el subarbol que beneficiaría a min y el valor que de momento es el máximo 
		if a >= b do devolver (a)
	
	return a
	Fin{MaxValor}
	

//Esto es igual pero está simulando lo que haría min, es decir elegir lo mejor para min y lo peor, por consecuencia, para max
function MinValor(estado, a, b)

	if es_suspension(estado) do
		return e(estado)
		
	sucesores = expandir(min, estado)
	
	for sucesor in sucesores do
		b = min(b, MaxValor(sucesor, a, b))
		
		if b <= a do devolver (b)

	return a
	fin {MinValor}



```


## Análisis de complejidad

*Nota: el algoritmo minimax con poda siempre produce el mismo resultado que sin la poda*

Minimax poda $\alpha - \beta$ : $O(b^{d/2})$  en el mejor caso
Minimax poda $\alpha - \beta$ : $O(b^{3d/4})$  en el caso medio