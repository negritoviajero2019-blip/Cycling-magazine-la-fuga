import Link from 'next/link'
import Image from 'next/image'
import { EditorialFallbackCard } from './EditorialFallbackCard'
import { formatDate } from '@/lib/content/format-date'
import type { ArticleSummary } from '@/types/content'

export function Hero({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative min-h-[420px] overflow-hidden rounded-lg md:min-h-[560px]">
      <Link href={`/news/${article.slug}`} className="block">
        {article.heroImage ? (
          <Image
            src={article.heroImage.url}
            alt={article.heroImage.altText || article.title}
            width={1600}
            height={900}
            priority
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.025]"
          />
        ) : (
          <EditorialFallbackCard
            label={article.category.name}
            variant="minimal"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <div className="relative flex min-h-[420px] flex-col justify-end gap-3 p-5 md:min-h-[560px] md:p-10">
          <span className="w-fit rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
            {article.category.name}
          </span>
          <h1 className="font-heading text-[2.5rem] font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <p className="hidden max-w-2xl text-base text-white/80 md:block">{article.excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
            <span aria-hidden>·</span>
            <span>{article.readingTime} min de lectura</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
