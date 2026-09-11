import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { branding } from '@/lib/config/branding'

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const jsonLd = breadcrumbJsonLd(items.map((i) => ({ name: i.name, url: `${branding.url}${i.href}` })))

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden>/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-accent">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
