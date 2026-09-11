import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { prisma, safeQuery } from '@/lib/db'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Equipos',
  description: 'Equipos WorldTour, ProTeam y Women WorldTour del ciclismo profesional.',
  path: '/teams',
})

export default async function TeamsIndexPage() {
  const teams = await safeQuery(
    () => prisma.team.findMany({ orderBy: { name: 'asc' }, select: { slug: true, name: true, country: true, category: true } }),
    [],
  )

  return (
    <Container className="py-6">
      <h1 className="mb-6 font-heading text-3xl font-bold">Equipos</h1>
      {teams.length === 0 ? (
        <p className="text-muted">Todavía no hay equipos publicados.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <li key={team.slug} className="rounded border border-border p-4 hover:border-accent">
              <Link href={`/teams/${team.slug}`} className="font-semibold hover:text-accent">
                {team.name}
              </Link>
              <p className="text-xs text-muted">{[team.country, team.category].filter(Boolean).join(' · ')}</p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
