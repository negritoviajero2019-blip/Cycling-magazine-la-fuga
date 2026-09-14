import { buildHeaderBannerSvg } from '@/lib/content/header-banner-svg'

/**
 * Genera el gráfico de cabecera al vuelo a partir de los ciclistas en
 * la query string, en vez de guardar el SVG completo en Media.url —
 * ese campo es VARCHAR(191) en MySQL y trunca cualquier data URI
 * largo (bug real encontrado en producción). Cacheable e idempotente.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ridersParam = searchParams.get('riders') || ''
  const label = searchParams.get('label') || undefined
  const riders = ridersParam
    .split(',')
    .filter(Boolean)
    .map((entry) => {
      const [name = '', team] = entry.split('|')
      return { name: decodeURIComponent(name), team: team ? decodeURIComponent(team) : undefined }
    })

  const svg = buildHeaderBannerSvg({ title: '', label, riders })

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
