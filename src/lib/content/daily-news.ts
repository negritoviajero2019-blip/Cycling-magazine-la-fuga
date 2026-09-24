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

// ————————————————————————————————————————————————————————————
// Piganzoli gana también la crono de Ettelbruck (etapa 4) y encarrila
// la general del Tour de Luxemburgo. Fuentes: Cyclingnews, Domestique
// Cycling, CyclingUpToDate, Team Visma | Lease a Bike (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const luxembourgStage4ResultContent = `
<p>Davide Piganzoli (Visma | Lease a Bike) encadenó este sábado su segundo golpe de autoridad en dos días en el Tour de Luxemburgo. Después de llevarse el liderato general el viernes en la etapa reina, ganó también la contrarreloj individual de Ettelbruck —20,4&nbsp;km de ida y vuelta sobre la misma localidad— con un tiempo de 26:49, y con ese resultado estira su ventaja en la general a falta de una sola etapa.</p>

<p>La victoria fue ajustada en la parte alta de la clasificación, pero contundente en el mensaje: Piganzoli superó por apenas 2 segundos a Andrea Raccagni Noviero, y por 18 a Leo Hayter, tercero. &laquo;Es muy bonito ganar aquí. El plan era salir a tope desde el inicio en la crono de hoy, y es genial terminar con este resultado&raquo;, explicó el italiano tras la carrera. &laquo;Cuando marqué el mejor tiempo en el intermedio supe que podía competir por la victoria, aunque la parte técnica final estaba más pensada para los especialistas puros&raquo;.</p>

<p>Ese último comentario no es un detalle menor. Piganzoli no es, sobre el papel, un especialista de contrarreloj — es un corredor de Grand Tour en construcción, fichado por Visma | Lease a Bike precisamente para convertirse en referencia de montaña a medio plazo. Que haya sido capaz de ganar una crono técnica por delante de corredores dedicados específicamente a este formato dice tanto de su estado de forma actual como de su margen de mejora: un corredor completo, capaz de defender minutos en la montaña y también de no perder terreno —o directamente ganarlo— contra el reloj.</p>

<p>El trazado de Ettelbruck no era una crono llana y sencilla: 20,4&nbsp;km de ida y vuelta con un tramo técnico en la segunda mitad, el tipo de recorrido que suele beneficiar a corredores con más experiencia específica en la disciplina que un escalador de 23 años en su primera temporada plena en el WorldTour. Que Piganzoli haya marcado el mejor tiempo en el intermedio y haya sabido defenderlo en la parte más técnica, según relató él mismo, es una demostración adicional de la versatilidad con la que Visma | Lease a Bike lo está terminando de formar como corredor de referencia para las grandes vueltas.</p>

<p>El resultado reordenó la parte alta de la general de forma favorable para el propio Piganzoli. Ahora lidera con 47 segundos de ventaja sobre Mattéo Vercher, que escaló hasta la segunda plaza, y 49 sobre Thomas Gachignard —su compañero de equipo en TotalEnergies y protagonista, junto con Piganzoli, del podio de la etapa reina del viernes—. Son diferencias que, a falta de una sola etapa y con la general básicamente jugándose ya solo en el llano de la jornada de cierre, dejan a Piganzoli en una posición prácticamente inexpugnable camino de su primera gran victoria por etapas en el WorldTour.</p>

<p>Para Mathieu van der Poel, el sábado fue el día que terminó de confirmar que esta edición del Tour de Luxemburgo no iba a ser la suya en la general. El neerlandés, que había llegado a la carrera como referencia principal y llegó a vestir el maillot de líder tras ganar la etapa 1, cerró la contrarreloj de Ettelbruck en el puesto 61 — un resultado que lo aleja definitivamente de la pelea por el podio final. No es, sin embargo, una mala noticia real para sus planes: como ha repetido él mismo desde el inicio de la semana, el objetivo de disputar esta carrera nunca fue pelear la general, sino recuperar ritmo de competición en carretera antes del Mundial de Montreal, que arranca este mismo domingo con las contrarrelojes élite.</p>

<p>Reinderink, autor de la sorpresa del viernes, conserva además el liderato de la clasificación de la montaña que conquistó en la etapa reina: al no haber puertos puntuables en una contrarreloj, esa clasificación no se movió este sábado, y llegará a la última etapa con ventaja suficiente para asegurarla salvo sorpresa mayúscula.</p>

<p>La quinta y última etapa de este domingo, con llegada en la capital luxemburguesa, ya no debería alterar de forma sustancial una clasificación general que Piganzoli controla con un margen amplio para el tipo de diferencias que ha dejado esta carrera en días anteriores —recordemos que el liderato cambió de manos por apenas 4 segundos entre la etapa 1 y la 2, y por 1 segundo en la etapa reina—. Salvo un desplome inesperado o una caída, el Tour de Luxemburgo 2026 ya tiene, con un día de antelación, a su ganador prácticamente decidido: un corredor de 23 años que llegaba a esta carrera como gregario de lujo para las grandes citas de su equipo, y que se va camino de firmar la victoria por etapas más importante de su carrera hasta la fecha.</p>

<p>La semana, en conjunto, deja una lectura clara de cara al Mundial de Montreal, que arranca mañana mismo con las contrarrelojes élite. Van der Poel llega sin el resultado en la general que probablemente esperaba al inicio de la semana, pero con los kilómetros de competición en carretera que decía necesitar tras su bloque de mountain bike. Piganzoli, por su parte, llega a Canadá como uno de los nombres que más ha crecido en esta última quincena — aunque su cita en Montreal será distinta, integrado en la selección italiana antes que como líder propio. Para Soudal Quick-Step, TotalEnergies y Visma | Lease a Bike, el balance de la semana en Luxemburgo ya es, de por sí, un argumento de peso antes de que arranque la cita que de verdad importa en el calendario de septiembre.</p>
`.trim()

export async function publishLuxembourgStage4ResultArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [raccagni, hayter, vercher] = await Promise.all([
    prisma.rider.upsert({
      where: { slug: 'andrea-raccagni-noviero' },
      update: {},
      create: {
        slug: 'andrea-raccagni-noviero',
        name: 'Andrea Raccagni Noviero',
        nationality: 'Italia',
        specialty: 'Contrarreloj / Ciclismo en ruta',
        bio: 'Ciclista profesional italiano.',
      },
    }),
    prisma.rider.upsert({
      where: { slug: 'leo-hayter' },
      update: {},
      create: {
        slug: 'leo-hayter',
        name: 'Leo Hayter',
        nationality: 'Reino Unido',
        specialty: 'Ciclismo en ruta',
        bio: 'Ciclista profesional británico.',
      },
    }),
    prisma.rider.upsert({
      where: { slug: 'matteo-vercher' },
      update: {},
      create: {
        slug: 'matteo-vercher',
        name: 'Mattéo Vercher',
        nationality: 'Francia',
        specialty: 'Ciclismo en ruta',
        bio: 'Ciclista profesional francés del equipo TotalEnergies.',
      },
    }),
  ])

  const [piganzoli, vdp, gachignard, visma, alpecin] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'davide-piganzoli' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'thomas-gachignard' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'visma-lease-a-bike' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
  ])
  const riderIds = [piganzoli?.id, vdp?.id, gachignard?.id, raccagni.id, hayter.id, vercher.id].filter(
    (id): id is number => id !== undefined,
  )
  const teamIds = [visma?.id, alpecin?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('piganzoli-gana-etapa-4-crono-tour-luxemburgo-2026', {
    url: '/images/headers/piganzoli-stage4-cover.jpg',
    altText: 'Piganzoli gana también la crono de Ettelbruck y estira su ventaja en el Tour de Luxemburgo',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Piganzoli gana también la crono de Ettelbruck y encarrila el Tour de Luxemburgo',
    subtitle: 'El italiano supera a los especialistas del reloj por 2 segundos y estira su ventaja a 47 sobre Vercher; Van der Poel, 61º, ya piensa solo en el Mundial',
    excerpt:
      'Davide Piganzoli ganó la contrarreloj de Ettelbruck (etapa 4 del Tour de Luxemburgo) y amplió su liderato general a 47 segundos sobre Mattéo Vercher. Mathieu van der Poel, 61º en la crono, confirma que esta carrera ya no es su prioridad camino del Mundial de Montreal.',
    content: luxembourgStage4ResultContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/racing/tour-de-luxembourg-davide-piganzoli-wins-stage-4-time-trial-and-increases-his-overall-lead/',
      'https://www.domestiquecycling.com/en/news/piganzoli-extends-gc-lead-with-statement-tt-win-on-tour-de-luxembourg-stage-4/',
      'https://cyclinguptodate.com/cycling/results-tour-de-luxembourg-2026-stage-4-davide-piganzoli-on-fire-again-as-he-takes-narrowest-time-trial-win-mathieu-van-der-poel-finishes-61st',
      'https://www.teamvismaleaseabike.com/race-report/news/piganzoli-impressively-claims-time-trial-victory-at-tour-de-luxembourg/',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Domestique Cycling', 'CyclingUpToDate', 'Team Visma | Lease a Bike']),
    seoTitle: 'Piganzoli gana la crono de Ettelbruck y lidera el Tour de Luxemburgo',
    seoDescription:
      'Davide Piganzoli gana la contrarreloj de Ettelbruck (etapa 4) y amplía su ventaja en la general del Tour de Luxemburgo 2026 a 47 segundos sobre Mattéo Vercher.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'piganzoli-gana-etapa-4-crono-tour-luxemburgo-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
    },
    create: {
      slug: 'piganzoli-gana-etapa-4-crono-tour-luxemburgo-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// A un día de la crono del Mundial: favoritos, curso y horarios.
// Fuentes: Rouleur, ProCyclingUK, Cyclingnews, TOUR Magazin (ver
// sourceUrls).
// ————————————————————————————————————————————————————————————

const worldsTTEveContent = `
<p>Mañana domingo arranca oficialmente el Mundial de ruta 2026 en Montreal, y lo hace de la manera en que arrancan todos los Mundiales desde hace años: con las contrarrelojes individuales élite, primero la femenina y después la masculina, sobre el mismo trazado de 39,2&nbsp;km entre el Circuito Gilles-Villeneuve, el Parc Jean-Drapeau y el cierre por el Puente Concordia hasta la avenida du Parc. El pronóstico anuncia condiciones mayormente soleadas, sin lluvia que complique las decisiones de material — buenas noticias para un recorrido pensado para la potencia aerodinámica sostenida más que para la habilidad técnica.</p>

<p>El perfil es engañosamente sencillo: apenas 220&nbsp;metros de desnivel acumulado en casi 40&nbsp;km, con largos tramos junto al río San Lorenzo donde los especialistas pueden mantener la posición aerodinámica sin interrupción. La dificultad real llega al final, con una rampa de varios cientos de metros por encima del 6% justo antes de meta — lo suficiente para que un corredor que llegue sin piernas pierda ahí los segundos que no pudo perder en el llano, pero no tanto como para cambiar por completo el perfil de favoritos hacia los escaladores.</p>

<p>En categoría femenina, que rueda primero a las 9:00 hora de Montreal, Marlen Reusser llega como la favorita más clara. La suiza defiende el título que ganó el año pasado y llega lanzada: se impuso en la crono del Tour de Francia Femmes este verano por 4 segundos sobre Lieke Nooijen y 18 sobre Demi Vollering, y remató la preparación ganando también la Chrono Féminin de Gatineau la semana pasada sobre suelo canadiense. Vollering, precisamente, es la rival más completa que puede oponerle: viene de ganar tanto el Giro de Italia como el Tour de Francia Femmes este año, un doblete que la sitúa como la corredora más en forma del pelotón femenino en cualquier terreno. La Fuga ya repasó en detalle a las outsiders con opciones reales de colarse en el podio —Lotte Kopecky, Kristen Faulkner y Lauretta Hanson— en un análisis publicado esta semana.</p>

<p>En categoría masculina, que arranca a las 12:45 hora de Montreal, el favoritismo tiene un solo nombre escrito con mayúsculas: Remco Evenepoel. El belga busca su cuarto título mundial consecutivo de contrarreloj —ganó en 2023, 2024 y 2025— y llega a Montreal sin haber perdido una sola crono en toda la temporada: se impuso en las tres que disputó, incluida una victoria reciente en el GP de Quebec, y en el Tour de Francia de este verano batió a Tadej Pogačar por 28 segundos en la única contrarreloj individual de la carrera. Es, sobre el papel, una de las apuestas más seguras de todo el Mundial.</p>

<p>Lo que Evenepoel persigue en Montreal no es solo un título más: es un récord histórico que nadie ha logrado antes. Ganó el Mundial de contrarreloj en 2023, 2024 y 2025 — tres consecutivos, la misma racha que antes solo habían firmado Michael Rogers y el alemán Tony Martin. Ningún hombre, en toda la historia de la prueba, ha ganado cuatro Mundiales de contrarreloj seguidos. Una victoria este domingo no solo igualaría a Fabian Cancellara y al propio Martin como los corredores con más títulos totales en la prueba (cuatro cada uno), sino que convertiría a Evenepoel en el primero en encadenar cuatro de forma consecutiva.</p>

<p>Su rival más plausible es Filippo Ganna. El italiano, un especialista puro de las cronos largas, ganó esta temporada el test contrarreloj de 42&nbsp;km del Giro de Italia entre Viareggio y Massa por casi dos minutos de ventaja — una demostración de fuerza bruta en el terreno exacto que más se parece al de Montreal. Stefan Küng completa el trío de favoritos: el suizo llega motivado tras ganar la contrarreloj de la Vuelta a España este verano, con la ambición declarada de conseguir por fin el maillot arcoíris que se le ha resistido hasta ahora. Detrás de ese trío, el propio perfil del recorrido —rápido, con un repecho final que exige algo de potencia además de aerodinámica pura— deja una rendija abierta para algún nombre menos anunciado que llegue con las piernas frescas en el momento justo, algo que en las contrarrelojes de más de media hora de duración ocurre con más frecuencia de la que sugieren las quinielas previas.</p>

<p>Lo que deja este cruce de nombres es una jornada de apertura del Mundial con perfiles de favoritismo muy distintos entre las dos categorías: una femenina donde Reusser llega como referencia pero con Vollering y hasta tres outsiders reales pisándole los talones, y una masculina donde Evenepoel se presenta como una apuesta casi cerrada, con Ganna y Küng peleando más por la plata que por arrebatarle el título. Ambas contrarrelojes se disputan este domingo, y servirán además como primera pista real de quién llega mejor de piernas a las pruebas en línea que cierran el Mundial el fin de semana siguiente.</p>

<p>La semana de contrarrelojes no termina el domingo. El lunes 21 de septiembre se disputan las pruebas sub-23, y el martes 22 llega el relevo mixto por equipos, una modalidad que combina a tres hombres y tres mujeres de cada selección por un recorrido de 40,6&nbsp;km — el tipo de prueba donde la profundidad de una federación, no solo su corredor más rápido, termina marcando la diferencia. Recién después de esos tres días de contrarreloj el Mundial se traslada por completo al terreno de las carreras en línea, con la femenina el sábado 26 y la masculina el domingo 27 como gran cierre de la cita.</p>
`.trim()

export async function publishWorldsTTEveArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [reusser, vollering, evenepoel, kopecky, faulkner, hanson, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'marlen-reusser' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'demi-vollering' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'remco-evenepoel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'lotte-kopecky' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'kristen-faulkner' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'lauretta-hanson' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])

  const ganna = await prisma.rider.upsert({
    where: { slug: 'filippo-ganna' },
    update: {},
    create: {
      slug: 'filippo-ganna',
      name: 'Filippo Ganna',
      nationality: 'Italia',
      specialty: 'Contrarreloj',
      bio: 'Ciclista profesional italiano, uno de los especialistas de contrarreloj más dominantes del pelotón.',
    },
  })
  const kung = await prisma.rider.upsert({
    where: { slug: 'stefan-kung' },
    update: {},
    create: {
      slug: 'stefan-kung',
      name: 'Stefan Küng',
      nationality: 'Suiza',
      specialty: 'Contrarreloj / Clásicas',
      bio: 'Ciclista profesional suizo, especialista de contrarreloj y clásicas del norte.',
    },
  })

  const riderIds = [
    reusser?.id,
    vollering?.id,
    evenepoel?.id,
    kopecky?.id,
    faulkner?.id,
    hanson?.id,
    ganna.id,
    kung.id,
  ].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('un-dia-crono-mundial-montreal-2026', {
    url: '/images/headers/tt-eve-cover.jpg',
    altText: 'Falta un día para la crono del Mundial: Reusser y Evenepoel, favoritos en Montreal',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Falta un día para la crono del Mundial: Reusser y Evenepoel, favoritos en Montreal',
    subtitle: 'Las contrarrelojes élite femenina y masculina abren el Mundial de ruta este domingo sobre el mismo trazado de 39,2 km; Evenepoel busca su cuarto título consecutivo',
    excerpt:
      'A un día de que arranque el Mundial de Montreal con las contrarrelojes élite, repasamos el trazado, el horario y los favoritos: Marlen Reusser y Demi Vollering en la femenina, Remco Evenepoel —imbatido esta temporada— junto a Filippo Ganna y Stefan Küng en la masculina.',
    content: worldsTTEveContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.rouleur.cc/racing/world-championships-2026-mens-time-trial-preview-montreal',
      'https://procyclinguk.com/mens-world-championships-time-trial-2026-preview-evenepoel-faces-ganna-and-kung-in-montreal/',
      'https://www.cyclingnews.com/pro-cycling/racing/remco-evenepoel-filippo-ganna-and-the-rest-analysing-the-contenders-for-the-elite-mens-time-trial-at-the-world-championships/',
      'https://www.tour-magazin.de/en/professional-cycling/latest-news/women-s-world-championship-individual-time-trial-who-will-claim-the-first-rainbow-jersey-in-montreal/',
      'https://www.flobikes.com/articles/16184376-remco-evenepoel-fourth-world-time-trial-title',
    ]),
    sourceNames: toJsonField(['Rouleur', 'ProCyclingUK', 'Cyclingnews', 'TOUR Magazin', 'FloBikes']),
    seoTitle: 'A un día del Mundial: favoritos de la crono en Montreal 2026',
    seoDescription:
      'Todo listo para las contrarrelojes élite del Mundial de Montreal 2026: recorrido, horarios y favoritos, con Reusser y Evenepoel como grandes referencias.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'un-dia-crono-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'un-dia-crono-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Horarios del Mundial de Montreal convertidos a hora local de
// Canadá, México, Colombia, Argentina y España. Fuentes: RTVE/Teledeporte,
// CiclismoAlDia, TOUR Magazin, UCI (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const worldsScheduleByCountryContent = `
<p>El Mundial de ruta 2026 arranca mañana domingo en Montreal, y para una audiencia repartida entre Canadá, México, Colombia, Argentina y España, eso significa cuatro horas de inicio completamente distintas para cada evento. Aquí va la conversión completa de los cuatro eventos élite más importantes —las dos contrarrelojes de este domingo y las dos carreras en línea que cierran la cita el fin de semana siguiente— a la hora local de cada país. Todos los horarios están calculados sobre la hora oficial de Montreal (EDT, UTC-4) publicada por la organización, cruzada con las conversiones ya confirmadas por medios de cada país para evitar errores de redondeo entre husos horarios que no siempre coinciden en una hora exacta.</p>

<p><strong>Domingo 20 de septiembre — Contrarreloj individual élite femenina</strong> (39,2 km, salida en Avenue du Parc):</p>
<ul>
<li><strong>Canadá (sede, hora de Montreal):</strong> 9:00 a.m.</li>
<li><strong>México (Ciudad de México):</strong> 7:00 a.m.</li>
<li><strong>Colombia (Bogotá):</strong> 8:00 a.m.</li>
<li><strong>Argentina (Buenos Aires):</strong> 10:00 a.m.</li>
<li><strong>España (península):</strong> 3:00 p.m.</li>
</ul>

<p><strong>Domingo 20 de septiembre — Contrarreloj individual élite masculina</strong> (mismo trazado de 39,2 km):</p>
<ul>
<li><strong>Canadá (sede):</strong> 12:45 p.m.</li>
<li><strong>México:</strong> 10:45 a.m.</li>
<li><strong>Colombia:</strong> 11:45 a.m.</li>
<li><strong>Argentina:</strong> 1:45 p.m.</li>
<li><strong>España:</strong> 6:45 p.m.</li>
</ul>

<p>Esa diferencia de casi cuatro horas entre las dos contrarrelojes del domingo tiene una explicación simple: entre medio se disputan las pruebas sub-23 de ambas categorías, así que el día se reparte en cuatro carreras completas antes de que caiga la tarde en Montreal.</p>

<p>La semana siguiente, el Mundial se traslada del todo al terreno de las carreras en línea, con los dos eventos que de verdad definen quién se lleva a casa el maillot arcoíris más codiciado del calendario:</p>

<p><strong>Sábado 26 de septiembre — Carrera en línea élite femenina</strong> (180,4 km, circuito final en Mont Royal):</p>
<ul>
<li><strong>Canadá (sede):</strong> 9:00 a.m.</li>
<li><strong>México:</strong> 7:00 a.m.</li>
<li><strong>Colombia:</strong> 8:00 a.m.</li>
<li><strong>Argentina:</strong> 10:00 a.m.</li>
<li><strong>España:</strong> 3:00 p.m.</li>
</ul>

<p><strong>Domingo 27 de septiembre — Carrera en línea élite masculina</strong> (273,7 km, el cierre del Mundial):</p>
<ul>
<li><strong>Canadá (sede):</strong> 9:00 a.m.</li>
<li><strong>México:</strong> 7:00 a.m.</li>
<li><strong>Colombia:</strong> 8:00 a.m.</li>
<li><strong>Argentina:</strong> 10:00 a.m.</li>
<li><strong>España:</strong> 3:00 p.m.</li>
</ul>

<p>Vale la pena un apunte sobre por qué estas conversiones no son simplemente "sumar o restar unas horas parejas" entre los cinco países. Canadá corre en horario de verano (EDT, UTC-4) hasta principios de noviembre. México eliminó el horario de verano en la mayor parte del país desde 2022, así que Ciudad de México se mantiene todo el año en UTC-6, dos horas por detrás de Montreal. Colombia (UTC-5) y Argentina (UTC-3) tampoco cambian de horario en ningún momento del año, lo que las deja una hora por detrás y una hora por delante de Montreal, respectivamente. España, en cambio, todavía está en horario de verano (CEST, UTC+2) hasta finales de octubre, lo que explica la diferencia de seis horas completas con la sede — la misma con la que empezamos a trabajar en la previa que publicamos ayer.</p>

<p>Para quien piense seguir el Mundial completo desde América Latina, el dato más práctico es este: las dos carreras en línea —las que de verdad reparten los títulos más importantes, con el maillot arcoíris en juego para toda la temporada siguiente— arrancan a las 7:00 de la mañana en México y a las 8:00 en Colombia, un horario exigente pero manejable para quien quiera verlas en directo desde el arranque. En Argentina, a las 10:00 de la mañana, el horario es sin duda el más cómodo de toda Latinoamérica para no perderse ni un kilómetro. En España, en cambio, ambas caen ya entrada la tarde, a las 3:00 p.m., justo después de comer — probablemente el horario más cómodo de los cinco países para seguir el cierre del Mundial sin madrugar, aunque toque esperar hasta bien avanzado el día para ver la coronación de los nuevos campeones del mundo.</p>

<p>Conviene recordar, además, por qué estos cuatro eventos concentran la atención por encima del resto del programa. Las contrarrelojes individuales reparten el primer maillot arcoíris del Mundial y suelen definir quién llega con mejores sensaciones a la semana de carreras en línea — el propio Remco Evenepoel, por ejemplo, encadena tres títulos consecutivos de contrarreloj antes de disputar la prueba en línea del domingo siguiente. Pero son las carreras en línea, con su desgaste de varias horas y su exigencia táctica de equipo, las que la afición identifica de verdad con "ganar el Mundial": son las que reparten el maillot arcoíris que el campeón vestirá durante toda la temporada 2027, en cualquier carrera que dispute, sea cual sea su equipo.</p>

<p>Sobre dónde verlo: en España, Teledeporte y RTVE Play cubren gratis las señales principales, con Eurosport y HBO Max completando el resto de pruebas. En México, la transmisión corre por cuenta de Claro Sports. En Colombia y Argentina, la referencia es DirecTV Sports, la misma señal que cubre la cita en buena parte de Sudamérica —Bolivia, Brasil, Chile, Ecuador, Paraguay, Perú, Uruguay y Venezuela incluidos—. Como respaldo adicional, y sujeto a restricciones según el país, la UCI suele transmitir parte de las pruebas en su propio canal de YouTube — conviene revisar la disponibilidad exacta en cada territorio antes de depender de esa vía como única opción para seguir la carrera en directo.</p>

<p>Esta guía cubre los cuatro eventos élite de mayor peso mediático; el programa completo del Mundial incluye además las pruebas sub-23, junior y el relevo mixto por equipos, con horarios propios que ya repasamos en detalle en nuestra nota sobre el calendario oficial completo de la UCI.</p>
`.trim()

export async function publishWorldsScheduleByCountryArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } })

  const heroImageId = await ensureCustomHeroImage('horarios-mundial-montreal-paises-2026', {
    url: '/images/headers/horarios-mundial-cover.jpg',
    altText: 'Horarios del Mundial de Montreal por país: Canadá, México, Colombia, Argentina, España',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Horarios del Mundial de Montreal: así se ven las carreras en Canadá, México, Colombia, Argentina y España',
    subtitle: 'Las contrarrelojes arrancan mañana; convertimos los cuatro eventos élite más importantes a la hora local de cada país',
    excerpt:
      'Guía práctica de horarios del Mundial de ruta 2026 en Montreal, convertidos a hora local de Canadá, México, Colombia, Argentina y España: las dos contrarrelojes de este domingo y las dos carreras en línea que cierran la cita.',
    content: worldsScheduleByCountryContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://ciclismoaldia.es/ciclismo/mundial-de-ciclismo-montreal-2026-donde-verlo-por-television-online-y-en-directo-en-espana-y-latinoamerica',
      'https://www.eldiario.es/spin/deportes/mundial-ciclismo-ruta-montreal-2026-contrarreloj-lista-espana-calendario-horario-donde-ver-tv-pm_1_13523479.html',
      'https://www.rouleur.cc/racing/world-championships-2026-mens-time-trial-preview-montreal',
      'https://en.wikipedia.org/wiki/2026_UCI_Road_World_Championships',
    ]),
    sourceNames: toJsonField(['CiclismoAlDia', 'El Diario', 'Rouleur', 'Wikipedia']),
    seoTitle: 'Horarios del Mundial de Montreal 2026 por país: México, Colombia, Argentina, España',
    seoDescription:
      'Todos los horarios del Mundial de ciclismo en ruta 2026 convertidos a la hora local de Canadá, México, Colombia, Argentina y España: contrarrelojes y carreras en línea.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'horarios-mundial-montreal-paises-2026' },
    update: {
      ...baseFields,
      races: race ? { set: [{ id: race.id }] } : undefined,
    },
    create: {
      slug: 'horarios-mundial-montreal-paises-2026',
      ...baseFields,
      publishedAt: new Date(),
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Cierre del Tour de Luxemburgo: Van der Poel gana la etapa 5 en una
// fuga en solitario de 175 km; Piganzoli campeón general.
// Fuentes: Cyclingnews, Escape Collective, Team Visma | Lease a Bike,
// Cyclismactu (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const luxembourgFinalStageContent = `
<p>El Tour de Luxemburgo 2026 se cerró este domingo con dos historias que resumen bien lo que fue toda la semana. Mathieu van der Poel (Alpecin-Premier Tech) ganó la quinta y última etapa con una fuga en solitario casi desde el kilómetro cero, de las que quedan en la memoria durante años. Y Davide Piganzoli (Visma | Lease a Bike), el corredor que se había ido construyendo un liderato discreto en las tres jornadas centrales, se coronó campeón general — su primera gran victoria por etapas en el WorldTour.</p>

<p><strong>Exhibición histórica:</strong> Van der Poel resistió el pulso de todo el pelotón prácticamente en solitario durante los 177&nbsp;km completos de la quinta etapa — atacó a los pocos kilómetros de la salida en Luxemburgo, y de esos 177&nbsp;km totales completó 174 completamente solo, sin que nadie lograra siquiera acercarse a tiempo de disputarle la victoria.</p>

<p>Lo de Van der Poel no fue un ataque más. Se marchó del pelotón prácticamente al inicio de los 177&nbsp;km entre Luxemburgo y Luxemburgo-Limpertsberg, y no lo volvieron a ver: completó 174 de esos 177 kilómetros en solitario, llegando a meta con más de un minuto de ventaja sobre el resto del pelotón. &laquo;Al principio pensé que los perseguidores me alcanzarían, pero seguí rodando a mi potencia y la diferencia volvió a crecer, así que en ese momento decidí ir a por todas hasta meta&raquo;, explicó después. Es el tipo de decisión que solo toma un corredor con margen de sobra en las piernas — y también, según reconoció el propio neerlandés, una manera de cerrar con autoridad una semana que había empezado ganando la etapa 1 y perdiendo el liderato apenas veinticuatro horas después.</p>

<p>Ese cierre en solitario deja a Van der Poel con dos victorias de etapa en cinco días de carrera —la primera y la última—, sin haber estado nunca realmente en la pelea por la general. Es, exactamente, el resultado que había ido a buscar a Luxemburgo: no ganar la clasificación general, sino llegar al Mundial de Montreal con piernas de carrera después de su bloque de mountain bike. Con la contrarreloj masculina del Mundial disputándose este mismo domingo, la exhibición de Limpertsberg llega en el momento justo para su moral de cara a la prueba en línea del 27 de septiembre.</p>

<p>Detrás de esa fuga, la pelea por el podio de etapa también tuvo su propio mérito: Mikkel Honoré (EF Education-EasyPost) resistió en segundo lugar, y Pepijn Reinderink (Soudal Quick-Step) completó el podio, sumando así un resultado más a una semana en la que ya había firmado su primera victoria profesional en la etapa reina del viernes.</p>

<p>Para Davide Piganzoli, el domingo no exigía ganar la etapa — exigía no perder la general. Y no la perdió: terminó cuarto en meta, con el mismo tiempo que Reinderink, una posición más que suficiente para blindar la ventaja que había construido en las dos jornadas anteriores. &laquo;Estoy extremadamente contento con nuestro rendimiento esta semana&raquo;, resumió el italiano al término de la carrera, y en declaraciones a medios franceses añadió: &laquo;Genial terminar con un resultado así&raquo;. La clasificación general final quedó con Piganzoli como campeón, Mattéo Vercher segundo y Thomas Gachignard tercero — ambos de TotalEnergies, que se lleva dos plazas del podio final pese a no haber ganado ni una sola etapa en toda la semana.</p>

<p>El resumen de la carrera, visto en conjunto, cuenta la historia de un Tour de Luxemburgo que cambió de protagonista casi cada día: Van der Poel ganó y lideró la etapa 1, Marijn van den Berg le arrebató el maillot en la etapa 2, Reinderink sorprendió con su primera victoria profesional en la etapa reina del viernes mientras Piganzoli tomaba el liderato, el propio Piganzoli lo blindó ganando también la crono de Ettelbruck el sábado, y Van der Poel cerró el domingo con la actuación más vistosa de toda la semana sin que eso alterara ya nada en la general. Pocas carreras de cinco días dejan un resumen tan completo de lo que puede ofrecer el ciclismo de principio a fin: sorpresas, especialistas, favoritos que cumplen a medias y un ganador que, sin ser el nombre más mediático de la carrera, termina siendo el más completo de todos.</p>

<p>Para Piganzoli, de 23 años y en su primera temporada plena en el WorldTour tras su fichaje por Visma | Lease a Bike, el triunfo confirma en carrera lo que el equipo ya sospechaba en los entrenamientos: un corredor capaz de ganar en la montaña, de rendir contra el reloj y de gestionar una ventaja mínima durante tres días consecutivos sin cometer errores. Para un equipo que lo fichó pensando en convertirlo en referencia de Grand Tour a medio plazo, el Tour de Luxemburgo 2026 queda como la primera prueba real de que ese plan va por buen camino.</p>

<p>El cierre de esta carrera llega, además, en el momento justo del calendario. El propio domingo en que se decidía el Tour de Luxemburgo, la contrarreloj masculina del Mundial de Montreal se disputaba en paralelo, con Van der Poel como uno de los nombres a seguir tras su exhibición en Limpertsberg. Para el neerlandés, después de una semana repartida entre perder el liderato y ganar dos etapas por su cuenta, la moral con la que llega a Canadá es, cuando menos, la mejor posible dadas las circunstancias — exactamente el efecto que buscaba al elegir Luxemburgo en lugar de las clásicas canadienses como preparación final.</p>
`.trim()

export async function publishLuxembourgFinalStageArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const honore = await prisma.rider.upsert({
    where: { slug: 'mikkel-honore' },
    update: {},
    create: {
      slug: 'mikkel-honore',
      name: 'Mikkel Honoré',
      nationality: 'Dinamarca',
      specialty: 'Ciclismo en ruta',
      bio: 'Ciclista profesional danés del equipo EF Education-EasyPost.',
    },
  })

  const [vdp, piganzoli, reinderink, vercher, gachignard, alpecin, visma, ef, soudal] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'mathieu-van-der-poel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'davide-piganzoli' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'pepijn-reinderink' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'matteo-vercher' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'thomas-gachignard' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'alpecin-premier-tech' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'visma-lease-a-bike' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'ef-education-easypost' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'soudal-quick-step' }, select: { id: true } }),
  ])
  const riderIds = [vdp?.id, piganzoli?.id, reinderink?.id, vercher?.id, gachignard?.id, honore.id].filter(
    (id): id is number => id !== undefined,
  )
  const teamIds = [alpecin?.id, visma?.id, ef?.id, soudal?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('van-der-poel-gana-etapa-5-piganzoli-campeon-luxemburgo-2026', {
    url: '/images/headers/vdp-luxembourg-final-cover.jpg',
    altText: 'Brutal exhibición de Van der Poel: escapada en solitario de 175 km en la etapa final de Luxemburgo',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Brutal exhibición de Van der Poel: una escapada en solitario de 175 km en la etapa final de Luxemburgo',
    subtitle: 'El neerlandés completó 174 de 177 km en fuga para cerrar la semana con dos victorias de etapa; Piganzoli, de Visma | Lease a Bike, se lleva su primera gran general del WorldTour',
    excerpt:
      'Mathieu van der Poel cerró el Tour de Luxemburgo 2026 con una fuga en solitario de 174 km en la etapa 5. Davide Piganzoli, cuarto en meta, se coronó campeón general por delante de Mattéo Vercher y Thomas Gachignard, ambos de TotalEnergies.',
    content: luxembourgFinalStageContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/racing/tour-de-luxembourg-extraordinary-scenes-as-mathieu-van-der-poel-wins-final-stage-with-jaw-dropping-solo-from-start-to-finish/',
      'https://escapecollective.com/van-der-poel-spends-175-km-solo-to-win-final-stage-in-luxembourg/',
      'https://cyclinguptodate.com/cycling/results-tour-de-luxembourg-2026-stage-5-mathieu-van-der-poel-completes-astonishing-170km-solo-raid-as-davide-piganzoli-seals-overall-victory',
      'https://www.teamvismaleaseabike.com/race-report/news/piganzoli-claims-overall-victory-in-tour-de-luxembourg-after-fourth-place-in-final-stage/',
      'https://www.cyclismactu.net/news-cyclisme-tour-de-luxembourg-davide-piganzoli-genial-de-conclure-avec-un-tel-resultat-96105.html',
    ]),
    sourceNames: toJsonField([
      'Cyclingnews',
      'Escape Collective',
      'CyclingUpToDate',
      'Team Visma | Lease a Bike',
      'Cyclismactu',
    ]),
    seoTitle: 'Brutal exhibición de Van der Poel en la etapa final del Tour de Luxemburgo',
    seoDescription:
      'Mathieu van der Poel gana la etapa 5 del Tour de Luxemburgo con una fuga en solitario de 174 km. Davide Piganzoli se corona campeón general del WorldTour.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'van-der-poel-gana-etapa-5-piganzoli-campeon-luxemburgo-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { set: teamIds.map((id) => ({ id })) } : undefined,
    },
    create: {
      slug: 'van-der-poel-gana-etapa-5-piganzoli-campeon-luxemburgo-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: teamIds.length ? { connect: teamIds.map((id) => ({ id })) } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Evenepoel gana su cuarta crono mundial consecutiva, iguala el
// récord de Cancellara y Martin. Fuentes: Cyclingnews, Cycling
// Weekly, Domestique Cycling (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const evenepoelFourthTTTitleContent = `
<p>Remco Evenepoel (Soudal Quick-Step) hizo historia este domingo en Montreal: ganó la contrarreloj individual élite del Mundial de ruta por cuarta vez consecutiva, y con ese resultado igualó el récord de más títulos mundiales de contrarreloj que hasta ahora compartían el suizo Fabian Cancellara y el alemán Tony Martin, con cuatro cada uno. La diferencia es que ni Cancellara ni Martin los ganaron de forma consecutiva — Evenepoel es el primer corredor en toda la historia de la prueba, disputada desde 1994, en encadenar cuatro títulos seguidos.</p>

<p>El belga completó los 39,2&nbsp;km del trazado montrealés en 44:53, a una media de 52,4&nbsp;km/h, y fue el único corredor de todo el día en bajar de los 45 minutos. Filippo Ganna, su rival más directo sobre el papel, tuvo que conformarse otra vez con la plata, a 57 segundos — la tercera vez consecutiva que el italiano termina segundo por detrás de Evenepoel en un Mundial de contrarreloj. El bronce fue para la gran sorpresa de la jornada: Paul Seixas, francés de 19 años, a 1:13 del ganador.</p>

<p>El trazado no dejaba mucho margen para sorpresas de recorrido: 39,2&nbsp;km mayormente llanos junto al río San Lorenzo, con apenas 220&nbsp;metros de desnivel acumulado, pensados para premiar la posición aerodinámica sostenida durante más de tres cuartos de hora. Era, sobre el papel, el terreno perfecto para Evenepoel — y el belga lo confirmó desde el primer parcial, donde ya marcaba la referencia, hasta el repecho final antes de meta, donde ni siquiera perdió el ritmo que había impuesto desde la salida.</p>

<p>&laquo;Es increíble. Obviamente el objetivo era venir aquí y ganar por cuarta vez consecutiva. Fue una motivación muy grande&raquo;, dijo Evenepoel tras cruzar la meta. &laquo;Solo tengo que agradecer a todo el equipo a mi alrededor por la preparación, y a Specialized por el material nuevo que hicieron&raquo;. Son palabras que resumen bien lo que ha sido su temporada contrarreloj: tres victorias en tres cronos disputadas antes de Montreal, incluida una reciente en el GP de Quebec, y una exhibición sobre Tadej Pogačar por 28 segundos en la única contrarreloj individual del Tour de Francia de este verano. Llegaba a Canadá sin haber perdido una sola vez en 2026 contra el reloj, y se va de Canadá exactamente igual.</p>

<p>Su racha de títulos mundiales de contrarreloj arrancó en Glasgow 2023, siguió en Zúrich 2024 y Kigali 2025, y se corona ahora en Montreal — cuatro ciudades, cuatro continentes distintos, cuatro victorias seguidas en una disciplina donde ni siquiera los especialistas más dominantes de la historia habían logrado hilar más de tres. Para dimensionar lo insólito de la racha: ni Cancellara ni Martin, pese a sumar cuatro arcoíris cada uno a lo largo de sus carreras, consiguieron nunca defender el título dos años seguidos de forma consecutiva.</p>

<p>Pero si el resultado en la parte alta de la general era, hasta cierto punto, previsible, la sorpresa del día llegó en el tercer escalón del podio. Paul Seixas, con apenas 19 años y en su primera temporada completa con Decathlon CMA CGM, terminó a solo 16 segundos de Ganna — un resultado que confirma que su 2026 no ha sido casualidad. El francés ya había ganado el título júnior de contrarreloj en el Mundial de 2024, pero este año dio el salto definitivo: se llevó el Tour del País Vasco, y ganó la Flecha Valona convirtiéndose en el vencedor más joven de la historia de esa clásica. &laquo;Es la prueba definitiva de que soy uno de los especialistas&raquo;, dijo tras la carrera, guiado en su preparación por el seleccionador francés Thomas Voeckler. &laquo;Quizás algún día pueda aspirar al primer puesto&raquo;.</p>

<p>El título de este domingo se suma además a un palmarés que ya era extraordinario para un corredor de apenas 26 años: campeón olímpico de contrarreloj y de ruta en los mismos Juegos de París 2024 —el primer ciclista masculino en la historia en lograr ese doblete—, campeón del mundo en ruta en 2023, y ahora cuatro arcoíris consecutivos contra el reloj. Pocas veces un solo corredor ha dominado de forma tan simultánea las dos grandes disciplinas del ciclismo de un día — la ruta y la contrarreloj — durante un período tan largo.</p>

<p>El resultado deja además una lectura clara de cara a la prueba en línea masculina que cierra el Mundial el próximo domingo 27 de septiembre. Evenepoel llega a Montreal en el mejor estado de forma posible, con la moral de un récord histórico recién conseguido, y se suma a la lista de favoritos que ya manejábamos esta semana —Del Toro, Van der Poel, Van Aert— con un argumento que ninguno de ellos puede igualar ahora mismo: no ha perdido ni una sola contrarreloj en toda la temporada. Ganna, por su parte, tendrá que esperar una vez más para colgarse su primer arcoíris individual en esta disciplina, algo que empieza a pesar tanto en su palmarés como en las conversaciones sobre su carrera: tres platas consecutivas ante el mismo rival son, a estas alturas, casi tan difíciles de digerir como una derrota.</p>

<p>Para Seixas, el podio de Montreal llega apenas unos días antes de cumplir 20 años, y confirma una temporada que ya lo había situado en la conversación sobre las nuevas generaciones del pelotón. De cara a la prueba en línea masculina del próximo domingo, su nombre entra ahora también en la lista de corredores a vigilar — no como favorito, pero sí como el tipo de corredor joven capaz de aprovechar cualquier grieta que dejen los favoritos habituales.</p>
`.trim()

export async function publishEvenepoelFourthTTTitleArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [evenepoel, ganna, seixas, race, soudal] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'remco-evenepoel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'filippo-ganna' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'paul-seixas' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'soudal-quick-step' }, select: { id: true } }),
  ])
  const riderIds = [evenepoel?.id, ganna?.id, seixas?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('evenepoel-cuarto-titulo-mundial-crono-2026', {
    url: '/images/headers/evenepoel-4th-tt-cover.jpg',
    altText: 'Evenepoel gana su cuarta crono mundial consecutiva e iguala el récord histórico',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Evenepoel gana su cuarta crono mundial consecutiva e iguala el récord histórico',
    subtitle: 'El belga bate a Ganna por 57 segundos y se convierte en el primer corredor en encadenar cuatro títulos mundiales de contrarreloj seguidos; el francés Paul Seixas, de 19 años, sorprende con el bronce',
    excerpt:
      'Remco Evenepoel ganó la contrarreloj élite del Mundial de Montreal por cuarta vez consecutiva, igualando el récord de Fabian Cancellara y Tony Martin (4 títulos) pero siendo el primero en lograrlo de forma seguida. Filippo Ganna, plata; Paul Seixas, de 19 años, sorprende con el bronce.',
    content: evenepoelFourthTTTitleContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.cyclingnews.com/pro-cycling/record-breaking-remco-evenepoel-makes-it-four-in-a-row-with-blistering-time-trial-performance-in-montreal/',
      'https://www.cyclingweekly.com/road-world-championships/remco-evenepoel-crushes-world-championships-elite-mens-time-trial-in-montreal-to-win-his-fourth-consecutive-title',
      'https://www.domestiquecycling.com/en/news/maybe-one-day-i-can-aim-for-first-paul-seixas-stuns-with-worlds-time-trial-bronze/',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/its-definitive-proof-that-im-one-of-the-specialists-paul-seixas-makes-his-mark-on-world-championships-time-trial-with-podium/',
      'https://www.olympics.com/en/news/remco-evenepoel-wins-gold-paris-2024-cycling-men-invididual-time-trial',
    ]),
    sourceNames: toJsonField(['Cyclingnews', 'Cycling Weekly', 'Domestique Cycling', 'Cyclingnews', 'Olympics.com']),
    seoTitle: 'Evenepoel gana su cuarta crono mundial consecutiva en Montreal 2026',
    seoDescription:
      'Remco Evenepoel gana la contrarreloj élite del Mundial de Montreal por cuarta vez seguida, un récord histórico. Ganna plata, Paul Seixas sorprende con el bronce.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'evenepoel-cuarto-titulo-mundial-crono-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      teams: soudal ? { set: [{ id: soudal.id }] } : undefined,
    },
    create: {
      slug: 'evenepoel-cuarto-titulo-mundial-crono-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      teams: soudal ? { connect: [{ id: soudal.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// La participación de México en el Mundial de Montreal 2026: Del
// Toro 6º en la crono, Hinojosa y Roel top-35 femenino, 26 atletas
// en 6 categorías. Fuentes: Excélsior, Infobae, El Imparcial,
// UnoTV (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const mexicoAtWorldsContent = `
<p>México llegó a Montreal con su delegación más numerosa en años: 26 atletas mexicanos repartidos en las seis categorías del Mundial de ruta 2026, encabezados por Isaac del Toro, cuarto en el ranking UCI y el mexicano mejor posicionado de la historia reciente del ciclismo nacional. Con la contrarreloj ya disputada y la carrera en línea todavía por delante, el balance hasta ahora deja motivos reales para el optimismo.</p>

<p>Del Toro abrió la participación mexicana el domingo con un sexto lugar en la contrarreloj élite masculina, sobre un trazado mayormente llano junto al río San Lorenzo con un repecho final exigente — terreno que en el papel no era el más favorable para un escalador de su perfil. Completó los 39,2&nbsp;km en 46:31.96 —a 1:38.83 del ganador, Remco Evenepoel, que hizo historia con su cuarto título mundial consecutivo—. Es, en los números fríos, una décima ligeramente peor que su quinto puesto de la edición de 2025, pero el contexto importa: la contrarreloj es la disciplina en la que Del Toro menos ha destacado a lo largo de su carrera, y terminar sexto en un campo con los mejores especialistas del mundo, a solo una posición y unos segundos del podio, confirma que su nivel general sigue subiendo incluso en el terreno que menos le favorece — una prueba más de que su margen de mejora, a los 22 años, todavía no ha tocado techo.</p>

<p>La historia más entrañable del día, sin embargo, la protagonizó su pareja. Romina Hinojosa, novia de Isaac del Toro y ya de por sí un nombre propio del ciclismo mexicano tras convertirse este verano en la primera mexicana en terminar el Tour de Francia Femenino, debutó en una contrarreloj de Mundial terminando 28ª, con un tiempo de 56:06.46 — a 5:42.02 de la campeona, Marlen Reusser. Junto a ella, Sara Roel, campeona nacional mexicana de contrarreloj, cerró 33ª con 57:53.48. Entre las dos, México firmó lo que varios medios locales ya describen como una actuación histórica: dos mexicanas dentro del top-35 mundial en la misma prueba, algo que no tenía precedentes recientes para el ciclismo femenino nacional — y una señal concreta de que el crecimiento del ciclismo mexicano ya no depende de un solo nombre.</p>

<p>El resto de la delegación mexicana se reparte entre las pruebas en línea que todavía quedan por disputarse. En la élite masculina, junto a Del Toro correrán Eder Frayre, Edgar Cadena, Ulises Castillo, Carlos García, Antonio Escárcega y Tomás Aguirre — siete corredores en total, la delegación masculina más grande que ha llevado México a un Mundial de ruta en mucho tiempo. En la élite femenina, Hinojosa y Roel se suman a Andrea Ramírez Fregoso, campeona nacional de ruta y primera mexicana en disputar la Vuelta a España Femenina este verano, y a Yareli Salazar, con experiencia olímpica, para completar un cuarteto que buscará dejar huella en la carrera en línea del próximo sábado.</p>

<p>Antes de esa cita masculina, el sábado 26 llega la prueba en línea femenina, de 180,4&nbsp;km sobre el mismo circuito final en el Mont Royal que usarán los hombres al día siguiente. Es la oportunidad de Hinojosa, Roel, Ramírez Fregoso y Salazar de confirmar en un formato distinto —más largo, más táctico, decidido en equipo— lo que ya insinuaron en la contrarreloj: que el ciclismo femenino mexicano tiene, por primera vez en mucho tiempo, un grupo compacto de corredoras compitiendo al nivel que exige un Mundial.</p>

<p>El plato fuerte para México, sin embargo, llega el domingo 27 de septiembre, con la prueba en línea masculina de 273,7&nbsp;km. Del Toro ya figuraba antes del Mundial en la lista de favoritos que manejaba buena parte de la prensa especializada —junto a Evenepoel, Van der Poel y Van Aert— tras su victoria en el GP de Montreal disputado sobre este mismo circuito hace apenas unas semanas. Ese antecedente, sumado a su sexto puesto en la crono y a la confianza que da haber subido al podio del Tour de Francia este verano, mantiene a México con una opción real de pelear por una medalla en la prueba que de verdad reparte el maillot arcoíris más codiciado del calendario.</p>

<p>El resto del equipo masculino tendrá un papel decisivo en esa carrera, aunque no aparezca en los titulares. Con 273,7&nbsp;km por delante y doce vueltas al circuito final de Montreal, ningún corredor gana un Mundial en línea solo: hace falta un equipo que controle el ritmo, cierre huecos y proteja a su líder hasta el momento exacto en que decida atacar. Frayre, Cadena, Castillo, García, Escárcega y Aguirre serán esos seis compañeros — corredores que probablemente no figuren entre los favoritos individuales, pero de cuyo trabajo silencioso depende en gran medida que Del Toro llegue con piernas frescas a la parte decisiva de la carrera.</p>

<p>Lo que deja esta primera jornada, en cualquier caso, va más allá de los resultados individuales. Un país que durante décadas tuvo en Raúl Alcalá su única referencia real en el ciclismo de élite europeo hoy lleva a un Mundial a 26 atletas, con un candidato a medalla en la prueba reina y dos mujeres marcando récords propios el mismo fin de semana. Es, en el sentido más literal, la generación más numerosa y más competitiva que el ciclismo mexicano ha llevado nunca a una cita de este nivel — y todavía quedan por delante los dos días de carreras en línea que de verdad pueden marcar la diferencia en la historia reciente del deporte en el país.</p>
`.trim()

export async function publishMexicoAtWorldsArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [hinojosa, roel, ramirezFregoso] = await Promise.all([
    prisma.rider.upsert({
      where: { slug: 'romina-hinojosa' },
      update: {},
      create: {
        slug: 'romina-hinojosa',
        name: 'Romina Hinojosa',
        nationality: 'México',
        specialty: 'Ciclismo en ruta',
        bio: 'Ciclista profesional mexicana, primera mexicana en terminar el Tour de Francia Femenino (2026).',
      },
    }),
    prisma.rider.upsert({
      where: { slug: 'sara-roel' },
      update: {},
      create: {
        slug: 'sara-roel',
        name: 'Sara Roel',
        nationality: 'México',
        specialty: 'Contrarreloj',
        bio: 'Ciclista profesional mexicana, campeona nacional de contrarreloj.',
      },
    }),
    prisma.rider.upsert({
      where: { slug: 'andrea-ramirez-fregoso' },
      update: {},
      create: {
        slug: 'andrea-ramirez-fregoso',
        name: 'Andrea Ramírez Fregoso',
        nationality: 'México',
        specialty: 'Ciclismo en ruta / Contrarreloj',
        bio: 'Ciclista profesional mexicana nacida en Zapopan, Jalisco. Campeona nacional de ruta y primera mexicana en disputar la Vuelta a España Femenina (2026).',
      },
    }),
  ])

  const [delToro, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [delToro?.id, hinojosa.id, roel.id, ramirezFregoso.id].filter(
    (id): id is number => id !== undefined,
  )

  const grandTourTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('mexico-en-mundial-montreal-2026', {
    url: '/images/headers/mexico-worlds-cover.jpg',
    altText: 'México en el Mundial de Montreal: Del Toro sexto en la crono, Hinojosa hace historia',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'La participación de México en el Mundial de Montreal: Del Toro sexto en la crono, Hinojosa hace historia',
    subtitle: '26 atletas mexicanos compiten en Canadá; Del Toro llega como favorito a la prueba en línea del 27 de septiembre tras terminar sexto en la contrarreloj',
    excerpt:
      'México lleva su delegación más numerosa en años al Mundial de Montreal 2026: 26 atletas en seis categorías. Isaac del Toro terminó sexto en la contrarreloj élite, mientras Romina Hinojosa y Sara Roel firmaron una actuación histórica en la femenina.',
    content: mexicoAtWorldsContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.infobae.com/mexico/deportes/2026/09/19/isaac-del-toro-y-la-delegacion-mexicana-que-competira-en-el-mundial-de-ciclismo-de-ruta-montreal-2026/',
      'https://www.excelsior.com.mx/deportes/isaac-toro-lider-seleccion-mexicana-mundial-ciclismo-ruta-2026-montreal',
      'https://www.elhorizonte.mx/deportes/del-toro-queda-en-6-lugar-en-contrarreloj-mundial-de-ruta-2026/2274631462',
      'https://www.elimparcial.com/deporte/2026/09/20/romina-hinojosa-novia-de-isaac-del-toro-debuto-en-la-contrarreloj-del-mundial-de-ciclismo-como-le-fue/',
      'https://www.unotv.com/deportes/romina-hinojosa-termina-en-el-lugar-28-de-la-contrarreloj-femenina-del-mundial-de-ruta/',
    ]),
    sourceNames: toJsonField(['Infobae', 'Excélsior', 'El Horizonte', 'El Imparcial', 'UnoTV']),
    seoTitle: 'México en el Mundial de Montreal 2026: Del Toro, Hinojosa y Roel',
    seoDescription:
      'La delegación mexicana en el Mundial de ciclismo de Montreal 2026: Isaac del Toro sexto en la contrarreloj, Romina Hinojosa y Sara Roel en el top-35 femenino.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'mexico-en-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: grandTourTag.id }] },
    },
    create: {
      slug: 'mexico-en-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: grandTourTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Omar Andrade, la siguiente generación del semillero de Del Toro,
// debuta en la crono junior del Mundial el martes 22.
// Fuentes: El Imparcial, ESPN México, Wikipedia, ClaroSports,
// Cyclingnews (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const omarAndradeContent = `
<p>Mientras la atención en Montreal se concentra en Isaac del Toro y su sexto puesto en la contrarreloj élite, otro mexicano se prepara para debutar en un Mundial siguiendo casi al pie de la letra el mismo camino que llevó a Del Toro hasta el podio del Tour de Francia. Omar Andrade Fernández, de 18 años, correrá este martes 22 de septiembre la contrarreloj individual junior masculina — 20,3&nbsp;km con salida a las 12:15 hora de Montreal—, su segunda participación en un Campeonato Mundial de ruta.</p>

<p>Andrade nació el 26 de febrero de 2008 y forma parte del equipo Sub-19 varonil de A.R. Monex Pro Cycling Team para la temporada 2026. En su palmarés nacional destacan el título de campeón mexicano juvenil A de contrarreloj en 2023 y el campeonato nacional de ruta en la categoría juvenil B — resultados que lo consolidaron como una de las piezas centrales de la cantera del equipo antes de dar el salto a competir en Europa bajo sus colores.</p>

<p>No es la primera vez que Andrade viste los colores de México en una cita mundialista: en la edición de 2025, disputada en Kigali, Ruanda, ya había debutado en la contrarreloj junior, donde terminó en el puesto 45. Llega a Montreal, por tanto, con la experiencia de un primer Mundial ya digerida y el objetivo lógico de mejorar esa posición en un trazado más corto que el de Ruanda y sobre un circuito que, en la categoría élite, ya dejó esta semana a Remco Evenepoel por debajo de los 45 minutos en un recorrido de doble longitud.</p>

<p>El nombre de A.R. Monex es, para cualquier aficionado mexicano al ciclismo, sinónimo de una sola cosa: el proyecto que llevó a Isaac del Toro desde Ensenada hasta el UAE Team Emirates. El equipo está registrado como Continental UCI en San Marino desde 2021 — el primero en hacerlo desde el Amica Chips-Knauf en 2009 —, dirigido por los hermanos mexicanos Luis y Alejandro Rodríguez Acevedo, con el objetivo explícito de desarrollar talento sub-23 nacional en el circuito europeo. Del Toro se integró al proyecto en 2019, antes de esa formalización como equipo Continental, y permaneció bajo sus colores hasta finales de 2023, cuando su victoria en el Tour de l'Avenir le abrió las puertas del WorldTour. Andrade, en ese sentido, no es solo un compañero más de cantera: es la generación que entrena bajo la misma estructura, con el ejemplo de Del Toro como prueba viviente de que el modelo funciona.</p>

<p>Conviene precisar que las fuentes no coinciden del todo sobre la cronología exacta del proyecto — algunos medios ubican la llegada de Del Toro al equipo en 2019, cuando A.R. Monex aún operaba como estructura de desarrollo antes de su registro formal como Continental en San Marino en 2021 — pero el hilo conductor es el mismo en todas las versiones: un programa mexicano, financiado y dirigido por mexicanos, pensado específicamente para llevar a corredores jóvenes del ciclismo nacional al pelotón europeo. Ese programa incluye pruebas de selección físicas y psicológicas y programas de desarrollo de entre cuatro y ocho años, según ha detallado el propio equipo en entrevistas — el mismo proceso, en esencia, por el que pasó Andrade antes de ganar sus dos títulos nacionales.</p>

<p>El título juvenil A de contrarreloj que Andrade conquistó en 2023 no es un dato menor: en el ciclismo de formación mexicano, la contrarreloj nacional juvenil suele ser el filtro donde se mide con mayor objetividad el potencial de un corredor, al eliminar variables tácticas y de equipo que sí pesan en una carrera en ruta. Sumar a ese título el campeonato nacional en ruta de la categoría juvenil B —conseguido en una edición anterior, ya como corredor de menor edad dentro de esa categoría— habla de una doble aptitud, tanto contrarrelojista como de carrera de fondo, poco común en corredores de su generación.</p>

<p>En la contrarreloj junior de este martes, Andrade no estará solo representando a México: lo acompañan José Emilio Rodríguez Delgado y Daniel Santiago Moreno García, que completan el equipo junior varonil mexicano en Montreal. Es, en conjunto, la delegación juvenil más nutrida que ha llevado el país a un Mundial de ruta en los últimos años — una señal más de que el trabajo de scouting que A.R. Monex realiza anualmente en México empieza a rendir frutos en profundidad, no solo en la punta de lanza que representa Del Toro.</p>

<p>La prueba llega, además, en una semana en la que el resto de la delegación mexicana ya dejó una huella histórica en Montreal: Del Toro terminó sexto en la crono élite masculina, Romina Hinojosa fue 28ª en la femenina y Sara Roel, campeona nacional de la especialidad, 33ª. Ese desempeño colectivo —el mejor que México ha mostrado en un Mundial de ciclismo de ruta en años recientes— es precisamente el telón de fondo sobre el que se mide la actuación de Andrade: no como un caso aislado, sino como la base de una pirámide que, por primera vez en mucho tiempo, tiene relevo generacional visible en más de una categoría a la vez.</p>

<p>Nada de esto garantiza, por supuesto, un resultado concreto el martes. La contrarreloj es una disciplina que recompensa la experiencia acumulada tanto como el talento puro, y a los 18 años, con un solo Mundial anterior en las piernas, lo razonable es medir el progreso de Andrade en términos relativos más que en posiciones absolutas. Pero el mero hecho de que México vuelva a presentarse con un corredor de la cantera de A.R. Monex en la misma prueba que unos años atrás corría un adolescente de Ensenada hoy convertido en podio del Tour de Francia, es en sí mismo la historia: la de un país que dejó de depender de una sola generación dorada y empezó, en cambio, a construir una línea de producción.</p>
`.trim()

export async function publishOmarAndradeArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const andrade = await prisma.rider.upsert({
    where: { slug: 'omar-andrade' },
    update: {},
    create: {
      slug: 'omar-andrade',
      name: 'Omar Andrade Fernández',
      nationality: 'México',
      specialty: 'Contrarreloj',
      bio: 'Ciclista mexicano nacido el 26 de febrero de 2008. Corre con el equipo Sub-19 de A.R. Monex Pro Cycling Team, el mismo semillero que formó a Isaac del Toro. Campeón nacional juvenil A de contrarreloj (2023) y nacional de ruta juvenil B.',
    },
  })

  const [delToro, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [andrade.id, delToro?.id].filter((id): id is number => id !== undefined)

  const ultimaHoraTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('omar-andrade-crono-junior-mundial-2026', {
    url: '/images/headers/omar-andrade-cover-v2.jpg',
    altText: 'Un futuro muy presente en el ciclismo mexicano',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Omar Andrade, la siguiente generación del semillero de Del Toro, debuta en la crono junior del Mundial',
    subtitle: 'El mexicano de 18 años, del mismo equipo A.R. Monex que formó a Isaac del Toro, corre este martes 22 de septiembre su segunda contrarreloj mundialista',
    excerpt:
      'Omar Andrade Fernández, de 18 años y del equipo A.R. Monex —el mismo semillero que llevó a Isaac del Toro al Tour de Francia—, debuta este martes en la contrarreloj junior del Mundial de Montreal, su segunda participación mundialista tras Kigali 2025.',
    content: omarAndradeContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.elimparcial.com/deporte/2026/09/19/equipo-de-mexico-en-el-mundial-de-ciclismo-2026-quienes-son-los-27-mexicanos-que-competiran-con-isaac-del-toro/',
      'https://www.espn.com.mx/ciclismo/nota/_/id/16364648/isaac-del-toro-modelo-a-seguir-ar-monex-ciclismo-mexico',
      'https://en.wikipedia.org/wiki/A.R._Monex_Pro_Cycling_Team',
      'https://www.clarosports.com/ciclismo/a-seguir-los-pasos-de-isaac-del-toro-ciclistas-mexicanos-se-unen-al-monex-pro-cycling-team/',
      'https://www.procyclingstats.com/rider/omar-andrade',
    ]),
    sourceNames: toJsonField(['El Imparcial', 'ESPN México', 'Wikipedia', 'ClaroSports', 'ProCyclingStats']),
    seoTitle: 'Omar Andrade: del semillero de A.R. Monex a la crono junior del Mundial',
    seoDescription:
      'Omar Andrade Fernández, de 18 años y del mismo equipo A.R. Monex que formó a Isaac del Toro, debuta el martes 22 de septiembre en la contrarreloj junior del Mundial de Montreal.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'omar-andrade-crono-junior-mundial-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: ultimaHoraTag.id }] },
    },
    create: {
      slug: 'omar-andrade-crono-junior-mundial-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: ultimaHoraTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Sigue la participación mexicana en el Mundial de Montreal: horarios,
// nombres y categorías de quién compite en los próximos días.
// Fuentes: Wikipedia (2026 UCI Road World Championships), El Imparcial,
// cyclinguptodate.com (ver sourceUrls). Nota: al cierre de esta
// edición no hay resultados publicados aún para la crono mixta por
// equipos ni para las cronos junior de este martes — se actualizará
// en cuanto haya datos oficiales.
// ————————————————————————————————————————————————————————————

const mexicoScheduleContent = `
<p>El Mundial de Ciclismo en Ruta de Montreal 2026 sigue su curso y la delegación mexicana —27 corredores en total, entre élite, Sub-23 y junior— tiene actividad prácticamente todos los días hasta el cierre del domingo 27 de septiembre. Después del sexto lugar de Isaac del Toro y las actuaciones de Romina Hinojosa y Sara Roel en la contrarreloj élite del sábado 20, este martes 22 México vuelve a estar en pista en tres pruebas distintas, todavía sin resultados publicados al momento de esta nota.</p>

<p>Estas son las tres competencias de hoy martes:</p>

<ul>
<li><strong>Contrarreloj mixta por equipos (40.6 km), 8:30 am hora Montreal.</strong> Selección mexicana: Romina Hinojosa, Andrea Ramírez Fregoso y Yareli Salazar por el lado femenil; Édgar Cadena, Sebastián Ruiz y Tomás Aguirre por el varonil. Quince selecciones nacionales toman parte; México sale tres minutos después de Japón. El formato es un relevo por equipos mixtos de seis corredores: los tres hombres cubren la primera mitad del recorrido y, tras el relevo, las tres mujeres completan la segunda mitad, con el tiempo del equipo tomado en el momento en que cruza la meta el tercer integrante de cada tramo.</li>
<li><strong>Contrarreloj junior masculina (20.3 km), 12:15–14:25 hora Montreal.</strong> Representan a México Omar Andrade Fernández, José Emilio Rodríguez Delgado y Daniel Santiago Moreno García.</li>
<li><strong>Contrarreloj junior femenina (10.7 km), 15:15–16:45 hora Montreal.</strong> Categoría en disputa el mismo día; no hay confirmación pública de que la delegación mexicana junior femenil —integrada por Nabyenka Bareño, Natalia Pineda Soto y Gaetana Alhach Sjogren— participe en esta prueba contrarreloj específica, ya que su convocatoria confirmada hasta ahora es para la prueba en ruta del viernes 25.</li>
</ul>

<p>El lunes 21, un día antes, ya había corrido la contrarreloj individual Sub-23, con Mayte Zamudio, Fernanda Zárate, Gissel Borrón y Atzi Paola por México en la rama femenil (20.3 km) y Sebastián Ruiz, Said Cisneros, Leo Cisneros, José Juan Prieto, José Antonio Prieto y Michael Zárate en la varonil (31.3 km). Tampoco de esa prueba hay resultados confirmados con corredores mexicanos en las fuentes consultadas hasta el momento.</p>

<p>Lo que sí quedó confirmado, y ya lo reportamos en su momento, es el resultado de la contrarreloj élite del sábado 20 de septiembre: Isaac del Toro terminó sexto en la rama varonil, con un tiempo de 46:31.96, a 1:38.83 del campeón Remco Evenepoel. En la rama femenil, Romina Hinojosa fue 28ª (56:06.46) y Sara Roel, campeona nacional de la especialidad, 33ª (57:53.48).</p>

<p>Vale la pena poner esta agenda en contexto. En Kigali 2025, la delegación mexicana en el Mundial de ruta fue considerablemente más reducida, y en varias categorías —particularmente junior y Sub-23 femenil— México no llegó a tener representación en todas las pruebas del programa. La lista de 27 corredores convocados para Montreal 2026, cubriendo las seis categorías del calendario (élite, Sub-23 y junior, en ambas ramas), es la delegación más numerosa y completa que el país ha llevado a una cita mundialista de ruta en años recientes. No es casualidad: coincide con el momento de mayor visibilidad internacional que ha tenido el ciclismo mexicano, con Isaac del Toro instalado como tercer lugar del Ranking Mundial UCI, solo detrás de Remco Evenepoel y Tadej Pogačar, y corriendo para el UAE Team Emirates-XRG, uno de los equipos WorldTour más fuertes del pelotón.</p>

<p>Ese crecimiento en el número de convocados no se traduce automáticamente en resultados —eso todavía está por verse conforme avance la semana—, pero sí es un indicador de que el trabajo de las federaciones y los programas de desarrollo nacionales, como el de A.R. Monex Pro Cycling Team en la rama junior, está identificando y llevando a competir internacionalmente a más corredores mexicanos que antes, y no solo en la categoría élite masculina donde tradicionalmente se ha concentrado la atención.</p>

<p>De cara al fin de semana, el calendario de pruebas en ruta —la parte más vistosa del Mundial, donde se define el maillot arcoíris en cada categoría— es el siguiente:</p>

<ul>
<li><strong>Jueves 24 de septiembre:</strong> ruta Sub-23 femenil (134 km) y ruta junior varonil, ambas con representación mexicana confirmada.</li>
<li><strong>Viernes 25 de septiembre:</strong> ruta Sub-23 varonil (174.2 km) y ruta junior femenil (80.4 km).</li>
<li><strong>Sábado 26 de septiembre:</strong> ruta élite femenil (180.1 km), con Hinojosa, Roel, Salazar y Ramírez Fregoso como abanderadas mexicanas.</li>
<li><strong>Domingo 27 de septiembre:</strong> ruta élite varonil (273.4 km), la prueba reina del Mundial, con Isaac del Toro como principal carta mexicana junto con Eder Frayre, Édgar Cadena, Ulises Castillo, José Antonio Escárcega, Carlos García y Tomás Aguirre.</li>
</ul>

<p>Es, en conjunto, la agenda más cargada que México ha tenido en un Mundial de ciclismo de ruta en años recientes: prácticamente ninguna categoría —élite, Sub-23 o junior, en ruta o contrarreloj— se queda sin representación azteca. Entre los nombres a seguir de cerca en las próximas pruebas en ruta, además de Del Toro, está el propio Omar Andrade, quien de terminar su participación en la crono junior de hoy, todavía tendría por delante la prueba en ruta del jueves 24, la misma en la que México también estará representado por José Emilio Rodríguez Delgado y Daniel Santiago Moreno García.</p>

<p>La cobertura televisiva en México corre a cargo de Claro Sports, que ha transmitido en vivo las 14 competencias programadas para Montreal 2026. En cuanto haya resultados oficiales de la crono mixta y de las cronos junior de hoy —ninguna de las páginas de resultados oficiales que consultamos, incluido ProCyclingStats, los tenía publicados al cierre de esta nota—, actualizaremos la cobertura con el detalle de cómo le fue a cada corredor mexicano.</p>
`.trim()

export async function publishMexicoScheduleUpdateArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [delToro, hinojosa, roel, andrade, ramirezFregoso, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'romina-hinojosa' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'sara-roel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'omar-andrade' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'andrea-ramirez-fregoso' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [delToro?.id, hinojosa?.id, roel?.id, andrade?.id, ramirezFregoso?.id].filter(
    (id): id is number => id !== undefined,
  )

  const ultimaHoraTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('mexico-agenda-mundial-montreal-2026', {
    url: '/images/headers/mexico-schedule-update-cover.jpg',
    altText: 'La participación de México continúa en el Mundial de ciclismo de Montreal 2026',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Sigue la participación de México en el Mundial de Montreal: horarios, nombres y categorías',
    subtitle: 'Este martes corren la crono mixta por equipos y las cronos junior; el fin de semana llegan las pruebas en ruta con Isaac del Toro a la cabeza',
    excerpt:
      'Guía completa de la agenda mexicana en el Mundial de ciclismo de Montreal 2026: quién compite, en qué categoría y a qué hora, desde la crono mixta y las cronos junior de este martes hasta las pruebas en ruta del fin de semana.',
    content: mexicoScheduleContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/2026_UCI_Road_World_Championships',
      'https://www.elimparcial.com/deporte/2026/09/19/equipo-de-mexico-en-el-mundial-de-ciclismo-2026-quienes-son-los-27-mexicanos-que-competiran-con-isaac-del-toro/',
      'https://cyclinguptodate.com/cycling/world-championships-2026-continue-tuesday-with-mixed-ttt-and-junior-mens-and-womens-time-trials-start-times-and-how-to-watch',
      'https://cyclinguptodate.com/cycling/start-times-order-world-championships-2026-montreal-team-time-trial-mixed-relay-switzerland-australia-france-italy-and-germany-battle-for-rainbow-jersey',
      'https://www.procyclingstats.com/race/uci-world-championships-itt-mj/2026/result',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'El Imparcial', 'CyclingUpToDate', 'ProCyclingStats']),
    seoTitle: 'Agenda de México en el Mundial de ciclismo de Montreal 2026: horarios y corredores',
    seoDescription:
      'Horarios, nombres y categorías de todos los mexicanos que compiten en el Mundial de ciclismo de Montreal 2026, de la crono mixta de hoy a las pruebas en ruta del fin de semana.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'mexico-agenda-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: ultimaHoraTag.id }] },
    },
    create: {
      slug: 'mexico-agenda-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: ultimaHoraTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Nabyenka Bareño, mejor latinoamericana en la crono junior
// femenina del Mundial de Montreal (13ª, martes 22 de septiembre).
// Fuentes: Infobae, La Crónica de Hoy, Cyclingnews, CyclingUpToDate
// (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const nabyenkaBarenoContent = `
<p>De las tres pruebas mexicanas del martes en el Mundial de Montreal, la más alentadora terminó siendo la que menos reflectores tenía encima. En la contrarreloj junior femenina, Nabyenka Bareño, originaria de Baja California Sur, terminó 13ª entre las mejores juveniles del mundo — y con ese resultado se convirtió en la mejor representante mexicana y también la mejor de toda Latinoamérica en la prueba.</p>

<p>Bareño completó los 10,7&nbsp;km del trazado montrealense en 16:18.15 minutos, a una velocidad promedio de 39.380 km/h, a 1:00.64 minutos de la ganadora, en un pelotón de 58 corredoras de 35 países. No es un margen pequeño frente a la campeona, pero sí lo es frente al resto de Latinoamérica: la siguiente mejor sudamericana en la general, la colombiana Zara Sofía Lamprea —de 17 años, originaria de Bogotá—, terminó apenas un lugar por detrás, en el 14º puesto, con un tiempo prácticamente idéntico (16:18, promedio 39.375 km/h). Bareño le sacó la diferencia mínima que separa a la mejor del continente de la segunda mejor: unas décimas de segundo.</p>

<p>La otra representante mexicana en la prueba, Gaetana Alhach, completó el recorrido en el puesto 37, con un tiempo de 17:08.37 minutos. Entre las dos, México sostuvo una presencia real en una categoría —la contrarreloj junior femenina— donde históricamente el país apenas había figurado.</p>

<p>La corona se la llevó la polaca Maria Okrucińska, de apenas 18 años y radicada en los Países Bajos, con un crono contundente de 15:17.51 —más de 42&nbsp;km/h de promedio— que superó por 12.25 segundos a la belga Yana Decruyenaere (plata, 15:29.76) y por 24.51 segundos a la británica Aalia Clay (bronce, 15:42.02). Para Polonia fue su primer título mundial en ciclismo de ruta en 12 años, desde el oro de Michał Kwiatkowski en Ponferrada 2014, y el esfuerzo de Okrucińska fue tan extremo que, según reportó Cyclingnews, la corredora llegó a desplomarse brevemente al cruzar la meta antes de recuperarse para subir al podio.</p>

<p>El margen entre Bareño y Lamprea —un solo lugar, y unas décimas de segundo en el crono— ilustra algo que se repite en el ciclismo femenino juvenil latinoamericano: el nivel entre las mejores corredoras de la región es cada vez más parejo, lo que en la práctica significa que cualquier detalle de preparación, material o experiencia de carrera puede decidir quién termina siendo "la mejor de Latinoamérica" en una prueba determinada. Que México y Colombia se hayan repartido esas dos primeras posiciones latinoamericanas, y no una sola potencia regional histórica, también dice algo sobre cómo se ha ampliado el mapa de dónde salen las ciclistas jóvenes competitivas del continente. La Federación Colombiana de Ciclismo, de hecho, celebró el resultado de Lamprea como confirmación de su proyección internacional — la misma lectura que cabe hacer del de Bareño para México.</p>

<p>El resultado de Bareño se suma a una semana que, en conjunto, ha sido la más sólida que México ha tenido en un Mundial de ciclismo de ruta en años recientes. El sábado 20, Isaac del Toro fue sexto en la contrarreloj élite masculina (46:31.96, a 1:38.83 del campeón Remco Evenepoel) y Romina Hinojosa (28ª, 56:06.46) y Sara Roel (33ª, 57:53.48) firmaron sus propias actuaciones destacadas en la femenina. El martes 22, además de la prueba de Bareño, México debutó en el relevo mixto por equipos —terminando 14º de 15 selecciones, con Italia llevándose el oro (51:32.28) por delante de Francia (+9s) y Suiza (+20s)— y corrió la contrarreloj junior varonil, donde José Emilio Rodríguez Delgado fue el mejor mexicano en el puesto 22 (26:32.31) y Omar Andrade Fernández terminó 54º (28:12.28), en una prueba que ganó el español Benjamín Noval con 25:17.</p>

<p>Tomadas en conjunto, estas actuaciones —ninguna de ellas una medalla, pero casi todas dentro o cerca del tercio superior de sus respectivas pruebas— dibujan algo más significativo que un resultado aislado: una generación de corredores y corredoras mexicanas jóvenes que, categoría por categoría, ya no llegan a un Mundial solo a completar el recorrido, sino a medirse de tú a tú con las principales potencias del ciclismo europeo. La delegación mexicana en Montreal, de 27 corredores en total entre las categorías élite, Sub-23 y junior, todavía tiene por delante las pruebas en ruta del fin de semana: la junior varonil y la Sub-23 femenil el jueves 24, la Sub-23 varonil y la junior femenil —donde Bareño y Alhach tendrán otra oportunidad— el viernes 25, la élite femenil el sábado 26 y, para cerrar el Mundial, la élite varonil el domingo 27 con Isaac del Toro como principal carta mexicana.</p>
`.trim()

export async function publishNabyenkaBarenoArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const bareno = await prisma.rider.upsert({
    where: { slug: 'nabyenka-bareno' },
    update: {},
    create: {
      slug: 'nabyenka-bareno',
      name: 'Nabyenka Bareño',
      nationality: 'México',
      specialty: 'Contrarreloj',
      bio: 'Ciclista mexicana originaria de Baja California Sur. En septiembre de 2026 fue 13ª en la contrarreloj junior femenina del Mundial de ciclismo de Montreal, la mejor actuación de una mexicana y de una latinoamericana en la prueba.',
    },
  })

  const alhach = await prisma.rider.upsert({
    where: { slug: 'gaetana-alhach-sjogren' },
    update: {},
    create: {
      slug: 'gaetana-alhach-sjogren',
      name: 'Gaetana Alhach',
      nationality: 'México',
      specialty: 'Contrarreloj',
      bio: 'Ciclista mexicana junior. Compitió en la contrarreloj junior femenina del Mundial de ciclismo de Montreal 2026, donde terminó en el puesto 37.',
    },
  })

  const [delToro, hinojosa, roel, andrade, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'romina-hinojosa' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'sara-roel' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'omar-andrade' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [bareno.id, alhach.id, delToro?.id, hinojosa?.id, roel?.id, andrade?.id].filter(
    (id): id is number => id !== undefined,
  )

  const ultimaHoraTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('nabyenka-bareno-crono-junior-mundial-2026', {
    url: '/images/headers/nabyenka-bareno-cover.jpg',
    altText: 'Crono junior femenina mexicana: Nabyenka Bareño fue 13ª, la mejor latinoamericana de la prueba',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Nabyenka Bareño, la mejor latinoamericana en la crono junior femenina del Mundial de Montreal',
    subtitle: 'La mexicana terminó 13ª en la contrarreloj junior, por delante de toda Sudamérica, en una jornada en la que Polonia y Maria Okrucińska se coronaron campeonas',
    excerpt:
      'Nabyenka Bareño fue 13ª en la contrarreloj junior femenina del Mundial de Montreal 2026, la mejor actuación mexicana y latinoamericana de la prueba, que ganó la polaca Maria Okrucińska.',
    content: nabyenkaBarenoContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.infobae.com/mexico/deportes/2026/09/23/nabyenka-bareno-pone-a-mexico-y-latinoamerica-entre-las-mejores-ciclistas-de-la-prueba-contrarreloj-junior-en-montreal-2026/',
      'https://www.cronica.com.mx/deportes/2026/09/22/nabyenka-bareno-brilla-en-montreal-2026-firma-la-mejor-actuacion-mexicana-en-la-contrarreloj-junior/',
      'https://www.cyclingnews.com/pro-cycling/womens-cycling/road-world-championships-maria-okrucinska-smashes-junior-womens-time-trial-to-take-gold-for-poland-in-montreal/',
      'https://cyclinguptodate.com/cycling/results-world-championships-junior-womens-time-trial-maria-okrucinska-crowned-world-champion-in-montreal-as-britains-aalia-clay-takes-third',
      'https://federacioncolombianadeciclismo.com/zara-lamprea-firma-un-destacado-decimocuarto-lugar-en-la-cri-junior-del-mundial-de-montreal/',
    ]),
    sourceNames: toJsonField(['Infobae', 'La Crónica de Hoy', 'Cyclingnews', 'CyclingUpToDate', 'Federación Colombiana de Ciclismo']),
    seoTitle: 'Nabyenka Bareño, 13ª y mejor latinoamericana en la crono junior del Mundial 2026',
    seoDescription:
      'Nabyenka Bareño terminó 13ª en la contrarreloj junior femenina del Mundial de Montreal 2026, la mejor actuación mexicana y latinoamericana de la prueba, ganada por la polaca Maria Okrucińska.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'nabyenka-bareno-crono-junior-mundial-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: ultimaHoraTag.id }] },
    },
    create: {
      slug: 'nabyenka-bareno-crono-junior-mundial-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: ultimaHoraTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Richard Carapaz se retira del Mundial de Montreal 2026 por
// complicaciones de salud (anunciado el 19 de septiembre).
// Fuentes: El Comercio, GolCaracol/Noticias Caracol, El Telégrafo,
// esciclismo.com (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const carapazWithdrawalContent = `
<p>Richard Carapaz no estará en la línea de salida de la prueba en ruta élite del Mundial de ciclismo de Montreal 2026, programada para el domingo 27 de septiembre. El ecuatoriano confirmó su baja el 19 de septiembre por "complicaciones de salud" que no detalló públicamente, apenas seis días después de haber completado la Vuelta a España.</p>

<p>"Lo más responsable es priorizar mi salud y enfocarme en una pronta recuperación", declaró Carapaz al anunciar la decisión, tomada de manera conjunta con su equipo de rendimiento tras una evaluación médica. El corredor de Carchi notificó formalmente su ausencia a la Federación Ecuatoriana de Ciclismo (FEC) y aseguró que continuará su tratamiento con el objetivo de "regresar lo antes posible a los entrenamientos". También dedicó un mensaje a sus compañeros de selección: "Deseo el mayor de los éxitos a toda la delegación tricolor que nos representará".</p>

<p>La baja llega en el cierre de la que ha sido, por resultados, una de las mejores temporadas de la carrera de Carapaz. En 2026 terminó 4º en la clasificación general de la Vuelta a España, a 6:54 del campeón Enric Mas; fue 8º en el Tour de Francia, donde ganó dos etapas y se llevó la clasificación de la montaña; y sumó podios de segundo lugar tanto en el Tour de Suiza como en la Clásica de San Sebastián. Es, en conjunto, el nivel que ya había llevado a este medio a describirlo como uno de los latinoamericanos más completos del año, capaz de competir de igual a igual en montaña, clasicomanía y regularidad general en las tres semanas de una gran vuelta.</p>

<p>Precisamente por eso su ausencia en Montreal se siente como una baja sensible para las aspiraciones de Ecuador y, en términos generales, para la representación latinoamericana en la prueba reina del Mundial. Carapaz ya tiene un antecedente propio en la ruta élite: ganó el Giro de Italia 2019 —el primer ecuatoriano en lograrlo— y el oro olímpico en ruta en Tokio 2020, convirtiéndose en el primer corredor de la historia en combinar un oro olímpico en ruta con podios de general en las tres grandes vueltas. Ese palmarés lo situaba entre los nombres a vigilar en un recorrido de 273,7&nbsp;km, uno de los más exigentes que ha tenido un Mundial de ruta en años recientes.</p>

<p>No es la primera vez que una baja de última hora aparta a Carapaz de un Mundial: en 2024 tuvo que ausentarse por un problema familiar. En esta ocasión, ni él ni su entorno han detallado la naturaleza exacta de las "complicaciones de salud" que motivaron la decisión, y hasta el cierre de esta nota tampoco se ha emitido un comunicado público por parte de EF Education-EasyPost, su equipo de trabajo, sobre el estado del corredor.</p>

<p>La baja de Carapaz no deja a Ecuador sin bandera en Montreal. Jhonatan Narváez, que llega de una temporada 2026 con tres victorias de etapa en el Giro de Italia y el segundo puesto en la general del Tour Down Under, seguirá encabezando a la delegación ecuatoriana en la prueba élite junto con Jefferson Cepeda y Alexander Cepeda, mientras que en la categoría Sub-23 el país estará representado el viernes 25 por Mateo Ramírez y Anthony Coque. Es, con todo, una selección que pierde a su corredor más laureado justo antes de la prueba que corona al campeón del mundo.</p>

<p>La prueba en ruta élite masculina del domingo 27 seguirá adelante con el resto del pelotón, encabezado por nombres como Tadej Pogačar, Remco Evenepoel e Isaac del Toro, mientras Ecuador deberá reconfigurar su estrategia de cara a una cita que, sin su corredor más laureado de la última década, pierde a uno de sus principales aspirantes al podio.</p>
`.trim()

export async function publishCarapazWithdrawalArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [carapaz, delToro, race] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'richard-carapaz' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])
  const riderIds = [carapaz?.id, delToro?.id].filter((id): id is number => id !== undefined)

  const ultimaHoraTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('richard-carapaz-baja-mundial-montreal-2026', {
    url: '/images/headers/richard-carapaz-baja-cover.jpg',
    altText: 'Richard es baja del Mundial: problemas de salud complican su participación y decide no ir',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Richard Carapaz se baja del Mundial de Montreal 2026 por complicaciones de salud',
    subtitle: 'El ecuatoriano, 4º en la Vuelta a España y con dos etapas en el Tour de Francia este año, no correrá la prueba en ruta élite del domingo 27',
    excerpt:
      'Richard Carapaz confirmó su baja del Mundial de ciclismo de Montreal 2026 por complicaciones de salud, seis días después de terminar 4º en la Vuelta a España. No correrá la prueba en ruta élite del 27 de septiembre.',
    content: carapazWithdrawalContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.elcomercio.com/deportes/ciclismo/richard-carapaz-mundial-ciclismo-2026-salud-ecuador/',
      'https://www.noticiascaracol.com/golcaracol/ciclismo/baja-sensible-en-el-mundial-de-ciclismo-2026-he-presentado-complicaciones-de-salud-cb20',
      'https://www.eltelegrafo.com.ec/noticias/deportes/212/ecuador-pierde-a-richard-carapaz-para-el-mundial-de-ciclismo-2026',
      'https://www.esciclismo.com/actualidad/carretera/93138.html',
    ]),
    sourceNames: toJsonField(['El Comercio', 'Noticias Caracol', 'El Telégrafo', 'esciclismo.com']),
    seoTitle: 'Richard Carapaz se retira del Mundial de ciclismo de Montreal 2026',
    seoDescription:
      'Richard Carapaz confirmó su baja del Mundial de Montreal 2026 por complicaciones de salud, tras terminar 4º en la Vuelta a España. No correrá la ruta élite del 27 de septiembre.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'richard-carapaz-baja-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: ultimaHoraTag.id }] },
    },
    create: {
      slug: 'richard-carapaz-baja-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: ultimaHoraTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// Lance Armstrong: la leyenda que se desmoronó — siete Tours de
// Francia, un escándalo de dopaje histórico y una segunda vida en
// los medios del ciclismo. Pieza de Leyendas, no ligada a
// actualidad del día. Fuentes: USADA Reasoned Decision (oct. 2012),
// Wikipedia, NBC Sports, ESPN, CNBC, Velo/Outside (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const lanceArmstrongContent = `
<p>Pocas historias en el deporte moderno combinan una hazaña tan extraordinaria con una caída tan estrepitosa como la de Lance Armstrong. Entre 1999 y 2005 ganó siete Tours de Francia consecutivos, una racha sin precedentes en la historia de la carrera. Una década después, la UCI le retiró los siete títulos, la Agencia Antidopaje de Estados Unidos (USADA) lo sancionó de por vida y su nombre pasó a ser sinónimo, para buena parte del público, de la mentira más elaborada que ha conocido el ciclismo profesional.</p>

<p>La historia empieza, sin embargo, con una hazaña real y verificable que no depende de ninguna sustancia: en 1996, a los 25 años, a Armstrong le diagnosticaron un cáncer testicular en estadio avanzado, ya extendido a los pulmones y al cerebro. Superó la enfermedad con quimioterapia y cirugía, y en 1997 fue declarado libre de cáncer. Ese mismo año fundó la Fundación Lance Armstrong, hoy conocida como Livestrong, que con el tiempo recaudó cerca de 400 millones de dólares para el apoyo a pacientes con cáncer, en buena medida a través de la venta de las pulseras amarillas que llegaron a ser uno de los símbolos benéficos más reconocibles del deporte mundial. Fue sobre esa base —la del superviviente que regresa para dominar el ciclismo más exigente del calendario— que se construyó el mito.</p>

<p>El mito empezó a resquebrajarse mucho antes de su caída oficial. Durante años, Armstrong enfrentó acusaciones de dopaje de excompañeros, periodistas y rivales, y respondió cada vez con negaciones categóricas, demandas legales contra sus acusadores y una defensa pública férrea que incluía el argumento de que nunca había dado positivo en un control antidopaje. La Agencia Antidopaje de Estados Unidos abrió una investigación formal en 2010 y, en junio de 2012, formuló cargos contra él por infracciones de dopaje que, según la agencia, se remontaban a 1998. El 23 de agosto de ese año, Armstrong decidió no llevar el caso a arbitraje, aceptando de manera tácita una sanción de por vida bajo el código de la Agencia Mundial Antidopaje y la descalificación de todos sus resultados desde agosto de 1998.</p>

<p>El 10 de octubre de 2012, la USADA publicó su "Reasoned Decision" ("decisión razonada"), un documento de cientos de páginas con testimonios jurados de 26 testigos —11 de ellos excompañeros de equipo—, además de correos electrónicos, documentos financieros y resultados de laboratorio. El reporte concluyó que Armstrong y el equipo US Postal Service habían operado "el programa de dopaje más sofisticado, profesionalizado y exitoso que el deporte haya visto jamás". Doce días después, el 22 de octubre de 2012, la UCI ratificó la decisión: le retiró los siete títulos del Tour de Francia (1999-2005), 25 victorias de etapa en esa misma carrera, y triunfos en el Dauphiné Libéré de 2002 y 2003 y en el Tour de Suiza de 2001. En enero de 2013, en una entrevista televisada con Oprah Winfrey, Armstrong admitió públicamente por primera vez haber usado sustancias prohibidas —incluyendo EPO y hormona de crecimiento— y haberse sometido a transfusiones de sangre y aplicaciones de testosterona a lo largo de gran parte de su carrera.</p>

<p>Conviene precisar algo que suele perderse en la narrativa simplificada: Armstrong no fue el único gran corredor de su generación señalado por dopaje —el caso Puerto, destapado en 2006, implicó también a Jan Ullrich, campeón del Tour de 1997, entre otros—, pero fue el único al que se le retiraron todos sus títulos de Grand Tour. La diferencia, según ha explicado el análisis especializado del caso, no fue de inocencia sino de procedimiento: el Tribunal de Arbitraje Deportivo solo pudo anular los resultados de Ullrich a partir de mayo de 2005, cuando el plazo de prescripción de ocho años sobre su título de 1997 ya había expirado y ningún organismo había construido un caso con testigos para llegar tan atrás en el tiempo. La USADA, en cambio, argumentó que el encubrimiento activo de Armstrong —sostenido durante su regreso a la competición en 2009 y 2010— constituía una ocultación fraudulenta que mantenía abierto el caso pese a los años transcurridos.</p>

<p>Las consecuencias legales se extendieron varios años más. En 2018, Armstrong llegó a un acuerdo extrajudicial de 5 millones de dólares para cerrar una demanda federal por fraude presentada originalmente por su expcompañero Floyd Landis —quien había confesado su propio dopaje en 2010 y actuó como denunciante (whistleblower) bajo la ley estadounidense—, muy por debajo de los cerca de 100 millones que el gobierno había buscado reclamar.</p>

<p>Más de una década después del escándalo, Armstrong ha encontrado un lugar, todavía debatido pero real, dentro del ciclismo mediático. Desde 2024 forma parte de la cobertura del Tour de Francia de la cadena estadounidense NBC, con su pódcast "The Move" disponible en Peacock tras cada etapa, junto a un elenco rotativo que incluye a Johan Bruyneel, Bradley Wiggins, Spencer Martin y, con una ironía que no pasa desapercibida para quien conoce la historia completa, George Hincapie —el gregario más leal de Armstrong en sus siete Tours, a quien llegó a describir como "un hermano", y uno de los 11 excompañeros cuyo testimonio ante la USADA en 2012 resultó decisivo para destapar el dopaje sistemático del equipo—. NBC ya confirmó su regreso para la cobertura de 2026, y según reportó Bloomberg Businessweek, el programa ha generado alrededor de un millón de dólares de ingresos en cada una de las últimas ediciones del Tour. Es, en cierto sentido, la última vuelta de tuerca de una historia que nunca ha tenido una lectura simple: la de un hombre que fue, a la vez, una inspiración real para millones de pacientes con cáncer y el protagonista de uno de los mayores fraudes deportivos de la historia moderna.</p>
`.trim()

export async function publishLanceArmstrongLegendArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'leyendas' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const armstrong = await prisma.rider.upsert({
    where: { slug: 'lance-armstrong' },
    update: {},
    create: {
      slug: 'lance-armstrong',
      name: 'Lance Armstrong',
      nationality: 'Estados Unidos',
      specialty: 'Grandes vueltas',
      birthDate: new Date('1971-09-18'),
      bio: 'Ciclista estadounidense, ganador de siete Tours de Francia consecutivos (1999-2005), todos ellos retirados en 2012 tras la investigación de la USADA sobre dopaje sistemático en el equipo US Postal Service. Sancionado de por vida por la USADA, admitió públicamente el dopaje en enero de 2013. Sobreviviente de cáncer testicular (1996) y fundador de la Fundación Livestrong.',
      achievements: toJsonField([
        'Siete títulos del Tour de Francia (1999-2005) — retirados en 2012 por la UCI',
        '25 victorias de etapa en el Tour de Francia — anuladas en 2012',
        'Sanción de por vida de la USADA (2012) tras una investigación por dopaje sistemático',
        'Fundador de la Fundación Lance Armstrong / Livestrong (1997), que recaudó cerca de 400 millones de dólares para pacientes con cáncer',
      ]),
      profileVerifiedAt: new Date(),
    },
  })

  const leyendasTag = await prisma.tag.upsert({
    where: { slug: 'leyendas' },
    update: {},
    create: { slug: 'leyendas', name: 'Leyendas', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('lance-armstrong-leyenda-dopaje-2026', {
    url: '/images/headers/lance-armstrong-cover.jpg',
    altText: 'Uno de los más grandes, manchado por el doping: el ascenso y la caída de un héroe',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Lance Armstrong: la leyenda que se desmoronó',
    subtitle: 'Siete Tours de Francia, un escándalo de dopaje histórico y una segunda vida en los medios del ciclismo',
    excerpt:
      'De sobreviviente de cáncer a heptacampeón del Tour de Francia, y de ahí al mayor escándalo de dopaje en la historia del ciclismo: la historia completa de Lance Armstrong, sin atajos.',
    content: lanceArmstrongContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/Lance_Armstrong_doping_case',
      'https://www.espn.com/olympics/cycling/story/_/id/29177227/line-lance-armstrong-career-successes-doping-allegations-final-collapse',
      'https://www.cnbc.com/2018/04/20/lance-armstrong-agrees-to-5-million-settlement-of-government-lawsuit.html',
      'https://www.nbcsports.com/olympics/news/lance-armstrong-timeline-cancer-tour-de-france-doping-admission',
      'https://cyclinguptodate.com/cycling/lance-armstrongs-tour-de-france-tv-return-confirmed-nbc-brings-cyclings-most-controversial-figure-back-to-peacock-for-2026',
      'https://roadmancycling.com/blog/armstrong-ullrich-doping-why-one-was-stripped',
      'https://www.outsideonline.com/outdoor-adventure/biking/lance-armstrongs-most-trusted-teammate/',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'ESPN', 'CNBC', 'NBC Sports', 'CyclingUpToDate', 'Roadman Cycling', 'Outside Online']),
    seoTitle: 'Lance Armstrong: siete Tours de Francia y el mayor escándalo de dopaje del ciclismo',
    seoDescription:
      'La historia completa de Lance Armstrong: sus siete Tours de Francia, el escándalo de dopaje que se los quitó, la sanción de por vida de la USADA y su regreso a los medios del ciclismo.',
    readingTime: 7,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'lance-armstrong-leyenda-dopaje-2026' },
    update: {
      ...baseFields,
      riders: { set: [{ id: armstrong.id }] },
      tags: { set: [{ id: leyendasTag.id }] },
    },
    create: {
      slug: 'lance-armstrong-leyenda-dopaje-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: [{ id: armstrong.id }] },
      tags: { connect: [{ id: leyendasTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// México, primer país latinoamericano en debutar en el relevo mixto
// por equipos de un Mundial de ciclismo de ruta (Montreal, 22 sept
// 2026): 14º lugar pese a una cadena suelta y una ponchadura.
// Fuentes: ABC Noticias, La Lista, El Tiempo Monclova, Publimetro
// (ver sourceUrls).
// ————————————————————————————————————————————————————————————

const mexicoMixedRelayContent = `
<p>Entre todas las actuaciones mexicanas de esta semana en el Mundial de ciclismo de Montreal, hay una que no se mide solo en el resultado final: el martes 22 de septiembre, México se convirtió en el primer país latinoamericano en la historia en competir en la contrarreloj por relevos mixtos de un Campeonato Mundial de Ciclismo en Ruta. Terminó 14º de 15 selecciones, pero llegó ahí después de superar, literalmente sobre la bicicleta, dos contratiempos mecánicos en los primeros minutos de carrera.</p>

<p>El equipo mexicano estuvo integrado por Sebastián Ruiz, Tomás Aguirre e Ignacio Prado en el tramo varonil, y por Romina Hinojosa, Andrea Ramírez y Yareli Salazar en el tramo femenil, sobre un recorrido de 40,6&nbsp;km. Apenas tres minutos después de la salida, a Ignacio Prado se le salió la cadena de la bicicleta. En vez de detenerse por completo, Prado logró acomodarla de nuevo sin bajarse —una maniobra arriesgada y técnicamente exigente que quedó registrada en video y circuló ampliamente en medios mexicanos—. Poco después, Tomás Aguirre sufrió una ponchadura que también le hizo perder tiempo. Pese a ambos incidentes, el equipo completó el recorrido y realizó el relevo hacia el tramo femenil sin más contratiempos.</p>

<p>México cruzó la meta con un tiempo de 57:41.84, a 6:09.56 minutos del oro conseguido por Italia —con Filippo Ganna y Elisa Longo Borghini entre sus seis integrantes—, que se impuso por apenas nueve segundos sobre Francia, con Suiza completando el podio. Considerando que la prueba reunió a selecciones con estructuras de relevos mixtos ya consolidadas desde ediciones anteriores, y que esta fue, para México, una participación debutante con dos incidentes mecánicos de por medio, el resultado se lee menos como una decepción y más como el costo lógico de abrir un camino nuevo.</p>

<p>Y es que, más allá del 14º lugar, lo relevante es el precedente: ningún otro país latinoamericano había inscrito equipo en esta prueba en un Mundial de ruta. La contrarreloj mixta por relevos —tres hombres cubriendo la primera mitad del recorrido, tres mujeres completando la segunda, con el relevo ocurriendo apenas el segundo corredor varonil cruza la meta— es, además, un formato relativamente joven dentro del calendario mundialista: se corre en este esquema de selecciones nacionales mixtas desde 2019, cuando sustituyó a una contrarreloj por equipos profesionales que se había disputado entre 2012 y 2018, y que a su vez había reemplazado a una versión amateur de selecciones nacionales vigente entre 1987 y 1994. Está pensado explícitamente para premiar la profundidad de una federación en ambas ramas al mismo tiempo, no solo en la masculina. Que México haya podido inscribir y completar un equipo de seis corredores capaces de correr a ese nivel es, en sí mismo, una señal de la misma profundidad de cantera que ya se ha visto esta semana en las pruebas individuales: Isaac del Toro sexto en la crono élite, Nabyenka Bareño 13ª y mejor latinoamericana en la crono junior femenina, y presencia mexicana en prácticamente todas las categorías del programa.</p>

<p>El video del momento de Ignacio Prado —reacomodando la cadena con una mano mientras mantenía el resto del cuerpo sobre la bicicleta en movimiento, sin perder el equilibrio ni detenerse del todo— circuló en medios deportivos mexicanos casi tan rápido como el resultado oficial, y terminó siendo, para buena parte del público que siguió la prueba, la imagen que define el debut: no la posición 14, sino la resolución de un problema técnico en tiempo real, a mitad de una contrarreloj mundialista, sin apoyo del vehículo del equipo. Es, en ese sentido, un debut que se cuenta tanto por lo que salió mal como por cómo se resolvió sobre la marcha.</p>

<p>La delegación mexicana —27 corredores en total— vuelve a competir este jueves 24 de septiembre, con la ruta Sub-23 femenil y la ruta junior varonil, esta última con Omar Andrade Fernández, José Emilio Rodríguez Delgado y Daniel Santiago Moreno García. El fin de semana cierran las pruebas en ruta élite, con Isaac del Toro como principal carta mexicana el domingo 27.</p>
`.trim()

export async function publishMexicoMixedRelayArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [ruiz, aguirre, prado, hinojosa, ramirezFregoso, salazar, delToro, bareno, race] = await Promise.all([
    prisma.rider.upsert({
      where: { slug: 'sebastian-ruiz' },
      update: {},
      create: { slug: 'sebastian-ruiz', name: 'Sebastián Ruiz', nationality: 'México', specialty: 'Contrarreloj' },
    }),
    prisma.rider.upsert({
      where: { slug: 'tomas-aguirre' },
      update: {},
      create: { slug: 'tomas-aguirre', name: 'Tomás Aguirre', nationality: 'México', specialty: 'Contrarreloj' },
    }),
    prisma.rider.upsert({
      where: { slug: 'ignacio-prado' },
      update: {},
      create: {
        slug: 'ignacio-prado',
        name: 'Ignacio Prado',
        nationality: 'México',
        specialty: 'Contrarreloj',
        bio: 'Ciclista mexicano. En el relevo mixto por equipos del Mundial de ciclismo de Montreal 2026, a tres minutos de la salida, logró reacomodar la cadena de su bicicleta sin bajarse de ella tras un desprendimiento, una maniobra que se hizo viral en medios mexicanos.',
      },
    }),
    prisma.rider.findUnique({ where: { slug: 'romina-hinojosa' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'andrea-ramirez-fregoso' }, select: { id: true } }),
    prisma.rider.upsert({
      where: { slug: 'yareli-salazar' },
      update: {},
      create: { slug: 'yareli-salazar', name: 'Yareli Salazar', nationality: 'México', specialty: 'Ruta' },
    }),
    prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'nabyenka-bareno' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } }),
  ])

  const riderIds = [ruiz.id, aguirre.id, prado.id, hinojosa?.id, ramirezFregoso?.id, salazar.id, delToro?.id, bareno?.id].filter(
    (id): id is number => id !== undefined,
  )

  const ultimaHoraTag = await prisma.tag.upsert({
    where: { slug: 'ultima-hora' },
    update: {},
    create: { slug: 'ultima-hora', name: 'Última Hora', type: 'topic' },
  })

  const heroImageId = await ensureCustomHeroImage('mexico-relevo-mixto-mundial-montreal-2026', {
    url: '/images/headers/mexico-relevo-mixto-cover.jpg',
    altText: 'México hace historia: primer país latinoamericano en el relevo mixto de un Mundial de ciclismo',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'México hace historia: primer país latinoamericano en el relevo mixto de un Mundial de ciclismo',
    subtitle: 'Con una cadena suelta y una ponchadura de por medio, la selección mexicana terminó 14ª en su debut en la contrarreloj por equipos de Montreal 2026',
    excerpt:
      'México se convirtió en el primer país latinoamericano en competir en el relevo mixto por equipos de un Mundial de ciclismo de ruta, terminando 14º pese a una cadena suelta y una ponchadura en los primeros minutos.',
    content: mexicoMixedRelayContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://abcnoticias.mx/deportes/2026/9/22/mexico-debuta-en-el-relevo-mixto-del-mundial-de-ciclismo-y-termina-14-290298.html',
      'https://la-lista.com/deportes/es-mexicano-ignacio-prado-arregla-su-cadena-sin-bajarse-de-su-bici-y-en-plena-carrera-del-mundial-de-ciclismo-video',
      'https://eltiempomx.com/noticia/2026/mexico-debuta-en-la-contrarreloj-por-relevos-mixtos-del-mundial-de-ciclismo.html',
      'https://www.publimetro.com.mx/deportes/2026/09/22/debut-historico-para-mexico-en-el-mundial-de-ciclismo-en-relevos-mixtos/',
      'https://es.wikipedia.org/wiki/Contrarreloj_por_equipos_mixtos_en_el_Campeonato_Mundial_de_Ruta',
    ]),
    sourceNames: toJsonField(['ABC Noticias', 'La Lista', 'El Tiempo Monclova', 'Publimetro México', 'Wikipedia']),
    seoTitle: 'México, primer país latinoamericano en el relevo mixto del Mundial de ciclismo 2026',
    seoDescription:
      'México se convirtió en el primer país latinoamericano en competir en el relevo mixto de un Mundial de ciclismo, terminando 14º pese a una cadena suelta y una ponchadura.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'mexico-relevo-mixto-mundial-montreal-2026' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { set: [{ id: race.id }] } : undefined,
      tags: { set: [{ id: ultimaHoraTag.id }] },
    },
    create: {
      slug: 'mexico-relevo-mixto-mundial-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      races: race ? { connect: [{ id: race.id }] } : undefined,
      tags: { connect: [{ id: ultimaHoraTag.id }] },
    },
  })

  return { slug: article.slug }
}

// ————————————————————————————————————————————————————————————
// México será sede por primera vez en su historia de un Mundial UCI
// absoluto: el Mundial de MTB Maratón (XCM) 2029, en Puebla. Anunciado
// el 23 de septiembre de 2026 durante el Congreso de la UCI en
// Montreal. Fuentes: Vanguardia, La Lista, La Jornada (ver
// sourceUrls).
// ————————————————————————————————————————————————————————————

const pueblaMtbWorldsContent = `
<p>Mientras la atención del ciclismo mundial sigue puesta en las pruebas en ruta del Mundial de Montreal 2026, la Unión Ciclista Internacional (UCI) confirmó el miércoles 23 de septiembre, durante su Congreso anual celebrado en paralelo a esa misma cita, una noticia que no tiene que ver con esta edición sino con el futuro: México será, por primera vez en su historia, sede de un Campeonato Mundial UCI absoluto. El estado de Puebla albergará el Mundial de Ciclismo de Montaña Maratón (MTB XCM) en 2029.</p>

<p>El anuncio lo hizo la Unión Ciclista de México (UCMex), presidida por Bernardo de la Garza, después de que la UCI otorgara formalmente la sede dentro del paquete de anfitriones de sus distintos campeonatos mundiales para los próximos años —el mismo proceso en el que, días antes, ya se habían confirmado Francia (2027), Abu Dabi (2028) y Dinamarca (2029) como sedes del Mundial de ruta en años sucesivos—. La de Puebla es una disciplina distinta: el MTB Maratón es una modalidad de cross-country de larga distancia, con recorridos que la UCI contempla entre 60 y 160&nbsp;kilómetros y miles de metros de desnivel acumulado, que exige tanto resistencia como técnica y estrategia de carrera. El ganador o ganadora, como en cualquier Mundial UCI, se lleva el maillot arcoíris.</p>

<p>El epicentro de la organización estaría en la región de Atlixco, que ya cuenta con trayectoria organizando la Maratón Popobike Internacional, una prueba que en su edición de 2025 convocó a más de 2,000 ciclistas, incluyendo competidores internacionales de MTB. Aun así, según las fuentes consultadas, todavía no se ha confirmado de manera oficial si Atlixco será la sede puntual dentro del estado, ni las fechas exactas ni el trazado definitivo de la prueba — detalles que la UCI y UCMex deberán precisar en los próximos meses.</p>

<p>Vale la pena notar, además, una novedad de formato que acompaña a esta edición: la UCI unificará de manera permanente las categorías Élite y Máster dentro del Mundial de MTB Maratón a partir de 2029, lo que en la práctica significa que corredores de distintas edades competirán bajo el mismo campeonato absoluto, con el mismo título en juego.</p>

<p>El contexto en el que llega esta sede no es casual. La designación se da apenas unos días después de que Isaac del Toro —hoy 3º en el Ranking Mundial UCI y podio del Tour de Francia 2026— haya vuelto a poner al ciclismo mexicano en el mapa internacional, y en la misma semana en que Nabyenka Bareño, Omar Andrade y el propio equipo del relevo mixto debutaron con actuaciones notables en Montreal. El propio anuncio ha sido leído por medios mexicanos como parte de ese mismo impulso: el reconocimiento de un país cuyo ciclismo, en años recientes, ha pasado de tener presencia ocasional en el circuito internacional a sostener candidaturas serias para organizar competencia de la máxima categoría.</p>

<p>El MTB mexicano específicamente también ha tenido un año fuerte en 2026. En los XXV Juegos Centroamericanos y del Caribe de Santo Domingo, México dominó ambas ramas de la prueba de montaña: Carolina Flores se colgó el oro en la femenil, completando las seis vueltas de un trazado de 4.1&nbsp;km en 1:24:42, mientras que en la varonil Gerardo Ulloa encabezó un contundente uno-dos mexicano en las siete vueltas del mismo circuito, con un tiempo de 1:23:17. A esto se suma un cambio institucional relevante: 2026 fue el primer año en que la Unión Ciclista de México presentó un calendario oficial del Serial Nacional de Ciclismo de Montaña —nueve fechas a lo largo del año, con aval de la propia UCI—, tras la creación formal de ese organismo. Es, en conjunto, la base doméstica sobre la que se construye la candidatura que hoy le da a Puebla la sede de 2029.</p>

<p>Puebla llega, sin embargo, a un calendario ya trazado por la UCI para el MTB Maratón: la edición previa a la mexicana, la de 2027, se disputará en Samoëns, Francia, dentro del mismo paquete de Mundiales que Haute-Savoie organizará ese año. Será, entonces, hasta 2029 cuando le toque el turno a México de recibir por primera vez, en cualquier disciplina del ciclismo, una prueba con el título de Campeonato Mundial UCI en su propio territorio — un hito que, aunque todavía a tres años de distancia, ya empieza a construir expectativa entre la comunidad ciclista mexicana.</p>
`.trim()

export async function publishPueblaMtbWorldsArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'mtb-gravel' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const delToro = await prisma.rider.findUnique({ where: { slug: 'isaac-del-toro' }, select: { id: true } })

  const [mtbTag, latinosTag] = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'mtb-gravel' },
      update: {},
      create: { slug: 'mtb-gravel', name: 'MTB y Gravel', type: 'topic' },
    }),
    prisma.tag.upsert({
      where: { slug: 'latinos' },
      update: {},
      create: { slug: 'latinos', name: 'Latinos', type: 'topic' },
    }),
  ])

  const heroImageId = await ensureCustomHeroImage('puebla-mundial-mtb-maraton-2029', {
    url: '/images/headers/puebla-mtb-worlds-cover.jpg',
    altText: 'México será sede del Mundial de ciclismo MTB en 2029',
    credit: 'Ilustración: La Fuga',
    width: 1672,
    height: 941,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'México hará historia: Puebla será sede del Mundial de MTB Maratón 2029',
    subtitle: 'Confirmado por la UCI durante su Congreso en Montreal, es la primera vez que el país organiza un Campeonato Mundial UCI absoluto de cualquier disciplina',
    excerpt:
      'La UCI confirmó a Puebla como sede del Mundial de MTB Maratón (XCM) 2029 — la primera vez en la historia que México organiza un Campeonato Mundial UCI absoluto, anunciado durante el Congreso de la UCI en paralelo al Mundial de Montreal.',
    content: pueblaMtbWorldsContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://vanguardia.com.mx/deportes/puebla-hara-historia-albergara-el-mundial-uci-de-mtb-xcm-en-2029-HP23685354',
      'https://la-lista.com/deportes/mexico-se-prepara-para-recibir-el-campeonato-mundial-de-ciclismo-2029-fechas-sede-pruebas-y-todo-lo-que-debes-saber',
      'https://www.tvazteca.com/aztecadeportes/confirmado-mexico-sera-sede-de-otro-mundial-sera-en-un-municipio-de-menos-de-150-mil-habitantes',
      'https://www.e-consulta.com/sin-categoria/atlixco-hara-historia-puebla-albergara-el-mundial-uci-de-mtb-maraton-en-2029',
      'https://www.carteldeportivo.com/mexico-domino-las-dos-ramas-del-ciclismo-mtb-de-los-jcc-santo-domingo-2026/',
    ]),
    sourceNames: toJsonField(['Vanguardia', 'La Lista', 'TV Azteca Deportes', 'e-consulta', 'Cartel Deportivo']),
    seoTitle: 'Puebla será sede del Mundial de MTB Maratón UCI 2029: primer Mundial de México',
    seoDescription:
      'La UCI confirmó a Puebla, México, como sede del Mundial de MTB Maratón (XCM) 2029 — el primer Campeonato Mundial UCI absoluto organizado por el país en su historia.',
    readingTime: 6,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'puebla-mundial-mtb-maraton-2029' },
    update: {
      ...baseFields,
      riders: delToro ? { set: [{ id: delToro.id }] } : undefined,
      tags: { set: [{ id: mtbTag.id }, { id: latinosTag.id }] },
    },
    create: {
      slug: 'puebla-mundial-mtb-maraton-2029',
      ...baseFields,
      publishedAt: new Date(),
      riders: delToro ? { connect: [{ id: delToro.id }] } : undefined,
      tags: { connect: [{ id: mtbTag.id }, { id: latinosTag.id }] },
    },
  })

  return { slug: article.slug }
}
