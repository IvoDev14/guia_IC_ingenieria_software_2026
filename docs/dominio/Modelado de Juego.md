Un Juego se modela de la siguiente manera. Tenemos que tener en cuenta que , al igual que un problema de búsqueda, es stateless, no almacena estados. Es como la plantilla de reglas.

```TypeScript

abstract class GameModel<state, action, players>{

	abstract readonly players: readonly players[];
	abstract readonly initialState: state;
	
	abstract getSuccesors(state): {action: action; nextState: state}[]; // Devuelve los estados accsibles desde un estado y teniendo en cuenta el jugador que juega (esto lo almacena state) junto a la acción con la que se llega a ese estado
	
	abstract getUtility(state): number; // Devuelve diferentes números según un estado terminal 
	
	abstract isTerminal(state): boolean; // Devuelve verdadero si el estado es terminal y falso si no lo es
	
}

```

Importante -> no representa una partida ni nada similar. Son solo las reglas del juego.