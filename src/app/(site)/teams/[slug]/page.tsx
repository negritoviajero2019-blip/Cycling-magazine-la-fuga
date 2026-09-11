import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { EditorialFallbackCard } from '@/components/editorial/EditorialFallbackCard'
import { getTeamBySlug } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const team = await getTeamBySlug(params.slug)
  if (!team) return buildMetadata({ title: 'Equipo no encontrado', description: '', noindex: true })
  return buildMetadata({
    title: team.name,
    description: team.description || `Plantilla, resultados y noticias de ${team.name}`,
    path: `/teams/${team.slug}`,
  })
}

export default async function TeamPage({ params }: Props) {
  const team = await getTeamBySlug(params.slug)
  if (!team) notFound()

  return (
    <Container className="py-6">
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Equipos', href: '/teams' }, { name: team.name, href: `/teams/${team.slug}` }]} />

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0">
          <EditorialFallbackCard label={team.slug.slice(0, 3).toUpperCase()} className="aspect-square h-20 w-20" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">{team.name}</h1>
          <p className="text-sm text-muted">{[team.country, team.category].filter(Boolean).join(' · ')}</p>
        </div>
      </div>

      {team.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed">{team.description}</p>}

      {team.riders.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-bold">Plantilla</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {team.riders.map((rider) => (
              <li key={rider.slug} className="rounded border border-border p-3">
                <Link href={`/riders/${rider.slug}`} className="font-semibold hover:text-accent">
                  {rider.name}
                </Link>
                {rider.specialty && <p className="text-xs text-muted">{rider.specialty}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {team.articles.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-heading text-xl font-bold">Noticias relacionadas</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
