import { HouseAdBanner } from './HouseAd'

/**
 * Espacios publicitarios (§42-43): componentes reutilizables con
 * tamaño físico reservado para evitar CLS. Muestra el anuncio propio
 * de Iron Mind & Body (ver HouseAd.tsx) hasta que NEXT_PUBLIC_ADSENSE_ADS_READY
 * esté en "true" — eso pasa recién cuando la cuenta de AdSense esté
 * aprobada Y exista un ad-slot real creado desde el panel de AdSense
 * para este espacio (el `<ins class="adsbygoogle">` con su
 * data-ad-slot se implementa en ese momento, no antes: no existe un
 * slot real todavía). NEXT_PUBLIC_ADSENSE_PUBLISHER_ID por sí solo
 * NO activa esto — solo sirve para el script de verificación en
 * <head> (ver src/app/layout.tsx), un paso previo e independiente.
 * Cuando se active: el snippet de AdSense también debe comprobar
 * `getStoredConsent() === 'accepted'` (ver src/lib/consent/cookie-consent.ts)
 * antes de cargar, igual que Analytics.tsx — RGPD exige consentimiento
 * previo para publicidad personalizada.
 */
const ADS_READY = process.env.NEXT_PUBLIC_ADSENSE_ADS_READY === 'true'

export function AdBanner({ label = 'Publicidad' }: { label?: string }) {
  if (!ADS_READY) return <HouseAdBanner label={label} />
  // Integración real de AdSense (ad-slot real) se completa aquí cuando exista.
  return <div className="ad-slot mx-auto h-[90px] w-full max-w-[728px] rounded">{label}</div>
}
