import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'
import { RiderAvatar } from '../RiderAvatar'
import { BROADCAST_TIMEZONES, formatInZone, type RaceInfo } from '@/lib/content/race-info'

interface RiderLite {
  slug: string
  name: string
  photoUrl: string | null
  photoCredit: string | null
}

const km = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 1 })

function heroImageExists(publicPath?: string): boolean {
  if (!publicPath) return false
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', publicPath))
  } catch {
    return false
  }
}

function SectionTitle({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      {kicker && <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent">{kicker}</p>}
      <h2 className="font-display text-3xl leading-none md:text-4xl">{children}</h2>
    </div>
  )
}

/** Fondo ilustrado por código (montañas, lago y hojas) cuando no hay imagen de cabecera. */
function IllustratedBackdrop() {
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1d3a" />
          <stop offset="0.55" stopColor="#8a3b2a" />
          <stop offset="1" stopColor="#f0a24a" />
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f4e79" />
          <stop offset="1" stopColor="#0b1d3a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="420" fill="url(#sky)" />
      <circle cx="930" cy="130" r="54" fill="#ffd27a" opacity="0.9" />
      <path d="M0 300 L120 190 L210 260 L330 150 L450 270 L560 180 L690 280 L800 200 L930 285 L1060 195 L1200 290 L1200 420 L0 420 Z" fill="#1c2f55" opacity="0.85" />
      <path d="M0 340 L140 250 L260 320 L400 230 L520 330 L660 240 L800 335 L940 255 L1080 330 L1200 270 L1200 420 L0 420 Z" fill="#101c38" />
      <rect y="350" width="1200" height="70" fill="url(#lake)" />
      <g fill="#e8742a" opacity="0.9">
        <path d="M120 60 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M300 110 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M520 40 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M720 95 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M1040 60 q10 -14 22 0 q-10 14 -22 0z" />
      </g>
      <g fill="#ffd23f" opacity="0.9">
        <path d="M210 150 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M640 150 q10 -14 22 0 q-10 14 -22 0z" />
        <path d="M900 210 q10 -14 22 0 q-10 14 -22 0z" />
      </g>
    </svg>
  )
}

function ClimbMap({ info }: { info: RaceInfo }) {
  const located = info.climbs.filter((c) => c.kmToGo !== undefined)
  return (
    <div>
      <div className="relative mb-2 h-16 rounded-lg bg-surface-soft">
        <div className="absolute inset-x-4 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-lime"
          style={{ left: '1rem', width: `calc((100% - 2rem) * ${located.length ? (info.distanceKm - Math.min(...located.map((c) => c.kmToGo as number))) / info.distanceKm : 0})` }}
        />
        {info.climbs.map((climb, i) => {
          if (climb.kmToGo === undefined) return null
          const pct = ((info.distanceKm - climb.kmToGo) / info.distanceKm) * 100
          return (
            <span
              key={climb.name}
              className="absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow ring-2 ring-surface"
              style={{ left: `calc(1rem + (100% - 2rem) * ${pct / 100})` }}
              title={`${climb.name} · a ${climb.kmToGo} km de meta`}
            >
              {i + 1}
            </span>
          )
        })}
      </div>
      <div className="mb-5 flex justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
        <span>Salida · {info.start}</span>
        <span>Meta · {info.finish}</span>
      </div>
      <ol className="divide-y divide-border rounded-lg border border-border bg-surface">
        {info.climbs.map((climb, i) => (
          <li key={climb.name} className="flex items-start gap-3 p-3 text-sm">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{climb.name}</p>
              {climb.detail && <p className="text-xs text-muted">{climb.detail}</p>}
            </div>
            {climb.kmToGo !== undefined && (
              <p className="whitespace-nowrap text-right text-xs">
                <span className="block font-bold text-accent">a {km(climb.kmToGo)} km de meta</span>
                <span className="text-muted">km {km(info.distanceKm - climb.kmToGo)}</span>
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function RaceFicha({
  raceName,
  startDate,
  info,
  riders,
}: {
  raceName: string
  startDate: Date
  info: RaceInfo
  riders: RiderLite[]
}) {
  const hasHero = heroImageExists(info.heroImage)
  const rawDate = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(startDate)
  const dateLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1)
  const riderBySlug = new Map(riders.map((r) => [r.slug, r]))

  return (
    <div className="pb-16">
      <header className="relative -mx-4 overflow-hidden rounded-b-2xl bg-primary text-white md:mx-0 md:rounded-2xl">
        <div className="relative min-h-[300px] md:min-h-[380px]">
          {hasHero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={info.heroImage} alt={`${raceName}: ilustración de la carrera`} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <IllustratedBackdrop />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
          <div className="relative flex min-h-[300px] flex-col justify-end gap-3 p-6 md:min-h-[380px] md:p-10">
            <div className="flex flex-wrap gap-2 text-[11px] font-extrabold uppercase tracking-wide">
              <span className="rounded-full bg-lime px-2.5 py-1 text-primary">{info.level}</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">{info.edition}</span>
            </div>
            <h1 className="font-display text-5xl leading-[0.92] tracking-tight md:text-7xl">{raceName}</h1>
            <p className="max-w-2xl text-base text-white/85 md:text-lg">{info.tagline}</p>
            <p className="text-sm font-semibold text-lime">
              {dateLabel} · {info.start} → {info.finish}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Distancia', value: `${info.distanceKm} km` },
          { label: 'Desnivel', value: `≈ ${info.elevationM.toLocaleString('es-ES', { useGrouping: 'always' })} m` },
          { label: 'Ascensiones', value: String(info.climbsCount) },
          { label: 'Salida → meta', value: `${info.start} → ${info.finish}` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-2xl leading-tight md:text-3xl">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Horarios y transmisión">Cuándo y dónde verla</SectionTitle>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <caption className="bg-surface-soft p-3 text-left text-xs font-bold uppercase tracking-wide text-muted">Horario por país (salida → llegada estimada)</caption>
              <tbody className="divide-y divide-border">
                {BROADCAST_TIMEZONES.map((zone) => (
                  <tr key={zone.label}>
                    <th scope="row" className="p-3 text-left font-semibold">{zone.label}</th>
                    <td className="p-3 text-right tabular-nums">
                      <span className="font-extrabold text-accent">{formatInZone(info.startUtc, zone.timeZone)}</span>
                      <span className="text-muted"> → {formatInZone(info.finishUtc, zone.timeZone)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3">
            {info.broadcasts.map((b) => (
              <li key={b.region} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{b.region}</p>
                <p className="mt-1 font-heading text-base font-bold">{b.channels}</p>
                {b.note && <p className="mt-1 text-xs text-muted">{b.note}</p>}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-xs text-muted">Los horarios son estimados y los canales pueden cambiar según tu proveedor y tu país.</p>
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Recorrido">Mapa de subidas</SectionTitle>
        <ClimbMap info={info} />
        <p className="mt-4 max-w-3xl rounded-xl border-l-4 border-lime bg-surface-soft p-4 text-sm leading-relaxed">
          <strong>El final: </strong>
          {info.finale}
        </p>
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Corredores a seguir">Favoritos y nombres propios</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {info.favorites.map((fav) => {
            const rider = riderBySlug.get(fav.slug)
            return (
              <Link key={fav.slug} href={`/riders/${fav.slug}`} className="flex gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-soft">
                <div className="w-16 shrink-0">
                  <RiderAvatar name={fav.name} photoUrl={rider?.photoUrl} photoCredit={null} size={96} />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold leading-tight">{fav.name}</p>
                  {fav.team && <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{fav.team}</p>}
                  <p className="mt-1 text-xs text-muted">{fav.note}</p>
                </div>
              </Link>
            )
          })}
        </div>
        {info.latinos && (
          <p className="mt-5 rounded-xl bg-primary p-4 text-sm leading-relaxed text-white">
            <strong className="text-lime">Radar latino: </strong>
            {info.latinos}
          </p>
        )}
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Palmarés">El último ganador</SectionTitle>
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="rounded-xl bg-primary p-6 text-white lg:col-span-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime">Edición {info.lastWinner.year}</p>
            <p className="mt-2 font-display text-4xl leading-none">{info.lastWinner.winner}</p>
            {info.lastWinner.team && <p className="mt-1 text-sm text-white/70">{info.lastWinner.team}</p>}
            {info.lastWinner.detail && <p className="mt-3 text-sm text-white/85">{info.lastWinner.detail}</p>}
            <ul className="mt-4 space-y-1 text-sm">
              {info.lastWinner.podium.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface lg:col-span-3">
            <table className="w-full text-sm">
              <thead className="bg-surface-soft text-left text-[11px] font-bold uppercase tracking-wide text-muted">
                <tr>
                  <th className="p-3">Año</th>
                  <th className="p-3">Ganador</th>
                  <th className="hidden p-3 sm:table-cell">Equipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {info.recentWinners.map((w) => (
                  <tr key={w.year}>
                    <td className="p-3 font-bold tabular-nums">{w.year}</td>
                    <td className="p-3 font-semibold">{w.winner}</td>
                    <td className="hidden p-3 text-muted sm:table-cell">{w.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Más de un siglo de historia">Historia de la carrera</SectionTitle>
        <ol className="relative space-y-6 border-l-2 border-lime pl-6">
          {info.history.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-lime ring-4 ring-surface" />
              <h3 className="font-heading text-lg font-bold">{item.title}</h3>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <SectionTitle kicker="Para charlar">Datos curiosos</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-2">
          {info.facts.map((fact) => (
            <li key={fact} className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed">
              <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-xs text-muted">
        Fuentes:{' '}
        {info.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-border hover:text-accent">
              {s.name}
            </a>
          </span>
        ))}
      </p>
    </div>
  )
}
