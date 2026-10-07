import { prisma } from '@/lib/db'

/**
 * Carreras que deben existir en la BD para que su ficha (race-info.ts) y
 * los artículos relacionados funcionen. Idempotente: se llama desde
 * "Publicar noticias del día" antes de los artículos.
 */
export async function ensureRaces() {
  await prisma.race.upsert({
    where: { slug: 'gran-piemonte-2026' },
    update: {},
    create: {
      slug: 'gran-piemonte-2026',
      name: 'Gran Piemonte',
      edition: 110,
      year: 2026,
      startDate: new Date('2026-10-08T00:00:00Z'),
      endDate: new Date('2026-10-08T00:00:00Z'),
      country: 'Italia',
      category: 'classic',
      distanceKm: 185,
      status: 'upcoming',
      description: 'Clásica italiana de 185 km entre Asti y Bra, a dos días de Il Lombardia.',
    },
  })
}
