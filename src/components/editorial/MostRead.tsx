import Link from 'next/link'
import type { ArticleSummary } from '@/types/content'

/**
 * "Más leído" — ranking 1-5 basado en viewCount real (§94: nunca se
 * simula una tendencia). Si aún no hay vistas registradas, el
 * homepage oculta esta sección (ver page.tsx) en vez de mostrar un
 * ranking vacío o arbitrario.
 */
export function MostRead({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null

  return (
    <section className="py-10">
      <h2 className="mb-7 font-heading text-3xl font-extrabold leading-none tracking-tight md:text-5xl">
        Más leído
      </h2>

      <ol className="divide-y divide-border rounded-md border border-border bg-surface">
        {articles.map((article, index) => (
          <li key={article.slug}>
            <Link
              href={`/news/${article.slug}`}
              className="group flex items-center gap-5 p-5 transition-colors hover:bg-surface-soft"
            >
              <span className="font-heading text-3xl font-extrabold text-border tabular-nums group-hover:text-lime">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-accent">
                  {article.category.name}
                </span>
                <h3 className="truncate font-heading text-base font-bold leading-snug tracking-tight group-hover:text-accent">
                  {article.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
