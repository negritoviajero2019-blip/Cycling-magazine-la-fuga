import { notFound } from 'next/navigation'
import { ArticleImage } from '@/components/editorial/ArticleImage'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { CategoryChip } from '@/components/editorial/CategoryChip'
import { ShareButtons } from '@/components/editorial/ShareButtons'
import { RelatedArticles } from '@/components/editorial/RelatedArticles'
import { EditorialFallbackCard } from '@/components/editorial/EditorialFallbackCard'
import { AdInArticle } from '@/components/ads/AdInArticle'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { NewsletterForm } from '@/components/editorial/NewsletterForm'
import { getArticleBySlug, getRelatedArticles, incrementArticleView } from '@/lib/content/queries'
import { formatDate, formatDateTime } from '@/lib/content/format-date'
import { fromJsonField } from '@/lib/content/json-field'
import { buildMetadata } from '@/lib/seo/metadata'
import { newsArticleJsonLd } from '@/lib/seo/structured-data'
import { branding } from '@/lib/config/branding'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) return buildMetadata({ title: 'Artículo no encontrado', description: '', noindex: true })

  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/news/${article.slug}`,
    image: article.heroImage?.url,
    type: 'article',
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
  })
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  incrementArticleView(article.id)

  const related = await getRelatedArticles(article.id, article.categoryId)
  const url = `${branding.url}/news/${article.slug}`

  const jsonLd = newsArticleJsonLd({
    title: article.title,
    excerpt: article.excerpt,
    slug: article.slug,
    authorName: article.author.name,
    publishedAt: article.publishedAt || article.createdAt,
    updatedAt: article.updatedAt,
    imageUrl: article.heroImage?.url,
  })

  return (
    <Container className="py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <article>
          <Breadcrumbs
            items={[
              { name: 'Inicio', href: '/' },
              { name: article.category.name, href: `/category/${article.category.slug}` },
              { name: article.title, href: `/news/${article.slug}` },
            ]}
          />

          <div className="mb-3 flex items-center gap-2">
            {article.breakingNews && <Badge variant="breaking">Última hora</Badge>}
            <CategoryChip slug={article.category.slug} name={article.category.name} />
          </div>

          <h1 className="font-heading text-3xl font-bold leading-[1.02] tracking-tight md:text-5xl">
            {article.title}
          </h1>
          {article.subtitle && <p className="mt-3 text-lg text-muted">{article.subtitle}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-3 text-sm text-muted">
            <span>
              Por <span className="font-semibold text-ink">{article.author.name}</span>
            </span>
            <span aria-hidden>·</span>
            {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
            <span aria-hidden>·</span>
            <span>{article.readingTime} min de lectura</span>
            {article.status === 'updated' && (
              <>
                <span aria-hidden>·</span>
                <span className="italic">Actualizado: {formatDateTime(article.updatedAt)}</span>
              </>
            )}
          </div>

          <div className="my-6 overflow-hidden rounded">
            {article.heroImage ? (
              <>
                <ArticleImage
                  src={article.heroImage.url}
                  alt={article.heroImage.altText || article.title}
                  width={1200}
                  height={675}
                  priority
                  className="w-full object-cover"
                />
                {article.imageCredit && (
                  <p className="mt-1 text-xs text-muted">{article.imageCredit}</p>
                )}
              </>
            ) : (
              <EditorialFallbackCard label={article.category.name} />
            )}
          </div>

          <div className="prose-article" dangerouslySetInnerHTML={{ __html: article.content }} />

          <AdInArticle />

          {(() => {
            const sourceUrls = fromJsonField<string[]>(article.sourceUrls, [])
            const sourceNames = fromJsonField<string[]>(article.sourceNames, [])
            if (sourceUrls.length === 0) return null
            return (
              <div className="mt-6 rounded border border-border bg-surface p-4 text-sm">
                <p className="mb-2 font-semibold">Fuentes consultadas</p>
                <ul className="list-inside list-disc space-y-1">
                  {sourceNames.map((name, i) => (
                    <li key={i}>
                      <a
                        href={sourceUrls[i]}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent hover:underline"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })()}

          {article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <a
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent"
                >
                  #{tag.name}
                </a>
              ))}
            </div>
          )}

          <div className="mt-6">
            <ShareButtons url={url} title={article.title} />
          </div>

          <div className="mt-8 rounded-md bg-primary p-6 text-white">
            <p className="mb-3 font-heading text-xl font-extrabold tracking-tight">
              Suscríbete a la newsletter
            </p>
            <NewsletterForm dark />
          </div>

          <RelatedArticles articles={related} />
        </article>

        <aside className="hidden lg:block">
          <AdSidebar />
        </aside>
      </div>
    </Container>
  )
}
