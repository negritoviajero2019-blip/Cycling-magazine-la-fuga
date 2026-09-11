export function AdSidebar({ label = 'Publicidad' }: { label?: string }) {
  return <div className="ad-slot sticky top-24 h-[600px] w-full max-w-[300px] rounded">{label}</div>
}
