import { create } from 'zustand'

// Estado de la disposición del dashboard (barra lateral). Se recuerda en el navegador.

export type VistaLateral = 'historial' | 'info'

export const ANCHO_MIN = 220
export const ANCHO_MAX = 520
const CLAVE = 'ic-busqueda:disposicion'

interface Disposicion {
  /** Vista abierta en la barra lateral, o null si está oculta. */
  vista: VistaLateral | null
  /** Última vista abierta, para volver a ella al mostrar la barra con Ctrl/⌘+B. */
  ultimaVista: VistaLateral
  ancho: number
  /** Abre la vista; si ya estaba abierta, oculta la barra (como en VS Code). */
  alternarVista(vista: VistaLateral): void
  alternarLateral(): void
  setAncho(ancho: number): void
}

function leer(): Partial<Pick<Disposicion, 'vista' | 'ultimaVista' | 'ancho'>> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '{}')
  } catch {
    return {}
  }
}

const guardado = leer()

export const useDisposicion = create<Disposicion>((set, get) => ({
  vista: guardado.vista === undefined ? 'historial' : guardado.vista,
  ultimaVista: guardado.ultimaVista ?? 'historial',
  ancho: Math.min(ANCHO_MAX, Math.max(ANCHO_MIN, guardado.ancho ?? 280)),
  alternarVista: (vista) => set((s) => (s.vista === vista ? { vista: null } : { vista, ultimaVista: vista })),
  alternarLateral: () => set((s) => ({ vista: s.vista ? null : get().ultimaVista })),
  setAncho: (ancho) => set({ ancho: Math.min(ANCHO_MAX, Math.max(ANCHO_MIN, ancho)) }),
}))

useDisposicion.subscribe(({ vista, ultimaVista, ancho }) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ vista, ultimaVista, ancho }))
  } catch {
    // Sin almacenamiento (modo privado, etc.): simplemente no se recuerda.
  }
})
