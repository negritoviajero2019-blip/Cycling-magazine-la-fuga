import { HouseAdSkyscraper } from './HouseAd'

// Ver comentario en AdBanner.tsx: NEXT_PUBLIC_ADSENSE_ADS_READY, no el
// publisher ID, es lo que activa el ad-slot real de AdSense aquí.
const ADS_READY = process.env.NEXT_PUBLIC_ADSENSE_ADS_READY === 'true'

export function AdSidebar({ label = 'Publicidad' }: { label?: string }) {
  if (!ADS_READY) {
    return (
      <div className="sticky top-24">
        <HouseAdSkyscraper label={label} />
      </div>
    )
  }
  return <div className="ad-slot sticky top-24 h-[600px] w-full max-w-[300px] rounded">{label}</div>
}
