import { useSyncExternalStore } from 'react'

// Rutas con hash (#/algoritmo/ejemplo): funcionan en cualquier hosting estático y se pueden compartir.

const suscribir = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useRuta(): { algoritmoId?: string; ejemploId?: string } {
  const hash = useSyncExternalStore(suscribir, () => window.location.hash)
  const [algoritmoId, ejemploId] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  return { algoritmoId, ejemploId }
}

export function navegar(algoritmoId: string, ejemploId?: string, reemplazar = false) {
  const hash = `#/${algoritmoId}${ejemploId ? `/${ejemploId}` : ''}`
  if (reemplazar) {
    // replaceState no lanza hashchange por sí solo
    window.history.replaceState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}
