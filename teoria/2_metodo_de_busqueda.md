# Método de Búsqueda

> Estado: *1.0*
> Última modificación: *26/10/2026*

En esta asignatura se tratan distintos tipos de algoritmos de búsqueda. Practicamente todos los algoritmos de búsqueda comparten una estructura, esta estructura es la del 
**Método General de Búsqueda**.

En este documento se explicará este método y se explicará en base a que se clasifican los algoritmos de búsqueda.

## Método general de búsqueda

Son tres pasos muy simples:

1. seleccionar nodo hoja
2. comoprobar si es nodo meta
3. expandir este nodo hoja

### psudocódigo explicado

```
nodo // el árbol está formado de nodos, nodo es un registro
abierta // abierta es una lista de nodos

funcion vacía?(lista) // la función vacía determina si una lista es vacía
funcion primero(lista) // devuelve el primer elemento de una lista
funcion ordInsertar(nodo, lista, orden) // añade el nodo *nodo* a la lista *lista* según un función *orden*
funcion meta?(nodo) // comprueba si el nodo es el objetivo
funcion expandir(nodo) // devuelve los nodos a los que se puede llegar desde el nodo que se pasa a la función

s_0 // nodo inicial

abierta.añadir(s_0) // abierta = {s_0}

Repetir 
	Si vacia?(abierta) entonces
		devolver negativo // sale de la función sin haber encontrado el nodo objetivo

	nodo = primero(abierta) // la variable nodo almacena el primer elemento de la lista (por la definición de la función primero, este nodo se quita de la lista)

	Si meta?(nodo) entonces
		devolver nodo // se sale del programa devolviendo el nodo que se alcanza como objetivo

	sucesores = expandir(nodo) // se almacena en la lista sucesores los nodos hijo del nodo que estamos analizando

	Para cada sucesor en sucesores hacer
		sucesor.padre = nodo // este paso es necesario para la reconstrucción del camino, al devolver el nodo al encontrar la meta necesitaremos poder sacar el camino, y eso se hace almacenando en cada nodo su padre
		ordInsertar(sucesor, abierta, <orden>) // se inserta el sucesor en la lista *abierta* según el orden que especifiquemos en la función
	Fin
	
```

Esta estructura es muy sencilla, dicho en un nivel más de abstracción sería:

- coger primer nodo de la cola (inicialmente estará el nodo inicial)
- comprobar si es meta
- si no es meta expandir
- por cada nodo hijo añadir a la cola

Y practicamente todos los algoritmos de búesqueda siguen esta estructura general, cambiando principalmente la función orden.

## Clasificación de métodos de búsqueda

Los algoritmos de búsqueda pueden tener las distintas características:

- Completitud: si existe una solución, entonces el algoritmo si o si la encuentra
- Optimalidad: si hay varias soluciones, se encuentra la más óptima
- Complejidad en tiempo: tiempo que se tarda en encontrar la solución
- Complejidad en espacio: memoria utilizada en la búsqueda

También, los algoritmos de búsqueda pueden ser de los siguientes tipos (dados en la asignatura):

- No informados (Tema 2) -> utilizan solo conocimientos mínimos
- Heurísticos (Tema 3-5) -> utilizan también información aproximada y específica del problema para guiar la búsqueda
- Con estados estructurados (Tema 6)

