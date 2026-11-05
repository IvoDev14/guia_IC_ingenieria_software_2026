# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repositorio

Guía de estudio personal de **Ingeniería del Conocimiento** (3º de Ingeniería del Software, URJC). Tiene dos partes: apuntes de teoría en Markdown (`docs/`) y una SPA para visualizar los algoritmos de búsqueda (`app/`).

Todo el contenido está en **español**: escribe en español los apuntes, los comentarios y los mensajes de commit.

## Estructura de `docs/`

- `docs/teoria/` — conceptos, numerados en el orden del temario: `N_tema.md` (`1_espacio_de_estados`, `2_metodo_de_busqueda`, `3_heuristica`, `4_heuristica_avanzada`…). Un tema nuevo lleva el siguiente número.
- `docs/algoritmos/` — una ficha por algoritmo de búsqueda. El prefijo indica el tipo: `NI_` = búsqueda **no informada**, `I_` = búsqueda **informada** (heurística).

Los apuntes se editan con **Obsidian** (`.obsidian/` está en `.gitignore`), así que el Markdown debe verse bien ahí: LaTeX inline con `$...$` y en bloque con `$$...$$`.

## Convenciones de los documentos

Cada `.md` empieza con:

```markdown
# Título

> Versión: *1.0*
> Última modificación: *5/11/26*
```

Al modificar un documento de forma relevante, actualiza la fecha (formato `d/m/aa`) y, si procede, la versión. Un borrador se sube primero y se marca como `1.0` cuando está revisado.

Las fichas de `algoritmos/` siguen la misma plantilla: `## Características` (completo / óptimo / informada o no), `## Pseudocódigo explicado` (bloque de código con pseudocódigo en español y comentarios `//`) y, si aplica, `## Análisis De Complejidad`. Todos los algoritmos se explican como variaciones del método general de búsqueda (`2_metodo_de_busqueda.md`), resaltando solo lo que cambia (normalmente el criterio de `ordInsertar`).

Notación usada en todo el repositorio (mantenerla coherente, también en futuras herramientas):

- Espacio de estados: `s_0`, `expandir(s)`, `meta?(s)`, `c(s_i, s_j)`.
- Búsqueda: lista `abierta`, `primero(abierta)`, `ordInsertar(n, abierta, criterio)`, `nodo.padre`, `devolver negativo`.
- Costes: `g(n)` coste acumulado; `h(n)` coste real a la meta; `h*(n)` heurística (estimación); `f*(n) = g(n) + h*(n)`.
- Distinción nodo vs. estado: un nodo representa un camino concreto hasta un estado.

El tono es de apuntes personales (primera persona, referencias a "las diapositivas"); respétalo al editar y no reescribas el estilo del autor salvo que se pida.

## App de visualización (`app/`)

Vite + React + TypeScript, Tailwind v4, Zustand, d3-hierarchy (layout del árbol), react-zoom-pan-pinch, Vitest. Todos los comandos se ejecutan dentro de `app/`:

```bash
npm run dev          # servidor de desarrollo
npm run build        # tsc -b + vite build
npm run lint         # oxlint
npm test             # vitest run
npx vitest run src/algoritmos/amplitud.test.ts   # un solo test
```

### Arquitectura

La idea central: **los algoritmos no pintan nada, emiten una traza de eventos** y los paneles solo la reproducen.

- `src/core/` (TS puro, sin React): `tipos.ts` define `Problema<S>` (s_0, expandir, meta?, c), `Nodo<S>`, `Evento<S>` y `Foto<S>`. `metodoGeneral.ts` implementa el método general de búsqueda con un `ordInsertar` como parámetro y genera el pseudocódigo de los apuntes. `traza.ts` ejecuta un algoritmo y precalcula, para cada evento, una foto inmutable (abierta, nodos generados, orden de expansión, resultado) y una descripción en texto. También relaciona cada evento con las líneas del pseudocódigo (`lineasDeEvento`).
- `src/algoritmos/`: cada algoritmo es un objeto `Algoritmo`. Los que son variantes del método general solo aportan su criterio de inserción (amplitud = al final de abierta). Los que no encajen (IDA*, profundización iterativa…) deben escribir su propio generador emitiendo los mismos `Evento`.
- `src/problemas/<problema>/`: modelo (`crearProblema…`), datos (p. ej. `mapas/rumania.ts`), la vista del "mundo real" (`Mundo…tsx`, recibe `MundoProps`: foto + nodo en foco) y sus `ejemplos.tsx`.
- `src/ejemplos.ts`: un `Ejemplo` es problema + id de algoritmo + componente `Mundo`. `definirEjemplo` borra el tipo del estado para poder registrarlo.
- `src/registro.ts`: **único sitio donde se dan de alta algoritmos y ejemplos**. El selector de la interfaz se construye a partir de aquí.
- `src/reproductor/`: store Zustand (ejemplo cargado, traza, paso actual, iteraciones, play/pausa, nodo seleccionado en el árbol), `hooks.ts` (atajos de teclado y reproducción automática) y `Controles.tsx` (tarjeta del paso actual). **La navegación manual es la prioridad**: cualquier acción manual (`irA`, `siguiente`, `anterior`, saltos de iteración) pausa la reproducción automática; solo `avanzar` la mantiene. Una iteración = una vuelta del bucle `repetir` (empieza en cada evento `seleccionar`). Atajos: ← → paso, Mayús + ← → iteración, Inicio/Fin, espacio. `useFoco()` da el nodo seleccionado en el árbol o, si no hay, el actual; el mundo muestra su camino.
- `src/paneles/`: `PanelPasos.tsx` (`Pseudocodigo`, `Abierta`, `Historial`), `ArbolBusqueda` y `PanelMundo`.
- `src/ui/`: `estados.ts` (papel de cada nodo y sus colores, estilos de cada tipo de evento; compartidos por árbol, mundo, leyenda e historial), `Panel.tsx` (contenedor común de los paneles), `iconos.tsx`.
- Rutas con hash: `#/<algoritmo>/<ejemplo>` (`src/ruta.ts`).

Reglas de interfaz:

- En escritorio (`lg`) la app ocupa exactamente la pantalla (`h-dvh`), sin scroll de página; cada panel hace scroll por dentro. Comprobar a 1280×720 que se ve todo.
- Nunca usar `scrollIntoView` (mueve también la página). El historial ajusta solo su propio `scrollTop` y deja de seguir el paso actual si el usuario sube.
- El árbol se dibuja a tamaño natural dentro de `react-zoom-pan-pinch` y la cámara (`setTransform`) sigue al nodo en foco. Si el usuario arrastra o hace zoom, deja de seguirlo hasta que pulsa "Seguir nodo". `setTransform` se lanza dos frames después del cambio, porque el ResizeObserver de la librería cancela las animaciones del frame en que cambia el tamaño del SVG.

Para añadir un algoritmo: crear `src/algoritmos/x.ts`, registrarlo en `registro.ts` y darle al menos un ejemplo. Para añadir un problema: crear `src/problemas/x/` con modelo, `Mundo` y ejemplos. En ambos casos conviene añadir un test que compruebe el orden de expansión esperado (como en clase).

La búsqueda no controla estados repetidos (como en los apuntes), así que una ciudad puede aparecer varias veces en el árbol. `maxNodos` (500 por defecto) corta árboles infinitos con un evento `limite`.

## Commits

Mensajes cortos en español y en minúscula, p. ej. `add 3_heuristica.md`, `add análisis de complejidad en I_A_estrella.md`, `refactor: ...`.
