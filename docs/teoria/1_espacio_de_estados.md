# Definición de espacio de estados

> Versión: *1.0*
> Última modificación: 26/10/26

Entender el espacio de estados y su definición es sencillo pero muy importante. Necesitamos entenderlo para gran parte de la asignatura, a si que este documento servirá de guía o "diccionario"
para verlo en cualquier momento y punto de la asignatura.

## Agentes basados en búsquedas

Los agentes basados en búsquedas son capaces de percibir el estado actual para cumplir su objetivo/meta. Son capaces de realizar acciones que modifiquen el mundo y lo que buscan es 
una secuencia de estas acciones que les permita llegar a su objetivo.

## Entornos simples

Son con los que trabajaremos en la asignatura.

Características de entornos simples:

- discreto:
	- se puede concebir el mundo de estados
	- en cada estado hay un conjunto finito de percepciones y acciones

- accesible: el agente puede acceder a características relevantes del entorno
	- puede determinar el estado actual del mundo
	- puede determinar el estado del mundo que le gustaría alcanzar

- estático y determinista:
	- el mundo cambia solo cuando el agente actúa
	- el resultado de cada acción está totalmente definido, es determinista

## Componentes del espacio de estados

Para definir un espacio de estados se requieren cinco elementos mínimos:

1. Estado inicial (s_0) -> representación de la situación inicial en la que se encuentra el entorno
2. Función expandir(s) -> dado un estado *s*, calcula y devuelve el conjunto finito de estados alcanzables al aplicar las acciones legales permitidas
3. Test o Prueba Meta (meta?(s)) -> determina si un estado satisface las condiciones del objetivo buscado
4. Función de coste del operador (c(s_i, s_j)) -> asigna valor numérico al coste de ejecutar una acción para pasar del estado s_i, al estado s_j
5. Los operadores -> acciones que se pueden realizar

