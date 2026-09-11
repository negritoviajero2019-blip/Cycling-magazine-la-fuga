import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { getRaceBySlug } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { sportsEventJsonLd } from '@/lib/seo/structured-data'
import { formatDate } from '@/lib/content/format-date'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const race = await getRaceBySlug(params.slug)
  if (!race) return buildMetadata({ title: 'Carrera no encontrada', description: '', noindex: true })
  return buildMetadata({
    title: race.name,
    description: race.description || `Recorrido, etapas, resultados y noticias de ${race.name}`,
    path: `/races/${race.slug}`,
  })
}

export default async function RacePage({ params }: Props) {
  const race = await getRaceBySlug(params.slug)
  if (!race) notFound()

  const jsonLd = sportsEventJsonLd({
    name: race.name,
    slug: race.slug,
    startDate: race.startDate,
    endDate: race.endDate,
    country: race.country,
  })

  return (
    <Container className="py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Carreras', href: '/races' }, { name: race.name, href: `/races/${race.slug}` }]} />

      <h1 className="font-heading text-3xl font-bold">{race.name}</h1>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Fechas</dt>
          <dd className="font-semibold">
            {formatDate(race.startDate)} – {formatDate(race.endDate)}
          </dd>
        </div>
        {race.country && (
          <div>
            <dt className="text-muted">País</dt>
            <dd className="font-semibold">{race.country}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted">Categoría</dt>
          <dd className="font-semibold capitalize">{race.category.replace('-', ' ')}</dd>
        </div>
        {race.numStages && (
          <div>
            <dt className="text-muted">Etapas</dt>
            <dd className="font-semibold">{race.numStages}</dd>
          </div>
        )}
      </dl>

      {race.description && <p className="mt-6 max-w-2xl text-sm leading-relaxed">{race.description}</p>}

      {race.stages.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-bold">Etapas</h2>
          <ol className="divide-y divide-border">
            {race.stages.map((stage) => (
              <li key={stage.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-semibold">Etapa {stage.number}</span>
                <span className="text-muted">
                  {stage.startCity} → {stage.endCity}
                </span>
                <time dateTime={stage.date.toISOString()}>{formatDate(stage.date)}</time>
              </li>
            ))}
          </ol>
        </section>
      )}

      {race.articles.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-heading text-xl font-bold">Noticias relacionadas</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {race.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
