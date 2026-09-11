import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { getTagBySlug, getArticlesByTag } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

// §95/§86: tags con muy poco contenido no se indexan (thin content).
const MIN_ARTICLES_TO_INDEX = 3

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug)
  if (!tag) return buildMetadata({ title: 'Tag no encontrado', description: '', noindex: true })
  const articles = await getArticlesByTag(tag.id)
  return buildMetadata({
    title: `#${tag.name}`,
    description: `Artículos relacionados con ${tag.name}`,
    path: `/tag/${tag.slug}`,
    noindex: articles.length < MIN_ARTICLES_TO_INDEX,
  })
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug)
  if (!tag) notFound()

  const articles = await getArticlesByTag(tag.id)

  return (
    <Container className="py-6">
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: `#${tag.name}`, href: `/tag/${tag.slug}` }]} />
      <h1 className="mb-6 font-heading text-3xl font-bold">#{tag.name}</h1>

      {articles.length === 0 ? (
        <p className="text-muted">Todavía no hay artículos con esta etiqueta.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </Container>
  )
}
