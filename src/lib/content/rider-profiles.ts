import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'

/**
 * Datos verificados a mano (WebSearch + ProCyclingStats, septiembre
 * 2026) para los corredores que ya aparecen en nuestra cobertura —
 * ver docs/EDITORIAL-CHECKLIST.md sobre no inventar datos biográficos.
 * Los ~700+ corredores restantes importados de resultados UCI se
 * quedan con ficha mínima hasta que los mencionemos en un artículo y
 * los investiguemos igual que estos.
 */
interface RiderProfileSeed {
  slug: string
  birthDate?: string
  weightKg?: number
  education?: string
  achievements?: string[]
  bio: string
}

const RIDER_PROFILES: RiderProfileSeed[] = [
  {
    slug: 'isaac-del-toro',
    birthDate: '2003-11-27',
    weightKg: 64,
    bio: 'Isaac del Toro Romero nació en Ensenada, Baja California. Se formó en el equipo mexicano A.R. Monex Pro Cycling Team antes de firmar con UAE Team Emirates en 2024. En 2026 se consolidó como uno de los mejores corredores del mundo: 3º en el Ranking Mundial UCI, podio en la clasificación general del Tour de Francia y ganador de cuatro carreras por etapas de una semana.',
    achievements: [
      '3º en la clasificación general del Tour de Francia 2026',
      'Ganador de la clasificación de mejor joven del Tour de Francia 2026',
      'Ganador de una etapa del Tour de Francia 2026',
      'Campeón general del UAE Tour, el Tirreno-Adriatico, el Tour Auvergne-Rhône-Alpes y la Deutschland Tour, todos en 2026',
      'Campeón general de la Vuelta a Burgos 2025',
      '6º en la contrarreloj élite del Mundial de ciclismo de Montreal 2026',
      '3º en el Ranking Mundial UCI (ProCyclingStats, septiembre de 2026)',
      '33 victorias profesionales en su carrera, incluyendo 3 grandes vueltas por etapas y 4 clásicas',
    ],
  },
  {
    slug: 'romina-hinojosa',
    birthDate: '2002-11-30',
    education: 'Estudiante de Nutrición',
    bio: 'Romina Hinojosa Cruz nació en Tampico, Tamaulipas, y creció en San Pedro Garza García, Nuevo León. Practicó gimnasia antes de dedicarse al ciclismo a los 13 años, iniciando en el programa A.R. Monex. En 2026 se convirtió en la primera mexicana en terminar el Tour de Francia Femmes. Compagina su carrera profesional con estudios de Nutrición.',
    achievements: [
      'Primera mexicana en terminar el Tour de Francia Femmes (2026)',
      '2x subcampeona nacional de México en ruta élite (2023, 2025)',
      '2ª en una etapa del Giro Mediterraneo Rosa (2024)',
      '28ª en la contrarreloj élite del Mundial de ciclismo de Montreal 2026',
      '11ª en el Campeonato Panamericano de contrarreloj (2021)',
    ],
  },
  {
    slug: 'sara-roel',
    birthDate: '1996-02-07',
    bio: 'Sara Roel López nació en Guanajuato. Compitió casi ocho años en triatlón antes de dedicarse al ciclismo. En 2023 superó una cirugía para extirparle un tumor en el tronco encefálico que afectaba su visión, y después enfrentó panhipopituitarismo, una condición que le dejó una densidad ósea comparable a la de una persona de 80 años. Utilizó el ciclismo como eje de su rehabilitación física y mental, y en octubre de 2025 se coronó campeona nacional élite de contrarreloj en Ensenada, Baja California.',
    achievements: [
      'Campeona nacional de México en contrarreloj élite (2025)',
      '2ª en la clasificación general de la Vuelta Femenina a Guatemala (2026)',
      '2ª en la contrarreloj de los Juegos Centroamericanos y del Caribe, Santo Domingo 2026',
      '33ª en la contrarreloj élite del Mundial de ciclismo de Montreal 2026',
    ],
  },
  {
    slug: 'andrea-ramirez-fregoso',
    birthDate: '1999-09-25',
    weightKg: 54,
    bio: 'Andrea Ramírez Fregoso nació en Zapopan, Jalisco. Corredora todoterreno, ha pasado por equipos como A.R. Monex Women\'s Pro Cycling Team, Massi-Tactic Women Team y Bizkaia Durango antes de fichar por Pato Bike BMC Team. Es una de las contrarrelojistas más laureadas de México a nivel nacional.',
    achievements: [
      '3x campeona nacional de México en contrarreloj (2019, 2020, 2023)',
      'Campeona nacional de México en ruta (2025)',
      '2ª en la clasificación general de la Vuelta Internacional Femenina a Costa Rica (2019, 2025)',
      '7 victorias profesionales en su carrera, incluyendo una etapa de un Giro',
    ],
  },
  {
    slug: 'omar-andrade',
    birthDate: '2008-02-26',
    bio: 'Omar Andrade Fernández forma parte del equipo Sub-19 varonil de A.R. Monex Pro Cycling Team para la temporada 2026, después de haber corrido en 2025 con el conjunto italiano Voltia-Lvcvs Avgvsti. Debutó en un Mundial de ciclismo en Kigali 2025 y este 2026 disputa su segunda contrarreloj mundialista en Montreal.',
    achievements: [
      'Campeón nacional mexicano juvenil A de contrarreloj (2023)',
      'Campeón nacional mexicano de ruta, categoría juvenil B',
      '45º en la contrarreloj junior del Mundial de ciclismo de Kigali 2025',
    ],
  },
]

/**
 * Aplica los perfiles verificados de arriba a los corredores ya
 * existentes en la base (no crea corredores nuevos). Idempotente:
 * seguro de volver a correr — sobreescribe con la versión más
 * reciente de cada perfil verificado.
 */
export async function backfillCoreRiderProfiles() {
  const results: { slug: string; updated: boolean }[] = []

  for (const profile of RIDER_PROFILES) {
    const existing = await prisma.rider.findUnique({ where: { slug: profile.slug }, select: { id: true } })
    if (!existing) {
      results.push({ slug: profile.slug, updated: false })
      continue
    }

    await prisma.rider.update({
      where: { slug: profile.slug },
      data: {
        birthDate: profile.birthDate ? new Date(profile.birthDate) : undefined,
        weightKg: profile.weightKg,
        education: profile.education,
        bio: profile.bio,
        achievements: profile.achievements ? toJsonField(profile.achievements) : undefined,
        profileVerifiedAt: new Date(),
      },
    })
    results.push({ slug: profile.slug, updated: true })
  }

  return results
}
