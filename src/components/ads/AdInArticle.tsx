export function AdInArticle({ label = 'Publicidad' }: { label?: string }) {
  return <div className="ad-slot my-8 h-[250px] w-full max-w-[336px] mx-auto rounded">{label}</div>
}
