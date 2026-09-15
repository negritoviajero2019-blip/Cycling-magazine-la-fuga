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

  const heroImageId = await ensureCustomHeroImage('van-der-poel-tour-luxemburgo-mundial-2026', {
    url: '/images/headers/vdp-luxembourg-cover.jpg',
    altText: 'Van der Poel evita Canadá y apuesta de nuevo por Luxemburgo antes del Mundial',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

  const heroImageId = await ensureCustomHeroImage('efemeride-vuelta-2016-quintana-froome-formigal', {
    url: '/images/headers/quintana-froome-cover.jpg',
    altText: 'La etapa que le dio la Vuelta a Nairo Quintana: cuando Contador y él desarmaron a Froome en Formigal',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

  const heroImageId = await ensureCustomHeroImage('il-lombardia-2026-previa-sin-pogacar', {
    url: '/images/headers/lombardia-cover.jpg',
    altText: 'Sin Pogačar, quién hereda el trono de Il Lombardia',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

  const heroImageId = await ensureCustomHeroImage('uci-elimina-ranking-womens-worldtour-2026', {
    url: '/images/headers/womens-ranking-cover.jpg',
    altText: 'Por qué ya no hay un maillot de líder del Women’s WorldTour',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

// ————————————————————————————————————————————————————————————
// 6. MTB y Gravel — previa Copa del Mundo Soldier Hollow + Whistler
// ————————————————————————————————————————————————————————————

const mtbWorldCupPreviewContent = `
<p>Con el Mundial de MTB de Val di Sole ya en los libros, la Copa del Mundo retoma su calendario cruzando el Atlántico para las dos últimas citas de la temporada, ambas en Norteamérica y con un cambio de registro completo entre una y otra.</p>

<p>La primera parada es Soldier Hollow, en Midway, Utah (19-20 de septiembre), sede olímpica de esquí nórdico en los Juegos de Invierno de 2002 y candidata a repetir protagonismo en 2034. El fin de semana reúne cross-country y short track sobre un trazado de valles y colinas suaves, pensado tanto para el público general como para el pelotón élite — un cierre relativamente accesible para la temporada de XCO.</p>

<p>Una semana después, el registro cambia por completo: Whistler, en la Columbia Británica de Canadá (25-27 de septiembre), acoge la última cita de descenso del año, sobre uno de los trazados más exigentes y reconocidos del circuito internacional de MTB.</p>

<p>Ninguna de las dos rondas reparte ya el maillot arcoíris — eso ya se decidió en Val di Sole a finales de agosto — pero sí cierran la clasificación general de la Copa del Mundo 2026, el otro gran objetivo de la temporada para quienes no llegaron a subirse al podio del Mundial. Para el aficionado que sigue MTB y gravel desde La Fuga, es la última oportunidad del año de ver a los mejores del planeta antes de que el calendario de superficie mixta se cierre en octubre con el Mundial de Gravel en Australia.</p>
`.trim()

export async function publishMtbWorldCupPreviewArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'mtb-gravel' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [soldierHollow, whistler] = await Promise.all([
    prisma.race.findUnique({ where: { slug: 'uci-mtb-world-cup-soldier-hollow-2026' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-mtb-world-cup-whistler-2026' }, select: { id: true } }),
  ])
  const raceIds = [soldierHollow?.id, whistler?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureHeroImage('previa-copa-mundo-mtb-soldier-hollow-whistler-2026', {
    title: 'Cierre de temporada MTB',
    label: 'MTB y Gravel',
  })

  const baseFields = {
    title: 'De Utah a Whistler: así cierra la Copa del Mundo de MTB su temporada 2026',
    subtitle: 'Soldier Hollow reparte cross-country y short track el 19-20 de septiembre; Whistler cierra con la última cita de descenso del año una semana después',
    excerpt:
      'La Copa del Mundo de MTB cierra 2026 con dos citas en Norteamérica: cross-country y short track en Soldier Hollow (19-20 sept) y descenso en Whistler (25-27 sept), ya sin el maillot arcoíris en juego.',
    content: mtbWorldCupPreviewContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.ucimtbworldseries.com/events/soldier-hollow-2026',
      'https://en.wikipedia.org/wiki/2026_UCI_Mountain_Bike_World_Cup',
    ]),
    sourceNames: toJsonField(['UCI Mountain Bike World Series', 'Wikipedia']),
    seoTitle: 'Copa del Mundo MTB 2026: Soldier Hollow y Whistler',
    seoDescription:
      'Previa de las dos últimas citas de la Copa del Mundo de MTB 2026: Soldier Hollow (cross-country) y Whistler (descenso).',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'previa-copa-mundo-mtb-soldier-hollow-whistler-2026' },
    update: { ...baseFields, races: raceIds.length ? { set: raceIds.map((id) => ({ id })) } : undefined },
    create: {
      slug: 'previa-copa-mundo-mtb-soldier-hollow-whistler-2026',
      ...baseFields,
      publishedAt: new Date(),
      races: raceIds.length ? { connect: raceIds.map((id) => ({ id })) } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 7. MTB y Gravel — previa Mundial de Gravel 2026 en Nannup, Australia
// ————————————————————————————————————————————————————————————

const gravelWorldsPreviewContent = `
<p>Por primera vez en su historia, el Mundial de Gravel de la UCI sale de sus escenarios habituales y aterriza en el hemisferio sur: Nannup, en Australia Occidental, acoge la quinta edición los días 10 y 11 de octubre, en lo que también es la primera vez que la propia sede sirvió como carrera clasificatoria a principios de temporada.</p>

<p>El recorrido, que sale y termina en el propio pueblo de Nannup, está basado en la carrera SEVEN — una prueba de gravel disputada desde 2018 y presente en todas las ediciones del Gravel World Series. Los hombres afrontarán 140,7&nbsp;km y las mujeres 123,1&nbsp;km, con más del 80% del trazado sobre gravel y solo tramos cortos de asfalto, incluido un arranque ondulado de 9&nbsp;km que el pelotón volverá a pisar a falta de 36&nbsp;km para meta.</p>

<p>Lo que de verdad define esta edición es el perfil: nada de puertos largos, sino una sucesión constante de rampas de 1 a 3,5&nbsp;km con pendientes que llegan al 20%, una detrás de otra, sin apenas tramos llanos para recuperar. Para las categorías de edad más veteranas habrá una distancia reducida de 90&nbsp;km, que aun así conserva unos 2.000&nbsp;m de desnivel positivo.</p>

<p>La cita llega al final de una temporada en la que el propio Gravel World Series ofreció un récord de más de 45 carreras clasificatorias en todo el planeta — la prueba más clara de que el gravel, disciplina todavía joven dentro del paraguas de la UCI, sigue creciendo a un ritmo que ninguna otra modalidad del ciclismo está replicando ahora mismo.</p>
`.trim()

export async function publishGravelWorldsPreviewArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'mtb-gravel' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUnique({ where: { slug: 'uci-gravel-world-championships-2026' }, select: { id: true } })

  const heroImageId = await ensureHeroImage('previa-mundial-gravel-2026-nannup', {
    title: 'Mundial de Gravel en Australia',
    label: 'MTB y Gravel',
  })

  const baseFields = {
    title: 'El Mundial de Gravel se va a Australia: subidas al 20% y ni un metro de descanso',
    subtitle: 'Nannup, Australia Occidental, acoge por primera vez el Mundial de Gravel (10-11 de octubre) con 140,7 km para los hombres y 123,1 km para las mujeres',
    excerpt:
      'El Mundial de Gravel 2026 se corre por primera vez fuera de sus sedes habituales: Nannup, Australia (10-11 de octubre), con un recorrido de rampas constantes de hasta el 20% basado en la carrera SEVEN.',
    content: gravelWorldsPreviewContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/2026_UCI_Gravel_World_Championships',
      'https://www.cyclingnews.com/pro-cycling/racing/uci-gravel-world-championships-2026-route/',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'Cyclingnews']),
    seoTitle: 'Mundial de Gravel 2026 en Nannup: recorrido',
    seoDescription:
      'Previa del Mundial de Gravel 2026 en Nannup, Australia (10-11 de octubre): recorrido, distancias y perfil de un trazado con rampas de hasta el 20%.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'previa-mundial-gravel-2026-nannup' },
    update: { ...baseFields, races: race ? { set: [{ id: race.id }] } : undefined },
    create: {
      slug: 'previa-mundial-gravel-2026-nannup',
      ...baseFields,
      publishedAt: new Date(),
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 8. Latinos — Buitrago rey de la montaña, Tejada top-10 y su fichaje por Ineos
// ————————————————————————————————————————————————————————————

const buitragoTejadaContent = `
<p>Entre los muchos colombianos que tomaron la salida en la Vuelta a España 2026, dos terminaron la ronda con motivos reales para celebrar — cada uno a su manera. Santiago Buitrago (Team Bahrain Victorious) se coronó campeón de la montaña, y Harold Tejada (XDS Astana Team) cerró su etapa en el equipo kazajo con el mejor resultado posible: un top 10 en la general.</p>

<p>Buitrago llegó a la última semana peleando la clasificación de la montaña de tú a tú, y en la etapa 19 —la reina del sur, ganada en solitario por Eddie Dunbar— llegó segundo, a rueda del propio Dunbar, sumando los puntos que terminarían de sentenciar el maillot de la montaña a su favor. Es el segundo gran resultado de su carrera en una grande, después de sus victorias de etapa previas, y confirma a Buitrago como una referencia fija cuando la carretera se empina.</p>

<p>Tejada, por su parte, completó una Vuelta sólida y regular que lo dejó en la décima posición final de la general — el mejor colombiano de la clasificación general y una manera inmejorable de despedirse del Astana, equipo en el que corre desde hace varias temporadas. El anuncio ya es oficial: a partir de 2027, Tejada correrá para el Netcompany Ineos, un salto a un equipo con más recursos en las grandes vueltas y, presumiblemente, más responsabilidad de liderazgo o de escudero de lujo en la montaña.</p>

<p>Dos historias distintas, pero con un denominador común: ambas confirman que la generación colombiana que sucede a Nairo Quintana y Rigoberto Urán sigue teniendo presencia real en la pelea de las grandes vueltas, no solo como gregarios de montaña sino como protagonistas de clasificaciones secundarias y generales.</p>
`.trim()

export async function publishBuitragoTejadaArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [buitrago, tejada, bahrain, astana, ineos, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'santiago-buitrago' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'harold-tejada' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'team-bahrain-victorious' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'xds-astana-team' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'netcompany-ineos' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'vuelta-a-espana-2026' }, select: { id: true } }),
  ])
  const riderIds = [buitrago?.id, tejada?.id].filter((id): id is number => id !== undefined)
  const teamIds = [bahrain?.id, astana?.id, ineos?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureHeroImage('buitrago-tejada-vuelta-espana-2026-colombianos', {
    title: 'Colombianos en la Vuelta',
    label: 'Latinos',
    riders: [
      ...(buitrago ? [{ name: 'Santiago Buitrago', team: 'team-bahrain-victorious' }] : []),
      ...(tejada ? [{ name: 'Harold Tejada', team: 'xds-astana-team' }] : []),
    ],
  })

  const baseFields = {
    title: 'Buitrago se corona rey de la montaña y Tejada cierra su etapa en Astana con un top 10',
    subtitle: 'Los dos colombianos protagonizaron la Vuelta a España 2026: Buitrago ganó la clasificación de la montaña y Tejada terminó décimo antes de fichar por el Ineos en 2027',
    excerpt:
      'Santiago Buitrago se coronó rey de la montaña en la Vuelta a España 2026 y Harold Tejada cerró su etapa en el Astana con un top 10 en la general, antes de su fichaje confirmado por el Netcompany Ineos para 2027.',
    content: buitragoTejadaContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.eltiempo.com/deportes/ciclismo/clasificaciones-de-la-vuelta-a-espana-2026-harold-tejada-sigue-en-el-top-10-y-santiago-buitrago-cerca-de-ganar-la-montana-3585370',
      'https://www.infobae.com/colombia/deportes/2026/09/13/santiago-buitrago-campeon-de-la-montana-en-la-vuelta-a-espana-hora-y-donde-ver-la-coronacion-del-colombiano-en-la-etapa-21/',
    ]),
    sourceNames: toJsonField(['El Tiempo', 'Infobae Colombia']),
    seoTitle: 'Buitrago y Tejada: los colombianos en la Vuelta 2026',
    seoDescription:
      'Santiago Buitrago se coronó rey de la montaña en la Vuelta a España 2026 y Harold Tejada terminó décimo antes de su fichaje por el Ineos en 2027.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'buitrago-tejada-vuelta-espana-2026-colombianos' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'buitrago-tejada-vuelta-espana-2026-colombianos',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 9. Tecnología — Specialized Tarmac SL9
// ————————————————————————————————————————————————————————————

const tarmacSl9Content = `
<p>Specialized presentó este año la nueva generación de su modelo insignia, la Tarmac SL9, y la primera sorpresa es lo que NO cambió: el cuadro pesa 687 gramos, dos gramos más que el de la SL8 anterior. En una industria donde cada lanzamiento suele presumir de gramos de menos, Specialized decidió apostar por otra prioridad.</p>

<p>Esa prioridad es la aerodinámica. La marca asegura que la SL9 es 4 vatios más eficiente a 45&nbsp;km/h que su predecesora, una mejora que no viene de tubos aero profundos sino de una reducción del 10% en el área frontal de la bicicleta, manteniendo la silueta clásica de la Tarmac. Uno de los elementos clave es el "Win Fin", una pieza de material añadida al tubo del sillín que cierra el hueco con la rueda trasera.</p>

<p>Traducido a términos de carrera: Specialized calcula que esos 4 vatios equivalen a un ahorro de 28 segundos en una etapa de 100&nbsp;km al ritmo de una gran vuelta. Las versiones completas de la S-Works Tarmac SL9 bajan hasta los 6,5&nbsp;kg, y una configuración orientada a la montaña con componentes Alpinist llega a los 6,1&nbsp;kg.</p>

<p>Detrás del diseño hay un cambio de filosofía que Specialized bautizó como "Time to Finish": en vez de optimizar peso, aerodinámica o rigidez por separado, la marca simula el efecto conjunto de las tres variables —además de la calidad de marcha— sobre etapas reales del WorldTour y los Monumentos, para decidir qué compromiso ofrece la bicicleta más rápida de verdad, no solo la más ligera o la más aerodinámica sobre el papel.</p>
`.trim()

export async function publishTarmacSl9Article() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'tecnologia' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const heroImageId = await ensureHeroImage('specialized-tarmac-sl9-lanzamiento-2026', {
    title: 'Specialized Tarmac SL9',
    label: 'Tecnología',
  })

  const baseFields = {
    title: 'La Specialized Tarmac SL9 no es más ligera, pero ahorra 28 segundos en 100 km',
    subtitle: 'El nuevo buque insignia de Specialized prioriza la aerodinámica sobre el peso: 4 vatios menos de resistencia a 45 km/h gracias a un 10% menos de área frontal',
    excerpt:
      'La Specialized Tarmac SL9 pesa dos gramos más que su antecesora, pero es 4 vatios más aerodinámica a 45 km/h — un ahorro calculado en 28 segundos sobre 100 km de etapa.',
    content: tarmacSl9Content,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.bikeradar.com/news/specialized-tarmac-sl9-2026',
      'https://www.cyclist.co.uk/news/specialized-tarmac-sl9',
    ]),
    sourceNames: toJsonField(['BikeRadar', 'Cyclist']),
    seoTitle: 'Specialized Tarmac SL9: lo que cambió en 2026',
    seoDescription:
      'La nueva Specialized Tarmac SL9 pesa lo mismo que su antecesora pero es 4 vatios más aerodinámica a 45 km/h, un ahorro de 28 segundos en 100 km de etapa.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'specialized-tarmac-sl9-lanzamiento-2026' },
    update: baseFields,
    create: { slug: 'specialized-tarmac-sl9-lanzamiento-2026', ...baseFields, publishedAt: new Date() },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// 10. Análisis — favoritos reales al Mundial masculino
// ————————————————————————————————————————————————————————————

const worldsFavoritesAnalysisContent = `
<p>Con Tadej Pogačar confirmado fuera, el Mundial de ruta masculino 2026 se presenta como uno de los más abiertos de la última década. Repasamos, con la forma reciente de cada uno como guía, quién llega con más argumentos para llevarse el arcoíris en Montreal el 27 de septiembre.</p>

<p><strong>Remco Evenepoel</strong> encabeza la mayoría de las quinielas. Llega lanzado tras ganar el Grand Prix Cycliste de Québec, la última gran prueba antes del Mundial, y su perfil —capaz de atacar de lejos y de defenderse en la crono— encaja bien con un circuito de Mont Royal que combina puertos cortos y explosivos con tramos técnicos.</p>

<p><strong>Isaac del Toro</strong> es la otra gran referencia de forma: ganó el Grand Prix Cycliste de Montréal apenas unos días antes del Mundial, en el mismo circuito de Mont Royal que decidirá el título, superando a Paul Seixas en un ataque a falta de 150 metros. Pocas veces un candidato llega a un Mundial con un ensayo general tan literal y tan reciente.</p>

<p><strong>Mathieu van der Poel</strong> rompe el patrón: en vez de probar el circuito real, optó por el Tour de Luxemburgo como preparación, repitiendo la fórmula que ya le dio un podio en 2024. Busca su segundo maillot arcoíris, después del de 2023, y su capacidad para decidir carreras explosivas en el último kilómetro lo mantiene entre los máximos favoritos pese a no haber pisado Mont Royal en competición esta temporada.</p>

<p><strong>Wout van Aert y Mattias Skjelmose</strong> completan el grupo de cabeza de las quinielas — el belga con el bagaje de una temporada completa de clásicas duras a sus espaldas, y el danés como el nombre que más ha crecido esta última campaña dentro de ese perfil de corredor explosivo y versátil que exige el circuito de Montreal.</p>

<p>Con dos formas de llegar —el ensayo directo en Mont Royal de Evenepoel y Del Toro, frente a la apuesta indirecta de Van der Poel— el Mundial 2026 promete una de las lecturas tácticas más interesantes de los últimos años, precisamente por la ausencia del nombre que llevaba dos ediciones resolviéndolo todo por la vía rápida.</p>
`.trim()

export async function publishWorldsFavoritesAnalysisArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'analisis' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const riderSlugs = ['remco-evenepoel', 'isaac-del-toro', 'mathieu-van-der-poel', 'wout-van-aert', 'mattias-skjelmose']
  const riders = await prisma.rider.findMany({ where: { slug: { in: riderSlugs } }, select: { id: true, slug: true, name: true } })
  const race = await prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } })

  const heroImageId = await ensureHeroImage('favoritos-mundial-ruta-masculino-2026', {
    title: 'Favoritos al Mundial',
    label: 'Análisis',
    riders: riders.slice(0, 4).map((r) => ({ name: r.name })),
  })

  const baseFields = {
    title: 'Evenepoel, Del Toro y el enigma Van der Poel: quién puede ganar el Mundial sin Pogačar',
    subtitle: 'Analizamos la forma reciente de los cinco grandes favoritos al Mundial de ruta masculino, a una semana de la salida en Montreal',
    excerpt:
      'Con Pogačar confirmado fuera, repasamos a los cinco grandes favoritos al Mundial de ruta 2026: Evenepoel, Del Toro, Van der Poel, Van Aert y Skjelmose, con su forma reciente como guía.',
    content: worldsFavoritesAnalysisContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.eurosport.es/ciclismo/campeonatos-mundiales/2026/montreal-mundial-2026-ciclismo-ruta-recorrido-favoritos-fecha-horario-donde-ver-tv-streaming-online-gratis-hoy_sto23336356/story.shtml',
      'https://ciclismoaldia.es/ciclismo/los-diez-grandes-favoritos-a-los-mundiales-del-toro-evenepoel-seixas-van-aert-van-der-poel-y-mas-se-presentan-en-ausencia-de-pogacar',
    ]),
    sourceNames: toJsonField(['Eurosport España', 'Ciclismo al Día']),
    seoTitle: 'Favoritos al Mundial de ruta 2026: análisis',
    seoDescription:
      'Análisis de los favoritos al Mundial de ruta masculino 2026 sin Pogačar: Evenepoel, Del Toro, Van der Poel, Van Aert y Skjelmose.',
    readingTime: 4,
  }

  const riderIds = riders.map((r) => r.id)

  const article = await prisma.article.upsert({
    where: { slug: 'favoritos-mundial-ruta-masculino-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'favoritos-mundial-ruta-masculino-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}
