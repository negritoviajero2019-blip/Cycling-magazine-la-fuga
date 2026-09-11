import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { prisma, safeQuery } from '@/lib/db'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Ciclistas',
  description: 'Perfiles, estadísticas y trayectoria de ciclistas profesionales.',
  path: '/riders',
})

export default async function RidersIndexPage() {
  const riders = await safeQuery(
    () => prisma.rider.findMany({ orderBy: { name: 'asc' }, select: { slug: true, name: true, nationality: true, specialty: true } }),
    [],
  )

  return (
    <Container className="py-6">
      <h1 className="mb-6 font-heading text-3xl font-bold">Ciclistas</h1>
      {riders.length === 0 ? (
        <p className="text-muted">Todavía no hay perfiles de ciclistas publicados.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {riders.map((rider) => (
            <li key={rider.slug} className="rounded border border-border p-4 hover:border-accent">
              <Link href={`/riders/${rider.slug}`} className="font-semibold hover:text-accent">
                {rider.name}
              </Link>
              <p className="text-xs text-muted">{[rider.nationality, rider.specialty].filter(Boolean).join(' · ')}</p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
