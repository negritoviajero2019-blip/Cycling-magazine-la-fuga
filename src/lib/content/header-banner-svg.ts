/**
 * Genera la imagen de cabecera de un artículo como un gráfico editorial
 * propio (nombre del evento, ciclistas destacados, colores de equipo) —
 * nunca una foto real. Evita por completo el problema de derechos de
 * autor de las fotos de prensa/agencia, que no podemos usar sin
 * licencia. Media.url guarda solo una URL corta a /api/banner-svg
 * (que genera el SVG al vuelo a partir de la query string) — nunca el
 * SVG completo: ese campo es VARCHAR(191) en MySQL y un data URI largo
 * se trunca en producción (bug real encontrado y corregido).
 *
 * Diseño v2: además de los chips de ciclistas, incluye una rueda de
 * bicicleta decorativa y un patrón de líneas tipo perfil de ruta, para
 * que sea más visual que un simple fondo con nombres. El Hero de la
 * portada sobrepone título/categoría en la mitad inferior de la
 * imagen (ver Hero.tsx, `justify-end`), así que todo el contenido
 * gráfico se mantiene en la mitad superior.
 */
const WIDTH = 1600
const HEIGHT = 900

// Colores representativos de equipo para el acento del chip — siempre
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
  title: string // usado solo como aria-label, no se dibuja (el título real lo pone la página encima de la imagen)
  label?: string // kicker corto sobre la lista, p.ej. "FAVORITOS", "PODIO", "GENERAL"
  riders?: RiderChip[]
}

/** Rueda de bicicleta decorativa (círculo + radios) — motivo genérico,
 * no representa ninguna bici ni marca real. */
function buildWheelMotif(cx: number, cy: number, r: number, opacity: number): string {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const x2 = cx + Math.cos(angle) * r
    const y2 = cy + Math.sin(angle) * r
    return `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#B7FF3C" stroke-width="2" opacity="${opacity}" />`
  }).join('')
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#B7FF3C" stroke-width="4" opacity="${opacity}" />
    <circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="none" stroke="#B7FF3C" stroke-width="3" opacity="${opacity}" />
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="8" fill="#B7FF3C" opacity="${opacity + 0.15}" />
  `
}

/** Línea tipo perfil de ruta/altimetría — puro motivo decorativo. */
function buildRouteLine(): string {
  const points = [
    [0, 520], [140, 470], [280, 500], [420, 380], [560, 430],
    [700, 300], [860, 340], [1020, 240], [1180, 290], [1340, 200], [1600, 250],
  ]
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  return `<path d="${d}" fill="none" stroke="#3a3d35" stroke-width="3" opacity="0.6" />`
}

/**
 * Chips de ciclistas + rueda decorativa + perfil de ruta — sin el
 * titular del artículo (las páginas ya lo sobreponen como texto HTML;
 * dibujarlo aquí también producía dos titulares superpuestos).
 */
export function buildHeaderBannerSvg({ title, label, riders = [] }: HeaderBannerInput): string {
  const cardTop = 90
  const cardX = WIDTH - 560
  const chips = riders.slice(0, 4).map((r, i) => {
    const color = (r.team && TEAM_ACCENT[r.team]) || '#B7FF3C'
    const y = cardTop + 70 + i * 62
    return `
      <rect x="${cardX}" y="${y - 34}" width="4" height="46" fill="${color}" />
      <text x="${cardX + 24}" y="${y - 4}" font-size="30" font-weight="700" fill="#F5F6F3">${escapeXml(r.name)}</text>
    `
  })

  const labelText = label ? escapeXml(label.toUpperCase()) : ''

  return `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111411" />
      <stop offset="100%" stop-color="#262b22" />
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="10%" r="65%">
      <stop offset="0%" stop-color="#B7FF3C" stop-opacity="0.16" />
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

  ${buildRouteLine()}
  ${buildWheelMotif(340, 260, 210, 0.16)}

  ${labelText ? `<text x="${cardX}" y="${cardTop + 18}" font-size="26" font-weight="800" letter-spacing="4" fill="#B7FF3C">${labelText}</text>` : ''}
  <line x1="${cardX}" y1="${cardTop + 38}" x2="${WIDTH - 70}" y2="${cardTop + 38}" stroke="#3a3d35" stroke-width="2" />
  ${chips.join('')}
</svg>`.trim()
}

function buildBannerUrl(riders: RiderChip[], label?: string): string {
  const ridersParam = riders
    .slice(0, 4)
    .map((r) => `${encodeURIComponent(r.name)}${r.team ? `|${encodeURIComponent(r.team)}` : ''}`)
    .join(',')
  const labelParam = label ? `&label=${encodeURIComponent(label)}` : ''
  return `/api/banner-svg?riders=${ridersParam}${labelParam}`
}

/** Devuelve los datos listos para crear/actualizar un registro Media a
 * partir de un banner generado — nunca una foto de agencia/prensa. */
export function buildHeaderBannerMedia(input: HeaderBannerInput) {
  return {
    url: buildBannerUrl(input.riders ?? [], input.label),
    source: 'editorial-card' as const,
    author: 'La Fuga',
    license: 'own',
    credit: 'Gráfico: La Fuga',
    altText: input.title,
    width: WIDTH,
    height: HEIGHT,
  }
}
