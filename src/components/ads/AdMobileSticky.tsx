'use client'

import { useState } from 'react'

/**
 * Formato sticky móvil — desactivado por defecto (§42: "no activar
 * formatos intrusivos inicialmente"). Se activa con
 * NEXT_PUBLIC_ENABLE_STICKY_AD="true" cuando editorialmente se decida,
 * y siempre es descartable por el usuario.
 */
export function AdMobileSticky() {
  const [dismissed, setDismissed] = useState(false)
  const enabled = process.env.NEXT_PUBLIC_ENABLE_STICKY_AD === 'true'

  if (!enabled || dismissed) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-background p-2 md:hidden">
      <div className="ad-slot h-[50px] flex-1 rounded">Publicidad</div>
      <button
        aria-label="Cerrar anuncio"
        onClick={() => setDismissed(true)}
        className="ml-2 px-2 text-muted"
      >
        ✕
      </button>
    </div>
  )
}
