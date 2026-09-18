import { HouseAdRectangle } from './HouseAd'

// Ver comentario en AdBanner.tsx: NEXT_PUBLIC_ADSENSE_ADS_READY, no el
// publisher ID, es lo que activa el ad-slot real de AdSense aquí.
const ADS_READY = process.env.NEXT_PUBLIC_ADSENSE_ADS_READY === 'true'

export function AdInArticle({ label = 'Publicidad' }: { label?: string }) {
  if (!ADS_READY) return <HouseAdRectangle label={label} />
  return <div className="ad-slot my-8 h-[250px] w-full max-w-[336px] mx-auto rounded">{label}</div>
}
