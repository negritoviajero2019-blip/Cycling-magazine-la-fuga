/**
 * Primer artículo real (no de ejemplo) del sitio. Hechos verificados
 * el 2026-09-11 vía fuentes reales — ver sourceUrls. Script de un solo
 * uso: crea el artículo si no existe (por slug) y termina.
 */
import { PrismaClient } from '@prisma/client'
import { toJsonField } from '../src/lib/content/json-field'
import { buildStageProfileSvg } from '../src/lib/content/stage-profile-svg'

const prisma = new PrismaClient()

/** Puertos y desnivel reales según la organización de La Vuelta (lavuelta.es/en/stage-19). */
const stageProfileSvg = buildStageProfileSvg({
  distanceKm: 210.8,
  startTown: 'Vélez-Málaga',
  finishTown: 'Peñas Blancas (Estepona)',
  finishAltitudeM: 1268,
  climbs: [
    { name: 'Puerto de las Abejas', category: '2ª', km: 91, gainM: 617, distanceKm: 14.5, avgGradient: 4.3 },
    { name: 'Puerto del Viento', category: '2ª', km: 111.3, gainM: 498, distanceKm: 13.1, avgGradient: 3.7 },
    { name: 'Peñas Blancas', category: '1ª', km: 210.8, gainM: 1216, distanceKm: 18.7, avgGradient: 6.5 },
  ],
})

const content = `
<figure class="stage-profile">
  ${stageProfileSvg}
  <figcaption>Perfil ilustrativo de la etapa 19, con los puertos categorizados oficiales — datos de La Vuelta.</figcaption>
</figure>
<p>Eddie Dunbar (Q36.5 Pro Cycling Team) se impuso en solitario en la decimonovena etapa de la Vuelta a España 2026, un recorrido de 210,8&nbsp;km entre Vélez-Málaga y el alto de Peñas Blancas, en Estepona, con final en un puerto de primera categoría. Dunbar salió en una larga fuga formada a mitad de etapa y distanció a sus acompañantes en los kilómetros finales del ascenso para cruzar la meta en solitario.</p>

<p>Santiago Buitrago (Team Bahrain Victorious) fue segundo a 14 segundos, y Thomas Gloag completó el podio a 23 segundos del ganador. Urko Berrade entró cuarto, a 44 segundos.</p>

<p>En la clasificación general, Enric Mas (Movistar Team) conservó el maillot rojo de líder tras cruzar la meta junto al grupo de sus principales rivales. Mas mantiene una ventaja de 1 minuto y 37 segundos sobre Primož Roglič (Red Bull-BORA-hansgrohe), segundo clasificado. Felix Gall (Decathlon CMA CGM) es tercero a 3 minutos y 1 segundo, seguido de Richard Carapaz (EF Education-EasyPost) a 5:17 y Oscar Onley (Netcompany Ineos) a 6:03.</p>

<p>A la carrera le quedan dos etapas. Este sábado 12 de septiembre se disputa la vigésima etapa, una jornada de montaña de 186,8&nbsp;km entre La Calahorra y el Collado del Alguacil que podría ser la última oportunidad real para mover la general antes de Granada. La Vuelta 2026 cierra su recorrido el domingo 13 de septiembre con una etapa llana de 99,4&nbsp;km en la propia ciudad de Granada.</p>

<p>Con Mas a menos de 48 horas de sellar su primera Vuelta a España, la etapa del sábado será determinante: una ventaja de 1:37 sobre Roglič es defendible pero no intocable en una etapa de montaña de este perfil.</p>
`.trim()

async function main() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'grand-tours' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const riders = await prisma.rider.findMany({
    where: { slug: { in: ['enric-mas', 'primoz-roglic', 'felix-gall', 'richard-carapaz'] } },
    select: { id: true },
  })
  const teams = await prisma.team.findMany({
    where: { slug: { in: ['movistar-team', 'red-bull-bora-hansgrohe'] } },
    select: { id: true },
  })
  const race = await prisma.race.findUniqueOrThrow({ where: { slug: 'vuelta-a-espana-2026' }, select: { id: true } })

  const baseFields = {
    title: 'Dunbar gana en Peñas Blancas y Enric Mas defiende el liderato a dos etapas del final',
    subtitle: 'El irlandés se impuso en solitario en la etapa reina del sur; Mas mantiene 1:37 sobre Roglič antes de la última cita de montaña',
    excerpt:
      'Eddie Dunbar ganó la etapa 19 de la Vuelta a España en el alto de Peñas Blancas tras una larga fuga. Enric Mas conserva el maillot rojo con 1:37 de ventaja sobre Primož Roglič a falta de dos etapas.',
    content,
    categoryId: category.id,
    authorId: author.id,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.lavuelta.es/en/stage-19',
      'https://www.eurosport.es/ciclismo/vuelta-a-espana/2026/clasificacion-general-maillot-rojo-resultados-tiempos-diferencias-favoritos-hoy_sto23330213/story.shtml',
      'https://www.infobae.com/america/agencias/2026/09/11/eddie-dunbar-gana-la-etapa-19-y-enric-mas-controla-su-liderato-rojo-en-la-cima-de-penas-blancas/',
    ]),
    sourceNames: toJsonField(['La Vuelta (oficial)', 'Eurosport España', 'Infobae']),
    seoTitle: 'Dunbar gana la etapa 19 de la Vuelta y Enric Mas sigue líder',
    seoDescription:
      'Eddie Dunbar se impone en Peñas Blancas en una fuga. Enric Mas defiende el maillot rojo con 1:37 sobre Roglič a dos etapas del final en Granada.',
    readingTime: 2,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'dunbar-gana-etapa-19-vuelta-espana-mas-lidera' },
    update: {
      ...baseFields,
      riders: { set: riders.map((r) => ({ id: r.id })) },
      teams: { set: teams.map((t) => ({ id: t.id })) },
      races: { set: [{ id: race.id }] },
    },
    create: {
      slug: 'dunbar-gana-etapa-19-vuelta-espana-mas-lidera',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: riders.map((r) => ({ id: r.id })) },
      teams: { connect: teams.map((t) => ({ id: t.id })) },
      races: { connect: [{ id: race.id }] },
    },
  })

  console.log(`✅ Artículo publicado: ${article.slug}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
