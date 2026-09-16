/**
 * Artículos publicados uno por uno a partir de la lista diaria de
 * noticias relevantes (ver memoria de sesión: cada día se investiga y
 * propone una lista de 10, y de ahí se decide qué se escribe). A
 * diferencia de batch-articles-sept.ts, este archivo no es una tanda
 * cerrada — va creciendo con cada artículo nuevo, uno por función.
 */
import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'
import { ensureHeroImage, ensureCustomHeroImage } from './uci-import'

// ————————————————————————————————————————————————————————————
// Pogačar vuelve a la bici (rodillo), 17 días después de la caída
// Fuentes: Cyclingnews, road.cc, Cycling Weekly, UAE Team Emirates
// (ver sourceUrls). Cita del vídeo de Instagram traducida del inglés
// original ("First time back, collarbone strong, head strong, heart
// rate high, super happy. Let's go!").
// ————————————————————————————————————————————————————————————

const pogacarBackOnBikeContent = `
<p>Diecisiete días después de la caída que le costó el resto de la temporada, Tadej Pogačar (UAE Team Emirates-XRG) volvió a subirse a una bicicleta. Lo hizo en el rodillo, en casa, y lo contó él mismo en un vídeo publicado en Instagram: &laquo;Primera vez de vuelta. La clavícula, fuerte. La cabeza, fuerte. El ritmo cardíaco, alto. Súper feliz. ¡Vamos!&raquo;.</p>

<p>La caída ocurrió el 30 de agosto, en la octava etapa de la Vuelta a España, a unos 32&nbsp;km de meta y poco antes del Puerto de Barx. Pogačar, que rodaba con casi cuatro minutos de ventaja sobre Enric Mas en la general, iba tomando un bidón —así lo recordaría después un compañero de equipo que rodaba justo detrás suyo— cuando, a más de 60&nbsp;km/h, se desvió hacia la derecha dentro del pelotón, al parecer esquivando algo en la carretera. Perdió el control y salió despedido por encima del manillar, golpeándose la cabeza y el hombro contra el asfalto. Llegó a levantarse e intentar seguir, pero no pudo volver a montar: se sentó en el suelo, con cortes y sangre visible en la cara, y tras varios minutos de asistencia médica se quitó el casco y caminó hasta la ambulancia.</p>

<p>En el pelotón no hubo sensación de carrera normal durante varios kilómetros. Sus siete compañeros de UAE Team Emirates-XRG se detuvieron a esperarlo y, cuando quedó claro que su líder no podía continuar, remontaron y completaron la etapa juntos, en silencio, sin pasar por zona de prensa al llegar. &laquo;Estábamos todos un poco en shock de que pasara tan rápido. Tadej es nuestro líder, pero también es nuestro amigo. Es el que nos hace reír en la mesa y el que nos motiva&raquo;, resumió después uno de ellos. Wout van Aert (Visma | Lease a Bike), que rodaba justo a su lado en el momento del golpe, lo describió así: &laquo;Es una sensación extraña. Este día se va a recordar por la caída de Tadej. Fue un golpe duro. Yo iba justo a su lado cuando perdió el control, y solo pude esquivarlo por poco&raquo;.</p>

<p>El parte médico confirmó una conmoción cerebral, una fractura desplazada de la clavícula izquierda, una fractura estable de la vértebra C7 y múltiples abrasiones. La operación de la clavícula tuvo que esperar: mientras la conmoción no estuviera descartada, el equipo médico no autorizaba el quirófano. La intervención llegó finalmente al día siguiente, el 31 de agosto, en el Hospital Universitari Dexeus de Barcelona, y según el parte del equipo &laquo;fue bien&raquo;, con Pogačar en observación varios días más antes de volver a Eslovenia.</p>

<p>Para dimensionar lo inusual del golpe: pese a acumular 12 caídas registradas desde 2014 —incluidas otras aparatosas en Strade Bianche, Milan-San Remo o el Tour de Francia de 2025—, esta fue la primera vez en toda su carrera que Pogačar no terminaba una gran vuelta. Según recordó TNT Sports, era además la primera vez que se retiraba de cualquiera de las 50 carreras por etapas que había empezado hasta ahora. Su último abandono en cualquier tipo de carrera se remontaba a la Lieja-Bastoña-Lieja de 2023, cuando se rompió la muñeca en otra caída y aun así terminó la temporada con normalidad semanas después.</p>

<p>La caída también cambió el desenlace de la Vuelta. Con Pogačar fuera de carrera, Bryan Coquard (Cofidis) se llevó la victoria de etapa por delante de Mads Pedersen y Jordi Meeus, y la general quedó en manos de Enric Mas, que terminaría coronándose campeón días después en Granada —la crónica completa ya está publicada en La Fuga.</p>

<p>Lo que se truncó no era una temporada cualquiera. Antes de la Vuelta, Pogačar sumaba nueve victorias en los primeros tres meses del año, incluida una Milan-San Remo insólita: se cayó en el Cipressa, se levantó, remontó y aun así ganó al sprint a Tom Pidcock tras 298&nbsp;km de carrera. En julio llegó su quinto Tour de Francia, con más de seis minutos de ventaja sobre Remco Evenepoel y cinco victorias de etapa en el camino —la edición más rápida de la historia—, con el que igualó a Jacques Anquetil, Eddy Merckx, Bernard Hinault y Miguel Induráin como los ciclistas con más Tours ganados. Sumó además su victoria de etapa número 26 en la carrera, superando a André Darrigade y André Leducq hasta el cuarto puesto de la lista histórica.</p>

<p>Ese año se apagó de golpe en Xeraco. El propio equipo confirmó que Pogačar no volverá a competir en lo que queda de 2026: se pierde la defensa del maillot arcoíris en el Mundial de Montreal (20-27 de septiembre), el Campeonato de Europa que este año se disputa en su propia Eslovenia, y el último Monumento de la temporada, Il Lombardia, donde compartía con Fausto Coppi el récord de cinco victorias.</p>

<p>Su ausencia deja el Mundial de ruta masculino más abierto de los últimos años, y así lo perciben sus rivales. Remco Evenepoel, que llegó a Canadá tras tres semanas y media de altura en Livigno específicamente pensadas para Montreal, ganó el GP de Quebec pero no pudo seguir los ataques decisivos en el de Montreal, donde acabó quinto — y ya advirtió que el circuito, con la subida de Camilien-Houde (casi 2&nbsp;km al 7,4-8% de media, más larga que el Koppenberg y el Paterberg juntos), favorece a corredores del perfil de Mathieu van der Poel o Wout van Aert. Isaac del Toro, que sí ganó en Montreal y desde entonces aparece como favorito casi por descarte, se mostró cauto tras la carrera: &laquo;No me sentí súper bien el domingo tampoco [...] La sensación no es la que esperaba&raquo;. La Fuga ya repasó a fondo el reparto de favoritos para el 27 de septiembre en un análisis aparte.</p>

<p>En medio de las malas noticias médicas llegó una buena para el futuro: UAE Team Emirates-XRG anunció la ampliación del contrato de Pogačar hasta el final de la temporada 2032, lo que le mantendrá en el equipo hasta bien entrada su treintena. &laquo;Desde el principio, este equipo se ha sentido como mi casa. Hemos crecido juntos a lo largo de los años y compartido momentos increíbles, así que estoy muy feliz de extender mi contrato hasta 2032&raquo;, dijo el corredor en el comunicado oficial. &laquo;Todavía hay mucho que quiero conseguir en este deporte y creo que este es el lugar correcto para hacerlo. Estoy muy agradecido por la confianza que el equipo ha depositado en mí&raquo;.</p>

<p>Mauro Gianetti, director general del equipo, coincidió en el tono: &laquo;Tadej ha sido central en el desarrollo de este equipo, y estamos extremadamente orgullosos de que esta relación continúe hasta 2032&raquo;. El director deportivo Matxin fue más allá al valorar el vínculo humano por encima del deportivo: &laquo;Pienso en la conexión que hay con Tadej, y en la conexión que Tadej tiene con sus compañeros, con el equipo y con el staff [...] Que el mejor ciclista del mundo siga haciendo historia con el mejor equipo del mundo, y que esa conexión se consolide en forma de un contrato hasta 2032, creo que significa mucho para ambas partes&raquo;.</p>

<p>El vídeo de este martes es, hasta ahora, la señal más concreta de que la recuperación avanza según lo esperado. Pogačar acompañó las imágenes con un mensaje más informal: &laquo;No es exactamente como habíamos planeado pasar septiembre&raquo;, escribió, añadiendo después &laquo;al menos tenemos buena compañía&raquo; —en referencia a su prometida, la también ciclista profesional Urška Žigart—. La comparación no es casual: Žigart, de 29 años, se fracturó la mandíbula en junio, en una caída en la segunda etapa del Tour de Suiza, y volvió a competir sin necesidad de cirugía apenas seis semanas después, llegando a disputar el Tour de Francia Femmes (48ª en la general). El 13 de septiembre, mientras marchaba tercera en la general del Faun Tour Femmes, sufrió una nueva caída en la etapa hacia Tournon-sur-Rhône y se refracturó la misma mandíbula — una lesión que, según los primeros partes médicos, también la dejará fuera del Mundial de Montreal.</p>

<p>El detalle, ajeno a la parte puramente deportiva, retrata bien el momento: una pareja de corredores de élite compartiendo mesa de rehabilitación en pleno mes de septiembre, el que debía ser uno de los más importantes del calendario para ambos.</p>

<p>Ni Pogačar ni el equipo han puesto fecha a un posible regreso a la competición, y no la pondrán mientras no haya un criterio médico claro: entre una fractura de clavícula, una vértebra fisurada y una conmoción, el margen de precaución suele ser amplio incluso cuando las primeras señales, como las de este martes, son buenas. Lo que sí queda claro con el contrato hasta 2032 es que, en UAE Team Emirates-XRG, la conversación sobre &laquo;después de Pogačar&raquo; queda aplazada indefinidamente. Para 2027, con el cuerpo respondiendo y siete temporadas más por delante bajo el mismo equipo, la ambición declarada —recuperar el maillot arcoíris que este año se le escapó por una caída, no por falta de piernas— sigue intacta. Por ahora, el próximo hito visible no está en una carrera, sino en la constancia de estos primeros vídeos de vuelta al rodillo: la manera en que, temporada tras temporada, Pogačar suele convertir un contratiempo en el punto de partida de la siguiente racha.</p>
`.trim()

export async function publishPogacarBackOnBikeArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [pogacar, team] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'tadej-pogacar' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'uae-team-emirates-xrg' }, select: { id: true } }),
  ])

  const heroImageId = await ensureCustomHeroImage('pogacar-vuelve-a-la-bici-rodillo-septiembre-2026', {
    url: '/images/headers/pogacar-recovery-cover.jpg',
    altText: 'Pogačar vuelve a la bici: primeras imágenes en el rodillo, 17 días después de la caída en la Vuelta',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Pogačar vuelve a la bici: primeras imágenes en el rodillo, 17 días después de la caída en la Vuelta',
    subtitle: '"Clavícula fuerte, cabeza fuerte": el esloveno compartió un vídeo de su primer entrenamiento indoor desde el accidente que le dejó fuera de lo que queda de temporada',
    excerpt:
      'Tadej Pogačar volvió a pedalear en el rodillo 17 días después de fracturarse la clavícula y la vértebra C7 en la Vuelta a España. El esloveno, que se perderá el resto de 2026, extendió además su contrato con UAE Team Emirates-XRG hasta 2032.',
    content: pogacarBackOnBikeContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/teams-riders/collarbone-strong-head-strong-tadej-pogacar-rides-indoors-for-the-first-time-since-vuelta-a-espana-crash/',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/tadej-pogacar-abandons-the-vuelta-a-espana-after-crash-on-stage-8/',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/tadej-pogacars-clavical-surgery-went-well-monday-as-team-confirms-world-champion-will-remain-in-barcelona-for-several-days/',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/tadej-pogacar-wont-race-again-in-2026-after-vuelta-a-espana-crash-but-extends-uae-contract-until-2032/',
      'https://www.uaeteamemirates.com/uae-team-emirates-xrg-announces-contract-extension-tadej-pogacar-2032/',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Cyclingnews', 'Cyclingnews', 'Cyclingnews', 'UAE Team Emirates-XRG']),
    seoTitle: 'Pogačar vuelve a la bici, 17 días después de su caída en la Vuelta',
    seoDescription:
      'Tadej Pogačar comparte su primer entrenamiento indoor tras la fractura de clavícula y vértebra sufrida en la Vuelta a España, y extiende su contrato con UAE hasta 2032.',
    readingTime: 8,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'pogacar-vuelve-a-la-bici-rodillo-septiembre-2026' },
    update: {
      ...baseFields,
      riders: pogacar ? { set: [{ id: pogacar.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
    },
    create: {
      slug: 'pogacar-vuelve-a-la-bici-rodillo-septiembre-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: pogacar ? { connect: [{ id: pogacar.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Del Toro, favorito "a la fuerza", y el aviso de Evenepoel sobre
// el circuito de Montreal — junta los puntos 6 y 7 de la lista del
// 16-sept en un solo análisis.
// Fuentes: Cyclingnews, idlprocycling, cyclinguptodate (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const delToroEvenepoelAnalysisContent = `
<p>Con Tadej Pogačar confirmado fuera del Mundial, alguien tenía que cargar con la etiqueta de favorito. Esta semana, tras el fin de semana de las clásicas canadienses, la llevan —cada uno a su manera y ninguno del todo cómodo con ella— Isaac del Toro y Remco Evenepoel.</p>

<p>Del Toro ganó el Grand Prix Cycliste de Montréal el domingo, superando a Paul Seixas en el mismo circuito de Mont Royal que decidirá el Mundial el 27 de septiembre. Cyclingnews tituló la crónica sin rodeos: se proclamaba &laquo;favorito al maillot arcoíris&raquo;. El propio corredor, sin embargo, no lo contó como una victoria de sensaciones. &laquo;Fue una situación extraña al principio de la carrera. No entendíamos tan bien a los otros equipos [...] Decidimos meter un ritmo normal, pero luego no me sentí tan bien y me apoyaron. Lo volvimos a intentar en la parte final&raquo;, explicó. Ganó, en sus propias palabras, sin sentirse bien.</p>

<p>La queja tiene más sentido si se mira la carrera anterior. Dos días antes, en el Grand Prix de Québec, Del Toro había terminado 55º, a 3:18 del ganador —el propio Evenepoel—. Pasar de ese resultado a ganar en Montreal en apenas 48 horas no es la progresión de un corredor que llega sobrado de confianza; es, más bien, la prueba de lo voluble que puede ser la forma física en esta recta final de temporada, incluso para quien termina llevándose la carrera.</p>

<p>Lo que le hizo aguantar, contó después, fue un consejo tan directo como gráfico de su equipo: &laquo;meter toda mi mierda en el bolsillo trasero y simplemente seguir corriendo&raquo;. La frase no es casual dentro de UAE Team Emirates-XRG: hace unos meses, tras dominar en el Tourmalet durante el Tour de Francia, fue el propio Pogačar quien le hizo una advertencia distinta —&laquo;fuiste demasiado rápido&raquo;— en un vídeo detrás de cámaras que se hizo viral. Del Toro asumió entonces el rol de alumno del esloveno dentro del equipo; con Pogačar fuera de la ecuación esta semana, es su otro consejo, el de guardarse las dudas y seguir pedaleando, el que le acaba de dar una victoria.</p>

<p>El otro protagonista de Montreal fue, de nuevo, Paul Seixas. El francés de 19 años terminó segundo tras perder la referencia del esprint en el momento clave: &laquo;Tuve un despiste tratando de ver qué tan cerca estaban los perseguidores. No encontraba el cartel de los 200 metros, y así, sin más, él [Del Toro] se fue&raquo;, contó. Lejos de lamentarse, lo enmarcó como aprendizaje de cara al 27 de septiembre: &laquo;Vine aquí a cometer errores [...] Sentí que soy capaz de más. Creo que lo vamos a ver en el Mundial&raquo;. Entre un ganador que no se sintió bien y un segundo que perdió por perder de vista un cartel, Montreal dejó más dudas que certezas sobre quién llega realmente fino.</p>

<p>Del otro lado de la moneda está Remco Evenepoel, que llegó a Canadá tras tres semanas y media de altura en Livigno pensadas explícitamente para el Mundial. Por su propia cuenta, el objetivo en Québec y Montreal no era llegar ya en su pico de forma, sino &laquo;volver a ser competitivo&raquo; y reconectar con las sensaciones de carrera. Ganó el Grand Prix de Québec al sprint por delante de Giulio Ciccone, pero no pudo seguir los ataques decisivos unos días después en Montreal, donde terminó quinto. Greg Van Avermaet, ganador de la prueba en el pasado, admitió que esperaba más de él: &laquo;Sinceramente, pensé que Montreal le sentaría incluso mejor que Québec, pero al parecer tuvo un día algo peor&raquo;, y apuntó a un factor externo — &laquo;no hay que olvidar que el jet lag también juega un papel&raquo;. El propio Evenepoel no ocultó su frustración durante la carrera, llegando a protestarle a Toms Skujins en la fase final por cómo se estaba corriendo el grupo de cabeza —una escena que, más que un enfado aislado, retrató a un corredor que llegaba con expectativas altas y las vio escaparse en tiempo real.</p>

<p>En vez de esconder esa diferencia, Evenepoel la convirtió en un pronóstico público: &laquo;Con la forma en que se corre el puerto más largo, es realmente difícil para los corredores más pesados&raquo;, dijo tras la carrera, en referencia al Camilien-Houde, una subida de casi 2&nbsp;km al 7,4-8% de media —más larga que el Koppenberg y el Paterberg juntos—. &laquo;Si miras el peso medio del top&nbsp;10, probablemente estemos en 63 o 65&nbsp;kilos&raquo;, calculó.</p>

<p>El aviso apuntaba, sin nombrarlos al principio, a dos de los grandes favoritos habituales: Mathieu van der Poel y Wout van Aert, ambos con un perfil más de clásicas que de escalador puro. Evenepoel matizó después que no los descartaba: &laquo;No son hombres pesados, pero corredores como Wout y Mathieu pueden sobrevivir esto en un día excepcional&raquo;. Es, en el fondo, la misma lectura que ya adelantó La Fuga al repasar el reparto de favoritos: Van der Poel decidió no pisar el circuito real esta temporada —prefirió el Tour de Luxemburgo como preparación—, apostando a que su explosividad en el último kilómetro compense no haber hecho el ensayo directo que sí hicieron Evenepoel, Del Toro y Seixas.</p>

<p>Lo que deja la semana, en definitiva, no es un favorito claro sino tres corredores administrando expectativas por caminos distintos: uno ganando sin sentirse a gusto y cargando con una etiqueta que dice no sentir todavía, otro terminando segundo por un despiste que promete no repetir, y un tercero perdiendo la última prueba directa pero convirtiendo esa derrota en un argumento a su favor. A diez días del Mundial, esa es quizás la lectura más honesta del estado de forma real del pelotón: nadie llega diciendo &laquo;estoy listo&raquo;.</p>
`.trim()

export async function publishDelToroEvenepoelAnalysisArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'analisis' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [delToro, evenepoel, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'remco-evenepoel' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [delToro?.id, evenepoel?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureHeroImage('del-toro-evenepoel-favoritos-mundial-montreal-2026', {
    title: '¿Del Toro, favorito? El aviso de Evenepoel sobre Montreal',
    label: 'Análisis',
    riders: [
      { name: 'Isaac del Toro', team: 'UAE Team Emirates-XRG' },
      { name: 'Remco Evenepoel', team: 'Soudal-QuickStep' },
    ],
  })

  const baseFields = {
    title: '¿Del Toro, favorito? El aviso de Evenepoel sobre Montreal',
    subtitle: 'El mexicano ganó en Montreal sin sentirse bien; Evenepoel, quinto, avisa que el circuito no favorece a los más pesados',
    excerpt:
      'Isaac del Toro ganó el GP de Montréal admitiendo que no se sintió bien, y desde entonces se habla de él como favorito al Mundial. Remco Evenepoel, quinto en esa misma carrera, advierte que el circuito de Mont Royal es duro para corredores como Van der Poel o Van Aert.',
    content: delToroEvenepoelAnalysisContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/racing/isaac-del-toro-announces-himself-as-rainbow-jersey-favourite-with-grand-prix-de-montreal-victory/',
      'https://www.domestiquecycling.com/en/news/del-toro-makes-surprising-admission-after-montreal-win-i-didnt-feel-so-well/',
      'https://cyclinguptodate.com/cycling/put-all-my-shit-in-my-back-pocket-isaac-del-toro-reveals-blunt-advice-that-inspired-montreal-victory',
      'https://cyclinguptodate.com/cycling/really-difficult-for-the-heavier-riders-remco-evenepoel-argues-climbers-not-van-aert-or-van-der-poel-are-favoured-by-montreal-circuit',
      'https://cyclinguptodate.com/cycling/you-cannot-forget-that-jet-lag-is-involved-remco-evenepoels-montreal-fifth-comes-with-greg-van-avermaet-warning-ahead-of-world-championships',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/i-was-here-to-make-mistakes-paul-seixas-confident-he-can-improve-after-second-at-gp-de-montreal-and-return-even-stronger-for-world-championships/',
      'https://cyclinguptodate.com/cycling/results-gp-de-montreal-2026-isaac-del-toro-beats-paul-seixas-as-duo-dominate-with-final-lap-surge-as-focus-turns-to-world-championships',
    ]),
    sourceNames: toJsonField([
      'Cyclingnews',
      'Domestique Cycling',
      'CyclingUpToDate',
      'CyclingUpToDate',
      'CyclingUpToDate',
      'Cyclingnews',
      'CyclingUpToDate',
    ]),
    seoTitle: 'Del Toro y Evenepoel, dudas de favoritos a días del Mundial de Montreal',
    seoDescription:
      'Isaac del Toro gana en Montreal sin sentirse bien y hereda la etiqueta de favorito; Remco Evenepoel avisa que el circuito no favorece a los corredores más pesados como Van der Poel o Van Aert.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'del-toro-evenepoel-favoritos-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'del-toro-evenepoel-favoritos-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}
