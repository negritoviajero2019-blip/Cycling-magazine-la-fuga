import Link from 'next/link'
import { formatDate } from '@/lib/content/format-date'
import { getRaceInfo, formatInZone } from '@/lib/content/race-info'

interface UpcomingRace {
  slug: string
  name: string
  startDate: Date
  country: string | null
  category: string
}

/** "Próximas carreras" — calendario rápido, alimentado por el modelo Race. */
export function UpcomingRaces({ races }: { races: UpcomingRace[] }) {
  if (races.length === 0) return null

  return (
    <section className="py-10">
      <div className="mb-7 flex items-end justify-between gap-6">
        <h2 className="font-display text-3xl leading-none md:text-5xl">
          Próximas carreras
        </h2>
        <Link href="/races" className="whitespace-nowrap text-sm font-bold text-accent transition-opacity hover:opacity-60">
          Ver calendario →
        </Link>
      </div>

      <ol className="divide-y divide-border rounded-md border border-border bg-surface">
        {races.map((race) => (
          <li key={race.slug}>
            <Link
              href={`/races/${race.slug}`}
              className="flex flex-wrap items-center justify-between gap-2 p-5 transition-colors hover:bg-surface-soft"
            >
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold tracking-tight">{race.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {[race.category.replace('-', ' '), race.country].filter(Boolean).join(' · ')}
                </p>
                {(() => {
                  const info = getRaceInfo(race.slug)
                  if (!info) return null
                  return (
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span className="rounded-full bg-lime px-2 py-0.5 font-extrabold text-primary">{info.distanceKm} km</span>
                      <span>
                        {info.start} → {info.finish}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        Sale {formatInZone(info.startUtc, 'Europe/Madrid')} (Europa) · {formatInZone(info.startUtc, 'America/Mexico_City')} (México)
                      </span>
                    </p>
                  )
                })()}
              </div>
              <div className="text-right">
                <time dateTime={race.startDate.toISOString()} className="block text-sm font-semibold text-accent">
                  {formatDate(race.startDate)}
                </time>
                {getRaceInfo(race.slug) && <span className="text-[11px] font-bold uppercase tracking-wide text-muted">Ver ficha →</span>}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
