/**
 * Artículos publicados uno por uno a partir de la lista diaria de
 * noticias relevantes (ver memoria de sesión: cada día se investiga y
 * propone una lista de 10, y de ahí se decide qué se escribe). A
 * diferencia de batch-articles-sept.ts, este archivo no es una tanda
 * cerrada — va creciendo con cada artículo nuevo, uno por función.
 */
import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'
import { ensureCustomHeroImage } from './uci-import'

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

  const heroImageId = await ensureCustomHeroImage('del-toro-evenepoel-favoritos-mundial-montreal-2026', {
    url: '/images/headers/del-toro-evenepoel-cover.jpg',
    altText: '¿Del Toro, favorito? El aviso de Evenepoel sobre el circuito de Montreal',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
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

// ————————————————————————————————————————————————————————————
// Arranca el Tour de Luxemburgo 2026 — Van der Poel repite la
// fórmula de 2024 antes del Mundial de Montreal.
// Fuentes: Cyclingnews, CyclingUpToDate, Domestique Cycling, ProCyclingStats.
// ————————————————————————————————————————————————————————————

const luxembourg2026Content = `
<p>Mientras Remco Evenepoel e Isaac del Toro se jugaban sus últimas cartas antes del Mundial en el circuito real de Mont Royal, Mathieu van der Poel (Alpecin-Premier Tech) tomaba el camino contrario. Este miércoles arrancó la 86ª edición del Tour de Luxemburgo —cinco etapas, 701,3&nbsp;km en total, hasta el domingo 20 de septiembre— y Van der Poel es, con diferencia, el nombre que todos miran en el pelotón, exactamente una semana antes de la prueba en línea masculina del 27 de septiembre.</p>

<p>La etapa inaugural, de 157,5&nbsp;km entre el Knuedler y el Fëschmaart, ambos en pleno centro de la capital luxemburguesa, sale a las 14:52 hora local por calles adoquinadas del casco histórico antes de abrirse a las carreteras onduladas de las afueras. No es un final para un sprinter puro: en las últimas tres ediciones lo ha ganado un velocista rápido pero capaz de digerir un repecho final —Corbin Strong en 2023, el propio Van der Poel en 2024 y Romain Grégoire en 2025—, lo que anticipa una llegada explosiva más que un esprint masivo clásico.</p>

<p>Van der Poel fue directo sobre por qué eligió Luxemburgo en vez de las clásicas canadienses que sí disputaron Evenepoel y Del Toro: &laquo;Después de mi bloque de mountain bike, sin duda puedo usar ritmo de carrera y kilómetros de competición en carretera&raquo;, explicó. &laquo;Ese es el objetivo principal para mí aquí&raquo;. No habló de ganar la general ni de un resultado concreto — habló de recuperar sensaciones, que es exactamente lo que dice haber necesitado en 2024.</p>

<p>Porque no es la primera vez que sigue este guion. En la edición de 2024, Van der Poel ganó la primera etapa, terminó segundo en la clasificación general final por detrás de Antonio Tiberi, y semanas más tarde subió al podio del Mundial de Zúrich con el bronce. &laquo;Más importante aún, tuve un buen Mundial en Zúrich después, lo que demostró que esta carrera fue una muy buena preparación final&raquo;, recordó esta semana. &laquo;Creo que puede servir el mismo propósito este año antes del Mundial en Canadá&raquo;. La apuesta no es improvisada: es la repetición deliberada de una fórmula que ya funcionó.</p>

<p>La contraposición con sus rivales directos al maillot arcoíris no podría ser más clara. Evenepoel pasó tres semanas y media en altura en Livigno y después usó el Gran Premio de Quebec y el de Montreal —este último sobre el circuito real de Mont Royal— como examen directo, terminando quinto pese a ganar en Quebec. Del Toro hizo lo mismo y se llevó la victoria en Montreal, aunque admitiendo después que no se sintió bien durante la carrera. Van der Poel, en cambio, ni siquiera ha pisado el trazado de Montreal esta temporada. Apuesta a que su explosividad pura en el último kilómetro compense no haber hecho el reconocimiento directo que sí hicieron sus dos rivales más mencionados.</p>

<p>El resto de la semana no está pensado para corredores de la explosividad de Van der Poel, lo que hace más interesante su apuesta por la general: la etapa 2 repite un perfil ondulado similar al de hoy, pero la etapa reina llega el viernes, entre Wiltz y Weiswampach, en el extremo norte del país, para bajar después hasta Diekirch —cerca de 179&nbsp;km por el terreno más exigente de Luxemburgo, con desnivel constante y varios puertos cortos que deberían abrir diferencias reales en la general—. El sábado, la contrarreloj individual de Ettelbruck (20,4&nbsp;km, rápida pero técnica) suele ser el punto donde se decide todo antes de la etapa de cierre del domingo en la capital.</p>

<p>El pelotón de esta edición reúne a 102 corredores de equipos WorldTour y continentales. Entre los nombres a seguir además de Van der Poel están Davide Piganzoli (Visma | Lease a Bike), Igor Arrieta (UAE Team Emirates-XRG), Mikkel Honoré (EF Education-EasyPost), Aurélien Paret-Peintre (Decathlon CMA CGM), Jasper Stuyven (Soudal Quick-Step) y Søren Kragh Andersen (Lidl-Trek) — un pelotón con perfil de clásicas y de puertos cortos, coherente con un recorrido que evita las grandes montañas pero no perdona a los sprinters puros ni premia a quien llegue sin piernas para los repechos finales.</p>

<p>Lo que hay en juego en Montreal para Van der Poel no es poca cosa. Ganó el maillot arcoíris en 2023, en Glasgow, y lo defendió sin éxito en 2024, cuando terminó con el bronce en Zúrich. Con Pogačar confirmado fuera de la salida tras su caída en la Vuelta, este año es, en el papel, la mejor oportunidad que ha tenido en tiempo para recuperar el título — pero también la que más rivales de perfil similar concentra en una sola carrera, con Evenepoel, Del Toro, Van Aert y Paul Seixas ya asomando en las quinielas después de Quebec y Montreal.</p>

<p>La carrera tendrá cobertura de Eurosport 1 y HBO Max durante toda la semana, con la etapa reina del viernes y la contrarreloj del sábado como los dos días que de verdad importan para quien busque la general. Pero para Van der Poel, el resultado final en la clasificación de Luxemburgo importa menos que llegar a Montreal con la misma sensación de puesta a punto que en 2024 — el año en que esta misma carrera, ganada a medias, terminó pagando dividendos tres semanas después en forma de podio mundial. Si el guion se repite tal cual, la última pieza que falta por confirmar en Montreal es si esta vez el bronce de Zúrich se convierte finalmente en oro.</p>
`.trim()

export async function publishLuxembourg2026Article() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [vdp, team] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])

  const heroImageId = await ensureCustomHeroImage('tour-de-luxemburgo-2026-van-der-poel-mundial', {
    url: '/images/headers/luxembourg-2026-cover.jpg',
    altText: 'Arranca el Tour de Luxemburgo 2026: Van der Poel repite la fórmula de 2024 antes del Mundial de Montreal',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Arranca el Tour de Luxemburgo: Van der Poel repite la fórmula de 2024 antes del Mundial',
    subtitle: 'Mientras Evenepoel y Del Toro se jugaban sus cartas en el circuito real de Montreal, Van der Poel eligió Luxemburgo — el mismo plan que le dio el bronce en Zúrich 2024',
    excerpt:
      'Arrancó la 86ª edición del Tour de Luxemburgo (16-20 de septiembre), con Mathieu van der Poel como gran referencia a una semana del Mundial de Montreal. El neerlandés repite la estrategia de 2024, cuando esta misma carrera precedió a su podio mundial en Zúrich.',
    content: luxembourg2026Content,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/teams-riders/this-race-was-a-very-good-final-preparation-mathieu-van-der-poel-returns-to-luxembourg-to-build-rhythm-and-form-ahead-of-road-world-championships/',
      'https://cyclinguptodate.com/cycling/tour-de-luxembourg-2026-gc-stage-1-preview-profile-favourites-predictions-mathieu-van-der-poels-big-pre-world-championships-test',
      'https://www.domestiquecycling.com/en/news/van-der-poel-adds-tour-de-luxembourg-to-intriguing-worlds-preparation/',
      'https://www.procyclingstats.com/race/tour-de-luxembourg/2026',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'CyclingUpToDate', 'Domestique Cycling', 'ProCyclingStats']),
    seoTitle: 'Tour de Luxemburgo 2026: Van der Poel antes del Mundial',
    seoDescription:
      'Arranca el Tour de Luxemburgo 2026 (16-20 sept.) con Van der Poel como referencia, repitiendo la estrategia de preparación que le dio el bronce mundial en 2024.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'tour-de-luxemburgo-2026-van-der-poel-mundial' },
    update: {
      ...baseFields,
      riders: vdp ? { set: [{ id: vdp.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
    },
    create: {
      slug: 'tour-de-luxemburgo-2026-van-der-poel-mundial',
      ...baseFields,
      publishedAt: new Date(),
      riders: vdp ? { connect: [{ id: vdp.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Leyendas — Annemiek van Vleuten: tres vértebras rotas en Río 2016
// y el círculo que cerró en Yorkshire 2019.
// Primer artículo de la nueva sección "Leyendas" (historias de
// superación / grandes hazañas históricas, no ligadas a la
// actualidad diaria). Fuentes: Cyclingnews, Cycling Weekly, NBC
// Olympics, ESPN, Wikipedia (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const vanVleutenLegendContent = `
<p>El 7 de agosto de 2016, Annemiek van Vleuten iba líder de la prueba en línea de los Juegos Olímpicos de Río de Janeiro, a unos 11&nbsp;km de la meta en Copacabana, en lo que ella misma describiría después como la mejor carrera de su carrera. En la bajada final salió despedida por encima del manillar y cayó de cabeza contra el asfalto. Pasó las siguientes 24 horas en cuidados intensivos. El parte médico habló de tres vértebras fracturadas y una conmoción cerebral severa. Desde la cama del hospital, todavía aturdida, escribió en Twitter: &laquo;Estoy en el hospital con algunas lesiones y fracturas, pero voy a estar bien. Sobre todo, súper decepcionada después de la mejor carrera de mi carrera&raquo;. Tenía 33 años, y en ese momento nadie hubiera apostado a que volvería a competir al máximo nivel — mucho menos a que esa misma disciplina, la prueba en línea, sería donde terminaría de escribir la respuesta definitiva, tres años después.</p>

<p>La recuperación no tuvo atajos. Poco más de un año después de Río, en septiembre de 2017, Van Vleuten volvió a subirse a un podio de Mundial — pero en la contrarreloj, en Bergen (Noruega), no en la prueba en línea. Fue una primera respuesta, pero no todavía la respuesta completa: había ganado un título mundial de vuelta de su caída, aunque en una disciplina distinta a la que la había dejado en cuidados intensivos.</p>

<p>La respuesta completa llegó dos años más tarde, el 28 de septiembre de 2019, en Yorkshire. Van Vleuten atacó en solitario en las rampas bajas de Lofthouse, a 105&nbsp;km de la meta en Harrogate — una distancia de ataque que roza lo absurdo incluso para los estándares del ciclismo profesional, y que ella misma reconoció después sin rodeos: &laquo;Todo el día pensé que era súper estúpido lo que estaba haciendo&raquo;, contó, pero su director de equipo le insistió en que siguiera adelante—. Aguantó sola hasta el final y ganó con 2 minutos y 15 segundos de ventaja sobre su compatriota y entonces campeona defensora, Anna van der Breggen. Con 36 años y 355 días, se convirtió en la campeona del mundo de ruta más veterana de la historia, superando el récord que tenía Jeannie Longo-Ciprelli desde 1995. Era, casi al día por día, la misma prueba —la línea, no la contrarreloj— en la que había estado a punto de quedar paralizada en Río.</p>

<p>En meta, con su madre presente entre el público, lo resumió así: &laquo;Tantas emociones... era un sueño muy grande para mí ser campeona del mundo. Ya había sido campeona del mundo de la contrarreloj, pero en ruta te la puedes poner muchas más veces&raquo; —en referencia al maillot arcoíris, que el campeón de ruta viste en carreras durante todo el año siguiente, a diferencia del de la especialidad contrarreloj—. El ambiente en la meta, dijo, fue &laquo;fantástico, con tanta gente aquí en Yorkshire animando&raquo;.</p>

<p>Ni siquiera ahí terminó la historia de tropiezos y respuestas. En Tokio, en julio de 2021, Van Vleuten cruzó la meta de la prueba en línea olímpica levantando los brazos, convencida de que acababa de ganar el oro. No lo había ganado: la austriaca Anna Kiesenhofer se había escapado en solitario desde muy lejos, y el pelotón —incluida la propia Van Vleuten y la selección holandesa, que llevaba la cuenta de las corredoras que quedaban por delante— la dio por controlada cuando ya no lo estaba. Van Vleuten se enteró del error ya en la meta, con los brazos todavía en alto, celebrando un oro que en realidad era plata. Tres días después, en la contrarreloj individual, ganó el oro olímpico real — una prueba distinta a la de su caída en Río, pero la reafirmación de que un tropiezo, incluso uno tan público y doloroso como celebrar por error frente a las cámaras de medio mundo, no tiene por qué ser la última palabra de la semana.</p>

<p>El resto de su palmarés terminó de confirmar que Río y Yorkshire no fueron un pico aislado. Ganó el Giro d'Italia Donne (la antigua Giro Rosa) cuatro veces —2018, 2019, 2022 y 2023—, y en 2022 se llevó las tres grandes vueltas femeninas de la temporada: Giro, Tour de Francia Femmes y Vuelta a España. Su victoria número 100 como profesional llegó, de forma simbólica, en ese mismo Giro d'Italia Donne de 2023, la edición con la que cerró una carrera de 16 años antes de retirarse a final de esa temporada. Pero si hay una sola imagen que resume esa carrera no es ninguna de esas victorias sueltas: es la distancia entre dos tardes de agosto y septiembre, Río 2016 y Yorkshire 2019, exactamente la misma prueba, exactamente la misma corredora, con un resultado que pasó de una ambulancia a un podio en la cima del mundo.</p>

<p>Ninguna de las tres etapas de esta historia —Bergen 2017, Yorkshire 2019, Tokio 2021— borra la anterior ni la hace innecesaria. Van Vleuten no ganó una sola vez y se acabó la historia: cayó, volvió más despacio de lo que hubiera querido, ganó en una disciplina distinta primero, y solo tres años después, en la prueba exacta que casi la deja parapléjica, cerró el círculo del todo. Incluso entonces, la vida le tenía guardado un tropiezo más —la confusión de Tokio— antes de la última respuesta. Es, quizás, el retrato más honesto de lo que realmente significa levantarse: no una sola vuelta triunfal, sino varias, espaciadas en años, con recaídas de por medio, hasta que el marcador finalmente cambia de lado.</p>
`.trim()

export async function publishVanVleutenLegendArticle() {
  const category = await prisma.category.upsert({
    where: { slug: 'leyendas' },
    update: { name: 'Leyendas' },
    create: {
      slug: 'leyendas',
      name: 'Leyendas',
      description: 'Historias de superación y grandes hazañas del ciclismo — no ligadas a la actualidad del día a día.',
    },
  })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const rider = await prisma.rider.upsert({
    where: { slug: 'annemiek-van-vleuten' },
    update: {},
    create: {
      slug: 'annemiek-van-vleuten',
      name: 'Annemiek van Vleuten',
      nationality: 'Países Bajos',
      specialty: 'Prueba en línea / Contrarreloj',
      bio: 'Ex ciclista profesional neerlandesa, retirada a finales de 2023. Campeona del mundo en ruta (2019) y contrarreloj (2017, entre otras), y campeona olímpica de contrarreloj en Tokio 2020/2021.',
    },
  })

  const heroImageId = await ensureCustomHeroImage('van-vleuten-rio-2016-yorkshire-2019-leyenda', {
    url: '/images/headers/van-vleuten-legend-cover.jpg',
    altText: 'Caer y levantarse: Annemiek van Vleuten, de la caída en Río 2016 al Mundial en Yorkshire 2019',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Annemiek van Vleuten: tres vértebras rotas en Río 2016, campeona del mundo en Yorkshire 2019',
    subtitle: 'Se cayó de cabeza liderando la prueba en línea de los Juegos de Río. Tres años después, en la misma disciplina, ganó el Mundial con un ataque en solitario de 105 kilómetros',
    excerpt:
      'En Río 2016, Annemiek van Vleuten se fracturó tres vértebras cayendo de cabeza cuando iba líder de la prueba olímpica en línea. Tres años después, en Yorkshire 2019, ganó el Mundial de esa misma disciplina con un ataque en solitario de 105 km, convirtiéndose en la campeona más veterana de la historia.',
    content: vanVleutenLegendContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.si.com/olympics/2016/08/07/womens-road-race-leader-crash-annemiek-van-vleuten',
      'https://gulfnews.com/sport/rio-olympics-ill-be-fine-injured-van-vleuten-says-1.1875752',
      'https://www.cyclingweekly.com/news/racing/annemiek-van-vleuten-solos-100km-claim-womens-road-race-yorkshire-world-championships-439014',
      'https://www.cyclingweekly.com/news/racing/thought-write-history-annemiek-van-vleuten-reflects-tactics-100km-solo-win-439043',
      'https://olympics.nbcsports.com/2017/09/19/annemiek-van-vleuten-wins-time-trial-world-championship/',
      'https://www.espn.com/olympics/cycling/story/_/id/31901661/',
      'https://www.welovecycling.com/wide/2023/09/01/annemiek-van-vleutens-remarkable-cycling-career/',
    ]),
    sourceNames: toJsonField([
      'Sports Illustrated',
      'Gulf News',
      'Cycling Weekly',
      'Cycling Weekly',
      'NBC Olympics',
      'ESPN',
      'Škoda We Love Cycling',
    ]),
    seoTitle: 'Van Vleuten: de la caída en Río 2016 al Mundial en Yorkshire 2019',
    seoDescription:
      'La historia real de Annemiek van Vleuten: fractura de tres vértebras en Río 2016 liderando la prueba en línea, y el título mundial en la misma disciplina tres años después.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'van-vleuten-rio-2016-yorkshire-2019-leyenda' },
    update: {
      ...baseFields,
      riders: { set: [{ id: rider.id }] },
    },
    create: {
      slug: 'van-vleuten-rio-2016-yorkshire-2019-leyenda',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: [{ id: rider.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Van der Poel gana la etapa 1 del Tour de Luxemburgo 2026 —
// resultado del día, sigue del artículo de arranque ya publicado.
// Fuentes: Cyclingnews, CyclingUpToDate, WielerFlits, DirectVelo
// (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const luxembourgStage1ResultContent = `
<p>Mathieu van der Poel (Alpecin-Premier Tech) ganó este miércoles la primera etapa del Tour de Luxemburgo, los 157,5&nbsp;km entre el Knuedler y el Fëschmaart en pleno centro de la capital luxemburguesa, y con eso se puso el primer maillot de líder de la 86ª edición de la carrera. No fue un triunfo cómodo ni previsible hasta el final: llegó después de que su propio ataque, lanzado a 11&nbsp;km de meta, terminara cazado por el pelotón a falta de apenas 4&nbsp;km.</p>

<p>La secuencia fue la siguiente. Van der Poel probó suerte en solitario en el tramo final, buscando llegar a la meta sin necesidad de definir al sprint. El pelotón, sin embargo, no le dio margen y lo neutralizó cuando ya se veía el arco de meta. En vez de quedarse sin opciones tras el esfuerzo del ataque fallido, Van der Poel se recompuso y ganó igual al sprint, por delante de Pierre Gautherat (Decathlon CMA CGM) y Marijn van den Berg (EF Education-EasyPost). &laquo;Eso dolió&raquo;, resumió después, escuetamente, sobre el desgaste de atacar, ser cazado y aun así tener piernas para ganar el sprint que siguió.</p>

<p>El resultado tiene un valor añadido que va más allá de la propia etapa: es la primera carrera en carretera de Van der Poel desde que el Tour de Francia terminó en los Campos Elíseos, en julio. Desde entonces se dedicó a un bloque de competición en mountain bike, y había sido explícito sobre lo que necesitaba de esta semana en Luxemburgo — no un resultado concreto, sino &laquo;ritmo de carrera y kilómetros de competición en carretera&raquo; antes del Mundial de Montreal, el 27 de septiembre. Ganar la primera etapa, y encima haciéndolo tras un ataque fallido y no por pura superioridad en un sprint controlado, es en todo caso una señal de que ese ritmo ya está ahí, no solo una casualidad favorable.</p>

<p>El segundo lugar tiene su propio interés: Pierre Gautherat, francés de 23 años y especialista en clásicas dentro del Decathlon CMA CGM, ya había sido campeón de Europa sub-23 en ruta en 2024 y llega esta temporada firmando su cuarta victoria profesional. Colarse en el podio de una etapa ganada al sprint por uno de los corredores más rápidos del pelotón, incluso en segundo lugar y a rueda de Van der Poel, es exactamente el tipo de resultado que empieza a construir una reputación seria dentro del pelotón WorldTour, más allá de las categorías de formación donde ya se había hecho notar.</p>

<p>La victoria también repite, punto por punto, el guion de 2024: aquel año Van der Poel también ganó la primera etapa de este mismo Tour de Luxemburgo, antes de terminar segundo en la general y subir después al podio del Mundial de Zúrich con el bronce. Él mismo lo reconoció esta semana al justificar por qué elegía Luxemburgo en vez de las clásicas canadienses que disputaron Evenepoel y Del Toro: &laquo;Tuve un buen Mundial en Zúrich después, lo que demostró que esta carrera fue una muy buena preparación final&raquo;. Un día uno con victoria de etapa es, como mínimo, un comienzo idéntico al de la última vez que el plan funcionó.</p>

<p>La lectura de fondo para Montreal es la que más importa a diez días del Mundial. Van der Poel ya ganó el maillot arcoíris en 2023, en Glasgow, y lo perdió por poco en 2024, cuando terminó con el bronce en Zúrich. Con Tadej Pogačar confirmado fuera de la salida tras su caída en la Vuelta a España, este año se presenta como una de las oportunidades más claras que ha tenido para recuperar el título — siempre que la forma acompañe. Ganar hoy, y encima hacerlo de la forma más exigente posible (un ataque que no salió, seguido de un sprint que sí), es un tipo de evidencia que pesa más que un triunfo cómodo en un día tranquilo: demuestra que puede sufrir, recuperarse dentro de la misma carrera y aun así imponerse.</p>

<p>Para el resto de la semana, el maillot de líder le da a Van der Poel y a su equipo el control simbólico de la carrera, aunque el verdadero examen de la general llega más adelante: la etapa reina del viernes, entre Wiltz y Weiswampach, con cerca de 179&nbsp;km por el terreno más exigente del país, y la contrarreloj individual de Ettelbruck el sábado, 20,4&nbsp;km descritos como rápidos pero técnicos. Ninguna de las dos favorece especialmente el perfil explosivo de Van der Poel frente a corredores más orientados a la montaña o la crono — así que defender el liderato hasta la meta final en la capital, el domingo, no está garantizado solo por haber ganado hoy.</p>

<p>Lo que sí deja claro el resultado de hoy es que la apuesta por Luxemburgo, cuestionada por algunos frente a la decisión de Evenepoel y Del Toro de probar el circuito real de Montreal, ya está dando la primera señal concreta que Van der Poel necesitaba: piernas de carrera, encontradas de la forma menos previsible —un ataque que no funcionó del todo, y que aun así terminó en victoria—. Quedan cuatro etapas de carrera y diez días de calendario hasta la salida en Montreal. Si el resto de la semana —etapa reina, contrarreloj y cierre en la capital— confirma la sensación de hoy, la comparación con 2024 va a seguir siendo el punto de referencia obligado hasta que se dispute realmente el Mundial, el 27 de septiembre.</p>
`.trim()

export async function publishLuxembourgStage1ResultArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [vdp, team] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])

  const heroImageId = await ensureCustomHeroImage('van-der-poel-gana-etapa-1-luxemburgo-2026', {
    url: '/images/headers/vdp-luxembourg-stage1-cover.jpg',
    altText: 'Van der Poel gana la etapa 1 del Tour de Luxemburgo: atacó a 11 km, lo cazaron a 4, y aun así ganó el sprint',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Van der Poel gana la etapa 1 del Tour de Luxemburgo tras un ataque fallido',
    subtitle: 'Atacó a 11 km de meta, lo cazaron a 4, y aun así ganó el sprint por delante de Gautherat y Van den Berg — su primera carrera en ruta desde el Tour de Francia',
    excerpt:
      'Mathieu van der Poel ganó la etapa 1 del Tour de Luxemburgo 2026 tras ver cazado su propio ataque a 4 km de meta, imponiéndose igual al sprint. Es su primera carrera en carretera desde el Tour de Francia y repite, etapa por etapa, el guion de 2024, cuando esta misma carrera precedió a su bronce mundial en Zúrich.',
    content: luxembourgStage1ResultContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/racing/tour-de-luxembourg-mathieu-van-der-poel-claims-sprint-victory-on-stage-1-after-late-race-attack-is-caught/',
      'https://cyclinguptodate.com/cycling/results-tour-de-luxembourg-2026-stage-1-mathieu-van-der-poel-attacks-from-11km-out-gets-caught-and-still-powers-to-opening-victory',
      'https://www.wielerflits.nl/nieuws/mathieu-van-der-poel-wint-in-luxemburg-en-mikt-op-eindzege/',
      'https://www.directvelo.com/actualite/131968/skoda-tour-de-luxembourg-et-1-classements',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'CyclingUpToDate', 'WielerFlits', 'DirectVelo']),
    seoTitle: 'Van der Poel gana la etapa 1 del Tour de Luxemburgo 2026',
    seoDescription:
      'Mathieu van der Poel gana la etapa 1 del Tour de Luxemburgo tras un ataque fallido a 4 km de meta, ganando igual al sprint. Primer maillot de líder de la carrera.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'van-der-poel-gana-etapa-1-luxemburgo-2026' },
    update: {
      ...baseFields,
      riders: vdp ? { set: [{ id: vdp.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
    },
    create: {
      slug: 'van-der-poel-gana-etapa-1-luxemburgo-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: vdp ? { connect: [{ id: vdp.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Perfil: Isaac del Toro, el presente y el futuro del ciclismo
// mexicano — de Ensenada al podio del Tour de Francia 2026.
// Fuentes: Wikipedia, BikeRadar, Olympics.com, El Imparcial, N+,
// TV Azteca, El Informador (ver sourceUrls). Imagen: banner
// automático mientras se produce una carátula compatible con la
// política de imágenes del sitio (ver nota interna).
// ————————————————————————————————————————————————————————————

const delToroProfileContent = `
<p>A diez días del Mundial de ruta en Montreal (20-27 de septiembre), Isaac del Toro (UAE Team Emirates-XRG) aparece en las quinielas de favoritos casi por descarte: sin Tadej Pogačar en la salida tras su caída en la Vuelta a España, y con Remco Evenepoel avisando de que el circuito de Mont Royal no favorece a los corredores más pesados, el mexicano de 22 años llega como una de las cartas más sólidas del pelotón. Es una frase que, hace apenas tres años, habría sonado a ciencia ficción para el ciclismo mexicano.</p>

<p>Del Toro nació el 27 de noviembre de 2003 en Ensenada, Baja California, hijo de un ciclista aficionado que introdujo tanto a él como a su hermano en el deporte desde niños. Antes de dedicarse en serio a la carretera pasó por el mountain bike y el ciclocross, disciplinas donde afinó un manejo de bicicleta que hoy sus rivales describen como fuera de lo común para un escalador puro. Compitió en el campeonato nacional mexicano a los 16 años, en 2020, y al año siguiente ya corría en Italia y disputaba el Mundial júnior en Bélgica — el primer salto real fuera de México.</p>

<p>El camino no fue lineal. En el invierno de 2022 sufrió una fractura de fémur que lo dejó fuera de competición durante meses, justo cuando empezaba a asomar en carreras como el Gran Premio Industria o el Giro della Valle d'Aosta, donde terminó 22º en la general y 5º en la clasificación de jóvenes. La recuperación de esa lesión es, para quienes siguen de cerca su carrera, el primer episodio de un patrón que se repetiría después más de una vez: un golpe que, en lugar de frenarlo, se convirtió en el punto de partida de la temporada siguiente.</p>

<p>Esa temporada siguiente fue 2023, y en ella ganó el Tour de l'Avenir — el "pequeño Tour de Francia" reservado a corredores sub-23 y considerado desde hace décadas el mejor termómetro para detectar futuros ganadores de grandes vueltas. Del Toro se convirtió en el primer mexicano en levantar ese título, un logro que le abrió las puertas del WorldTour: UAE Team Emirates lo fichó para debutar como profesional en 2024.</p>

<p>Ese primer año como profesional lo pasó, sobre todo, como gregario de montaña — el corredor que reparte bidones y marca ritmo para que otros lleguen frescos a los puertos decisivos. Aun así, tuvo margen para mostrar algo propio: subió al podio en la Down Under Classic, ganó una etapa del Tour Down Under, lideró esa carrera durante tres jornadas y terminó tercero en la general. Eran señales, no titulares. El titular llegaría un año después, y sería de los que cambian una carrera de golpe.</p>

<p>En el Giro de Italia de 2025, Del Toro vistió la maglia rosa desde la novena etapa, la mantuvo durante más de una semana, ganó la etapa 17 y se llevó la clasificación de mejor joven — el primer corredor norteamericano en la historia en lograrlo. La perdió en la penúltima jornada frente a Simon Yates, pero terminó segundo en la general: el primer mexicano en subir al podio de una gran vuelta, y a los 21 años, el ciclista más joven en lograrlo en el Giro desde 2018.</p>

<p>Si 2025 fue la temporada de la confirmación, 2026 ha sido la de la consolidación. Del Toro llegó a mitad de año campeón del Tour de los Emiratos y de la Tirreno-Adriático, y sumó un tercer puesto en la Strade Bianche — resultados que ya lo situaban entre los mejores corredores de clásicas y de vueltas por etapas de una semana antes de que empezara julio. Pero fue en el Tour de Francia donde terminó de instalarse en la conversación sobre el futuro inmediato del ciclismo mundial: ganó la segunda etapa, con final en Barcelona, sumó otras cuatro terceras plazas parciales, se llevó el maillot blanco de mejor joven y cerró la carrera en el tercer escalón del podio final.</p>

<p>Es, otra vez, un primero: el primer mexicano en subir al podio del Tour de Francia, el primer latinoamericano en lograrlo desde Richard Carapaz en 2021, y apenas el sexto corredor no europeo de las potencias tradicionales del ciclismo en conseguirlo en la historia de la carrera. Para dimensionar lo insólito del dato conviene mirar hacia atrás: el ciclismo mexicano tiene un solo antecedente comparable, y es de otra época por completo. Raúl Alcalá, nacido en Monterrey, debutó en el Tour de 1986 con el mítico 7-Eleven y terminó noveno en la general de 1987, llevándose también el maillot blanco — el mismo que Del Toro ganaría casi cuarenta años después. Ganó dos etapas del Tour, en 1989 y 1990, y cerró su carrera europea a mediados de los noventa en el Motorola, como compañero de equipo de un jovencísimo Lance Armstrong. Durante más de tres décadas, Alcalá fue prácticamente el único punto de referencia del país en las grandes vueltas europeas. Del Toro no solo iguala esa huella: la supera, y lo hace con veintidós años y, según su propio equipo, todavía sin haber corrido su mejor Tour de Francia.</p>

<p>Precisamente por eso UAE Team Emirates decidió no incluirlo entre los ocho corredores para la Vuelta a España 2026: el equipo prefirió reservarlo tras el desgaste del Tour, con la idea explícita de cuidar su progresión a largo plazo en lugar de exprimirlo carrera tras carrera en un mismo año. Es una gestión poco habitual para un corredor de su nivel — y, a la vez, una señal de hasta qué punto UAE lo considera ya una pieza central de su proyecto: el mexicano tiene contrato con el equipo hasta 2029, con apenas 22 años cumplidos.</p>

<p>El presente inmediato se juega en Montreal. Del Toro llega a la cita mundialista habiendo ganado ya el Gran Premio de Montreal disputado sobre el mismo circuito de Mont Royal, aunque admitió después no haberse sentido especialmente bien durante la carrera — una confesión que sus rivales han tomado más como advertencia que como excusa. El trazado, con la subida de Camilien-Houde repetida varias veces, castiga a los corredores más pesados y premia a escaladores explosivos como él. Si algo ha demostrado en los últimos dieciocho meses es que sabe administrar la etiqueta de favorito mejor que la mayoría de corredores de su edad: la cargó en el Giro, la cargó en el Tour, y ahora la carga de nuevo camino del maillot arcoíris.</p>

<figure class="video-embed">
  <a class="video-embed-link" href="https://youtu.be/HR2d9uobKzY" target="_blank" rel="noopener noreferrer">
    <img src="https://img.youtube.com/vi/HR2d9uobKzY/maxresdefault.jpg" alt="Isaac del Toro, campeón del Gran Premio de Montreal 2026 — resumen en video" />
  </a>
  <figcaption>Resumen del Gran Premio de Montreal 2026: Del Toro remonta tras problemas mecánicos y gana a Paul Seixas en los metros finales. Video: Claro Sports.</figcaption>
</figure>

<p>El futuro, mientras tanto, ya no se mide carrera a carrera. Con un contrato que lo ata a UAE Team Emirates hasta el final de la década, con Tadej Pogačar como compañero de equipo y con una progresión que en apenas tres temporadas lo llevó de gregario de montaña a podio del Tour de Francia, Isaac del Toro representa hoy, literalmente, las dos cosas que anuncia el título de este artículo: es el mejor resultado que el ciclismo mexicano ha tenido en casi cuarenta años, y al mismo tiempo la principal razón por la que, en un país donde el ciclismo profesional ha sido históricamente un deporte casi invisible, empieza a hablarse en serio de una generación que todavía está por llegar.</p>
`.trim()

export async function publishDelToroProfileArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [delToro, team, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'uae-team-emirates-xrg' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])

  const heroImageId = await ensureCustomHeroImage('isaac-del-toro-presente-futuro-ciclismo-mexico', {
    url: '/images/headers/del-toro-perfil-cover.jpg',
    altText: 'Joven maravilla: el presente y el futuro del ciclismo en México',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'El presente y el futuro del ciclismo en México',
    subtitle: 'Quién es Isaac del Toro, de dónde viene, y cómo pasó en tres temporadas de gregario de montaña a subir al podio del Tour de Francia',
    excerpt:
      'De Ensenada al podio del Tour de Francia: la trayectoria de Isaac del Toro, el corredor mexicano de 22 años que llega como favorito al Mundial de Montreal tras romper, uno detrás de otro, los techos históricos del ciclismo de su país.',
    content: delToroProfileContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/Isaac_del_Toro',
      'https://www.bikeradar.com/features/racing/who-is-isaac-del-toro',
      'https://www.olympics.com/es/noticias/isaac-del-toro-tour-francia-2026-resultados-clasificacion-ciclista-mexicano',
      'https://www.elimparcial.com/deporte/2026/08/03/por-que-isaac-del-toro-no-correra-la-vuelta-a-espana-2026/',
      'https://www.nmas.com.mx/deportes/isaac-del-toro-renacer-ciclismo-mexico-como-logro-triunfar-biografia-premios-ciclista/',
      'https://www.tvazteca.com/aztecadeportes/raul-alcala-mexicano-participo-tour-francia-gano-etapa',
      'https://www.informador.mx/deportes/los-tres-mexicanos-que-han-hecho-historia-en-el-tour-de-francia-20260704-0066.html',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'BikeRadar', 'Olympics.com', 'El Imparcial', 'N+', 'TV Azteca', 'El Informador']),
    seoTitle: 'Isaac del Toro: el presente y el futuro del ciclismo mexicano',
    seoDescription:
      'Quién es Isaac del Toro y de dónde viene: de Ensenada al podio del Tour de Francia 2026, la trayectoria del corredor mexicano que llega como favorito al Mundial de Montreal.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'isaac-del-toro-presente-futuro-ciclismo-mexico' },
    update: {
      ...baseFields,
      riders: delToro ? { set: [{ id: delToro.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'isaac-del-toro-presente-futuro-ciclismo-mexico',
      ...baseFields,
      publishedAt: new Date(),
      riders: delToro ? { connect: [{ id: delToro.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Van der Poel pierde el liderato en Luxemburgo — Van den Berg gana
// al sprint en subida en la etapa 2.
// Fuentes: Cyclingnews, Domestique Cycling, CyclingUpToDate,
// radsportaktuell.de (ver sourceUrls). Video: TNT Sports Cycling
// (resumen de los últimos km, YouTube).
// ————————————————————————————————————————————————————————————

const luxembourgStage2ResultContent = `
<p>Mathieu van der Poel (Alpecin-Premier Tech) perdió este jueves el maillot de líder del Tour de Luxemburgo que había conquistado un día antes. En la etapa 2, un sprint largo en subida entre Differdange/Niederkorn y Junglinster (166,8&nbsp;km), fue Marijn van den Berg (EF Education-EasyPost) quien se impuso, lanzando su remate desde lejos y aguantando hasta la línea por delante de Timo Kielich (Visma | Lease a Bike) y Pierre Gautherat (Decathlon CMA CGM). Van der Poel, que un día antes había ganado la etapa inaugural pese a ver cazado su propio ataque, no pudo seguir el ritmo en el repecho final y cruzó la meta quinto.</p>

<p>La victoria fue la primera de la temporada 2026 para Van den Berg, y llegó de la manera en que suele construir sus triunfos: abriendo el sprint pronto, antes de que el grupo pudiera organizarse para perseguirlo, y resistiendo en el último centenar de metros con la rampa todavía subiendo. Es una fórmula que ya le había funcionado en otras citas de un día y que en Luxemburgo volvió a demostrar ser difícil de contrarrestar, incluso para rivales tan rápidos como Van der Poel o Kielich.</p>

<p>El final de etapa no era terreno para un velocista puro. A diferencia del trazado más plano y adoquinado del día inaugural en la capital luxemburguesa, la llegada a Junglinster subía de forma constante en los últimos metros — el tipo de final que en el papel debía favorecer a corredores capaces de combinar velocidad y potencia en pendiente, precisamente el perfil de Van der Poel. Que haya sido superado en ese terreno específico, y no en un sprint masivo convencional, es la parte del resultado que más atención generó entre los equipos rivales de cara al Mundial de Montreal, todavía a diez días de distancia.</p>

<p>La etapa 1, el miércoles, ya había dejado una pista de que Van der Poel no llegaba a Luxemburgo en su mejor punto de explosividad pura. Ganó esa jornada inaugural de 157,5&nbsp;km por las calles adoquinadas del casco histórico, pero tuvo que remontar un ataque propio que fue cazado a apenas 4&nbsp;km de meta antes de resolver el sprint del grupo reducido. Fue una victoria construida más sobre persistencia que sobre superioridad clara, y el resultado de este jueves confirma que, al menos en estos primeros días de competición en carretera tras su bloque de mountain bike, su punta de velocidad todavía no está al cien por cien frente a especialistas de sprint como Van den Berg o Kielich.</p>

<p>El maillot de líder cambió de manos no solo por el resultado de la etapa, sino por la combinación de la victoria con las bonificaciones de tiempo en meta. Van den Berg encabeza ahora la general, seguido por Pierre Gautherat a 4 segundos y por el propio Van der Poel, también a 4 segundos, en el tercer escalón. Jasper Stuyven (Soudal Quick-Step) y Davide Piganzoli (Visma | Lease a Bike) completan las cinco primeras posiciones, ambos a 16 segundos del liderato. Son diferencias mínimas, del tipo que una sola bonificación mal repartida puede borrar de un plumazo — la clasificación general del Tour de Luxemburgo, a estas alturas, sigue completamente abierta.</p>

<p>Para Van der Poel, la pérdida del liderato no cambia el objetivo real de su participación en esta carrera. Como explicó él mismo al llegar a Luxemburgo, no vino buscando necesariamente ganar la general, sino recuperar ritmo de competición en carretera después de su bloque de mountain bike, siguiendo el mismo guion que en 2024, cuando esta misma carrera precedió a su medalla de bronce en el Mundial de Zúrich. Perder unos segundos en un sprint cuesta arriba —terreno en el que no es, ni pretende ser, un especialista puro— no altera esa lógica de fondo, aunque sí deja la carrera bastante más abierta de lo que estaba tras la victoria de la etapa 1.</p>

<p>Van den Berg, por su parte, llega a este resultado en un año que hasta ahora no había sido especialmente prolífico en victorias para él. El neerlandés, uno de los velocistas más completos del pelotón cuando la llegada no es completamente plana, encuentra en Luxemburgo el terreno ideal para su perfil: explosivo, capaz de rodar fuerte durante muchos metros y con margen de maniobra en finales que no se deciden a la velocidad pura de un sprint masivo. Para EF Education-EasyPost, un equipo que reparte sus opciones entre varios corredores según el tipo de etapa, tener a Van den Berg vestido de líder a falta de tres jornadas es una posición que no esperaban defender de entrada, pero que ahora deben gestionar con cuidado.</p>

<p>Lo que queda de carrera no favorece precisamente a los velocistas. La etapa 3 de este viernes es la jornada reina: casi 180&nbsp;km entre Wiltz, en el extremo norte del país, y Weiswampach, antes de virar hacia el sur y terminar en Diekirch. El tramo final incluye un circuito con tres puertos cortos pero exigentes — 1,8&nbsp;km al 6,1%, 700&nbsp;metros al 8% y 1,1&nbsp;km al 7,2% — seguidos de una bajada corta y un tramo llano hasta meta, un perfil pensado para abrir diferencias reales entre los aspirantes a la general antes de la contrarreloj de Ettelbruck del sábado. Es, sobre el papel, el terreno donde Van der Poel puede intentar recuperar tiempo: explosivo, sin puertos largos, y exactamente el tipo de final en el que ya ha demostrado ser letal en ediciones anteriores de esta misma carrera.</p>

<p>La pregunta que deja abierta la etapa 2 es si Van den Berg, un corredor más de sprint que de montaña, puede aguantar el maillot en un día con tres repechos consecutivos, o si el liderato volverá a cambiar de dueño antes del fin de semana. Con las diferencias actuales tan ajustadas —4 y 16 segundos entre los cinco primeros—, casi cualquier resultado en Wiltz-Weiswampach-Diekirch puede reordenar por completo la general a falta de una crono y una etapa de cierre en la capital el domingo.</p>

<figure class="video-embed">
  <a class="video-embed-link" href="https://www.youtube.com/watch?v=rs9BxLwZPBI" target="_blank" rel="noopener noreferrer">
    <img src="https://img.youtube.com/vi/rs9BxLwZPBI/maxresdefault.jpg" alt="Últimos kilómetros del sprint de la etapa 2 del Tour de Luxemburgo 2026" />
  </a>
  <figcaption>Los últimos kilómetros del sprint en subida de la etapa 2. Video: TNT Sports Cycling.</figcaption>
</figure>
`.trim()

export async function publishLuxembourgStage2ResultArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [vandenberg, vdp, kielich, gautherat, stuyven, efTeam, alpecinTeam] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'marijn-van-den-berg' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'timo-kielich' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'pierre-gautherat' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'jasper-stuyven' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'ef-education-easypost' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])
  const riderIds = [vandenberg?.id, vdp?.id, kielich?.id, gautherat?.id, stuyven?.id].filter(
    (id): id is number => id !== undefined,
  )
  const teamIds = [efTeam?.id, alpecinTeam?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('van-der-poel-pierde-liderato-luxemburgo-etapa-2-2026', {
    url: '/images/headers/vdp-luxembourg-stage2-cover.jpg',
    altText: 'Van der Poel pierde el liderato en Luxemburgo: Van den Berg gana al sprint en subida',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Van der Poel pierde el liderato: Van den Berg gana al sprint en subida en Luxemburgo',
    subtitle: 'El neerlandés lanzó su sprint desde lejos en la etapa 2 y resistió hasta Junglinster; Van der Poel, quinto, cede el maillot por apenas 4 segundos',
    excerpt:
      'Marijn van den Berg ganó la etapa 2 del Tour de Luxemburgo 2026 con un sprint largo en subida y le arrebató el liderato a Mathieu van der Poel, quinto en meta. La general queda abierta a tres jornadas del final, con la etapa reina de este viernes por delante.',
    content: luxembourgStage2ResultContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/racing/tour-de-luxembourg-marijn-van-den-berg-claims-stage-2-with-long-sprint/',
      'https://www.domestiquecycling.com/en/news/van-den-berg-powers-to-first-win-of-2026-as-van-der-poel-loses-luxembourg-lead/',
      'https://cyclinguptodate.com/cycling/results-tour-de-luxembourg-2026-stage-2-van-der-poel-denied-in-uphill-sprint-as-marijn-van-den-berg-rides-into-leaders-jersey',
      'https://radsportaktuell.de/radsport/ergebnisse-tour-de-luxembourg-2026-etappe-2-van-der-poel-im-bergaufsprint-geschlagen-marijn-van-den-berg-ubernimmt-das-fuhrungstrikot',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Domestique Cycling', 'CyclingUpToDate', 'radsportaktuell.de']),
    seoTitle: 'Van den Berg gana la etapa 2 del Tour de Luxemburgo y quita el liderato a Van der Poel',
    seoDescription:
      'Marijn van den Berg gana al sprint en subida la etapa 2 del Tour de Luxemburgo 2026 y le quita el maillot de líder a Mathieu van der Poel, quinto en meta.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'van-der-poel-pierde-liderato-luxemburgo-etapa-2-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
    },
    create: {
      slug: 'van-der-poel-pierde-liderato-luxemburgo-etapa-2-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Grandes Enfrentamientos: Alberto Contador vs Andy Schleck — el
// Chaingate de 2010, el Galibier de 2011 y un título entregado año
// y medio tarde. Sección Leyendas.
// Fuentes: Cycling Weekly, Cyclingnews, ESPN, Wikipedia (ver
// sourceUrls).
// ————————————————————————————————————————————————————————————

const contadorSchleckRivalryContent = `
<p>Entre 2009 y 2011, el ciclismo mundial tuvo un duelo que todavía se recuerda como uno de los más intensos de la era moderna del Tour de Francia: Alberto Contador contra Andy Schleck. Tres ediciones seguidas del Tour, dos podios compartidos, un incidente mecánico que se convirtió en escándalo, y un desenlace tan tardío que el propio protagonista terminó recibiendo el título de campeón año y medio después de que la carrera hubiera terminado.</p>

<p>Cuando empezó todo, en 2009, Contador ya era un corredor consagrado: dos veces campeón del Tour (2007 y, esa misma edición, 2009), conocido por sus ataques explosivos en la montaña y por una capacidad de cambio de ritmo que pocos rivales podían seguir. Schleck, luxemburgués de Team Saxo Bank, era la gran promesa: un escalador puro, elegante sobre la bici, pero con una debilidad conocida —la contrarreloj— que Contador explotaba sin piedad cada vez que el calendario lo permitía. Ese año, Contador ganó el Tour y Schleck terminó segundo, ya entonces reconocido como su rival más serio.</p>

<p>La rivalidad se volvió leyenda al año siguiente, en la etapa 15 del Tour de Francia 2010, en la ascensión al Port de Balès. Schleck, que llevaba el maillot amarillo, atacó a Contador en la subida. A los pocos segundos, se le salió la cadena. Pedaleó en el vacío durante un instante, incrédulo, antes de detenerse a repararla mientras Contador y el resto del grupo de favoritos pasaban de largo. El resultado fue brutal: Schleck perdió 39 segundos esa etapa, y Contador pasó de estar 31 segundos por detrás en la general a liderarla por 8.</p>

<p>Lo que siguió fue una de las polémicas más comentadas en la historia reciente del ciclismo. Existe una regla no escrita en el pelotón —no aprovecharse de la mala suerte mecánica de un rival— y muchos consideraron que Contador la había roto. El propio Schleck no se guardó nada al llegar a meta: &laquo;Estoy realmente decepcionado. Tengo el estómago lleno de rabia, y quiero mi venganza&raquo;, dijo, y añadió: &laquo;Él puede estar nervioso los próximos días... esto me da rabia. Ya no soy el que persiguen, soy el que persigue. Esa es una gran diferencia&raquo;. Contador se defendió apelando a las circunstancias de la carrera: &laquo;Ataqué antes de saber que él tenía un problema con la cadena, y ya estaba por delante cuando lo supe&raquo;. La opinión de los expertos quedó dividida: Sean Kelly consideró que Contador debió esperar; Stephen Roche, que el error había sido de Schleck y que el ataque estaba justificado.</p>

<p>El desenlace final de aquel Tour resultó casi poético en su crueldad estadística: Contador ganó por apenas 39 segundos sobre Schleck — exactamente el mismo margen que el luxemburgués había perdido en el Port de Balès. Sin aquel incidente mecánico, el resultado de todo el Tour muy probablemente habría sido otro.</p>

<p>Pero la historia de ese Tour no terminó en París. El 30 de septiembre de 2010, la UCI anunció que Contador había dado positivo por clembuterol en un control antidopaje realizado durante la segunda jornada de descanso de la carrera. El corredor alegó contaminación por carne, y en febrero de 2011 la federación española de ciclismo lo exoneró. El caso, sin embargo, llegó al Tribunal de Arbitraje Deportivo (TAS), que celebró audiencias entre el 21 y el 24 de noviembre de 2011. El veredicto llegó el 6 de febrero de 2012: sanción de dos años, y pérdida de todos los resultados obtenidos desde el Tour de Francia 2010 en adelante, incluido ese propio Tour y el Giro de Italia que había ganado en 2011. Andy Schleck fue proclamado, con año y medio de retraso, campeón del Tour de Francia 2010 — sin ceremonia de podio, sin champán en los Campos Elíseos, con la noticia llegándole por un comunicado del TAS en lugar de por una victoria vivida en la carretera.</p>

<p>Entre el incidente y el veredicto quedó, además, el propio Tour de Francia 2011 — la tercera y última gran cita de la rivalidad, y probablemente la más memorable desde el punto de vista puramente deportivo. Contador llegó a Francia después de haber ganado el Giro de Italia semanas antes, intentando un doblete Giro-Tour que pocos corredores logran completar, y con el caso de dopaje ya pesando sobre su temporada. No fue su mejor año: terminó quinto en la general, sin victorias de etapa ni un solo día de maillot amarillo. Schleck, en cambio, protagonizó una de las fugas más recordadas de la década: en la etapa 18, con 62&nbsp;km todavía por delante, atacó en el Izoard y llegó en solitario hasta la cima del Galibier, sacando dos minutos a un grupo que incluía a su propio hermano Fränk, a Cadel Evans y a Thomas Voeckler. Fue la última victoria de la carrera profesional de Schleck, y le sirvió para terminar segundo en la general final, con Fränk tercero — un podio con dos Schleck y ningún Contador, que Cadel Evans ganó por apenas 1&nbsp;minuto 34&nbsp;segundos sobre Andy.</p>

<p>Con los años, la rivalidad se suavizó hasta convertirse en un recuerdo compartido con más respeto que rencor. Contador, ya retirado, llegó a declarar: &laquo;Andy fue mi mayor rival, mucho más que Froome, que solo llegó en los últimos dos años [de mi carrera]. Con él fue con quien más batallé, y también viví momentos muy buenos&raquo;. Es una frase que resume bien lo que fue aquel cruce de trayectorias: tres Tours de Francia decididos por márgenes mínimos, un incidente mecánico que se volvió símbolo de toda una polémica ética del deporte, y un título que tardó año y medio en encontrar a su verdadero dueño. Pocas rivalidades en la historia reciente del ciclismo combinan en partes tan iguales el drama deportivo y la controversia — razón de sobra para que, quince años después, Contador contra Schleck siga siendo la referencia obligada cuando se habla de grandes enfrentamientos en el pelotón.</p>
`.trim()

export async function publishContadorSchleckRivalryArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'leyendas' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const contador = await prisma.rider.upsert({
    where: { slug: 'alberto-contador' },
    update: {},
    create: {
      slug: 'alberto-contador',
      name: 'Alberto Contador',
      nationality: 'España',
      specialty: 'Escalada / Vueltas por etapas',
      bio: 'Ex ciclista profesional español, retirado en 2017. Ganador de siete grandes vueltas a lo largo de su carrera (con revisiones posteriores por sanción), uno de los escaladores más explosivos de su generación.',
    },
  })
  const schleck = await prisma.rider.upsert({
    where: { slug: 'andy-schleck' },
    update: {},
    create: {
      slug: 'andy-schleck',
      name: 'Andy Schleck',
      nationality: 'Luxemburgo',
      specialty: 'Escalada',
      bio: 'Ex ciclista profesional luxemburgués, retirado en 2014. Campeón del Tour de Francia 2010 (título recibido en 2012 tras la sanción de Alberto Contador), subcampeón en 2009 y 2011.',
    },
  })

  const heroImageId = await ensureCustomHeroImage('contador-vs-schleck-grandes-enfrentamientos', {
    url: '/images/headers/contador-schleck-cover.jpg',
    altText: 'Contador vs Schleck: el duelo de una era — Grandes Enfrentamientos en Leyendas',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Contador vs Schleck: el duelo que definió una era',
    subtitle: 'Tres Tours de Francia, un Chaingate en el Port de Balès y un título que le llegó a Schleck año y medio tarde',
    excerpt:
      'Entre 2009 y 2011, Alberto Contador y Andy Schleck protagonizaron una de las grandes rivalidades del ciclismo moderno: el Chaingate de 2010, la fuga solitaria de Schleck en el Galibier 2011, y un título de Tour que cambió de dueño año y medio después de la carrera.',
    content: contadorSchleckRivalryContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.cyclingweekly.com/news/latest-news/andy-schleck-biggest-rival-says-alberto-contador-143000',
      'https://www.cyclingweekly.com/news/racing/tour-de-france/schleck-contador-friendship-turns-sour-following-chain-problem-58877',
      'https://www.espn.com/olympics/tdf2010/news/story?id=5392117',
      'https://www.cyclingnews.com/news/cas-sanction-contador-with-two-year-ban-in-clenbuterol-case/',
      'https://en.wikipedia.org/wiki/2011_Tour_de_France',
      'https://en.wikipedia.org/wiki/Andy_Schleck',
    ]),
    sourceNames: toJsonField(['Cycling Weekly', 'Cycling Weekly', 'ESPN', 'Cyclingnews', 'Wikipedia', 'Wikipedia']),
    seoTitle: 'Contador vs Schleck: la rivalidad del Chaingate y el Galibier',
    seoDescription:
      'La historia completa de la rivalidad Contador-Schleck: el Chaingate de 2010 en el Port de Balès, la fuga de Schleck en el Galibier 2011, y el título del Tour que le llegó año y medio tarde.',
    readingTime: 7,
  }

  const grandToursTag = await prisma.tag.upsert({
    where: { slug: 'grand-tours' },
    update: {},
    create: { slug: 'grand-tours', name: 'Grand Tours', type: 'topic' },
  })

  const article = await prisma.article.upsert({
    where: { slug: 'contador-vs-schleck-grandes-enfrentamientos' },
    update: {
      ...baseFields,
      riders: { set: [{ id: contador.id }, { id: schleck.id }] },
      tags: { set: [{ id: grandToursTag.id }] },
    },
    create: {
      slug: 'contador-vs-schleck-grandes-enfrentamientos',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: [{ id: contador.id }, { id: schleck.id }] },
      tags: { connect: [{ id: grandToursTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Las tres sorpresas posibles de la crono femenina del Mundial:
// Kopecky, Faulkner y Hanson. Fuentes: Cyclingnews, ProCyclingUK,
// TOUR Magazin, ProCyclingStats (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const worldsTTOutsidersContent = `
<p>El Mundial de Montreal arranca este domingo 20 de septiembre con la contrarreloj individual femenina, 39,2&nbsp;km entre el Circuito Gilles-Villeneuve, el Parc Jean-Drapeau y un cierre por el Puente Concordia hasta la avenida du Parc, con apenas 220&nbsp;metros de desnivel. Es un trazado mayormente llano y largo — el tipo de recorrido que premia la posición aerodinámica sostenida durante más de media hora, más que la explosividad de una crono corta. Marlen Reusser, campeona mundial vigente, y Demi Vollering llegan como las dos favoritas claras. Pero hay al menos tres nombres más que, en un día perfecto, podrían colarse en el podio: Lotte Kopecky, Kristen Faulkner y Lauretta Hanson.</p>

<p>La referencia de forma es la contrarreloj del Tour de Francia Femmes de este verano, donde Reusser ganó por apenas 4 segundos sobre Lieke Nooijen, 18 sobre Vollering y 20 sobre Zoe Bäckstedt — márgenes mínimos entre las cuatro primeras que muestran lo apretado que está el nivel en la parte alta de la general. Vollering llega además reforzada por una temporada dominante: ganó tanto el Giro de Italia como el Tour de Francia Femmes en 2026, una combinación que la sitúa como la rival más completa de Reusser en cualquier terreno.</p>

<p>Lotte Kopecky (Bélgica) es el nombre menos previsible del lote de outsiders, y también el que arrastra más potencia bruta. Ganó la Milán-San Remo femenina el 21 de marzo y llegó a vestir el maillot de líder en la primera semana de la Vuelta Femenina 2026 — resultados que confirman que sigue siendo una de las corredoras más completas del pelotón, con un bagaje de pista y de clásicas que le permite sostener potencias altas en casi cualquier terreno. El problema es específico: un trazado de 39&nbsp;km recompensa cualidades de contrarreloj muy particulares —posición aerodinámica sostenida, gestión del esfuerzo a lo largo de más de media hora— en las que Kopecky, devastadora en esfuerzos cortos, se enfrenta a rivales mucho más especializadas exactamente en ese formato. Sus resultados contrarreloj en 2026 no han sido especialmente destacados, lo que la deja como una apuesta de alto riesgo y alto techo antes que como una candidata segura.</p>

<p>Kristen Faulkner (Estados Unidos, EF Education-Oatly) llega a Montreal con una temporada irregular pero con una constante clara: cuando hay un reloj de por medio, aparece. La doble campeona olímpica en París 2024 —oro en ruta y en persecución por equipos en pista— tuvo un arranque de año lento, condicionado por una lesión, y su única victoria de 2026 hasta ahora llegó precisamente contrarreloj: el título panamericano, 31,4&nbsp;km resueltos en 38:31 por delante de su compatriota Emily Ehrlich. A eso se suma un sexto puesto en la crono del Tour de Francia Femmes en Gevrey-Chambertin, su único otro top-10 del año. A los 33 años, y con prácticamente todos sus mejores resultados de la temporada concentrados en el formato contrarreloj, Faulkner es precisamente el tipo de corredora que nunca se puede descartar cuando se trata de rodar sola contra el cronómetro.</p>

<p>Lauretta Hanson (Australia, Lidl-Trek) es la que llega con la forma más reciente y más directamente verificable de las tres: terminó tercera en la Chrono Féminin de Gatineau esta misma semana, a 1 minuto 17 segundos de una Reusser que llegó a esa cita ya lanzada de cara al Mundial, por delante de Felicity Wilson-Haffenden. A sus 31 años, Hanson no es un nombre habitual en las quinielas de podio mundialista, pero un resultado así, a solo unos días de Montreal y sobre un terreno con similitudes de perfil, es exactamente el tipo de señal que los equipos rivales toman en serio a la hora de repartir marcajes y expectativas.</p>

<p>El contexto histórico añade un aliciente distinto para cada una. Estados Unidos tiene tradición real en esta prueba —Amber Neben ganó dos veces (la última en 2016) y Chloé Dygert se colgó el arcoíris en 2019 y 2023—, así que un podio de Faulkner encajaría dentro de una racha ya consolidada. Australia llega en su mejor momento histórico en la disciplina: Grace Brown fue campeona del mundo en 2024 y plata en 2022, con Katrin Garfoot sumando un bronce en 2016 — un podio de Hanson prolongaría una tradición que el propio país construyó apenas en los últimos años. Bélgica, en cambio, nunca ha subido al podio de esta prueba en toda su historia: ni Kopecky ni ninguna otra corredora belga lo ha logrado hasta ahora, lo que convierte cualquier resultado top-3 suyo en algo sin precedentes para su país en este formato específico.</p>

<p>Lo que une a las tres es que ninguna llega como favorita en el sentido estricto de la palabra, pero las tres tienen argumentos reales y recientes para colarse donde no se las espera. Kopecky aporta el techo más alto si logra sostener su potencia durante los 39&nbsp;km completos; Faulkner aporta la especialización pura de una corredora que este año solo ha brillado contrarreloj; Hanson aporta la forma más fresca, confirmada literalmente esta semana sobre suelo canadiense. En una contrarreloj tan larga y tan dependiente de la gestión del esfuerzo, la diferencia entre pelear por el arcoíris y quedarse fuera del top&nbsp;10 puede ser cuestión de cómo cada una reparte sus fuerzas entre el Circuito Gilles-Villeneuve y la recta final de la avenida du Parc.</p>

<p>La cita es este domingo a las 9:00 hora local de Montreal (EDT). Con Reusser y Vollering como favoritas declaradas, pero con Kopecky, Faulkner y Hanson pisándoles los talones desde el papel, la primera prueba de fuego del Mundial 2026 promete estar mucho más abierta de lo que sugiere el orden de las quinielas.</p>
`.trim()

export async function publishWorldsTTOutsidersArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ciclismo-femenino' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [kopecky, faulkner, hanson, reusser, vollering, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'lotte-kopecky' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'kristen-faulkner' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'lauretta-hanson' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'marlen-reusser' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'demi-vollering' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [kopecky?.id, faulkner?.id, hanson?.id, reusser?.id, vollering?.id].filter(
    (id): id is number => id !== undefined,
  )

  const heroImageId = await ensureCustomHeroImage('sorpresas-crono-femenina-mundial-montreal-2026', {
    url: '/images/headers/tt-outsiders-cover.jpg',
    altText: 'Kopecky, Faulkner y Hanson: las sorpresas de la crono femenina del Mundial',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Kopecky, Faulkner y Hanson: las sorpresas posibles de la crono femenina del Mundial',
    subtitle: 'Reusser y Vollering son las favoritas claras en Montreal, pero tres nombres más tienen argumentos recientes para colarse en el podio de la contrarreloj',
    excerpt:
      'A dos días del Mundial de Montreal, Marlen Reusser y Demi Vollering encabezan las quinielas de la crono femenina (39,2 km). Lotte Kopecky, Kristen Faulkner y Lauretta Hanson llegan como outsiders con argumentos recientes y reales para pelear un puesto en el podio.',
    content: worldsTTOutsidersContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://procyclinguk.com/womens-world-championships-time-trial-2026-preview-reusser-faces-backstedt-and-vollering-in-montreal/',
      'https://www.cyclingnews.com/pro-cycling/womens-cycling/marlen-reusser-or-demi-vollering-can-anyone-challenge-the-two-favourites-in-the-world-championships-elite-womens-time-trial/',
      'https://www.cyclingnews.com/pro-cycling/womens-cycling/kristen-faulkner-and-emily-ehrlich-go-one-two-in-time-trial-for-team-usa-at-pan-american-road-championships/',
      'https://www.cyclingnews.com/pro-cycling/womens-cycling/chrono-feminin-de-gatineau-marlen-reusser-smashes-individual-time-trial-showing-strong-form-ahead-of-worlds/',
      'https://www.tour-magazin.de/en/professional-cycling/latest-news/women-s-world-championship-individual-time-trial-who-will-claim-the-first-rainbow-jersey-in-montreal/',
      'https://en.wikipedia.org/wiki/UCI_Road_World_Championships_%E2%80%93_Women%27s_time_trial',
    ]),
    sourceNames: toJsonField(['ProCyclingUK', 'Cyclingnews', 'Cyclingnews', 'Cyclingnews', 'TOUR Magazin', 'Wikipedia']),
    seoTitle: 'Kopecky, Faulkner y Hanson: outsiders de la crono femenina del Mundial 2026',
    seoDescription:
      'A dos días del Mundial de Montreal, repasamos a las tres outsiders con opciones reales de sorprender en la contrarreloj femenina: Lotte Kopecky, Kristen Faulkner y Lauretta Hanson.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'sorpresas-crono-femenina-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'sorpresas-crono-femenina-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Mercado de fichajes 2027: Molano a Lotto-Intermarché, Asgreen a
// NSN, Van Anrooij a Canyon-SRAM y más. Fuentes: Cyclingnews,
// Escape Collective, ProCyclingUK, Ciclo21 (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const transferMarket2027Content = `
<p>Con el Mundial de Montreal todavía por delante, el mercado de fichajes de cara a 2027 no se ha detenido. Desde que se abrió el periodo de anuncios el 1 de agosto, varios movimientos de peso ya son oficiales — algunos de ellos cerrados apenas esta semana. Repasamos los más relevantes.</p>

<p>El movimiento con más carga simbólica es la salida de Juan Sebastián Molano de UAE Team Emirates-XRG. El colombiano, que llevaba ocho temporadas en el equipo de Pogačar desde 2019 y sumó 19 victorias vistiendo esos colores, firmó un contrato de dos años con Lotto-Intermarché a partir de 2027. La razón que él mismo ha dado es simple: después de ocho años en el mismo entorno, quiere volver a tener la libertad de correr como esprínter propio en vez de repartir su temporada entre trabajo de equipo y oportunidades puntuales. El director general de Lotto-Intermarché, Jean-François Bourlart, ya adelantó que Molano tendrá vía libre para pelear sus propias victorias.</p>

<p>Kasper Asgreen también cambia de aire. El danés, ganador del Tour de Flandes 2021 y una de las referencias de clásicas del pelotón, deja EF Education-EasyPost tras dos temporadas para firmar dos años con NSN Cycling Team. Antes de EF había pasado seis años en Soudal Quick-Step, donde construyó su palmarés de adoquín: además del Flandes, tiene un E3 Saxo Classic, una Kuurne-Brussel-Kuurne y etapas tanto en el Tour de Francia como en el Giro de Italia. En NSN se suma a un proyecto de clásicas ya reforzado con el colombiano Santiago Buitrago, y ha dejado clara su ambición para 2027: completar la trilogía de etapas en las tres grandes con un triunfo en la Vuelta a España, la única gran vuelta donde todavía no ha ganado.</p>

<p>En el pelotón femenino, el traspaso más comentado es el de Shirin van Anrooij, que deja Lidl-Trek —el único equipo que ha conocido como profesional— para firmar con Canyon-SRAM hasta 2029. Lo curioso del caso es la fecha: en vez de esperar al 1 de enero de 2027 como es habitual, Van Anrooij se incorporará a su nuevo equipo el 1 de noviembre de 2026, porque la temporada de ciclocross —donde también compite regularmente— arranca antes de que termine el año. Terminará su calendario en ruta con Lidl-Trek como estaba previsto, pero ya vestirá los colores de Canyon-SRAM en las primeras citas de ciclocross del invierno. La neerlandesa, de 24 años, ganó el Trofeo Alfredo Binda en 2023 y ha subido al podio en clásicas como el Tour de Flandes y la Amstel Gold Race.</p>

<p>Movistar, por su parte, sigue construyendo su proyecto femenino a mediano plazo: aseguró a la eslovaca Sofia Ungerová, de apenas 20 años, con un contrato que la vincula al equipo hasta 2029. Llega procedente del MAT Atom Deweloper Wrocław, donde ha corrido las últimas dos temporadas.</p>

<p>También hay movimiento en la categoría ProTeam, con un regreso a Europa que suma otro nombre latinoamericano a la lista. Jonathan Caicedo, ecuatoriano de 33 años y ganador de una etapa en el Giro de Italia, firmó un año con el Burgos Burpellet BH, que lo confirmó como su segundo fichaje para 2027 tras el del estonio Romet Pajur. Caicedo llega procedente del Wheeltop Rotor Chengdu, equipo chino al que se había unido en junio pasado tras la desaparición del Petrolike por problemas financieros — y llega en buen momento: en su debut con el nuevo equipo, se llevó la general del Tour of Qinghai, vistiendo el maillot de líder durante cinco días y sumando dos segundos puestos de etapa.</p>

<p>Pinarello Q36.5, uno de los equipos ProTeam más activos del mercado esta temporada, sigue sumando nombres: aseguró al velocista checo Pavel Bittner, de 23 años y máximo anotador de puntos UCI de su actual equipo, el Picnic-PostNL, con un contrato de dos años desde el 1 de enero de 2027; y al australiano Sebastian Berwick, procedente de Caja Rural-Seguros RGA, también por dos temporadas. Berwick llega en su mejor momento: en 2026 sumó top-10 en el Tour de Omán y el Tour de Eslovenia, y se llevó la general del Tour de Turquía en mayo.</p>

<p>No todos los movimientos de esta semana son traspasos — también hay renovaciones. Red Bull-BORA-hansgrohe confirmó este miércoles que Ben Zwiehoff continuará en el equipo, asegurando así a uno de sus corredores de clásicas y apoyo en carreras por etapas para la temporada 2027.</p>

<p>El patrón que dejan estos movimientos es el de un mercado que, año tras año, se mueve cada vez más rápido y cada vez más temprano: contratos que arrancan en plena temporada de ciclocross en vez de esperar al año nuevo, corredores de casi treinta años buscando un cambio de aire después de ocho temporadas en el mismo sitio, y equipos de categoría ProTeam como NSN Cycling Team, Burgos Burpellet BH o Pinarello Q36.5 compitiendo de igual a igual con estructuras WorldTour por fichajes de peso — algo que hace apenas unos años habría sido casi impensable. Para los equipos de nivel intermedio, cada uno de estos fichajes es también una apuesta de crecimiento: subir el nivel general de la plantilla para pelear resultados que hace poco parecían reservados solo a los grandes presupuestos.</p>

<p>Con el Mundial de Montreal todavía en el horizonte inmediato —arranca este mismo domingo— y con casi todo el pelotón concentrado en cerrar bien la temporada 2026, el mercado de 2027 seguirá moviéndose en segundo plano durante todo el otoño, con nuevos nombres confirmándose semana a semana hasta que arranque la pretemporada.</p>
`.trim()

export async function publishTransferMarket2027Article() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const ungerova = await prisma.rider.upsert({
    where: { slug: 'sofia-ungerova' },
    update: {},
    create: {
      slug: 'sofia-ungerova',
      name: 'Sofia Ungerová',
      nationality: 'Eslovaquia',
      specialty: 'Ciclismo en ruta',
      bio: 'Ciclista profesional eslovaca, de 20 años, fichada por Movistar Team hasta 2029 procedente del MAT Atom Deweloper Wrocław.',
    },
  })

  const [molano, asgreen, vanAnrooij, zwiehoff, uae, ef, lidlTrek, canyonSram, lottoIntermarche, redBull, nsn] =
    await Promise.all([
      prisma.rider.findUnique({ where: { slug: 'juan-sebastian-molano' }, select: { id: true } }),
      prisma.rider.findUnique({ where: { slug: 'kasper-asgreen' }, select: { id: true } }),
      prisma.rider.findUnique({ where: { slug: 'shirin-van-anrooij' }, select: { id: true } }),
      prisma.rider.findUnique({ where: { slug: 'ben-zwiehoff' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'uae-team-emirates-xrg' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'ef-education-easypost' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'lidl-trek' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'canyon-sram' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'lotto-intermarche' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'red-bull-bora-hansgrohe' }, select: { id: true } }),
      prisma.team.findUnique({ where: { slug: 'nsn-cycling-team' }, select: { id: true } }),
    ])
  const riderIds = [molano?.id, asgreen?.id, vanAnrooij?.id, zwiehoff?.id, ungerova.id].filter(
    (id): id is number => id !== undefined,
  )
  const teamIds = [uae?.id, ef?.id, lidlTrek?.id, canyonSram?.id, lottoIntermarche?.id, redBull?.id, nsn?.id].filter(
    (id): id is number => id !== undefined,
  )

  const heroImageId = await ensureCustomHeroImage('mercado-fichajes-2027-septiembre', {
    url: '/images/headers/transfers-2027-cover.jpg',
    altText: 'Mercado de fichajes 2027: Molano, Asgreen y Van Anrooij cambian de equipo',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Mercado de fichajes 2027: Molano deja a Pogačar, Asgreen ficha por NSN, Van Anrooij a Canyon-SRAM',
    subtitle: 'El colombiano rompe ocho temporadas en UAE Team Emirates, el danés busca su trilogía de etapas en grandes vueltas, y la neerlandesa cambiará de equipo antes de que acabe el año por el calendario de ciclocross',
    excerpt:
      'Repaso a los movimientos más relevantes del mercado de fichajes 2027: Juan Sebastián Molano deja UAE tras ocho temporadas por Lotto-Intermarché, Kasper Asgreen ficha por NSN Cycling, Shirin van Anrooij se va a Canyon-SRAM, y Movistar asegura a la eslovaca Sofia Ungerová hasta 2029.',
    content: transferMarket2027Content,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://escapecollective.com/juan-sebastian-molano-signs-a-two-year-deal-with-lotto-intermarche/',
      'https://procyclinguk.com/kasper-asgreen-joins-nsn-cycling-team-on-two-year-deal-for-2027-and-2028/',
      'https://www.cyclingnews.com/pro-cycling/transfers/shirin-van-anrooij-makes-bold-switch-to-canyon-sram-with-transfer-to-come-into-force-before-2026-is-over/',
      'https://www.ciclo21.com/mercado-fichajes-2027-septiembre7/',
      'https://www.eldiario.ec/deportes/regresa-a-europa-jonathan-caicedo-ficha-por-el-burgos-burpellet-bh-para-la-temporada-2027-28082026',
      'https://procyclinguk.com/pavel-bittner-to-join-pinarello-q36-5-on-two-year-deal-from-2027/',
      'https://cyclingflash.com/news/after-three-years-at-caja-rural-sebastian-berwick-takes-step-to-top-team-again',
    ]),
    sourceNames: toJsonField([
      'Escape Collective',
      'ProCyclingUK',
      'Cyclingnews',
      'Ciclo21',
      'El Diario (Ecuador)',
      'ProCyclingUK',
      'CyclingFlash',
    ]),
    seoTitle: 'Mercado de fichajes 2027: Molano, Asgreen y Van Anrooij cambian de equipo',
    seoDescription:
      'Los movimientos más relevantes del mercado de fichajes 2027 en el ciclismo: Molano deja UAE por Lotto-Intermarché, Asgreen ficha por NSN, Van Anrooij se va a Canyon-SRAM.',
    readingTime: 6,
  }

  const latinosTag = await prisma.tag.upsert({
    where: { slug: 'latinos' },
    update: {},
    create: { slug: 'latinos', name: 'Latinos', type: 'topic' },
  })

  const article = await prisma.article.upsert({
    where: { slug: 'mercado-fichajes-2027-septiembre' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
      tags: { set: [{ id: latinosTag.id }] },
    },
    create: {
      slug: 'mercado-fichajes-2027-septiembre',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
      tags: { connect: [{ id: latinosTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Reinderink gana su primera carrera como profesional en la etapa
// reina del Tour de Luxemburgo; Piganzoli nuevo líder.
// Fuentes: Domestique Cycling, Dicodusport, CiclismoAlDia,
// Cyclismactu (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const luxembourgStage3ResultContent = `
<p>Pepijn Reinderink (Soudal Quick-Step) consiguió este viernes la primera victoria de su carrera como profesional, y lo hizo en el peor —o mejor— terreno posible para debutar en el palmarés: la etapa reina del Tour de Luxemburgo, 179,6&nbsp;km entre Wiltz y Diekirch con desnivel constante desde el kilómetro cero. El neerlandés, de 24 años, se escapó en la última subida del día, la Montée de Haemerich, a apenas 3&nbsp;km de meta, y aguantó en solitario hasta la línea por un margen mínimo: un segundo sobre Davide Piganzoli (Visma | Lease a Bike) y Thomas Gachignard (TotalEnergies), que llegaron juntos persiguiéndolo sin conseguir cazarlo.</p>

<p>El trazado no dio tregua en ningún momento. Tras salir de Wiltz, en el extremo norte del país, la etapa entró en un circuito final alrededor de Diekirch que había que completar dos veces, con dos puertos cortos pero exigentes repetidos en cada vuelta —Um Knupp, 1,8&nbsp;km al 6,9%, y la Montée de Knaphoscheid, 2,7&nbsp;km al 6%— antes de enlazar con la Montée de Haemerich en el tramo final. Ese patrón de subidas cortas y constantes, sin un puerto largo que permitiera controlar la carrera desde lejos, es precisamente el terreno donde una fuga bien gestionada tiene más opciones de aguantar hasta el final: exige que los equipos de los favoritos decidan exactamente cuándo lanzar la persecución, y un margen de error de pocos segundos puede ser la diferencia entre cazar al fugado o quedarse a las puertas.</p>

<p>La victoria no fue casualidad ni un golpe de suerte aislado. Reinderink, debutante profesional con Soudal Quick-Step en 2024 tras destacar en el equipo de desarrollo del conjunto belga, se ha ido especializando en los últimos años en escapadas de largo recorrido — el tipo de corredor dispuesto a intentarlo incluso cuando las probabilidades parecen mínimas. Ya había mostrado ese perfil ganando la etapa inaugural del Triptyque Ardennais y el título nacional neerlandés en ruta en 2023. Este viernes no solo se llevó la etapa: también ganó cuatro de los cinco puertos puntuables del día, lo que le valió de paso el liderato de la clasificación de la montaña, con 18 puntos, tres más que Nils Politt.</p>

<p>El otro protagonista de la jornada fue Davide Piganzoli, que sin ganar la etapa se llevó lo que en una carrera de cinco días vale más: el maillot de líder. El italiano, de 23 años, vive su primera temporada en el WorldTour después de tres años en el Polti VisitMalta, y llegó a Visma | Lease a Bike este año con un contrato de tres temporadas pensado para convertirlo en corredor de referencia en las grandes vueltas. Sus credenciales ya lo avalaban: dos participaciones en el Giro de Italia con 13º y 14º puesto en la general, un tercer lugar en el Tour de l'Avenir 2023 —por detrás de Isaac del Toro y Giulio Pellizzari—, y este mismo verano, una etapa de contrarreloj por equipos en el Tour de Francia corriendo como gregario de Jonas Vingegaard. En Luxemburgo, ese trabajo de equipo se convirtió en oportunidad propia: terminó segundo en meta, a un segundo de Reinderink, y asumió tanto el liderato general como el maillot de mejor joven.</p>

<p>La general quedó así completamente reordenada a falta de dos etapas. Piganzoli lidera con 6 segundos de ventaja sobre Gachignard y 9 sobre Mattéo Vercher, tercero. Son diferencias del mismo calibre milimétrico que ya había dejado la etapa 2 —cuando Marijn van den Berg le quitó el liderato a Mathieu van der Poel por apenas 4 segundos—, lo que confirma que esta edición del Tour de Luxemburgo se está decidiendo por márgenes casi inexistentes entre los favoritos.</p>

<p>Van der Poel, que había llegado a esta carrera como referencia principal antes del Mundial de Montreal, tampoco fue protagonista en la pelea final de la etapa reina. Sí disputó el primer sprint de montaña del día, en Um Knupp, a apenas 22,4&nbsp;km de salida, pero ahí se impuso Bauke Mollema y el neerlandés de Alpecin-Premier Tech quedó segundo. En el tramo decisivo, con la fuga de Reinderink ya consolidada, Van der Poel no apareció entre los nombres que se jugaron la etapa — una jornada más discreta para alguien que llegó a Luxemburgo, según sus propias palabras, buscando sobre todo recuperar ritmo de competición antes del Mundial, no necesariamente pelear la general.</p>

<p>Lo que queda de carrera se decide rápido. Este sábado llega la contrarreloj individual de Ettelbruck, 20,4&nbsp;km que se perfilan como el examen decisivo antes de la etapa de cierre del domingo en la capital luxemburguesa. Con Piganzoli defendiendo apenas 6 segundos sobre Gachignard, y con corredores de perfil muy distinto —un neo-líder de Grand Tour, un especialista de clásicas del equipo francés y el propio Van der Poel, siempre peligroso contra el crono— todavía dentro del margen de un buen día, la general del Tour de Luxemburgo 2026 sigue sin tener un favorito claro a dos jornadas del final.</p>

<p>Para Soudal Quick-Step, la victoria de Reinderink llega además en un momento en que el equipo belga necesitaba precisamente este tipo de resultado: una etapa ganada desde la fuga, con un corredor de la casa que lleva años entrenando exactamente esta clase de escenario, sin depender de sus nombres más mediáticos. Es el tipo de triunfo que no cambia planes de temporada ni headlines de portada, pero que construye la credibilidad de un corredor que, a partir de este viernes, ya no llega a las escapadas como una incógnita.</p>
`.trim()

export async function publishLuxembourgStage3ResultArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const gachignard = await prisma.rider.upsert({
    where: { slug: 'thomas-gachignard' },
    update: {},
    create: {
      slug: 'thomas-gachignard',
      name: 'Thomas Gachignard',
      nationality: 'Francia',
      specialty: 'Ciclismo en ruta',
      bio: 'Ciclista profesional francés del equipo TotalEnergies.',
    },
  })

  const [reinderink, piganzoli, vdp, soudal, visma, alpecin] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'pepijn-reinderink' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'davide-piganzoli' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'soudal-quick-step' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'visma-lease-a-bike' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])
  const riderIds = [reinderink?.id, piganzoli?.id, gachignard.id, vdp?.id].filter(
    (id): id is number => id !== undefined,
  )
  const teamIds = [soudal?.id, visma?.id, alpecin?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('reinderink-gana-etapa-3-tour-luxemburgo-2026', {
    url: '/images/headers/reinderink-luxembourg-cover.jpg',
    altText: 'Reinderink gana su primera carrera como profesional en la etapa reina de Luxemburgo',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Reinderink gana su primera carrera como profesional en la etapa reina de Luxemburgo',
    subtitle: 'Se escapó a 3 km de meta en la Montée de Haemerich y aguantó por 1 segundo; Piganzoli, segundo en meta, es el nuevo líder de la general',
    excerpt:
      'Pepijn Reinderink logró su primera victoria profesional en la etapa reina del Tour de Luxemburgo, escapándose en el último kilómetro y resistiendo por apenas 1 segundo. Davide Piganzoli, segundo en meta, asume el liderato general con 6 segundos sobre Gachignard antes de la crono de Ettelbruck.',
    content: luxembourgStage3ResultContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.domestiquecycling.com/en/news/reinderink-takes-maiden-pro-win-on-tour-de-luxembourg-queen-stage-as-piganzoli-seizes-lead/',
      'https://dicodusport.fr/blog/au-terme-dun-immense-numero-pepijn-reinderink-remporte-la-3e-etape-du-tour-de-luxembourg-2026/',
      'https://ciclismoaldia.es/ciclismo/resultados-tour-de-luxembourg-2026-etapa-3-pepijn-reinderink-se-marcha-en-solitario-y-contiene-al-heroico-davide-piganzoli-en-una-etapa-vibrante',
      'https://www.cyclismactu.net/news-cyclisme-tour-de-luxembourg-pepijn-reinderink-3e-etape-piganzoli-en-tete-du-general-96092.html',
    ]),
    sourceNames: toJsonField(['Domestique Cycling', 'Dicodusport', 'CiclismoAlDia', 'Cyclismactu']),
    seoTitle: 'Reinderink gana la etapa reina del Tour de Luxemburgo, Piganzoli nuevo líder',
    seoDescription:
      'Pepijn Reinderink logra su primera victoria profesional en la etapa reina del Tour de Luxemburgo 2026. Davide Piganzoli asume el liderato general antes de la crono de Ettelbruck.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'reinderink-gana-etapa-3-tour-luxemburgo-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
    },
    create: {
      slug: 'reinderink-gana-etapa-3-tour-luxemburgo-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
    },
  })

  return { slug: article.slug }
}
