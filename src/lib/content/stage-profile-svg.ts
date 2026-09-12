/**
 * Genera un perfil de etapa en SVG a partir de datos reales y
 * verificados de la organización de la carrera (puertos categorizados,
 * km, desnivel, distancia). No es una topografía exacta punto a punto
 * — es una ilustración editorial fiel a los datos oficiales, usada
 * cuando no disponemos de una imagen con derechos de uso (nunca se
 * generan fotos ni mapas satelitales inventados). El desnivel entre
 * puertos se representa de forma relativa; solo la altitud de meta
 * (si se aporta) es una cota absoluta real.
 */
interface Climb {
  name: string
  category: string // "1ª", "2ª", "3ª", "Especial"
  km: number
  gainM: number
  distanceKm: number
  avgGradient: number
}

interface StageProfileInput {
  distanceKm: number
  startTown: string
  finishTown: string
  finishAltitudeM?: number
  climbs: Climb[]
}

const WIDTH = 820
const HEIGHT = 320
const PAD_LEFT = 30
const PAD_RIGHT = 30
const PAD_TOP = 40
const BASELINE_Y = 240
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT

const CATEGORY_COLOR: Record<string, string> = {
  'Especial': '#B7FF3C',
  '1ª': '#B7FF3C',
  '2ª': '#111411',
  '3ª': '#9C9C94',
}

export function buildStageProfileSvg(input: StageProfileInput): string {
  const { distanceKm, startTown, finishTown, finishAltitudeM, climbs } = input
  const maxGain = Math.max(...climbs.map((c) => c.gainM), 100)
  const peakHeight = 120

  const kmToX = (km: number) => PAD_LEFT + (km / distanceKm) * PLOT_WIDTH

  let baselinePath = `M ${PAD_LEFT} ${BASELINE_Y}`
  const labels: string[] = []

  // Puertos separados por menos del 12% del recorrido total alternan
  // altura de etiqueta para no solaparse (p.ej. dos puertos cercanos).
  const closeThresholdKm = distanceKm * 0.12
  let lastKm: number | null = null
  let stagger = 0

  for (const climb of climbs) {
    const peakX = kmToX(climb.km)
    const startX = kmToX(Math.max(0, climb.km - climb.distanceKm))
    const peakY = BASELINE_Y - (climb.gainM / maxGain) * peakHeight
    const isFinishClimb = Math.abs(climb.km - distanceKm) < 0.5

    baselinePath += ` L ${startX} ${BASELINE_Y} L ${peakX} ${peakY}`
    if (!isFinishClimb) {
      baselinePath += ` L ${peakX + 8} ${BASELINE_Y}`
    }

    stagger = lastKm !== null && climb.km - lastKm < closeThresholdKm ? (stagger + 1) % 2 : 0
    lastKm = climb.km
    const labelYOffset = 12 + stagger * 38

    const color = CATEGORY_COLOR[climb.category] ?? '#111411'
    const textColor = color === '#B7FF3C' ? '#111411' : '#F5F6F3'
    const boxWidth = Math.max(climb.name.length * 5.6, 90)
    // Si la etiqueta se saldría por el borde derecho, se ancla hacia la
    // izquierda del punto en vez de hacia la derecha.
    const overflowsRight = peakX + boxWidth > WIDTH - PAD_RIGHT
    const boxX = overflowsRight ? -boxWidth + 4 : -4
    const textAnchor = overflowsRight ? 'end' : 'start'
    const textX = 0

    labels.push(`
      <circle cx="${peakX}" cy="${peakY}" r="5" fill="${color}" stroke="#111411" stroke-width="1.5" />
      <line x1="${peakX}" y1="${peakY}" x2="${peakX}" y2="${peakY - labelYOffset}" stroke="${color}" stroke-width="1" stroke-dasharray="2 2" />
      <g transform="translate(${peakX}, ${peakY - labelYOffset})">
        <rect x="${boxX}" y="-30" width="${boxWidth}" height="34" rx="4" fill="${color}" />
        <text x="${textX}" y="-18" text-anchor="${textAnchor}" font-size="9" font-weight="700" fill="${textColor}">${climb.category} · ${climb.name}</text>
        <text x="${textX}" y="-6" text-anchor="${textAnchor}" font-size="8" fill="${textColor}" opacity="0.85">Km ${climb.km} · ${climb.gainM} m · ${climb.avgGradient}%</text>
      </g>
    `)
  }
  if (kmToX(distanceKm) > kmToX(climbs.at(-1)?.km ?? 0) + 1) {
    baselinePath += ` L ${WIDTH - PAD_RIGHT} ${BASELINE_Y}`
  }

  return `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Perfil de la etapa: ${startTown} a ${finishTown}, ${distanceKm} km">
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#F5F6F3" />
  <line x1="${PAD_LEFT}" y1="${BASELINE_Y}" x2="${WIDTH - PAD_RIGHT}" y2="${BASELINE_Y}" stroke="#D9DAD3" stroke-width="1" />
  <path d="${baselinePath}" fill="none" stroke="#111411" stroke-width="2.5" stroke-linejoin="round" />
  ${labels.join('')}
  <text x="${PAD_LEFT}" y="${PAD_TOP - 18}" font-size="13" font-weight="800" fill="#111411">${startTown} → ${finishTown}</text>
  <text x="${PAD_LEFT}" y="${PAD_TOP}" font-size="10" fill="#5B5C55">${distanceKm} km${finishAltitudeM ? ` · Llegada a ${finishAltitudeM} m de altitud` : ''}</text>
  <text x="${PAD_LEFT}" y="${BASELINE_Y + 20}" font-size="8" fill="#9C9C94">Km 0</text>
  <text x="${WIDTH - PAD_RIGHT}" y="${BASELINE_Y + 20}" font-size="8" fill="#9C9C94" text-anchor="end">Km ${distanceKm}</text>
</svg>`.trim()
}
