import { stratify, tree } from 'd3-hierarchy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch'
import { camino } from '../core/traza'
import type { Nodo } from '../core/tipos'
import { useFoco, useFoto, useReproductor } from '../reproductor/store'
import { clasificarNodos, COLORES } from '../ui/estados'
import { IconoCentrar } from '../ui/iconos'
import { Leyenda, Panel } from '../ui/Panel'

const ANCHO = 92
const ALTO = 30
const SEP_X = 14
const SEP_Y = 72
const MARGEN = 28
// El árbol se encoge para caber en el panel solo hasta ESCALA_MIN; a partir de ahí
// mantiene un tamaño legible y la cámara sigue al nodo en foco.
const ESCALA_MIN = 0.8
const ESCALA_MAX = 1.1

interface Limites { minX: number; minY: number; ancho: number; alto: number }

/** Árbol de búsqueda en el paso actual. Zoom con la rueda, arrastrar para moverse, clic para ver el camino de un nodo. */
export function ArbolBusqueda() {
  const ejemplo = useReproductor((s) => s.ejemplo)
  const seleccionar = useReproductor((s) => s.seleccionar)
  const seleccionado = useReproductor((s) => s.seleccionado)
  const foto = useFoto()
  const foco = useFoco()
  const camara = useRef<ReactZoomPanPinchContentRef>(null)
  const [contenedor, tamaño] = useTamaño()
  const [siguiendo, setSiguiendo] = useState(true)
  const primerEncuadre = useRef(true)

  const layout = useMemo(() => {
    if (!foto) return null
    const raiz = stratify<Nodo<unknown>>()
      .id((n) => String(n.id))
      .parentId((n) => (n.padre === null ? null : String(n.padre)))(foto.nodos)
    const puntos = tree<Nodo<unknown>>().nodeSize([ANCHO + SEP_X, SEP_Y])(raiz)
    const nodos = puntos.descendants()
    const xs = nodos.map((n) => n.x)
    const minX = Math.min(...xs) - ANCHO / 2 - MARGEN
    const limites: Limites = {
      minX,
      minY: -ALTO / 2 - MARGEN,
      ancho: Math.max(...xs) + ANCHO / 2 + MARGEN - minX,
      alto: Math.max(...nodos.map((n) => n.y)) + ALTO + 2 * MARGEN,
    }
    const posicion = new Map(nodos.map((n) => [n.data.id, { x: n.x, y: n.y }]))
    return { nodos, enlaces: puntos.links(), limites, posicion }
  }, [foto])

  const objetivo = foco && layout ? layout.posicion.get(foco.id) : undefined

  // Mueve la cámara al nodo en foco (o encuadra el árbol entero si cabe).
  useEffect(() => {
    if (!siguiendo || !camara.current || !layout || tamaño.ancho === 0) return
    const { x, y, escala } = encuadre(layout.limites, tamaño, objetivo)
    const duracion = primerEncuadre.current ? 0 : 280
    primerEncuadre.current = false
    // Cuando el SVG cambia de tamaño, el ResizeObserver de la librería cancela cualquier animación
    // en curso en ese mismo frame; por eso se espera un frame más antes de mover la cámara.
    const frames: number[] = []
    frames.push(
      requestAnimationFrame(() => {
        frames.push(requestAnimationFrame(() => camara.current?.setTransform(x, y, escala, duracion, 'easeOut')))
      }),
    )
    return () => frames.forEach(cancelAnimationFrame)
  }, [siguiendo, layout, tamaño, objetivo?.x, objetivo?.y]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!foto || !ejemplo || !layout) return null
  const estados = clasificarNodos(foto)
  const caminoFoco = new Set(foco ? camino(foto, foco.id).map((n) => n.id) : [])
  const ordenExpansion = new Map(foto.ordenExpansion.map((id, i) => [id, i + 1]))
  const esSolucion = foto.resultado?.tipo === 'solucion' && foco?.id === foto.resultado.nodoId
  const colorCamino = esSolucion ? COLORES.solucion.borde : COLORES.actual.borde
  const dejarDeSeguir = () => setSiguiendo(false)
  const { minX, minY, ancho, alto } = layout.limites

  return (
    <Panel
      titulo="Árbol de búsqueda"
      className="h-full"
      extra={
        <div className="flex min-w-0 items-center gap-3">
          {!siguiendo && (
            <button
              onClick={() => setSiguiendo(true)}
              className="flex shrink-0 items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-slate-700"
            >
              <IconoCentrar /> Seguir nodo
            </button>
          )}
        </div>
      }
    >
      <div ref={contenedor} className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        <TransformWrapper
          ref={camara}
          minScale={0.2}
          maxScale={2.5}
          limitToBounds={false}
          doubleClick={{ disabled: true }}
          onPanning={dejarDeSeguir}
          onWheel={dejarDeSeguir}
          onPinch={dejarDeSeguir}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <svg width={ancho} height={alto} viewBox={`${minX} ${minY} ${ancho} ${alto}`} className="select-none">
              {layout.enlaces.map(({ source, target }) => {
                const activo = caminoFoco.has(target.data.id)
                const medioY = (source.y + target.y) / 2
                return (
                  <path
                    key={target.data.id}
                    d={`M${source.x},${source.y + ALTO / 2} C${source.x},${medioY} ${target.x},${medioY} ${target.x},${target.y - ALTO / 2}`}
                    fill="none"
                    stroke={activo ? colorCamino : '#cbd5e1'}
                    strokeWidth={activo ? 2.5 : 1.25}
                  />
                )
              })}
              {layout.nodos.map(({ x, y, data: nodo }) => {
                const estado = estados[nodo.id]
                const color = COLORES[estado]
                const orden = ordenExpansion.get(nodo.id)
                return (
                  <g key={nodo.id} transform={`translate(${x},${y})`} onClick={() => seleccionar(nodo.id)} className="cursor-pointer">
                    <title>{`nodo ${nodo.id} · profundidad ${nodo.profundidad} · g = ${nodo.g}${nodo.accion ? ` · ${nodo.accion}` : ''}`}</title>
                    {nodo.id === seleccionado && (
                      <rect x={-ANCHO / 2 - 4} y={-ALTO / 2 - 4} width={ANCHO + 8} height={ALTO + 8} rx={10} fill="none" stroke="#0f172a" strokeWidth={1.5} />
                    )}
                    <rect
                      x={-ANCHO / 2} y={-ALTO / 2} width={ANCHO} height={ALTO} rx={7}
                      fill={color.relleno}
                      stroke={color.borde}
                      strokeWidth={estado === 'actual' || estado === 'solucion' ? 2 : 1.25}
                      strokeDasharray={estado === 'generado' ? '4 3' : undefined}
                    />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={12.5} fontWeight={500} fill={color.texto}>
                      {recortar(ejemplo.problema.etiqueta(nodo.estado))}
                    </text>
                    {orden !== undefined && (
                      <g transform={`translate(${ANCHO / 2},${-ALTO / 2})`}>
                        <circle r={8.5} fill="#fff" stroke="#cbd5e1" />
                        <text textAnchor="middle" dominantBaseline="central" fontSize={9.5} fontWeight={600} fill="#475569">{orden}</text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </TransformComponent>
        </TransformWrapper>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-lg bg-white/90 px-2.5 py-1.5 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <Leyenda colores={Object.values(COLORES)} />
        </div>
      </div>
    </Panel>
  )
}

/** Posición y escala de la cámara para ver el árbol entero o, si no cabe, centrar el nodo en foco. */
function encuadre(l: Limites, { ancho: W, alto: H }: { ancho: number; alto: number }, foco?: { x: number; y: number }) {
  const escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, Math.min(W / l.ancho, H / l.alto)))
  const w = l.ancho * escala
  const h = l.alto * escala
  const sujetar = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
  const fx = foco ? (foco.x - l.minX) * escala : w / 2
  const fy = foco ? (foco.y - l.minY) * escala : 0
  return {
    escala,
    x: w <= W ? (W - w) / 2 : sujetar(W / 2 - fx, W - w, 0),
    y: h <= H ? 0 : sujetar(H / 2 - fy, H - h, 0),
  }
}

function useTamaño() {
  const [tamaño, setTamaño] = useState({ ancho: 0, alto: 0 })
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const observador = new ResizeObserver(([e]) => setTamaño({ ancho: e.contentRect.width, alto: e.contentRect.height }))
    observador.observe(el)
    return () => observador.disconnect()
  }, [])
  return [ref, tamaño] as const
}

const recortar = (texto: string, max = 12) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto)
