import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/editorial/Breadcrumbs'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { RiderAvatar } from '@/components/editorial/RiderAvatar'
import { RiderProfileTabs } from '@/components/editorial/RiderProfileTabs'
import { getRiderBySlug } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { personJsonLd } from '@/lib/seo/structured-data'
import { formatDate, calculateAge } from '@/lib/content/format-date'
import { fromJsonField } from '@/lib/content/json-field'

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

const RESULT_TYPE_LABEL: Record<string, string> = {
  stage: 'Etapa',
  gc: 'General',
  points: 'Puntos',
  kom: 'Montaña',
  youth: 'Jóvenes',
  team: 'Equipos',
}

export default async function RiderPage({ params }: Props) {
  const rider = await getRiderBySlug(params.slug)
  if (!rider) notFound()

  const jsonLd = personJsonLd({ name: rider.name, nationality: rider.nationality, slug: rider.slug })
  const achievements = fromJsonField<string[]>(rider.achievements, [])
  const age = rider.birthDate ? calculateAge(rider.birthDate) : null
  const hasFullProfile = Boolean(rider.bio || achievements.length || rider.education)

  const statChips: { label: string; value: string }[] = []
  if (rider.nationality) statChips.push({ label: 'Nacionalidad', value: rider.nationality })
  if (age !== null) statChips.push({ label: 'Edad', value: `${age} años` })
  if (rider.weightKg) statChips.push({ label: 'Peso', value: `${rider.weightKg} kg` })
  if (rider.specialty) statChips.push({ label: 'Especialidad', value: rider.specialty })
  if (rider.currentTeam) statChips.push({ label: 'Equipo actual', value: rider.currentTeam.name })

  const tabs = [
    {
      id: 'resumen',
      label: 'Resumen',
      content: (
        <div className="space-y-6">
          {rider.bio ? (
            <p className="text-sm leading-relaxed text-ink">{rider.bio}</p>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Aún no tenemos una biografía verificada de {rider.name}. En cuanto se publique un artículo con más
              contexto sobre este corredor, actualizaremos su hoja de datos.
            </p>
          )}
          {rider.education && (
            <div>
              <h3 className="mb-1 font-heading text-sm font-bold uppercase tracking-wide text-muted">Estudios</h3>
              <p className="text-sm leading-relaxed text-ink">{rider.education}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'logros',
      label: `Logros${achievements.length ? ` (${achievements.length})` : ''}`,
      content: achievements.length ? (
        <ul className="space-y-2">
          {achievements.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Sin logros verificados registrados todavía.</p>
      ),
    },
    {
      id: 'carreras',
      label: `Carreras${rider.results.length ? ` (${rider.results.length})` : ''}`,
      content: rider.results.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Carrera</th>
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Posición</th>
              </tr>
            </thead>
            <tbody>
              {rider.results.map((result) => (
                <tr key={result.id} className="border-b border-border/60">
                  <td className="py-2 pr-4">
                    <Link href={`/races/${result.race.slug}`} className="hover:text-accent">
                      {result.race.name}
                    </Link>
                    {result.stage && (
                      <span className="text-muted">
                        {' '}
                        — Etapa {result.stage.number}
                        {result.stage.startCity && result.stage.endCity
                          ? ` (${result.stage.startCity} · ${result.stage.endCity})`
                          : ''}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-muted">{formatDate(result.date)}</td>
                  <td className="py-2 pr-4 text-muted">{RESULT_TYPE_LABEL[result.resultType] ?? result.resultType}</td>
                  <td className="py-2 pr-4 font-semibold">{result.position ? `${result.position}º` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">Sin resultados registrados en nuestra base de datos todavía.</p>
      ),
    },
    {
      id: 'noticias',
      label: `Noticias${rider.articles.length ? ` (${rider.articles.length})` : ''}`,
      content: rider.articles.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rider.articles.map((article) => (
            <ArticleCard key={article.slug} article={article} size="compact" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Todavía no hemos publicado artículos sobre {rider.name}.</p>
      ),
    },
  ]

  return (
    <Container className="py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Ciclistas', href: '/riders' }, { name: rider.name, href: `/riders/${rider.slug}` }]} />

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div>
          <RiderAvatar name={rider.name} photoUrl={rider.photoUrl} photoCredit={rider.photoCredit} />
        </div>

        <div>
          <h1 className="font-heading text-3xl font-bold">{rider.name}</h1>
          {!hasFullProfile && (
            <p className="mt-2 inline-block rounded bg-surface-soft px-3 py-1 text-xs text-muted">
              Ficha básica — aún sin biografía verificada
            </p>
          )}

          {statChips.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {statChips.map((chip) => (
                <div key={chip.label}>
                  <dt className="text-muted">{chip.label}</dt>
                  <dd className="font-semibold">
                    {chip.label === 'Equipo actual' && rider.currentTeam ? (
                      <Link href={`/teams/${rider.currentTeam.slug}`} className="hover:text-accent">
                        {chip.value}
                      </Link>
                    ) : (
                      chip.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <RiderProfileTabs tabs={tabs} />
    </Container>
  )
}
