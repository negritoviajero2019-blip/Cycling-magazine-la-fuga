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
