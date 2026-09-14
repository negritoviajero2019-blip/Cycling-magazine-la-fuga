/**
 * Genera la imagen de cabecera de un artículo como un gráfico editorial
 * propio (nombre del evento, ciclistas destacados, colores de equipo) —
 * nunca una foto real. Evita por completo el problema de derechos de
 * autor de las fotos de prensa/agencia, que no podemos usar sin
 * licencia. Se codifica como data URI (SVG) para no depender de
 * escribir archivos en disco, que no sobreviven a un nuevo despliegue
 * en el hosting actual (ver docs/DEPLOYMENT.md).
 */
const WIDTH = 1600
const HEIGHT = 900

// Colores representativos de equipo para el punto del chip — siempre
// suficientemente claros para verse sobre el fondo oscuro del banner.
const TEAM_ACCENT: Record<string, string> = {
  'movistar-team': '#4f8fd6',
  'red-bull-bora-hansgrohe': '#e4002b',
  'decathlon-cma-cgm': '#00a19a',
  'ef-education-easypost': '#3b6fd6',
  'uae-team-emirates-xrg': '#26b463',
  'netcompany-ineos': '#5b9bd5',
  'visma-lease-a-bike': '#f7d417',
  'lidl-trek': '#e0334e',
  'uno-x-mobility': '#ff3b30',
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

interface RiderChip {
  name: string
  team?: string
}

interface HeaderBannerInput {
  eyebrow: string // categoría o "PREVIA" / "ÚLTIMA HORA"
  title: string // usado solo como aria-label, no se dibuja (el título real lo pone la página encima de la imagen)
  riders?: RiderChip[]
}

/**
 * Solo fondo + nombres de ciclistas + marca — sin el titular del
 * artículo, porque las páginas (Hero, ArticleCard, etc.) ya
 * sobreponen el título real encima de esta imagen como texto HTML.
 * Dibujarlo también aquí producía dos titulares superpuestos.
 */
export function buildHeaderBannerSvg({ title, riders = [] }: HeaderBannerInput): string {
  // Esquina superior derecha: fuera de la zona donde Hero/ArticleCard
  // sobreponen el título real (abajo-izquierda) y la píldora de
  // categoría (arriba-izquierda) — así no se pisan.
  const chips = riders.slice(0, 3).map((r, i) => {
    const color = (r.team && TEAM_ACCENT[r.team]) || '#B7FF3C'
    const y = 110 + i * 56
    const chipWidth = Math.max(r.name.length * 17 + 50, 240)
    const x = WIDTH - 70 - chipWidth
    return `
      <rect x="${x}" y="${y - 30}" width="${chipWidth}" height="42" rx="21" fill="#1c1f1a" stroke="#3a3d35" />
      <rect x="${x + 18}" y="${y - 16}" width="14" height="14" rx="3" fill="${color}" />
      <text x="${x + 42}" y="${y - 4}" font-size="22" font-weight="700" fill="#F5F6F3">${escapeXml(r.name)}</text>
    `
  })

  return `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111411" />
      <stop offset="100%" stop-color="#262b22" />
    </linearGradient>
    <radialGradient id="glow" cx="15%" cy="85%" r="70%">
      <stop offset="0%" stop-color="#B7FF3C" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#B7FF3C" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B7FF3C" />
      <stop offset="100%" stop-color="#7ea82a" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="url(#stripe)" />

  ${chips.join('')}
</svg>`.trim()
}

export function svgToDataUri(svg: string): string {
  const base64 = Buffer.from(svg, 'utf-8').toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/** Devuelve los datos listos para crear/actualizar un registro Media a
 * partir de un banner generado — nunca una foto de agencia/prensa. */
export function buildHeaderBannerMedia(input: HeaderBannerInput) {
  const svg = buildHeaderBannerSvg(input)
  return {
    url: svgToDataUri(svg),
    source: 'editorial-card' as const,
    author: 'La Fuga',
    license: 'own',
    credit: 'Gráfico: La Fuga',
    altText: input.title,
    width: WIDTH,
    height: HEIGHT,
  }
}
