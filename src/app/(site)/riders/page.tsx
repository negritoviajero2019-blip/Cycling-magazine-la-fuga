import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { RiderAvatar } from '@/components/editorial/RiderAvatar'
import { prisma, safeQuery } from '@/lib/db'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Ciclistas',
  description: 'Ranking UCI y perfiles de ciclistas profesionales en activo.',
  path: '/riders',
})

export default async function RidersIndexPage() {
  const riders = await safeQuery(
    () =>
      prisma.rider.findMany({
        where: { isRetired: false, uciRanking: { not: null } },
        orderBy: { uciRanking: 'asc' },
        select: {
          slug: true,
          name: true,
          nationality: true,
          specialty: true,
          photoUrl: true,
          photoCredit: true,
          uciRanking: true,
          currentTeam: { select: { name: true } },
        },
      }),
    [],
  )

  const [top3, rest] = [riders.slice(0, 3), riders.slice(3)]
  const columns: (typeof rest)[] = [[], [], []]
  rest.forEach((rider, i) => columns[i % 3]?.push(rider))

  return (
    <Container className="py-6">
      <h1 className="font-heading text-3xl font-bold">Ciclistas</h1>
      <p className="mt-1 text-sm text-muted">Ordenado por Ranking Mundial UCI (élite masculino, activos).</p>

      {riders.length === 0 ? (
        <p className="mt-6 text-muted">Todavía no hay corredores con ranking cargado.</p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {top3.map((rider) => (
              <Link
                key={rider.slug}
                href={`/riders/${rider.slug}`}
                className="group overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent"
              >
                <div className="relative">
                  <RiderAvatar name={rider.name} photoUrl={rider.photoUrl} photoCredit={rider.photoCredit} />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-lime font-heading text-lg font-bold text-primary">
                    {rider.uciRanking}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-heading text-lg font-bold group-hover:text-accent">{rider.name}</p>
                  <p className="text-xs text-muted">
                    {[rider.nationality, rider.currentTeam?.name].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-2 sm:grid-cols-3">
            {columns.map((col, i) => (
              <ul key={i} className="divide-y divide-border">
                {col.map((rider) => (
                  <li key={rider.slug}>
                    <Link
                      href={`/riders/${rider.slug}`}
                      className="flex items-center gap-3 py-2.5 hover:text-accent"
                    >
                      <span className="w-6 shrink-0 text-right text-sm font-semibold text-muted">
                        {rider.uciRanking}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{rider.name}</span>
                        <span className="block text-xs text-muted">
                          {[rider.nationality, rider.specialty].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </>
      )}
    </Container>
  )
}
