import Link from 'next/link'
import { ArticleImage } from './ArticleImage'
import { Badge } from '@/components/ui/Badge'
import { CategoryChip } from './CategoryChip'
import { EditorialFallbackCard } from './EditorialFallbackCard'
import { formatDate } from '@/lib/content/format-date'
import type { ArticleSummary } from '@/types/content'

export function ArticleCard({
  article,
  size = 'default',
}: {
  article: ArticleSummary
  size?: 'default' | 'large' | 'compact'
}) {
  return (
    <article className="group overflow-hidden rounded-md border border-border bg-surface transition-all duration-300 ease-editorial hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-lift">
      <Link href={`/news/${article.slug}`} className="block overflow-hidden">
        {article.heroImage ? (
          <ArticleImage
            src={article.heroImage.url}
            alt={article.heroImage.altText || article.title}
            width={800}
            height={500}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.045]"
          />
        ) : (
          <EditorialFallbackCard label={article.category.name} />
        )}
      </Link>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          {article.breakingNews && article.category.slug !== 'ultima-hora' && (
            <Badge variant="breaking">Última hora</Badge>
          )}
          <CategoryChip slug={article.category.slug} name={article.category.name} />
        </div>

        <Link href={`/news/${article.slug}`}>
          <h3
            className={`font-heading font-bold leading-[1.05] tracking-tight ${
              size === 'large' ? 'text-2xl md:text-3xl' : size === 'compact' ? 'text-lg' : 'text-xl'
            }`}
          >
            {article.title}
          </h3>
        </Link>

        {size !== 'compact' && <p className="text-sm text-muted line-clamp-2">{article.excerpt}</p>}

        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
          {article.publishedAt && (
            <span>
              <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
            </span>
          )}
          <span aria-hidden>·</span>
          <span>{article.readingTime} min de lectura</span>
        </div>
      </div>
    </article>
  )
}
