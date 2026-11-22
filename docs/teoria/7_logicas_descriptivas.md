> Version: *1.0*
> Última modificación: *17/11/26*

Este tema es importante ya sirve para entender como se formaliza el conocimiento mediante lógicas descriptivas, y esto se usa en web semántica (el siguiente tema).

La lógica descriptiva es una familia de lenguajes de representación del conocimiento, utilizados para estructurar y formalizar información sobre un dominio específico.

Me voy a saltar el repaso de la lógica proposicional y de predicados para dejar esta parte limpia, de todas formas se repasa rápido.

## Representación del conocimiento

### Términos

Es importante tener presente lo que significan estos términos para entender todo a partir de aquí:

- **Conceptos**: en las presentaciones se marcan como si fueran las clases en POO. Básicamente son sustantivos generales (curso, profesor, aula...)
- **Roles**: en la presentación son como las relaciones entre clase. También se puede ver como verbos (imparteCurso, asisteACurso...)
- **Individuos**: entidades concretas del mundo, los sustantivos concretos (por ejemplo Aula006, Sergio...)

Con estos conceptos definimos el dominio sobre el que estructuraremos y formalizaremos la información.

### Lógica descriptiva básica: $\mathcal{ALC}$ 

$\mathcal{ALC}$ (Attribute Language with Complements) es un lenguaje dentro de la familia de la Lógica Descriptiva. Es el estándar canónico de referencia dentro de la familia, la lógica descriptiva "mínima"

#### Descripción de Conceptos

En este apartado se define que es un concepto en $\mathcal{ALC}$ 

Siendo $C$ un conjunto de **nombres de conceptos** y $R$ un conjunto de nombres de roles disjunto de $C$:

- Cada nombres de conceptos es concepto de $\mathcal{ALC}$ 
- $\top$, $\bot$  son conceptos en $\mathcal{ALC}$ 
- Si $A$ y $B$ son conceptos $\mathcal{ALC}$ y r un nombre de rol entonces también son conceptos $\mathcal{ALC}$:
	- $\neg A$ (negación)
	- $A \sqcap B$ (conjunción)
	- $A \sqcup B$ (disyunción)
	- $\exists r.A$ (restricción existencial)
	- $\forall r.A$ (restricción de valores)

El orden de precedencia de los operadores es la misma que en la lógica de primer orden.

Un ejemplo de concepto sería:

Dado el concepto $Persona$, el concepto $Curso$ y el nombre de rol $asiste$. Un nuevo concepto creado podría ser $Persona \sqcap asiste.Curso$ 

#### Interpretación $\mathcal I$ 

Una interpretación es, dado un conjunto $C$ con nombres de conceptos y un conjunto $R$ con nombres de roles, definir unos individuos y describir como se relacionan entre si en base a los roles de R y a que concepto/s pertenecen. 

Una interpretación $\mathcal{I} = (\Delta^\mathcal{I}, \cdot^\mathcal{I})$ define sus partes como:

- $\Delta ^\mathcal I$ -> Dominio: conjunto no vacío de todos los objetos existentes en el mundo modelado, son individuos
- $\cdot ^ \mathcal I$ -> Función que asocia:
	- A cada nombre de concepto $A \in C$ un conjunto $A^\mathcal I \subseteq \Delta ^\mathcal I$  
	- A cada nombre de rol una relación binaria  $r^\mathcal I \subseteq \Delta^\mathcal I X \Delta^\mathcal I$  

#### Bases del Conocimiento (BC)

Las bases del Conocimiento describen "normas" de situaciones, ya sean generales o específicas (por ejemplo decir que una empresa no puede ser una persona, o que "Ana" es una persona)

Una base del conocimiento $K$ suele dividirse en dos componentes $K=<\mathcal T, \mathcal A>$ siendo:

- **TBox** (Terminological KB - "Vocabulario"): un conjunto de axiomas que describen la estructura de un dominio (como equivalencias o normas del tipo Empresa no es una Persona o Empresario es una Persona que posee una Empresa).
	
	- **Inclusión de conceptos:** $C \sqsubseteq D$ si $C^\mathcal{I} \subseteq D^\mathcal{I}$  _"Todo_ $C$ _es un_ $D$_"_.
	- **Equivalencia / Definición:** $C \equiv D$ si $C \sqsubseteq D$ y $D \sqsubseteq C$, es decir, $C^\mathcal{I} = D^\mathcal{I}$

- **ABox** (Assertional KB - "Hechos del Mundo"): conjunto de axiomas que describen una situación concreta (es decir, por ejemplo describen a un invidúo $a$ de la forma Persona($a$)):

	- **Aserción de conceptos**: $C(a)$ 
		- $C(a)$ si $a^\mathcal I \in C^\mathcal I$ un individuo $a$ es un concepto $C$ por ejemplo siendo $C$ persona y $a$ Ana -> $C(a)$ Ana es una persona
	- **Aserción de roles**: $r(a,b)$ 
		- $r(a,b)$ si $<a, b> \in r^\mathcal I$ por ejemplo siendo $r$ trabajaPara y $r^\mathcal = \{<Ana, Marcos>, <Sergio, Hector>\}$ entonces $r(Ana, Marcos)$ 

##### Inferencia

El objetivo de la inferencia de las Lógicas de Descripciones es, dada una BC $K = <T,A>$, deducir conocimiento implícito (es decir que queda reflejado en la BC pero que por lo que hay en la BC es así) a partir de lo definido explícitcamente.

Pondré los mecanismos de razonamiento en un fichero aparte.