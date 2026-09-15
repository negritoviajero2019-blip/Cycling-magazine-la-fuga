import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { getCategoryBySlug, getArticlesByCategory, getUpcomingRacesByCategory } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { UpcomingRaces } from '@/components/editorial/UpcomingRaces'

/** Categorías de artículos con su propio calendario de carreras (Race.category),
 * mostrado arriba del listado — hoy solo MTB y Gravel lo necesita. */
const RACE_CATEGORIES_BY_SECTION: Record<string, string[]> = {
  'mtb-gravel': ['mtb', 'gravel'],
}

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

  const raceCategories = RACE_CATEGORIES_BY_SECTION[category.slug]
  const [articles, races] = await Promise.all([
    getArticlesByCategory(category.id),
    raceCategories ? getUpcomingRacesByCategory(raceCategories) : Promise.resolve([]),
  ])

  return (
    <Container className="py-6">
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: category.name, href: `/category/${category.slug}` }]} />
      <h1 className="mb-6 font-display text-4xl">{category.name}</h1>

      {races.length > 0 && <UpcomingRaces races={races} />}

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
