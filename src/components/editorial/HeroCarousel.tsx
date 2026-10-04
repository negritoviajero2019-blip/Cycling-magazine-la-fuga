'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArticleImage } from './ArticleImage'
import { EditorialFallbackCard } from './EditorialFallbackCard'
import { formatDate } from '@/lib/content/format-date'
import type { ArticleSummary } from '@/types/content'

const AUTOPLAY_MS = 3500
const IDLE_BEFORE_RESUME_MS = 6000

/** `cover-composited`: la imagen ya trae el titular y la bajada
 * "horneados" — no se vuelve a sobreponer texto encima. Ver Hero.tsx. */
function hasBakedInText(source?: string): boolean {
  return source === 'cover-composited'
}

/**
 * Carrusel de portada: historias centradas, con un pedazo de la
 * anterior y la siguiente a los lados. Avanza solo cada ~3,5 s y se
 * detiene mientras el usuario lo toca, lo apunta con el mouse o
 * navega con teclado; retoma a los 6 s sin actividad. No avanza
 * solo si el usuario pidió reducir el movimiento.
 */
export function HeroCarousel({ articles }: { articles: ArticleSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const hoveringRef = useRef(false)
  const lastInteractionRef = useRef(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(index, track.children.length - 1))
    const slide = track.children[clamped] as HTMLElement | undefined
    if (!slide) return
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }, [])

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame: number
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2
        let best = 0
        let bestDistance = Infinity
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement
          const distance = Math.abs(el.offsetLeft + el.clientWidth / 2 - center)
          if (distance < bestDistance) {
            bestDistance = distance
            best = i
          }
        })
        activeRef.current = best
        setActiveIndex((prev) => (prev === best ? prev : best))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (articles.length < 2) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      if (document.hidden || hoveringRef.current) return
      if (Date.now() - lastInteractionRef.current < IDLE_BEFORE_RESUME_MS) return
      scrollToIndex((activeRef.current + 1) % articles.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [articles.length, scrollToIndex])

  if (articles.length === 0) return null

  const goTo = (index: number) => {
    markInteraction()
    scrollToIndex(index)
  }

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => {
        hoveringRef.current = true
      }}
      onMouseLeave={() => {
        hoveringRef.current = false
        markInteraction()
      }}
      onTouchStart={markInteraction}
      onTouchMove={markInteraction}
      onFocus={markInteraction}
      onKeyDown={markInteraction}
    >
      <div
        ref={trackRef}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[7%] py-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:px-[11%] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, i) => {
          const baked = hasBakedInText(article.heroImage?.source)
          const isActive = i === activeIndex
          const Title = i === 0 ? 'h1' : 'h2'
          return (
            <article
              key={article.slug}
              className={`w-[86%] shrink-0 snap-center transition-all duration-500 md:w-[78%] ${
                isActive ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-60'
              }`}
            >
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                <Link
                  href={`/news/${article.slug}`}
                  className="block h-full w-full"
                  onClick={(event) => {
                    if (!isActive) {
                      event.preventDefault()
                      goTo(i)
                    }
                  }}
                >
                  {article.heroImage ? (
                    <ArticleImage
                      src={article.heroImage.url}
                      alt={article.heroImage.altText || article.title}
                      width={1600}
                      height={900}
                      priority={i < 2}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <EditorialFallbackCard label={article.category.name} variant="minimal" className="absolute inset-0 h-full w-full" />
                  )}
                  {baked ? (
                    <div className="absolute bottom-4 right-4 hidden items-center gap-2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm md:flex">
                      {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
                      <span aria-hidden>·</span>
                      <span>{article.readingTime} min de lectura</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                      <div className="relative flex h-full flex-col justify-end gap-2 p-4 md:gap-3 md:p-8">
                        <span className="w-fit rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
                          {article.category.name}
                        </span>
                        <Title className="font-display text-3xl leading-[0.95] tracking-tight text-white md:text-5xl">
                          {article.title}
                        </Title>
                        <p className="hidden max-w-2xl text-sm text-white/80 md:block">{article.excerpt}</p>
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
            onClick={() => goTo((activeIndex - 1 + articles.length) % articles.length)}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 md:block md:opacity-0 md:group-hover/carousel:opacity-100 md:focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Siguiente historia"
            onClick={() => goTo((activeIndex + 1) % articles.length)}
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 md:block md:opacity-0 md:group-hover/carousel:opacity-100 md:focus-visible:opacity-100"
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
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-lime' : 'w-2 bg-border hover:bg-muted'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
