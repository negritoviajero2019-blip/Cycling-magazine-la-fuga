import { HouseAdRectangle } from './HouseAd'

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdInArticle({ label = 'Publicidad' }: { label?: string }) {
  if (!ADSENSE_ID) return <HouseAdRectangle label={label} />
  return <div className="ad-slot my-8 h-[250px] w-full max-w-[336px] mx-auto rounded">{label}</div>
}
