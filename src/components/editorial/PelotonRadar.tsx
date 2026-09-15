import Link from 'next/link'
import { ArticleImage } from './ArticleImage'
import { EditorialFallbackCard } from './EditorialFallbackCard'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/lib/content/format-date'
import type { ArticleSummary } from '@/types/content'

/**
 * "Radar del Pelotón": snapshot de actualidad — una historia principal
 * + un feed corto de lo último (MTB/gravel, carreras, equipos, análisis…
 * cualquier categoría reciente, no restringido a una lista fija).
 */
export function PelotonRadar({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null

  const [main, ...feed] = articles

  return (
    <section className="peloton-radar py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="mb-3 inline-block rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
            Actualidad
          </span>
          <h2 className="font-heading text-3xl font-extrabold leading-none tracking-tight md:text-5xl">
            Radar del Pelotón
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Las historias que están moviendo al ciclismo profesional: MTB, gravel, lesiones,
            carreras, resultados y movimientos dentro del pelotón.
          </p>
        </div>

        <Link
          href="/category/ultima-hora"
          className="min-h-[48px] shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform duration-200 ease-editorial hover:-translate-y-0.5"
        >
          Ver todas las noticias →
        </Link>
      </div>

      <div className="rounded-lg bg-surface-soft p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-[25px] min-[850px]:grid-cols-[1.55fr_minmax(320px,0.75fr)]">
          {main && (
            <Link
              href={`/news/${main.slug}`}
              className="group relative block aspect-video overflow-hidden rounded-lg bg-[#111]"
            >
              {main.heroImage ? (
                <ArticleImage
                  src={main.heroImage.url}
                  alt={main.heroImage.altText || main.title}
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.035]"
                />
              ) : (
                <EditorialFallbackCard label={main.category.name} variant="minimal" className="absolute inset-0 h-full w-full" />
              )}
              {main.heroImage?.source === 'cover-composited' ? null : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/[0.08]" />
                  <div className="relative z-[2] flex h-full flex-col justify-end p-[clamp(28px,5vw,55px)] text-white">
                    {main.breakingNews ? (
                      <Badge variant="breaking">Breaking</Badge>
                    ) : (
                      <span className="w-fit rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
                        {main.category.name}
                      </span>
                    )}
                    <h3 className="mb-3 mt-4 max-w-[700px] font-heading text-[clamp(2rem,4vw,4rem)] font-extrabold leading-[0.97] tracking-[-0.05em]">
                      {main.title}
                    </h3>
                    <p className="max-w-[600px] text-white/70">{main.excerpt}</p>
                  </div>
                </>
              )}
            </Link>
          )}

          <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
            {feed.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="grid flex-1 grid-cols-[80px_1fr] gap-[18px] border-b border-border p-[25px] transition-colors duration-200 ease-in-out last:border-b-0 hover:bg-surface-soft"
              >
                <span className="text-[0.72rem] text-muted">
                  {article.publishedAt ? formatRelativeTime(article.publishedAt) : ''}
                </span>
                <div>
                  <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-accent">
                    {article.category.name}
                  </span>
                  <h4 className="mt-1.5 font-heading text-[clamp(1.05rem,1.5vw,1.35rem)] font-bold leading-[1.15] tracking-[-0.025em]">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
