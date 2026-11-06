# Guía de Ingeniería del Conocimiento 2026

Guía de estudio de **Ingeniería del Conocimiento** (3º de Ingeniería del Software, Universidad Rey Juan Carlos). Tiene dos partes:

- **Apuntes** (`docs/`): teoría de la asignatura en Markdown, escrita para leerse en Obsidian.
- **Visualizador de algoritmos de búsqueda** (`app/`): una aplicación web en la que se elige un algoritmo y un ejemplo y se recorre su ejecución paso a paso. En cada paso se ven a la vez:
  - el **pseudocódigo**, con la línea que se está ejecutando;
  - el **árbol de búsqueda** que se va formando;
  - el **mundo real** del problema, por ejemplo dónde está el agente en un mapa de ciudades.

El visualizador usa la misma notación que los apuntes (`s_0`, `expandir`, `meta?`, `abierta`, `ordInsertar`, `g`, `h*`, `f*`), así que se pueden leer en paralelo.

Ahora mismo incluye **búsqueda en amplitud** con el ejemplo clásico del **mapa de Rumanía (Arad → Bucharest)**. Está pensado para que añadir más algoritmos, ejemplos y problemas sea sencillo; la última sección es un tutorial para hacerlo.

---

## Índice

1. [Estructura del repositorio](#1-estructura-del-repositorio)
2. [Los apuntes (`docs/`)](#2-los-apuntes-docs)
3. [El visualizador (`app/`)](#3-el-visualizador-app)
   - [Puesta en marcha](#puesta-en-marcha)
   - [Cómo se usa](#cómo-se-usa)
   - [Arquitectura: la idea central](#arquitectura-la-idea-central)
   - [Conceptos y tipos clave](#conceptos-y-tipos-clave)
   - [Qué hay en cada carpeta](#qué-hay-en-cada-carpeta)
   - [Reglas que no hay que romper](#reglas-que-no-hay-que-romper)
4. [Tutorial: añadir contenido nuevo](#4-tutorial-añadir-contenido-nuevo)
   - [A. Un ejemplo nuevo para un problema que ya existe](#a-un-ejemplo-nuevo-para-un-problema-que-ya-existe)
   - [B. Un algoritmo que sigue el método general](#b-un-algoritmo-que-sigue-el-método-general)
   - [C. Un algoritmo con estructura propia](#c-un-algoritmo-con-estructura-propia)
   - [D. Un problema nuevo (con su "mundo")](#d-un-problema-nuevo-con-su-mundo)
   - [Lista de comprobación final](#lista-de-comprobación-final)
5. [Convenciones](#5-convenciones)

---

## 1. Estructura del repositorio

```
IC_guia_2026/
├─ docs/                    Apuntes de teoría (Markdown / Obsidian)
│  ├─ teoria/               Temas numerados en orden del temario
│  └─ algoritmos/           Una ficha por algoritmo (NI_ = no informada, I_ = informada)
├─ app/                     Visualizador (Vite + React + TypeScript)
│  ├─ src/
│  │  ├─ core/              Motor de búsqueda y trazas (TypeScript puro, sin React)
│  │  ├─ algoritmos/        Un archivo por algoritmo (+ sus tests)
│  │  ├─ problemas/         Un directorio por tipo de problema (modelo, datos, vista, ejemplos)
│  │  ├─ reproductor/       Estado de la reproducción, controles y atajos de teclado
│  │  ├─ paneles/           Paneles del dashboard y vistas de la barra lateral
│  │  ├─ ui/                Piezas visuales compartidas (colores, panel, barra lateral, iconos)
│  │  ├─ registro.ts        ← Aquí se dan de alta algoritmos y ejemplos
│  │  ├─ ejemplos.ts        Tipo Ejemplo y MundoProps
│  │  ├─ ruta.ts            Rutas #/algoritmo/ejemplo
│  │  └─ App.tsx            Disposición del dashboard
│  └─ package.json
├─ CLAUDE.md                Instrucciones para agentes de IA que trabajen en el repo
└─ README.md
```

---

## 2. Los apuntes (`docs/`)

- `docs/teoria/` contiene los conceptos, numerados según el temario: `1_espacio_de_estados.md`, `2_metodo_de_busqueda.md`, `3_heuristica.md`, `4_heuristica_avanzada.md`… Un tema nuevo lleva el siguiente número.
- `docs/algoritmos/` contiene una ficha por algoritmo. El prefijo indica el tipo: `NI_` para búsqueda **no informada** e `I_` para búsqueda **informada** (heurística).

Cada documento empieza con una cabecera de versión:

```markdown
# Título

> Versión: *1.0*
> Última modificación: *5/11/26*
```

Las fichas de algoritmos siguen siempre la misma plantilla:

- `## Características`: completo, óptimo, informada o no.
- `## Pseudocódigo explicado`: un bloque de código con pseudocódigo en español.
- `## Análisis de complejidad`: si aplica.

Todos los algoritmos se explican como variaciones del **método general de búsqueda** (`docs/teoria/2_metodo_de_busqueda.md`), indicando solo lo que cambia (normalmente el orden de `ordInsertar`). El visualizador sigue exactamente esa misma idea.

Las fórmulas usan LaTeX de Obsidian: `$...$` en línea y `$$...$$` en bloque.

---

## 3. El visualizador (`app/`)

### Puesta en marcha

Requisitos: Node.js 20 o superior. Todos los comandos se ejecutan dentro de `app/`:

```bash
cd app
npm install

npm run dev          # servidor de desarrollo (http://localhost:5173)
npm test             # tests (Vitest)
npx vitest run src/algoritmos/amplitud.test.ts   # un solo archivo de tests
npm run lint         # linter (oxlint)
npm run build        # comprobación de tipos + build de producción en app/dist
```

La app está hecha para escritorio. No hay versión móvil.

### Cómo se usa

La pantalla es un **dashboard fijo**: todo se ve a la vez y la página nunca se desplaza. Solo hacen scroll, si lo necesitan, los paneles por dentro.

| Zona | Qué muestra |
|---|---|
| **Cabecera** | Selector de algoritmo y de ejemplo. A la derecha, la navegación: `«` / `»` saltan una iteración, `‹` y **Siguiente** mueven un paso, y **Auto** reproduce sola a la velocidad elegida. |
| **Línea de tiempo** | Barra fina bajo la cabecera. Marca el progreso y el inicio de cada iteración. Se puede pulsar o arrastrar para saltar a cualquier paso. |
| **Pseudocódigo** (arriba izquierda) | Qué acaba de pasar en este paso y la línea del pseudocódigo que le corresponde, resaltada. |
| **Mundo** (abajo izquierda) | El problema "real": en el mapa se ven el camino del nodo en foco, las ciudades en `abierta` (con `×N` si hay varios nodos de la misma ciudad) y las expandidas. Abajo está la tira de **abierta**, que se despliega para ver todos sus nodos. |
| **Árbol de búsqueda** (derecha) | El árbol en el paso actual, con colores según el papel de cada nodo y un número con el orden de expansión. Se puede hacer zoom con la rueda y moverlo arrastrando. Al hacer clic en un nodo, el mundo muestra su camino. La cámara sigue al nodo actual hasta que la mueves tú; "Seguir nodo" la reengancha. |
| **Barra lateral** (izquierda) | **Historial** de todos los pasos (con clic para saltar a uno) y **Sobre el algoritmo** (descripción, leyenda y atajos). Se pliega con los iconos de la izquierda o con `Ctrl/⌘ + B`, y su ancho se cambia arrastrando el borde. |

Atajos de teclado: `←` / `→` paso, `Mayús + ←` / `Mayús + →` iteración, `Inicio` / `Fin`, `Espacio` reproducción automática.

Cada ejemplo tiene su URL (`#/amplitud/rumania-arad-bucharest`), así que se puede compartir un enlace directo.

### Arquitectura: la idea central

> **Los algoritmos no pintan nada. Emiten una lista de eventos (la traza) y los paneles solo la reproducen.**

```
 Problema ─┐
           ├─► algoritmo.ejecutar() ─► eventos ─► core/traza.ts ─► Traza { eventos, fotos, descripciones }
 Algoritmo ┘                                                          │
                                                                      ▼
                                              reproductor (paso actual i) ─► fotos[i]
                                                                      │
                               ┌──────────────────────┬───────────────┼─────────────────┐
                               ▼                      ▼               ▼                 ▼
                         Pseudocódigo           Árbol de búsqueda   Mundo          Historial
```

1. Un **algoritmo** se ejecuta sobre un **problema** y va emitiendo **eventos**: `inicio`, `seleccionar`, `testMeta`, `expandir`, `insertar`, `solucion`, `fallo`, `limite`.
2. `core/traza.ts` ejecuta el algoritmo **entero de una vez**. Tras cada evento guarda una **foto** inmutable del estado de la búsqueda y una **descripción** en texto.
3. El **reproductor** solo guarda el número de paso actual. Ir hacia atrás o adelante es elegir otra foto, así que no hay que volver a ejecutar nada.
4. Cada **panel** lee la foto del paso actual y la dibuja.

Consecuencias prácticas:

- Un algoritmo nuevo **no necesita tocar la interfaz**: si emite los eventos correctos, los tres paneles funcionan solos.
- Un problema nuevo solo tiene que aportar su modelo y su componente de "mundo". El árbol, el pseudocódigo, el historial y `abierta` ya son genéricos.
- La lógica de búsqueda se prueba sin interfaz, con tests de TypeScript puro.

### Conceptos y tipos clave

Todos están en `app/src/core/tipos.ts` y `app/src/ejemplos.ts`.

| Tipo | Qué es |
|---|---|
| `Problema<S>` | El **espacio de estados**: `s0`, `expandir(s)` (devuelve `{ estado, accion, coste }`), `meta(s)`, `clave(s)` (identifica el estado), `etiqueta(s)` (texto corto para la interfaz) y, opcionalmente, `heuristicas` (funciones `h*`). `S` es el tipo del estado: un `string` en el grafo o, por ejemplo, un tablero en el 8-puzzle. |
| `Nodo<S>` | Nodo del árbol de búsqueda: un **camino concreto** hasta un estado. Tiene `id`, `estado`, `padre`, `accion`, `g` (coste acumulado) y `profundidad`. Dos nodos distintos pueden tener el mismo estado. |
| `Evento<S>` | Lo que ocurre en un paso. Cada uno corresponde a una o varias líneas del pseudocódigo (`lineasDeEvento` en `core/traza.ts`). |
| `Foto<S>` | Estado completo tras un evento: `nodos` (todos los generados, **indexados por id**), `abierta` (ids en orden), `actual`, `ordenExpansion` y `resultado`. |
| `Traza<S>` | `{ eventos, fotos, descripciones }`: una entrada por paso. |
| `Algoritmo` | `id`, `nombre`, `tipo` (`'no-informada'` o `'informada'`), `resumen`, `caracteristicas`, `criterioOrden` (texto del tercer argumento de `ordInsertar`), `pseudocodigo` y `ejecutar(problema)`, que devuelve un iterable de eventos. |
| `Ejemplo<S>` | Lo que aparece en el selector: `id`, `titulo`, `descripcion`, `algoritmoId`, el `problema` ya construido y el componente `Mundo`. Un ejemplo pertenece a **un** algoritmo; para ver el mismo problema con otro algoritmo se crea otro ejemplo, reutilizando el problema. |
| `MundoProps<S>` | Lo que recibe la vista del mundo: `problema`, `foto` y `foco` (el nodo seleccionado en el árbol o, si no hay, el actual). |

### Qué hay en cada carpeta

#### `src/core/`: motor de búsqueda (sin React)

- **`tipos.ts`**: todos los tipos anteriores.
- **`metodoGeneral.ts`**:
  - `metodoGeneral(problema, ordInsertar, opciones)`: el método general de búsqueda de los apuntes, como generador que emite eventos. `ordInsertar(abierta, nuevo)` devuelve **la posición** de `abierta` en la que se inserta el nodo nuevo; es lo único que cambia entre amplitud, profundidad, coste uniforme, A*…
  - `pseudocodigoMetodoGeneral(criterio)`: genera el pseudocódigo de los apuntes con ese criterio en `ordInsertar`. Cada línea lleva un `id` para poder resaltarla.
  - `maxNodos` (500 por defecto) corta la búsqueda con un evento `limite`. Hace falta porque, sin control de estados repetidos, el árbol puede ser infinito.
- **`traza.ts`**:
  - `ejecutar(algoritmo, problema)`: ejecuta el algoritmo y devuelve la `Traza`.
  - `aplicar(foto, evento)`: reductor puro que calcula la foto siguiente.
  - `camino(foto, nodoId)`: camino desde la raíz hasta un nodo.
  - `lineasDeEvento(evento)`: líneas del pseudocódigo que se resaltan en cada evento.
  - `describir`: el texto de cada paso que se ve en el panel y en el historial.

#### `src/algoritmos/`

Un archivo por algoritmo, con su test al lado (`amplitud.ts`, `amplitud.test.ts`). Los algoritmos del método general ocupan unas pocas líneas: metadatos y una función `ordInsertar`.

#### `src/problemas/<problema>/`

Todo lo propio de un tipo de problema. Por ejemplo, `problemas/grafo/`:

- `modelo.ts`: `crearProblemaGrafo(mapa, inicio, destino)` construye un `Problema<string>`. Los sucesores se generan en orden alfabético, como en los ejercicios de clase.
- `mapas/rumania.ts`: datos del mapa: ciudades con coordenadas, carreteras con distancias y distancias en línea recta, ya preparadas para usarlas como heurística en A*.
- `MundoGrafo.tsx`: el mapa en SVG que muestra el estado de la búsqueda.
- `ejemplos.tsx`: los ejemplos de este problema.

#### `src/registro.ts`

Es el **único sitio donde se dan de alta algoritmos y ejemplos**. El selector de la cabecera y las rutas se construyen a partir de aquí.

#### `src/reproductor/`

- `store.ts` (Zustand) guarda:
  - el ejemplo cargado y su traza;
  - el `paso` actual y el inicio de cada iteración;
  - si está en reproducción automática;
  - el nodo seleccionado en el árbol.

  Cualquier acción manual (`siguiente`, `anterior`, `irA`, saltos de iteración) **pausa** la reproducción automática. Una iteración es una vuelta del bucle `repetir` y empieza en cada evento `seleccionar`.
- `hooks.ts`: atajos de teclado y temporizador de la reproducción automática.
- `Controles.tsx`: `BarraPasos` (la navegación de la cabecera) y `LineaTiempo`.

#### `src/paneles/`

- `PanelPasos.tsx`: `Pseudocodigo` (con la descripción del paso) y `AbiertaDesplegable`.
- `ArbolBusqueda.tsx`: árbol con `d3-hierarchy` (solo para calcular las posiciones) y SVG propio dentro de `react-zoom-pan-pinch`, que se encarga del zoom y del arrastre.
- `PanelMundo.tsx`: pinta el `Mundo` del ejemplo y la tira de `abierta`.
- `Historial.tsx` e `Info.tsx`: vistas de la barra lateral.

#### `src/ui/`

- `estados.ts`: papel de cada nodo (actual, en abierta, generado, expandido, solución), sus colores y el estilo de cada tipo de evento. Lo comparten el árbol, el mundo, la leyenda y el historial.
- `Panel.tsx`: el contenedor común de los paneles, la leyenda y el estilo de las teclas.
- `Lateral.tsx`: la barra de actividad y la barra lateral.
- `disposicion.ts`: qué vista lateral está abierta y su ancho, guardado en `localStorage`.
- `iconos.tsx`: iconos.

### Reglas que no hay que romper

- **Los ids de los nodos son consecutivos desde 0, en orden de creación.** `Foto.nodos` es un array indexado por id (`foto.nodos[id]`). `metodoGeneral` ya lo garantiza; si escribes tu propio generador, también tienes que garantizarlo.
- **Los sucesores se emiten en el evento `expandir`** (ahí entran en el árbol) y luego **un evento `insertar` por cada uno** (ahí entran en `abierta`).
- **`seleccionar` saca el nodo de `abierta`**, igual que `primero(abierta)` en los apuntes.
- **La interfaz no recalcula la búsqueda.** Si algo debe verse en pantalla, tiene que estar en los eventos o en la foto.
- **El dashboard ocupa exactamente la ventana.** La página no se desplaza; solo los paneles por dentro. Hay que comprobarlo a 1280×720, con la barra lateral abierta y cerrada.
- **Nunca usar `scrollIntoView`**, porque también desplaza la página. Hay que ajustar el `scrollTop` del contenedor, como hace `Historial.tsx`.

---

## 4. Tutorial: añadir contenido nuevo

Esta sección sirve igual a una persona que a un agente de IA. Sigue los pasos en orden y termina con la [lista de comprobación](#lista-de-comprobación-final).

Antes de empezar, revisa la ficha del algoritmo en `docs/algoritmos/` (o escríbela). El pseudocódigo de la app tiene que coincidir con el de los apuntes.

### A. Un ejemplo nuevo para un problema que ya existe

Ejemplo: amplitud en Rumanía, pero de **Timisoara a Bucharest**.

**1.** Añade el ejemplo en `app/src/problemas/grafo/ejemplos.tsx`:

```tsx
definirEjemplo({
  id: 'rumania-timisoara-bucharest',          // único: forma parte de la URL
  titulo: 'Rumanía: de Timisoara a Bucharest',
  descripcion: 'Explica aquí qué tiene de interesante este ejemplo.',
  algoritmoId: 'amplitud',                    // id de un algoritmo registrado
  problema: crearProblemaGrafo(rumania, 'timisoara', 'bucharest'),
  Mundo: (props) => <MundoGrafo {...props} mapa={rumania} inicio="timisoara" destino="bucharest" />,
}),
```

**2.** Como `ejemplosGrafo` ya está en `registro.ts`, no hace falta registrar nada más.

**3.** Si es un mapa nuevo, crea `problemas/grafo/mapas/<nombre>.ts` con el tipo `Mapa`:
- `ciudades` con `id`, `nombre`, `x` e `y` (la `y` crece hacia arriba);
- `carreteras` como `[ciudad, ciudad, distancia]`;
- opcionalmente, `distanciaRecta[destino][ciudad]` para las heurísticas.

**4.** Añade un test que compruebe el orden de expansión que se haría a mano en clase (ver [la plantilla de test](#plantilla-de-test)).

### B. Un algoritmo que sigue el método general

Es el caso más habitual: amplitud, profundidad, coste uniforme, A*… Solo cambia **dónde se inserta cada sucesor en `abierta`**.

Ejemplo completo: **búsqueda de coste uniforme** (ordenar `abierta` por `g`).

**1.** Crea `app/src/algoritmos/costeUniforme.ts`:

```ts
import { metodoGeneral, pseudocodigoMetodoGeneral } from '../core/metodoGeneral'
import type { Algoritmo } from '../core/tipos'

// docs/algoritmos/NI_busqueda_de_coste_uniforme.md
export const costeUniforme: Algoritmo = {
  id: 'coste-uniforme',                     // va en la URL: minúsculas y guiones
  nombre: 'Búsqueda de coste uniforme',
  tipo: 'no-informada',
  resumen: 'Expande siempre el nodo de menor coste acumulado g: abierta se mantiene ordenada por g.',
  caracteristicas: ['Completa', 'Óptima', 'Tiempo y espacio O(b^(1+C*/ε))'],
  criterioOrden: 'g',                       // aparece en ordInsertar(sucesor, abierta, g)
  pseudocodigo: pseudocodigoMetodoGeneral('g'),
  ejecutar(problema, opciones) {
    // Inserta antes del primer nodo con g mayor: con empates, el más antiguo va primero.
    return metodoGeneral(
      problema,
      (abierta, nuevo) => {
        const i = abierta.findIndex((n) => n.g > nuevo.g)
        return i === -1 ? abierta.length : i
      },
      opciones,
    )
  },
}
```

**2.** Regístralo en `app/src/registro.ts`:

```ts
import { costeUniforme } from './algoritmos/costeUniforme'

export const algoritmos: Algoritmo[] = [amplitud, costeUniforme]
```

**3.** Dale **al menos un ejemplo** (apartado A) con `algoritmoId: 'coste-uniforme'`. Sin ejemplos, la app solo muestra "Este algoritmo todavía no tiene ejemplos".

**4.** Escribe su test, `costeUniforme.test.ts`.

**Algoritmos informados (A\*, búsqueda voraz…)**: la heurística viene del problema (`problema.heuristicas`). Por ejemplo, para A*:

```ts
ejecutar(problema, opciones) {
  const h = Object.values(problema.heuristicas ?? {})[0] ?? (() => 0)
  const f = (n: Nodo<typeof problema.s0>) => n.g + h(n.estado)
  return metodoGeneral(
    problema,
    (abierta, nuevo) => {
      const i = abierta.findIndex((n) => f(n) > f(nuevo))
      return i === -1 ? abierta.length : i
    },
    opciones,
  )
},
```

Usa `tipo: 'informada'` y `criterioOrden: 'f*'`.

> Limitación actual: el árbol y la tira de `abierta` todavía no muestran `h*` ni `f*` de cada nodo, aunque `g` sí sale en el tooltip del árbol. Si un algoritmo lo necesita, hay que extender `Nodo`/`Foto` y los paneles (ver apartado C).

### C. Un algoritmo con estructura propia

Algunos algoritmos no son el método general con otro orden: profundización iterativa, IDA*, búsqueda con aprendizaje de h*, búsqueda con control de estados repetidos (lista cerrada)… En ese caso, `ejecutar` es **tu propio generador**, que emite los mismos eventos.

Esqueleto:

```ts
import type { Algoritmo, Evento, Nodo, Problema } from '../core/tipos'

function* miAlgoritmo<S>(problema: Problema<S>): Generator<Evento<S>> {
  let siguienteId = 0                       // ids consecutivos desde 0: obligatorio
  const crear = (estado: S, padre: Nodo<S> | null, accion: string | null, coste: number): Nodo<S> => ({
    id: siguienteId++, estado, padre: padre?.id ?? null, accion,
    g: (padre?.g ?? 0) + coste, profundidad: padre ? padre.profundidad + 1 : 0,
  })

  const raiz = crear(problema.s0, null, null, 0)
  yield { tipo: 'inicio', nodo: raiz }      // raíz en el árbol y en abierta
  // ...
  yield { tipo: 'seleccionar', nodoId }     // saca el nodo de abierta y pasa a ser el actual
  yield { tipo: 'testMeta', nodoId, esMeta }
  yield { tipo: 'expandir', nodoId, sucesores }   // los sucesores (ya creados) entran en el árbol
  yield { tipo: 'insertar', nodoId: s.id, posicion }  // uno por sucesor: entra en abierta en esa posición
  yield { tipo: 'solucion', nodoId }        // o { tipo: 'fallo' } / { tipo: 'limite', maxNodos }
}
```

Si el algoritmo necesita algo que estos eventos no pueden expresar (por ejemplo, la lista cerrada o vaciar el árbol entre iteraciones de profundización iterativa), sigue estos pasos:

1. Añade el nuevo tipo de evento en `Evento<S>` (`core/tipos.ts`).
2. Trátalo en `aplicar` y en `describir` (`core/traza.ts`), añadiendo a `Foto` los campos que necesite.
3. Asígnale sus líneas en `lineasDeEvento`. Si son líneas nuevas, añade su id a `IdLinea` y escribe el pseudocódigo del algoritmo a mano en lugar de usar `pseudocodigoMetodoGeneral`.
4. Dale una etiqueta y un color en `EVENTOS` (`ui/estados.ts`).
5. Muéstralo en el panel que corresponda.

TypeScript avisa de los `switch` que no tratan el evento nuevo.

### D. Un problema nuevo (con su "mundo")

Ejemplo: el **8-puzzle**. El estado es el tablero; aquí se representa como un string de 9 caracteres, con `0` para el hueco.

**1.** Crea `app/src/problemas/8-puzzle/modelo.ts` con una función que devuelva un `Problema<S>`:

```ts
import type { Problema } from '../../core/tipos'

export type Tablero = string   // "123456780"

export function crearProblema8Puzzle(inicial: Tablero, objetivo: Tablero): Problema<Tablero> {
  return {
    s0: inicial,
    expandir: (t) => {
      // Mover el hueco arriba / abajo / izquierda / derecha, con coste 1 cada movimiento.
      // Devuelve { estado, accion: 'arriba' | ..., coste: 1 }[] en un orden fijo y documentado.
      return []
    },
    meta: (t) => t === objetivo,
    clave: (t) => t,
    etiqueta: (t) => t,    // corta: el árbol recorta las etiquetas a 12 caracteres
    heuristicas: {
      'fichas descolocadas': (t) => [...t].filter((c, i) => c !== '0' && c !== objetivo[i]).length,
    },
  }
}
```

Puntos importantes del modelo:

- **Orden de los sucesores**: tiene que ser fijo y estar documentado en la descripción del ejemplo, porque decide el orden de expansión que se compara con los ejercicios de clase.
- **`clave`** identifica el estado; **`etiqueta`** es lo que se lee en el árbol, en `abierta` y en el historial.
- Las **heurísticas** se declaran aquí, con un nombre descriptivo.

**2.** Crea la vista del mundo, `app/src/problemas/8-puzzle/Mundo8Puzzle.tsx`. Es un componente que recibe `MundoProps<Tablero>` y dibuja el estado del nodo en foco:

```tsx
import type { MundoProps } from '../../ejemplos'

export function Mundo8Puzzle({ foto, foco }: MundoProps<string>) {
  const tablero = foco?.estado ?? foto.nodos[0].estado
  // Dibuja el tablero (SVG o grid de divs). Puede usar camino(foto, foco.id)
  // para mostrar la secuencia de movimientos hasta ese nodo.
  return <svg viewBox="0 0 300 300" className="h-full w-full">{/* ... */}</svg>
}
```

Reglas de la vista:

- Tiene que ocupar el contenedor (`h-full w-full`); el panel ya le deja hueco abajo para la tira de `abierta`.
- Usa los colores de `ui/estados.ts` (`COLORES.actual`, `COLORES.abierta`…) para que todo el dashboard hable el mismo idioma visual.
- No guardes estado propio de la búsqueda: todo sale de `foto` y `foco`.

**3.** Crea `app/src/problemas/8-puzzle/ejemplos.tsx`:

```tsx
import { definirEjemplo } from '../../ejemplos'
import { crearProblema8Puzzle } from './modelo'
import { Mundo8Puzzle } from './Mundo8Puzzle'

export const ejemplos8Puzzle = [
  definirEjemplo({
    id: '8-puzzle-facil',
    titulo: '8-puzzle: a dos movimientos',
    descripcion: 'Orden de los sucesores: arriba, abajo, izquierda, derecha.',
    algoritmoId: 'amplitud',
    problema: crearProblema8Puzzle('123405786', '123456780'),
    Mundo: Mundo8Puzzle,
  }),
]
```

**4.** Regístralos en `app/src/registro.ts`:

```ts
import { ejemplos8Puzzle } from './problemas/8-puzzle/ejemplos'

export const ejemplos: Ejemplo<unknown>[] = [...ejemplosGrafo, ...ejemplos8Puzzle]
```

**5.** Añade tests del modelo (que `expandir` genere los movimientos correctos) y del ejemplo.

### Plantilla de test

```ts
import { describe, expect, it } from 'vitest'
import { camino, ejecutar } from '../core/traza'
import { crearProblemaGrafo } from '../problemas/grafo/modelo'
import { rumania } from '../problemas/grafo/mapas/rumania'
import { costeUniforme } from './costeUniforme'

describe('búsqueda de coste uniforme', () => {
  it('Rumanía, de Arad a Bucharest: encuentra el camino de menor coste', () => {
    const problema = crearProblemaGrafo(rumania, 'arad', 'bucharest')
    const { fotos } = ejecutar(costeUniforme, problema)
    const ultima = fotos[fotos.length - 1]

    expect(ultima.resultado?.tipo).toBe('solucion')
    if (ultima.resultado?.tipo !== 'solucion') return
    const ruta = camino(ultima, ultima.resultado.nodoId)
    expect(ruta.map((n) => problema.etiqueta(n.estado))).toEqual(['Arad', 'Sibiu', 'Rimnicu Vilcea', 'Pitesti', 'Bucharest'])
    expect(ruta.at(-1)!.g).toBe(418)

    // Lo más valioso: el orden de expansión, comparado con el que se haría a mano.
    const expandidos = ultima.ordenExpansion.map((id) => problema.etiqueta(ultima.nodos[id].estado))
    expect(expandidos.slice(0, 4)).toEqual(['Arad', 'Zerind', 'Timisoara', 'Sibiu'])
  })
})
```

### Lista de comprobación final

Dentro de `app/`:

- [ ] `npm test` pasa, con al menos un test nuevo que compruebe el **orden de expansión** y el **resultado**.
- [ ] `npm run lint` no da avisos.
- [ ] `npm run build` compila (incluye la comprobación de tipos).
- [ ] En `npm run dev`, el algoritmo o ejemplo aparece en el selector y se recorre hasta el final sin errores en consola.
- [ ] A 1280×720, con la barra lateral abierta y cerrada, todo se ve sin desplazar la página.
- [ ] El pseudocódigo coincide con la ficha de `docs/algoritmos/` y las líneas se resaltan en el paso correcto.
- [ ] Los `id` de algoritmos y ejemplos son únicos y en minúsculas con guiones (forman la URL).
- [ ] Si has cambiado la arquitectura (eventos nuevos, campos nuevos en `Foto`…), actualiza este README y `CLAUDE.md`.

---

## 5. Convenciones

- **Idioma**: todo en español: apuntes, código (nombres de variables y funciones), comentarios e interfaz.
- **Notación**: la de los apuntes, también en el código y en la interfaz (`s_0`, `expandir`, `meta?`, `abierta`, `ordInsertar`, `g`, `h*`, `f*`).
- **Fidelidad a la asignatura**: los algoritmos se implementan como en los apuntes. Por ejemplo, el método general **no controla estados repetidos**; un algoritmo que sí lo haga debe ser explícito y mostrarlo.
- **Commits**: mensajes cortos, en español y en minúscula (`add búsqueda de coste uniforme con tests`, `refactor: ...`), y atómicos (un cambio lógico por commit).
