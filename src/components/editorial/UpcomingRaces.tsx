import Link from 'next/link'
import { formatDate } from '@/lib/content/format-date'

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
        <h2 className="font-heading text-3xl font-extrabold leading-none tracking-tight md:text-5xl">
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
              <div>
                <p className="font-heading text-lg font-bold tracking-tight">{race.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {[race.category.replace('-', ' '), race.country].filter(Boolean).join(' · ')}
                </p>
              </div>
              <time dateTime={race.startDate.toISOString()} className="text-sm font-semibold text-accent">
                {formatDate(race.startDate)}
              </time>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
