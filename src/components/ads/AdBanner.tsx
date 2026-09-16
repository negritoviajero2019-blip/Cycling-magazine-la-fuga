import { HouseAdBanner } from './HouseAd'

/**
 * Espacios publicitarios (§42-43): componentes reutilizables con
 * tamaño físico reservado para evitar CLS. Mientras no se configure
 * NEXT_PUBLIC_ADSENSE_PUBLISHER_ID, muestra el anuncio propio de Iron
 * Mind & Body (ver HouseAd.tsx) en vez de un placeholder vacío — en
 * cuanto exista publisher ID, AdSense lo sustituye sin tocar el layout.
 * Cuando se active: el snippet de AdSense también debe comprobar
 * `getStoredConsent() === 'accepted'` (ver src/lib/consent/cookie-consent.ts)
 * antes de cargar, igual que Analytics.tsx — RGPD exige consentimiento
 * previo para publicidad personalizada.
 */
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdBanner({ label = 'Publicidad' }: { label?: string }) {
  if (!ADSENSE_ID) return <HouseAdBanner label={label} />
  // Integración real de AdSense se activa aquí cuando exista publisher ID.
  return <div className="ad-slot mx-auto h-[90px] w-full max-w-[728px] rounded">{label}</div>
}
