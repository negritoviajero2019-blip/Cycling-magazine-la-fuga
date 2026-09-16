import { HouseAdSkyscraper } from './HouseAd'

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdSidebar({ label = 'Publicidad' }: { label?: string }) {
  if (!ADSENSE_ID) {
    return (
      <div className="sticky top-24">
        <HouseAdSkyscraper label={label} />
      </div>
    )
  }
  return <div className="ad-slot sticky top-24 h-[600px] w-full max-w-[300px] rounded">{label}</div>
}
