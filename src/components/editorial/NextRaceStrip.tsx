import Link from 'next/link'
import { formatDate, formatDaysUntil } from '@/lib/content/format-date'

interface NextRace {
  slug: string
  name: string
  startDate: Date
  endDate: Date
  country: string | null
  category: string
  status: string
}

/** Franja compacta con la próxima carrera del calendario UCI — a diferencia
 * de `UpcomingRaces` (listado de 5), esta muestra una sola, la más cercana. */
export function NextRaceStrip({ race }: { race: NextRace | null }) {
  if (!race) return null

  const isOngoing = race.status === 'ongoing' || race.startDate <= new Date()

  return (
    <Link
      href={`/races/${race.slug}`}
      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-5 py-4 transition-colors hover:bg-surface-soft"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
          {isOngoing ? 'En curso' : 'Próxima carrera'}
        </span>
        <p className="font-heading text-lg font-bold tracking-tight">{race.name}</p>
        <p className="text-xs uppercase tracking-wide text-muted">
          {[race.category.replace('-', ' '), race.country].filter(Boolean).join(' · ')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <time dateTime={race.startDate.toISOString()} className="text-sm text-muted">
          {formatDate(race.startDate)}
        </time>
        <span className="text-sm font-semibold text-accent">{formatDaysUntil(race.startDate)}</span>
      </div>
    </Link>
  )
}
