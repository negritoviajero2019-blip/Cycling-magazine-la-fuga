import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { prisma, safeQuery } from '@/lib/db'
import { buildMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/content/format-date'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Calendario de carreras',
  description: 'Grand Tours, clásicas y carreras WorldTour próximas y en curso.',
  path: '/races',
})

export default async function RacesIndexPage() {
  const races = await safeQuery(
    () =>
      prisma.race.findMany({
        orderBy: { startDate: 'asc' },
        select: { slug: true, name: true, startDate: true, endDate: true, category: true, country: true, status: true },
      }),
    [],
  )

  return (
    <Container className="py-6">
      <h1 className="mb-6 font-heading text-3xl font-bold">Calendario</h1>
      {races.length === 0 ? (
        <p className="text-muted">Todavía no hay carreras publicadas.</p>
      ) : (
        <ul className="divide-y divide-border">
          {races.map((race) => (
            <li key={race.slug} className="flex items-center justify-between py-3">
              <div>
                <Link href={`/races/${race.slug}`} className="font-semibold hover:text-accent">
                  {race.name}
                </Link>
                <p className="text-xs text-muted">
                  {formatDate(race.startDate)} – {formatDate(race.endDate)} · {race.country}
                </p>
              </div>
              <span className="rounded bg-surface px-2 py-1 text-xs font-semibold uppercase text-muted">
                {race.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
