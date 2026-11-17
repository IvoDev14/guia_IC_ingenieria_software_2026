> Versión: *1.0*
> Última modificación: *8/11/26*

El algoritmo minimax tiene dos funciones mutuamente recursivas. Y la entrada del algoritmo sería llamando a la función MaxValor, ya que esto es visto desde la perspectiva de $max$ y MaxValor es la que se ejecuta en los turnos de $max$, es la que devolverá el máximo de sus sucesores.

``` JavaScript

function MaxValor(estado)
	// Comprobamos si el estado es terminal
	if es_terminal(estado) do
		return U(estado) //Siendo U la función utilidad
	
	sucesores = expandir(max, estado)
	a = -infinito // Crea un valor inicial poniéndose en el peor de los casos
	
	for sucesor in sucesores do
		a = max(a, MinValor(sucesor)) // Como los sucesores serán turno de min, debe devolver el valor máximo entre el subarbol que beneficiaría a min y el valor que de momento es el máximo 
	
	return a
	Fin{MaxValor}
	

//Esto es igual pero está simulando lo que haría min, es decir elegir lo mejor para min y lo peor, por consecuencia, para max
function MinValor(estado)

	if es_terminal(estado) do
		return U(estado)
		
	sucesores = expandir(min, estado)
	b = +infinito
	
	for sucesor in sucesores do
		b = min(b, MaxValor(sucesor))

	return a
	fin {MinValor}

```



