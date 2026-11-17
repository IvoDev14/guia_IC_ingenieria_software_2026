``` TypeScript

abstract class SearchProblem{

	constructor(initialState) {
		this.initialState = initialState;
	}
	
	/*
		Lógica para generar los estados a los que se puede llegar desde un 
		estado dado (la función expandir)
	*/
	abstract getSuccesors(state);
		
	/*
		Comprobación de si el estado dado es meta (la función meta)
	*/
	abstract isGoal(state);
	
	/*
		Función de coste del operador c(s1, a, s2) siendo a, la acción
		realizada. Por defecto sería 1 (la función coste)
	*/
	abstract getCoast(state, action, nextState);

}

```

