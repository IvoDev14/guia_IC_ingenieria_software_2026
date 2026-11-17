Un nodo de búsqueda es una "foto" de un momento dado. Es decir, almacena un estado, como se ha llegado hasta él, el nodo que le precedía, el coste acumulado, el valor heurístico y la f.

```TypeScript
type SearchNode{
	estado: state; // estado del mundo 
	padre: node; // nodo padre
	accion: action; // acción por la que se ha llegado a este nodo
	g: int; //Coste acumulado desde la raíz
	h: int; // Valor heurístico, también podria ser un float
	f: int; // Valor que proviene de sumar g+h
}
```



