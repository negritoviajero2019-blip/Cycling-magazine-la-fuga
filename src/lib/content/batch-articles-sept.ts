/**
 * Tanda de 10 artículos reales (2026-09-15/16) — uno o dos por sección,
 * con imagen propia generada por el usuario con IA para cada uno (ver
 * ensureCustomHeroImage). Reutiliza los helpers de uci-import.ts en vez
 * de duplicarlos. Cada función documenta sus fuentes reales en un
 * comentario justo antes de la función.
 */
import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'
import { ensureHeroImage } from './uci-import'

// ————————————————————————————————————————————————————————————
// 1. Última Hora — horarios oficiales del Mundial + selecciones
// ————————————————————————————————————————————————————————————

const worldsScheduleContent = `
<p>Con el Mundial de ruta 2026 ya a la vuelta de la esquina (20-27 de septiembre, Montreal), la UCI y el comité organizador confirmaron el reparto completo de los siete días de competición y los horarios oficiales para el público europeo.</p>

<p>La semana arranca con las contrarreloj individuales: la femenina a las 15:00 (hora peninsular española) y la masculina a las 18:45, ambas sobre un trazado urbano de 39,9&nbsp;km. El fin de semana de cierre concentra las dos pruebas en línea, con salida a las 15:00 en ambos casos: la femenina el sábado 26 de septiembre (180,1&nbsp;km, 2.570&nbsp;m de desnivel) y la masculina el domingo 27 (273,7&nbsp;km, más de 3.800&nbsp;m de desnivel), ambas sobre el mismo circuito final de Mont Royal.</p>

<p>En España, Teledeporte y RTVE Play ofrecerán cobertura gratuita, mientras que Eurosport y HBO Max completan la señal desde la primera contrarreloj hasta la entrega del último maillot arcoíris.</p>

<p>La selección española masculina llega encabezada por Enric Mas, campeón de la Vuelta a España hace apenas unos días, y Juan Ayuso — aunque la participación de este último sigue en duda tras su caída en el GP de Quebec. En el equipo femenino, las referencias son Mavi García y Paula Blasi.</p>

<p>La gran ausencia sigue siendo Tadej Pogačar, que confirmó el fin de su temporada tras la fractura sufrida en la Vuelta y no defenderá el maillot arcoíris que viene ganando las dos últimas ediciones.</p>
`.trim()

export async function publishWorldsScheduleArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [mas, ayuso, garcia, blasi, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'enric-mas' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'juan-ayuso' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'mavi-garcia' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'paula-blasi' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [mas?.id, ayuso?.id, garcia?.id, blasi?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureHeroImage('mundial-ruta-2026-horarios-selecciones', {
    title: 'Horarios del Mundial',
    label: 'Última hora',
    riders: [
      ...(mas ? [{ name: 'Enric Mas', team: 'movistar-team' }] : []),
      ...(ayuso ? [{ name: 'Juan Ayuso', team: 'uae-team-emirates-xrg' }] : []),
    ],
  })

  const baseFields = {
    title: 'Horarios oficiales del Mundial de Montreal: así se reparten los siete días de arcoíris',
    subtitle: 'La crono empieza el 20 de septiembre; España llega con Enric Mas y Juan Ayuso en el equipo masculino, Mavi García y Paula Blasi en el femenino',
    excerpt:
      'La UCI confirmó los horarios del Mundial de Montreal (20-27 de septiembre): contrarreloj entre semana, líneas el fin de semana sobre el circuito de Mont Royal. España llega con Enric Mas, Juan Ayuso, Mavi García y Paula Blasi.',
    content: worldsScheduleContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.eurosport.es/ciclismo/campeonatos-mundiales/2026/montreal-mundial-2026-ciclismo-ruta-recorrido-favoritos-fecha-horario-donde-ver-tv-streaming-online-gratis-hoy_sto23336356/story.shtml',
      'https://www.ciclo21.com/mundial-montreal-2026-perfiles-selecciones-septiembre11/',
    ]),
    sourceNames: toJsonField(['Eurosport España', 'Ciclo21']),
    seoTitle: 'Horarios del Mundial de ruta 2026 en Montreal',
    seoDescription:
      'Horarios oficiales del Mundial de ruta 2026 en Montreal (20-27 de septiembre): contrarrelojes, líneas y selecciones de España.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'mundial-ruta-2026-horarios-selecciones' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'mundial-ruta-2026-horarios-selecciones',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}
