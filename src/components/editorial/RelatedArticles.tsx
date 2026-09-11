import { ArticleCard } from './ArticleCard'
import type { ArticleSummary } from '@/types/content'

/** §68: 3-6 piezas relacionadas basadas en tags/entidades/categoría. */
export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="related-heading" className="mb-4 font-heading text-xl font-bold">
        Artículos relacionados
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((article) => (
          <ArticleCard key={article.slug} article={article} size="compact" />
        ))}
      </div>
    </section>
  )
}
