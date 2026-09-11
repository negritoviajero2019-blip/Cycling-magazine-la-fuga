/**
 * Espacios publicitarios (§42-43): componentes reutilizables con
 * tamaño físico reservado para evitar CLS. Inertes hasta que se
 * configure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID — entonces se sustituye
 * el placeholder por el snippet real de AdSense, sin tocar el layout.
 */
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdBanner({ label = 'Publicidad' }: { label?: string }) {
  if (!ADSENSE_ID) {
    return (
      <div className="ad-slot mx-auto h-[90px] w-full max-w-[728px] rounded">
        {label}
      </div>
    )
  }
  // Integración real de AdSense se activa aquí cuando exista publisher ID.
  return <div className="ad-slot mx-auto h-[90px] w-full max-w-[728px] rounded">{label}</div>
}
