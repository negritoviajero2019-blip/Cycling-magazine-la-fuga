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

// ————————————————————————————————————————————————————————————
// 4. Clásicas — previa de Il Lombardia 2026
// ————————————————————————————————————————————————————————————

const lombardiaPreviewContent = `
<p>El 10 de octubre, Lombardía cierra el calendario de los cinco Monumentos con la 120ª edición de Il Lombardia, la "carrera de las hojas caídas" — y por primera vez en cinco años, sin el nombre que la ha dominado por completo.</p>

<p>Tadej Pogačar comparte con Fausto Coppi el récord de victorias en esta carrera, con cinco triunfos cada uno. El año pasado el esloveno atacó a 36&nbsp;km de meta y llegó en solitario para firmar su quinta victoria consecutiva, igualando la marca histórica de Coppi. Pero tras confirmar el fin de su temporada por la fractura sufrida en la Vuelta a España, Pogačar no estará en la salida — y con él desaparece también la posibilidad de que este año alguien supere ese récord.</p>

<p>El recorrido exacto de esta edición todavía no se ha hecho público, aunque Il Lombardia mantiene año tras año su carácter: un final exigente por las estribaciones prealpinas de Lombardía, con los muros que han decidido la carrera en las últimas ediciones — Colle Brianza, la Culmine di San Fermo y, sobre todo, el tramo final hacia Como.</p>

<p>Con el trono vacante, la última cita grande del calendario masculino antes del cierre de temporada queda abierta como pocas veces en el último lustro. La ausencia de Pogačar reabre exactamente el mismo debate que ya se planteó de cara al Mundial de Montreal: sin el esloveno, la lista de candidatos se amplía considerablemente, aunque todavía es pronto para una lista de favoritos — el propio recorrido, cuando se publique, marcará quién entra y quién no en las quinielas.</p>
`.trim()

export async function publishLombardiaPreviewArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'clasicas' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const heroImageId = await ensureHeroImage('il-lombardia-2026-previa-sin-pogacar', {
    title: 'Il Lombardia sin Pogačar',
    label: 'Clásicas',
  })

  const baseFields = {
    title: 'Sin Pogačar, quién hereda el trono de Il Lombardia',
    subtitle: 'El esloveno comparte el récord de victorias con Coppi (cinco) pero no estará el 10 de octubre — el último Monumento del año queda con el trono vacante',
    excerpt:
      'Il Lombardia 2026 (10 de octubre) se corre sin Tadej Pogačar, que comparte con Fausto Coppi el récord de cinco victorias en la carrera. Su ausencia reabre el último Monumento de la temporada.',
    content: lombardiaPreviewContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.ilombardia.it/en/',
      'https://cyclingfantasy.cc/en/race/il-lombardia/2026/route-and-favourites',
    ]),
    sourceNames: toJsonField(['Il Lombardia (oficial)', 'Cycling Fantasy']),
    seoTitle: 'Il Lombardia 2026: previa sin Pogačar',
    seoDescription:
      'Previa de Il Lombardia 2026 (10 de octubre): Tadej Pogačar, que comparte el récord de victorias con Fausto Coppi, no estará en la salida tras el fin de su temporada.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'il-lombardia-2026-previa-sin-pogacar' },
    update: baseFields,
    create: { slug: 'il-lombardia-2026-previa-sin-pogacar', ...baseFields, publishedAt: new Date() },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 5. Ciclismo Femenino — la UCI eliminó el ranking propio del Women's WorldTour
// ————————————————————————————————————————————————————————————

const womensRankingChangeContent = `
<p>Si este año te ha costado encontrar una clasificación general del Women's WorldTour, no es que te la hayas perdido: ya no existe. Desde 2025, la UCI eliminó de su reglamento de ruta la clasificación propia de la competición — el Women's WorldTour dejó de ser, formalmente, una carrera de clasificación por puntos con un maillot de líder al final de la temporada.</p>

<p>En su lugar, todo el peso recae ahora en el ranking mundial UCI de ruta femenino, un sistema que ya existía en paralelo pero que ahora es la referencia oficial única. La diferencia no es solo de nombre: el ranking mundial también reparte puntos por carreras que quedan fuera del calendario WorldTour, así que una corredora puede sumar posiciones compitiendo en pruebas que antes no contaban para nada a nivel de "clasificación general de la temporada".</p>

<p>Para 2026 la UCI afinó todavía más el sistema: las carreras por etapas de una semana y los monumentos reparten más puntos que las pruebas de un día o las etapas sueltas de menor categoría. El calendario 2026 tiene 27 pruebas, con La Vuelta Femenina, el Giro d'Italia Women y el Tour de Francia Femmes como las tres grandes carreras por etapas que más pesan en ese reparto.</p>

<p>¿Qué significa esto en la práctica para quien sigue el ciclismo femenino? Que la vieja pregunta de "¿quién lidera el WorldTour ahora mismo?" ya no tiene una respuesta directa — hay que mirar el ranking mundial, que es más amplio, más lento de leer de un vistazo, pero también más representativo de una temporada completa disputada en más de un continente.</p>
`.trim()

export async function publishWomensRankingChangeArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ciclismo-femenino' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const heroImageId = await ensureHeroImage('uci-elimina-ranking-womens-worldtour-2026', {
    title: 'Adiós al ranking del WorldTour',
    label: 'Ciclismo femenino',
  })

  const baseFields = {
    title: 'Por qué ya no hay un maillot de líder del Women’s WorldTour',
    subtitle: 'Desde 2025 la UCI eliminó la clasificación propia de la competición: todo se mide ahora en el ranking mundial UCI, que también puntúa carreras fuera del calendario WorldTour',
    excerpt:
      'La UCI eliminó desde 2025 la clasificación propia del Women’s WorldTour. Explicamos cómo funciona ahora el ranking mundial UCI que la sustituyó, y por qué reparte más puntos a las grandes rondas en 2026.',
    content: womensRankingChangeContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/UCI_Women%27s_World_Tour',
      'https://www.uci.org/article/uci-womens-worldtour-a-decisive-year-around-the-globe/4Z53e7FRHjL7sQQTUPDOTD',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'UCI (oficial)']),
    seoTitle: 'Por qué no hay ranking del Women’s WorldTour',
    seoDescription:
      'La UCI eliminó desde 2025 la clasificación propia del Women’s WorldTour. Explicamos el ranking mundial UCI que la sustituyó de cara a 2026.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'uci-elimina-ranking-womens-worldtour-2026' },
    update: baseFields,
    create: { slug: 'uci-elimina-ranking-womens-worldtour-2026', ...baseFields, publishedAt: new Date() },
  })

  return { slug: article.slug }
}
