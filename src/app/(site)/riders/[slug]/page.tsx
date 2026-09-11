import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { EditorialFallbackCard } from '@/components/editorial/EditorialFallbackCard'
import { getRiderBySlug } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { personJsonLd } from '@/lib/seo/structured-data'
import { formatDate } from '@/lib/content/format-date'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const rider = await getRiderBySlug(params.slug)
  if (!rider) return buildMetadata({ title: 'Ciclista no encontrado', description: '', noindex: true })
  return buildMetadata({
    title: rider.name,
    description: rider.bio || `Perfil, resultados y noticias de ${rider.name}`,
    path: `/riders/${rider.slug}`,
  })
}

export default async function RiderPage({ params }: Props) {
  const rider = await getRiderBySlug(params.slug)
  if (!rider) notFound()

  const jsonLd = personJsonLd({ name: rider.name, nationality: rider.nationality, slug: rider.slug })

  return (
    <Container className="py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Ciclistas', href: '/riders' }, { name: rider.name, href: `/riders/${rider.slug}` }]} />

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div>
          {rider.photoUrl ? (
            <Image
              src={rider.photoUrl}
              alt={rider.name}
              width={240}
              height={240}
              className="aspect-square w-full rounded object-cover"
            />
          ) : (
            <EditorialFallbackCard label={rider.name} className="aspect-square" />
          )}
        </div>

        <div>
          <h1 className="font-heading text-3xl font-bold">{rider.name}</h1>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            {rider.nationality && (
              <div>
                <dt className="text-muted">Nacionalidad</dt>
                <dd className="font-semibold">{rider.nationality}</dd>
              </div>
            )}
            {rider.birthDate && (
              <div>
                <dt className="text-muted">Nacimiento</dt>
                <dd className="font-semibold">{formatDate(rider.birthDate)}</dd>
              </div>
            )}
            {rider.currentTeam && (
              <div>
                <dt className="text-muted">Equipo actual</dt>
                <dd className="font-semibold">
                  <Link href={`/teams/${rider.currentTeam.slug}`} className="hover:text-accent">
                    {rider.currentTeam.name}
                  </Link>
                </dd>
              </div>
            )}
            {rider.specialty && (
              <div>
                <dt className="text-muted">Especialidad</dt>
                <dd className="font-semibold">{rider.specialty}</dd>
              </div>
            )}
          </dl>
          {rider.bio && <p className="mt-4 text-sm leading-relaxed text-ink">{rider.bio}</p>}
        </div>
      </div>

      {rider.articles.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-heading text-xl font-bold">Noticias relacionadas</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rider.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
