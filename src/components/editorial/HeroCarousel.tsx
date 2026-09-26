'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArticleImage } from './ArticleImage'
import { EditorialFallbackCard } from './EditorialFallbackCard'
import { formatDate } from '@/lib/content/format-date'
import type { ArticleSummary } from '@/types/content'

/** `cover-composited`: la imagen ya trae el titular y la bajada
 * "horneados" — no se vuelve a sobreponer texto encima. Ver Hero.tsx. */
function hasBakedInText(source?: string): boolean {
  return source === 'cover-composited'
}

/**
 * Carrusel de portada: 4-6 historias deslizables en vez de un solo
 * artículo fijo (ver getHomeSections). Deslizable con el dedo/mouse
 * (scroll-snap nativo) o con las flechas/puntos. Nunca autoavanza
 * solo — el usuario decide cuándo cambiar de historia.
 */
export function HeroCarousel({ articles }: { articles: ArticleSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(index, track.children.length - 1))
    const slide = track.children[clamped] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame: number
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const index = Math.round(track.scrollLeft / track.clientWidth)
        setActiveIndex((prev) => (prev === index ? prev : index))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  if (articles.length === 0) return null

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => {
          const baked = hasBakedInText(article.heroImage?.source)
          return (
            <article key={article.slug} className="w-full shrink-0 snap-start">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Link href={`/news/${article.slug}`} className="block h-full w-full">
                  {article.heroImage ? (
                    <ArticleImage
                      src={article.heroImage.url}
                      alt={article.heroImage.altText || article.title}
                      width={1600}
                      height={900}
                      priority
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <EditorialFallbackCard label={article.category.name} variant="minimal" className="absolute inset-0 h-full w-full" />
                  )}
                  {baked ? (
                    <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                      {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
                      <span aria-hidden>·</span>
                      <span>{article.readingTime} min de lectura</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                      <div className="relative flex h-full flex-col justify-end gap-3 p-5 md:p-10">
                        <span className="w-fit rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
                          {article.category.name}
                        </span>
                        <h1 className="font-display text-[2.5rem] leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
                          {article.title}
                        </h1>
                        <p className="hidden max-w-2xl text-base text-white/80 md:block">{article.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
                          <span aria-hidden>·</span>
                          <span>{article.readingTime} min de lectura</span>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Historia anterior"
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Siguiente historia"
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {articles.map((article, i) => (
              <button
                key={article.slug}
                type="button"
                aria-label={`Ir a la historia ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-lime' : 'w-2 bg-border hover:bg-muted'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
