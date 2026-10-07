import type { ReactNode } from 'react'

export interface ProfileMarker {
  name: string
  /** Km de carrera donde está la cima. */
  km: number
  alt: number
  lengthKm?: number
  gradientPct?: number
  /** Categoría de la subida (solo si la fuente la da): 'HC', '1', '2', '3', '4'. */
  category?: string
  /** 0 = fila baja, 1 = fila alta (para que no se pisen las etiquetas de cimas cercanas). */
  row?: 0 | 1
}

export interface ElevationProfileProps {
  points: [number, number][]
  totalKm: number
  start: { name: string; alt: number }
  finish: { name: string; alt: number }
  markers: ProfileMarker[]
  credit?: string
}

const W = 930
const H = 470
const X0 = 18
const X1 = 912
const Y_BASE = 412
const Y_TOP = 212

const fmt = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 1 })

/**
 * Altimetría con el estilo de las fichas de cronoescalada: relleno amarillo,
 * banda oscura en las subidas, insignias rojas con categoría, etiqueta con
 * altitud / nombre / (longitud · pendiente) y barra negra de kilómetros.
 * Se ajusta al perfil de cada carrera o etapa.
 */
export function ElevationProfile({ points, totalKm, start, finish, markers, credit }: ElevationProfileProps) {
  const P = points.map(([km, alt]) => ({ km, alt }))
  const first = P[0]
  const last = P[P.length - 1]
  if (!first || !last) return null
  const alts = P.map((p) => p.alt)
  const minAlt = Math.min(...alts)
  const maxAlt = Math.max(...alts)
  const range = maxAlt - minAlt || 1
  const altBase = minAlt - range * 0.12
  const x = (km: number) => X0 + (km / totalKm) * (X1 - X0)
  const y = (alt: number) => Y_BASE - ((alt - altBase) / (maxAlt - altBase)) * (Y_BASE - Y_TOP)
  const pt = (p: { km: number; alt: number }, dx = 0) => `${(x(p.km) + dx).toFixed(1)},${y(p.alt).toFixed(1)}`

  const line = P.map((p) => pt(p))
  const area = `M${x(first.km).toFixed(1)},${Y_BASE} L${line.join(' L')} L${x(last.km).toFixed(1)},${Y_BASE} Z`

  // Subidas: tramos con pendiente media > 2,5 % en ventanas de ~2 km
  const step = P[1] ? P[1].km - first.km : 0.5
  const win = Math.max(2, Math.round(2 / step))
  const asc = new Set<number>()
  for (let i = 0; i < P.length - win; i++) {
    const a0 = P[i]
    const b0 = P[i + win]
    if (!a0 || !b0) continue
    if ((b0.alt - a0.alt) / ((b0.km - a0.km) * 1000) > 0.025) for (let j = i; j <= i + win; j++) asc.add(j)
  }
  const runs: number[][] = []
  for (const i of Array.from(asc).sort((m, n) => m - n)) {
    const cur = runs[runs.length - 1]
    if (cur && i - (cur[cur.length - 1] ?? -9) <= 1) cur.push(i)
    else runs.push([i])
  }
  const bands = runs.map((idx) => {
    const pts = idx.map((i) => P[i]).filter((p): p is { km: number; alt: number } => !!p)
    const top = pts.map((p) => pt(p))
    const back = [...pts].reverse().map((p) => pt(p, -8))
    return `M${top.join(' L')} L${back.join(' L')} Z`
  })

  const label = (m: ProfileMarker): ReactNode => {
    const cx = x(m.km)
    const topY = m.row === 1 ? 52 : 122
    const detail = m.lengthKm !== undefined || m.gradientPct !== undefined
      ? `(${[m.lengthKm !== undefined ? `${fmt(m.lengthKm)} km` : '', m.gradientPct !== undefined ? `${fmt(m.gradientPct)} %` : ''].filter(Boolean).join(' · ')})`
      : ''
    const lineTop = topY + (detail ? 66 : 54)
    return (
      <g key={`${m.name}-${m.km}`}>
        <line x1={cx} x2={cx} y1={lineTop} y2={Y_BASE} stroke="#ffffff" strokeWidth={1.6} opacity={0.95} />
        <line x1={cx} x2={cx} y1={lineTop} y2={y(m.alt)} stroke="#1f2937" strokeWidth={0.8} opacity={0.5} />
        <circle cx={cx} cy={topY + 11} r={11} fill="#c8102e" stroke="#ffffff" strokeWidth={1.5} />
        <text x={cx} y={topY + 15} textAnchor="middle" fontSize={m.category && m.category.length > 1 ? 8.5 : 11} fontWeight={800} fill="#ffffff">
          {m.category ?? '▲'}
        </text>
        <text x={cx} y={topY + 34} textAnchor="middle" fontSize={11} fontWeight={600} fill="#111827">
          {fmt(m.alt)} m
        </text>
        <text x={cx} y={topY + 47} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#111827">
          {m.name}
        </text>
        {detail && (
          <text x={cx} y={topY + 60} textAnchor="middle" fontSize={10.5} fill="#374151">
            {detail}
          </text>
        )}
      </g>
    )
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-white">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Perfil altimétrico: ${start.name} (${start.alt} m) a ${finish.name} (${finish.alt} m), ${totalKm} km`} className="block h-auto w-full" style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
        <defs>
          <clipPath id="perfil-area">
            <path d={area} />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill="#ffffff" />

        {/* Salida y meta (franja superior propia, para que no choque con las etiquetas de las cimas) */}
        <g>
          <circle cx={X0 + 10} cy={20} r={10} fill="#1d4ed8" />
          <path d={`M${X0 + 7},${15} L${X0 + 15},${20} L${X0 + 7},${25} Z`} fill="#ffffff" />
          <text x={X0 + 26} y={17} fontSize={14} fontWeight={800} fill="#111827">{start.name.toUpperCase()}</text>
          <text x={X0 + 26} y={32} fontSize={11.5} fill="#374151">{start.alt} m</text>
        </g>
        <g>
          <circle cx={X1 - 10} cy={20} r={10} fill="#c8102e" />
          <g fill="#ffffff">
            <rect x={X1 - 15} y={15} width={5} height={5} />
            <rect x={X1 - 5} y={15} width={5} height={5} />
            <rect x={X1 - 10} y={20} width={5} height={5} />
          </g>
          <text x={X1 - 26} y={17} textAnchor="end" fontSize={14} fontWeight={800} fill="#111827">{finish.name.toUpperCase()}</text>
          <text x={X1 - 26} y={32} textAnchor="end" fontSize={11.5} fill="#374151">{finish.alt} m</text>
        </g>

        {/* Banda oscura de las subidas (detrás del relleno) */}
        <g fill="#8a6a1c">
          {bands.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* Relleno amarillo del perfil */}
        <path d={area} fill="#f3c12f" />
        <polyline points={line.join(' ')} fill="none" stroke="#c99512" strokeWidth={1.2} strokeLinejoin="round" />
        <g clipPath="url(#perfil-area)" opacity={0.0} />

        {markers.map(label)}

        {/* Barra de kilómetros */}
        <rect x={X0 - 12} y={Y_BASE} width={X1 - X0 + 24} height={18} fill="#111111" />
        {markers.map((m) => (
          <text key={`km-${m.name}-${m.km}`} x={x(m.km)} y={Y_BASE + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
            {fmt(m.km)}
          </text>
        ))}
        <text x={X0 - 12} y={Y_BASE + 38} fontSize={13} fontWeight={800} fill="#111827">0</text>
        <text x={X1 + 12} y={Y_BASE + 38} textAnchor="end" fontSize={13} fontWeight={800} fill="#111827">{fmt(totalKm)} km</text>
      </svg>
      {credit && <figcaption className="border-t border-border bg-surface-soft px-3 py-2 text-[11px] leading-snug text-muted">{credit}</figcaption>}
    </figure>
  )
}
