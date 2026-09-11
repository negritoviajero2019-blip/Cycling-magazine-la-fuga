import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { getCategoryBySlug, getArticlesByCategory } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) return buildMetadata({ title: 'Categoría no encontrada', description: '', noindex: true })
  return buildMetadata({
    title: category.name,
    description: category.description || `Noticias de ${category.name}`,
    path: `/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) notFound()

  const articles = await getArticlesByCategory(category.id)

  return (
    <Container className="py-6">
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: category.name, href: `/category/${category.slug}` }]} />
      <h1 className="mb-6 font-heading text-3xl font-bold">{category.name}</h1>

      {articles.length === 0 ? (
        <p className="text-muted">Todavía no hay artículos publicados en esta categoría.</p>
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
