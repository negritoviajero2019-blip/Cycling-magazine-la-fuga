import Link from 'next/link'

interface BreakingItem {
  slug: string
  title: string
}

/**
 * Solo se renderiza si hay breaking news real (§8: "No mostrarla
 * cuando no existan noticias suficientemente importantes"). La
 * decisión de qué es "breaking" vive en Article.breakingNews, marcado
 * por el pipeline editorial (§77), no aquí.
 */
export function BreakingNewsBar({ items }: { items: BreakingItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="bg-breaking text-white">
      <div className="container mx-auto flex items-center gap-3 overflow-hidden px-4 py-2 text-sm">
        <span className="shrink-0 rounded bg-white/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
          Última hora
        </span>
        <div className="flex gap-6 overflow-x-auto">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="whitespace-nowrap font-medium hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
