import { prisma } from '@/lib/db'

/**
 * Calendario de publicación: slug → fecha/hora ISO (UTC) en la que el
 * artículo debe salir. Se aplica al correr "Publicar noticias del día"
 * en /admin/automation: los de fecha futura quedan `scheduled` (ocultos)
 * y se publican solos al llegar su hora (cron scheduled-publisher o,
 * como respaldo, la primera visita a la portada). Los de fecha pasada
 * se publican con esa fecha. Los slugs que no estén aquí no se tocan.
 */
export const PUBLICATION_SCHEDULE: Record<string, string> = {
  // 14:00 UTC = 08:00 Ciudad de México = 16:00 Madrid
  'coppa-bernocchi-2026-isidore-aular-podio': '2026-10-06T14:00:00Z',
  'ciccone-fotofinish-europeo-evenepoel-linea-meta': '2026-10-06T19:00:00Z',
  'giro-italia-2027-trieste-zoncolan': '2026-10-07T14:00:00Z',
  'asa-vermette-campeon-general-descenso-lake-placid-2026': '2026-10-08T14:00:00Z',
  'il-lombardia-2026-claves-sin-pogacar': '2026-10-09T14:00:00Z',
  'lucho-herrera-jardinerito-vuelta-1987': '2026-10-11T16:00:00Z',
}

export async function applyPublicationSchedule(now = new Date()) {
  const applied: { slug: string; status: string; publishedAt: string }[] = []

  for (const [slug, iso] of Object.entries(PUBLICATION_SCHEDULE)) {
    const when = new Date(iso)
    if (Number.isNaN(when.getTime())) continue

    const status = when > now ? 'scheduled' : 'published'
    const result = await prisma.article.updateMany({ where: { slug }, data: { status, publishedAt: when } })
    if (result.count > 0) applied.push({ slug, status, publishedAt: when.toISOString() })
  }

  return applied
}
