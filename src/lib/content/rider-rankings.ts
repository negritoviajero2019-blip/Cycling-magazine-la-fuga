import { prisma } from '@/lib/db'

/**
 * UCI World Ranking individual masculino, verificado en
 * ProCyclingStats (procyclingstats.com/rankings/me/uci-individual)
 * con fecha de corte 2026-09-22. Se usa para ordenar /riders y elegir
 * las 3 tarjetas destacadas — ver rider-profiles.ts sobre el mismo
 * criterio de no inventar datos para el resto de la base.
 */
interface RankedRider {
  slug: string
  name: string
  uciRanking: number
  nationality: string
}

const RANKED_RIDERS: RankedRider[] = [
  { slug: 'tadej-pogacar', name: 'Tadej Pogačar', uciRanking: 1, nationality: 'Eslovenia' },
  { slug: 'remco-evenepoel', name: 'Remco Evenepoel', uciRanking: 2, nationality: 'Bélgica' },
  { slug: 'isaac-del-toro', name: 'Isaac del Toro', uciRanking: 3, nationality: 'México' },
  { slug: 'paul-seixas', name: 'Paul Seixas', uciRanking: 4, nationality: 'Francia' },
  { slug: 'jonas-vingegaard', name: 'Jonas Vingegaard', uciRanking: 5, nationality: 'Dinamarca' },
  { slug: 'jasper-philipsen', name: 'Jasper Philipsen', uciRanking: 6, nationality: 'Bélgica' },
  { slug: 'tom-pidcock', name: 'Tom Pidcock', uciRanking: 7, nationality: 'Gran Bretaña' },
  { slug: 'wout-van-aert', name: 'Wout van Aert', uciRanking: 8, nationality: 'Bélgica' },
  { slug: 'felix-gall', name: 'Felix Gall', uciRanking: 9, nationality: 'Austria' },
  { slug: 'lenny-martinez', name: 'Lenny Martinez', uciRanking: 10, nationality: 'Francia' },
  { slug: 'richard-carapaz', name: 'Richard Carapaz', uciRanking: 11, nationality: 'Ecuador' },
  { slug: 'mattias-skjelmose', name: 'Mattias Skjelmose', uciRanking: 12, nationality: 'Dinamarca' },
  { slug: 'mathieu-van-der-poel', name: 'Mathieu van der Poel', uciRanking: 13, nationality: 'Países Bajos' },
  { slug: 'mauro-schmid', name: 'Mauro Schmid', uciRanking: 14, nationality: 'Suiza' },
  { slug: 'tobias-halland-johannessen', name: 'Tobias Halland Johannessen', uciRanking: 15, nationality: 'Noruega' },
  { slug: 'christian-scaroni', name: 'Christian Scaroni', uciRanking: 16, nationality: 'Italia' },
  { slug: 'romain-gregoire', name: 'Romain Grégoire', uciRanking: 17, nationality: 'Francia' },
  { slug: 'mads-pedersen', name: 'Mads Pedersen', uciRanking: 18, nationality: 'Dinamarca' },
  { slug: 'paul-magnier', name: 'Paul Magnier', uciRanking: 19, nationality: 'Francia' },
  { slug: 'tobias-lund-andresen', name: 'Tobias Lund Andresen', uciRanking: 20, nationality: 'Dinamarca' },
  { slug: 'primoz-roglic', name: 'Primož Roglič', uciRanking: 21, nationality: 'Eslovenia' },
  { slug: 'benoit-cosnefroy', name: 'Benoît Cosnefroy', uciRanking: 22, nationality: 'Francia' },
  { slug: 'giulio-ciccone', name: 'Giulio Ciccone', uciRanking: 23, nationality: 'Italia' },
  { slug: 'enric-mas', name: 'Enric Mas', uciRanking: 24, nationality: 'España' },
  { slug: 'matthew-brennan', name: 'Matthew Brennan', uciRanking: 25, nationality: 'Gran Bretaña' },
  { slug: 'christophe-laporte', name: 'Christophe Laporte', uciRanking: 26, nationality: 'Francia' },
  { slug: 'jordi-meeus', name: 'Jordi Meeus', uciRanking: 27, nationality: 'Bélgica' },
  { slug: 'giulio-pellizzari', name: 'Giulio Pellizzari', uciRanking: 28, nationality: 'Italia' },
  { slug: 'florian-lipowitz', name: 'Florian Lipowitz', uciRanking: 29, nationality: 'Alemania' },
  { slug: 'laurence-pithie', name: 'Laurence Pithie', uciRanking: 30, nationality: 'Nueva Zelanda' },
]

/** Corredores retirados ya presentes en la base (perfiles de leyendas) — nunca deben aparecer en el ranking activo. */
const RETIRED_SLUGS = ['alberto-contador', 'andy-schleck', 'annemiek-van-vleuten']

/**
 * Aplica el ranking UCI verificado y marca a los retirados conocidos.
 * Idempotente: seguro de volver a correr.
 */
export async function backfillRiderRankings() {
  const ranked: { slug: string; applied: boolean }[] = []

  for (const rider of RANKED_RIDERS) {
    await prisma.rider.upsert({
      where: { slug: rider.slug },
      update: { uciRanking: rider.uciRanking, nationality: rider.nationality },
      create: {
        slug: rider.slug,
        name: rider.name,
        uciRanking: rider.uciRanking,
        nationality: rider.nationality,
        bio: null,
      },
    })
    ranked.push({ slug: rider.slug, applied: true })
  }

  const retired = await prisma.rider.updateMany({
    where: { slug: { in: RETIRED_SLUGS } },
    data: { isRetired: true },
  })

  return { ranked: ranked.length, retiredMarked: retired.count }
}
