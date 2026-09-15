/**
 * Tanda de 10 artículos reales (2026-09-15/16) — uno o dos por sección,
 * con imagen propia generada por el usuario con IA para cada uno (ver
 * ensureCustomHeroImage). Reutiliza los helpers de uci-import.ts en vez
 * de duplicarlos. Cada función documenta sus fuentes reales en un
 * comentario justo antes de la función.
 */
import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'
import { ensureHeroImage, ensureCustomHeroImage } from './uci-import'

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

  const heroImageId = await ensureCustomHeroImage('mundial-ruta-2026-horarios-selecciones', {
    url: '/images/headers/worlds-schedule-cover.jpg',
    altText: 'Horarios oficiales del Mundial de Montreal: así se reparten los siete días de arcoíris',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

// ————————————————————————————————————————————————————————————
// 2. Última Hora — Van der Poel se salta Quebec/Montreal por Luxemburgo
// ————————————————————————————————————————————————————————————

const vdpLuxembourgContent = `
<p>Mientras la mayoría de sus rivales al maillot arcoíris —Remco Evenepoel, Isaac del Toro, Wout van Aert, Mattias Skjelmose— usaron el Grand Prix Cycliste de Québec y el de Montréal como último examen sobre un circuito muy similar al del Mundial, Mathieu van der Poel (Alpecin-Premier Tech) tomó la decisión contraria: se salta por completo las citas canadienses y en su lugar liderará a su equipo en el Tour de Luxemburgo, del 16 al 20 de septiembre.</p>

<p>La carrera, de cinco etapas, termina justo una semana antes de la prueba en línea masculina en Montreal (27 de septiembre), dejándole el margen de recuperación exacto que suele buscar antes de una gran cita.</p>

<p>No es una apuesta improvisada: es la misma fórmula que ya usó en 2024, cuando ganó la primera etapa del Tour de Luxemburgo, terminó segundo en la general por detrás de Antonio Tiberi, y semanas después subió al podio del Mundial de ruta. Repetir el guion sugiere que, para Van der Poel, la preparación en Luxemburgo pesa más que rodar sobre el trazado real de la carrera que quiere ganar.</p>

<p>El objetivo declarado es claro: un segundo maillot arcoíris, después del que ya ganó en 2023. Con Evenepoel y Del Toro llegando a Montreal con las piernas ya puestas a prueba en el mismo circuito de Mont Royal, el contraste de estrategias añade una capa extra de incertidumbre a una carrera que, sin Pogačar en la salida, ya se presentaba especialmente abierta.</p>
`.trim()

export async function publishVdpLuxembourgArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [vdp, team] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])

  const heroImageId = await ensureHeroImage('van-der-poel-tour-luxemburgo-mundial-2026', {
    title: 'Van der Poel evita Canadá',
    label: 'Última hora',
    riders: vdp ? [{ name: 'Mathieu van der Poel', team: 'alpecin-premier-tech' }] : [],
  })

  const baseFields = {
    title: 'Van der Poel evita Canadá y apuesta de nuevo por Luxemburgo antes del Mundial',
    subtitle: 'El neerlandés repite la fórmula de 2024 (podio en el Mundial tras el Tour de Luxemburgo) mientras sus rivales rodaron en Quebec y Montreal',
    excerpt:
      'Mathieu van der Poel se salta el GP de Quebec y el de Montreal y en su lugar liderará el Tour de Luxemburgo (16-20 de septiembre) como preparación para el Mundial de ruta, repitiendo la fórmula que ya le funcionó en 2024.',
    content: vdpLuxembourgContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/teams-riders/mathieu-van-der-poel-skips-canadian-one-day-races-returns-to-tour-de-luxembourg-to-build-for-uci-road-world-championships-in-montreal/',
      'https://www.domestiquecycling.com/en/news/van-der-poel-adds-tour-de-luxembourg-to-intriguing-worlds-preparation/',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Domestique Cycling']),
    seoTitle: 'Van der Poel se prepara para el Mundial en Luxemburgo',
    seoDescription:
      'Mathieu van der Poel se salta las carreras canadienses previas al Mundial y opta por el Tour de Luxemburgo, repitiendo la fórmula que le dio el podio en 2024.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'van-der-poel-tour-luxemburgo-mundial-2026' },
    update: {
      ...baseFields,
      riders: vdp ? { set: [{ id: vdp.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
    },
    create: {
      slug: 'van-der-poel-tour-luxemburgo-mundial-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: vdp ? { connect: [{ id: vdp.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 3. Grand Tours — efeméride: Vuelta 2016, etapa 15, Quintana vs. Froome
// ————————————————————————————————————————————————————————————

const quintanaFroomeContent = `
<p>Con las tres grandes vueltas del año ya en el archivo, toca mirar hacia atrás: pocas etapas resumen tan bien lo que puede hacer un ataque bien planeado como la etapa 15 de la Vuelta a España 2016, con final en Formigal.</p>

<p>Chris Froome (Team Sky) llegaba a esa jornada con apenas 54 segundos de renta sobre Nairo Quintana (Movistar) en la general. Sobre el papel, una etapa de 118,5&nbsp;km no parecía terreno para grandes sorpresas. Pero Alberto Contador (Tinkoff) tenía otros planes: atacó prácticamente desde el kilómetro 0, en una maniobra tan audaz que pilló a todo el pelotón — y especialmente al Team Sky — completamente descolocado.</p>

<p>Quintana no dudó ni un segundo: se sumó de inmediato a la fuga de Contador. El resultado fue que Froome se quedó aislado, sin apoyo de equipo, obligado a perseguir con sus propias piernas mientras dos de sus rivales directos rodaban juntos por delante. La etapa la acabó ganando Gianluca Brambilla (Etixx-QuickStep), que llegó con ventaja al sprint del grupo de cabeza, pero lo verdaderamente decisivo pasó en la clasificación general.</p>

<p>Quintana cruzó la meta segundo, a rueda de Brambilla, sumando seis segundos de bonificación. Entre el propio ataque y esa bonificación, el colombiano le endosó 2 minutos y 37 segundos a Froome en un solo día de carrera. Su ventaja pasó de 54 segundos a 3 minutos y 37 segundos — una diferencia que, con apenas unas etapas de montaña por delante, resultaría prácticamente definitiva.</p>

<p>Quintana selló esa Vuelta como campeón. Casi una década después, la etapa de Formigal sigue siendo un caso de estudio de cómo una fuga bien sincronizada, más que la pura potencia en la subida final, puede decidir una gran vuelta antes de que empiece la etapa reina.</p>
`.trim()

export async function publishQuintanaFroomeArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'grand-tours' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const quintana = await prisma.rider.findUnique({ where: { slug: 'nairo-quintana' }, select: { id: true } })

  const heroImageId = await ensureHeroImage('efemeride-vuelta-2016-quintana-froome-formigal', {
    title: 'Vuelta 2016: Quintana vs. Froome',
    label: 'Grand Tours · Efeméride',
    riders: quintana ? [{ name: 'Nairo Quintana' }] : [],
  })

  const baseFields = {
    title: 'La etapa que le dio la Vuelta a Nairo Quintana: cuando Contador y él desarmaron a Froome en Formigal',
    subtitle: 'Vuelta a España 2016, etapa 15: un ataque desde el kilómetro 0 aisló al líder británico y le costó 2:37 en un solo día',
    excerpt:
      'Repasamos la etapa 15 de la Vuelta 2016: el ataque de Contador desde el km 0, Quintana sumándose de inmediato, y los 2:37 que le costó a un Froome aislado — la jugada que decidió esa Vuelta.',
    content: quintanaFroomeContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/races/vuelta-a-espana-2016/stage-15/results/',
      'https://www.si.com/cycling/2016/08/29/ap-cyc-spanish-vuelta',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Sports Illustrated']),
    seoTitle: 'Efeméride: Quintana vs. Froome, Vuelta 2016 etapa 15',
    seoDescription:
      'La etapa 15 de la Vuelta a España 2016 en Formigal: el ataque que le costó 2:37 a Chris Froome y le dio la Vuelta a Nairo Quintana.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'efemeride-vuelta-2016-quintana-froome-formigal' },
    update: { ...baseFields, riders: quintana ? { set: [{ id: quintana.id }] } : undefined },
    create: {
      slug: 'efemeride-vuelta-2016-quintana-froome-formigal',
      ...baseFields,
      publishedAt: new Date(),
      riders: quintana ? { connect: [{ id: quintana.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}
