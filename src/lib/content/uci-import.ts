/**
 * Lógica reutilizable para cargar datos UCI reales (calendario, equipos,
 * ciclistas) y publicar el artículo real de la etapa 19 de la Vuelta
 * 2026 — compartida entre los scripts de CLI en prisma/*.ts (uso local)
 * y la ruta de administración /api/admin/import-uci (uso en
 * producción, sin necesitar SSH). Ver prisma/import-uci-data.ts,
 * prisma/import-uci-riders.ts y prisma/publish-vuelta-stage19-article.ts
 * para el detalle de fuentes y verificación de cada dato.
 */
import { prisma } from '@/lib/db'
import { toJsonField } from './json-field'
import { buildStageProfileSvg } from './stage-profile-svg'
import { buildHeaderBannerMedia } from './header-banner-svg'

/**
 * Crea la imagen de cabecera (gráfico editorial propio, nunca foto de
 * agencia) para un artículo. Si ya tiene una y sigue en el formato
 * actual (/api/banner-svg), no crea una fila Media duplicada. Si
 * tiene una en un formato viejo/roto (p.ej. el data URI que se
 * truncaba en MySQL, ver commit a5f65e4), la regenera sola.
 */
async function ensureHeroImage(
  articleSlug: string,
  input: { title: string; label?: string; riders?: { name: string; team?: string }[] },
): Promise<number | undefined> {
  const existing = await prisma.article.findUnique({
    where: { slug: articleSlug },
    select: { heroImageId: true, heroImage: { select: { url: true } } },
  })
  // Solo regenera si no hay imagen o si es el formato viejo/roto (data
  // URI truncado, ver a5f65e4). Una imagen real curada a mano (p.ej.
  // subida a public/images/headers/) nunca se sobrescribe sola.
  if (existing?.heroImageId && !existing.heroImage?.url.startsWith('data:')) return undefined
  const media = await prisma.media.create({ data: buildHeaderBannerMedia(input) })
  return media.id
}

/**
 * Igual que ensureHeroImage, pero para una imagen real curada a mano
 * (generada con IA por fuera, sin ciclistas reales identificables ni
 * logos, ver docs/EDITORIAL-CHECKLIST.md) en vez del banner de chips
 * automático. El archivo debe estar ya committeado en public/images/.
 *
 * `source: 'cover-composited'` marca que el titular y la bajada ya
 * vienen "horneados" en el archivo (ver /api/og-cover) — Hero.tsx y
 * PelotonRadar.tsx usan ese valor para no volver a sobreponer su
 * propio texto encima y duplicarlo.
 */
async function ensureCustomHeroImage(
  articleSlug: string,
  media: {
    url: string
    altText: string
    credit: string
    width: number
    height: number
    source?: 'own' | 'cover-composited'
  },
): Promise<number | undefined> {
  const existing = await prisma.article.findUnique({
    where: { slug: articleSlug },
    select: { heroImageId: true, heroImage: { select: { url: true } } },
  })
  if (existing?.heroImageId && existing.heroImage?.url === media.url) return undefined
  const created = await prisma.media.create({
    data: {
      url: media.url,
      source: media.source ?? 'own',
      author: 'La Fuga (generada con IA, sin ciclistas reales identificables)',
      license: 'own',
      credit: media.credit,
      altText: media.altText,
      width: media.width,
      height: media.height,
    },
  })
  return created.id
}

/**
 * Ajusta las secciones (Category) del sitio: agrega "MTB y Gravel" y
 * renombra "Fichajes" a "Latinos" preservando el id de la categoría
 * (para no perder el/los artículos ya vinculados) — acordado
 * 2026-09-14. Idempotente: se puede correr más de una vez.
 */
export async function ensureSiteCategories() {
  await prisma.category.upsert({
    where: { slug: 'mtb-gravel' },
    update: { name: 'MTB y Gravel' },
    create: { slug: 'mtb-gravel', name: 'MTB y Gravel' },
  })

  const fichajes = await prisma.category.findUnique({ where: { slug: 'fichajes' } })
  if (fichajes) {
    await prisma.category.update({ where: { id: fichajes.id }, data: { slug: 'latinos', name: 'Latinos' } })
  } else {
    await prisma.category.upsert({
      where: { slug: 'latinos' },
      update: { name: 'Latinos' },
      create: { slug: 'latinos', name: 'Latinos' },
    })
  }

  return { ok: true }
}

const TODAY = new Date()

function statusFor(start: string, end: string): 'upcoming' | 'ongoing' | 'finished' {
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (endDate < TODAY) return 'finished'
  if (startDate <= TODAY && TODAY <= endDate) return 'ongoing'
  return 'upcoming'
}

interface RaceInput {
  slug: string
  name: string
  start: string
  end: string
  country: string
  category: 'grand-tour' | 'classic' | 'worldtour' | 'women-worldtour' | 'other' | 'mtb' | 'gravel'
  numStages?: number
}

/** Campeonatos UCI que no forman parte del calendario WorldTour de
 * equipos (selecciones nacionales) — verificado vía Wikipedia
 * (2026_UCI_Road_World_Championships), consultado 2026-09-14. */
const CHAMPIONSHIP_RACES: RaceInput[] = [
  { slug: 'uci-road-world-championships-2026', name: 'Mundial de Ruta UCI', start: '2026-09-20', end: '2026-09-27', country: 'Canadá', category: 'other' },
]

const MENS_RACES: RaceInput[] = [
  { slug: 'tour-down-under-2026', name: 'Tour Down Under', start: '2026-01-20', end: '2026-01-25', country: 'Australia', category: 'worldtour', numStages: 6 },
  { slug: 'cadel-evans-great-ocean-road-race-2026', name: 'Cadel Evans Great Ocean Road Race', start: '2026-02-01', end: '2026-02-01', country: 'Australia', category: 'classic' },
  { slug: 'uae-tour-2026', name: 'UAE Tour', start: '2026-02-16', end: '2026-02-22', country: 'Emiratos Árabes Unidos', category: 'worldtour', numStages: 7 },
  { slug: 'omloop-het-nieuwsblad-2026', name: 'Omloop Het Nieuwsblad', start: '2026-02-28', end: '2026-02-28', country: 'Bélgica', category: 'classic' },
  { slug: 'strade-bianche-2026', name: 'Strade Bianche', start: '2026-03-07', end: '2026-03-07', country: 'Italia', category: 'classic' },
  { slug: 'paris-nice-2026', name: 'París-Niza', start: '2026-03-08', end: '2026-03-15', country: 'Francia', category: 'worldtour', numStages: 8 },
  { slug: 'tirreno-adriatico-2026', name: 'Tirreno-Adriático', start: '2026-03-09', end: '2026-03-15', country: 'Italia', category: 'worldtour', numStages: 7 },
  { slug: 'milan-san-remo-2026', name: 'Milán-San Remo', start: '2026-03-21', end: '2026-03-21', country: 'Italia', category: 'classic' },
  { slug: 'volta-a-catalunya-2026', name: 'Volta a Catalunya', start: '2026-03-23', end: '2026-03-29', country: 'España', category: 'worldtour', numStages: 7 },
  { slug: 'ronde-van-brugge-2026', name: 'Ronde van Brugge', start: '2026-03-25', end: '2026-03-25', country: 'Bélgica', category: 'classic' },
  { slug: 'e3-saxo-classic-2026', name: 'E3 Saxo Classic', start: '2026-03-27', end: '2026-03-27', country: 'Bélgica', category: 'classic' },
  { slug: 'gante-wevelgem-2026', name: 'Gante-Wevelgem', start: '2026-03-29', end: '2026-03-29', country: 'Bélgica', category: 'classic' },
  { slug: 'dwars-door-vlaanderen-2026', name: 'Dwars door Vlaanderen', start: '2026-04-01', end: '2026-04-01', country: 'Bélgica', category: 'classic' },
  { slug: 'tour-of-flanders-2026', name: 'Tour de Flandes', start: '2026-04-05', end: '2026-04-05', country: 'Bélgica', category: 'classic' },
  { slug: 'itzulia-basque-country-2026', name: 'Vuelta al País Vasco', start: '2026-04-06', end: '2026-04-11', country: 'España', category: 'worldtour', numStages: 6 },
  { slug: 'paris-roubaix-2026', name: 'París-Roubaix', start: '2026-04-12', end: '2026-04-12', country: 'Francia', category: 'classic' },
  { slug: 'amstel-gold-race-2026', name: 'Amstel Gold Race', start: '2026-04-19', end: '2026-04-19', country: 'Países Bajos', category: 'classic' },
  { slug: 'la-fleche-wallonne-2026', name: 'La Flecha Valona', start: '2026-04-22', end: '2026-04-22', country: 'Bélgica', category: 'classic' },
  { slug: 'liege-bastogne-liege-2026', name: 'Lieja-Bastoña-Lieja', start: '2026-04-26', end: '2026-04-26', country: 'Bélgica', category: 'classic' },
  { slug: 'tour-de-romandie-2026', name: 'Tour de Romandía', start: '2026-04-28', end: '2026-05-03', country: 'Suiza', category: 'worldtour', numStages: 5 },
  { slug: 'eschborn-frankfurt-2026', name: 'Eschborn-Fráncfort', start: '2026-05-01', end: '2026-05-01', country: 'Alemania', category: 'classic' },
  { slug: 'giro-ditalia-2026', name: "Giro d'Italia", start: '2026-05-08', end: '2026-05-31', country: 'Italia', category: 'grand-tour', numStages: 21 },
  { slug: 'tour-auvergne-rhone-alpes-2026', name: 'Tour Auvergne-Rhône-Alpes', start: '2026-06-07', end: '2026-06-14', country: 'Francia', category: 'worldtour', numStages: 8 },
  { slug: 'copenhagen-sprint-2026', name: 'Copenhagen Sprint', start: '2026-06-14', end: '2026-06-14', country: 'Dinamarca', category: 'classic' },
  { slug: 'tour-de-suisse-2026', name: 'Tour de Suiza', start: '2026-06-17', end: '2026-06-21', country: 'Suiza', category: 'worldtour', numStages: 5 },
  { slug: 'tour-de-france-2026', name: 'Tour de Francia', start: '2026-07-04', end: '2026-07-26', country: 'Francia', category: 'grand-tour', numStages: 21 },
  { slug: 'clasica-san-sebastian-2026', name: 'Clásica de San Sebastián', start: '2026-08-01', end: '2026-08-01', country: 'España', category: 'classic' },
  { slug: 'tour-de-pologne-2026', name: 'Tour de Polonia', start: '2026-08-03', end: '2026-08-09', country: 'Polonia', category: 'worldtour', numStages: 7 },
  { slug: 'hamburg-cyclassics-2026', name: 'Hamburg Cyclassics', start: '2026-08-16', end: '2026-08-16', country: 'Alemania', category: 'classic' },
  { slug: 'renewi-tour-2026', name: 'Renewi Tour', start: '2026-08-19', end: '2026-08-23', country: 'Bélgica/Países Bajos', category: 'worldtour', numStages: 5 },
  { slug: 'vuelta-a-espana-2026', name: 'Vuelta a España', start: '2026-08-22', end: '2026-09-13', country: 'España', category: 'grand-tour', numStages: 21 },
  { slug: 'bretagne-classic-2026', name: 'Bretagne Classic', start: '2026-08-30', end: '2026-08-30', country: 'Francia', category: 'classic' },
  { slug: 'gp-cycliste-quebec-2026', name: 'Grand Prix Cycliste de Québec', start: '2026-09-11', end: '2026-09-11', country: 'Canadá', category: 'classic' },
  { slug: 'gp-cycliste-montreal-2026', name: 'Grand Prix Cycliste de Montréal', start: '2026-09-13', end: '2026-09-13', country: 'Canadá', category: 'classic' },
  { slug: 'il-lombardia-2026', name: 'Il Lombardia', start: '2026-10-10', end: '2026-10-10', country: 'Italia', category: 'classic' },
  { slug: 'tour-of-guangxi-2026', name: 'Tour of Guangxi', start: '2026-10-13', end: '2026-10-18', country: 'China', category: 'worldtour', numStages: 6 },
]

/** Calendario real de MTB y Gravel a nivel profesional — solo las
 * citas que quedan por disputarse desde el 14-09-2026, verificado vía
 * UCI/Red Bull/Cyclingnews/Wikipedia (no es el calendario completo de
 * las 14 rondas de MTB World Cup ni de los 47 eventos de Gravel World
 * Series — el Mundial de MTB en Val di Sole, Italia, ya se corrió del
 * 26 al 30 de agosto de 2026, antes de esta importación). Se puede
 * ampliar más adelante si se quiere cubrir también resultados pasados.
 */
const MTB_GRAVEL_RACES: RaceInput[] = [
  { slug: 'uci-mtb-world-championships-2026', name: 'Mundial de MTB UCI — Val di Sole', start: '2026-08-26', end: '2026-08-30', country: 'Italia', category: 'mtb' },
  { slug: 'uci-mtb-world-cup-soldier-hollow-2026', name: 'Copa del Mundo MTB — Soldier Hollow (XCO / Short Track)', start: '2026-09-19', end: '2026-09-20', country: 'Estados Unidos', category: 'mtb' },
  { slug: 'uci-mtb-world-cup-whistler-2026', name: 'Copa del Mundo MTB — Whistler (Downhill)', start: '2026-09-25', end: '2026-09-27', country: 'Canadá', category: 'mtb' },
  { slug: 'pyrenees-catalanes-gravel-tour-2026', name: 'Pyrénées Catalanes Gravel Tour', start: '2026-09-26', end: '2026-09-26', country: 'Francia', category: 'gravel' },
  { slug: 'uci-gravel-world-championships-2026', name: 'Mundial de Gravel UCI', start: '2026-10-10', end: '2026-10-11', country: 'Australia', category: 'gravel' },
]

const WOMENS_RACES: RaceInput[] = [
  { slug: 'womens-tour-down-under-2026', name: "Women's Tour Down Under", start: '2026-01-17', end: '2026-01-19', country: 'Australia', category: 'women-worldtour', numStages: 3 },
  { slug: 'cadel-evans-great-ocean-road-race-women-2026', name: 'Cadel Evans Great Ocean Road Race (femenino)', start: '2026-01-31', end: '2026-01-31', country: 'Australia', category: 'women-worldtour' },
  { slug: 'uae-tour-women-2026', name: 'UAE Tour Women', start: '2026-02-05', end: '2026-02-08', country: 'Emiratos Árabes Unidos', category: 'women-worldtour', numStages: 4 },
  { slug: 'omloop-het-nieuwsblad-women-2026', name: 'Omloop Het Nieuwsblad (femenino)', start: '2026-02-28', end: '2026-02-28', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'strade-bianche-donne-2026', name: 'Strade Bianche Donne', start: '2026-03-07', end: '2026-03-07', country: 'Italia', category: 'women-worldtour' },
  { slug: 'trofeo-alfredo-binda-2026', name: 'Trofeo Alfredo Binda', start: '2026-03-15', end: '2026-03-15', country: 'Italia', category: 'women-worldtour' },
  { slug: 'milan-san-remo-women-2026', name: 'Milán-San Remo (femenino)', start: '2026-03-21', end: '2026-03-21', country: 'Italia', category: 'women-worldtour' },
  { slug: 'ronde-van-brugge-women-2026', name: 'Ronde van Brugge (femenino)', start: '2026-03-26', end: '2026-03-26', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'gante-wevelgem-women-2026', name: 'Gante-Wevelgem (femenino)', start: '2026-03-29', end: '2026-03-29', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'dwars-door-vlaanderen-women-2026', name: 'Dwars door Vlaanderen (femenino)', start: '2026-04-01', end: '2026-04-01', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'tour-of-flanders-women-2026', name: 'Tour de Flandes (femenino)', start: '2026-04-05', end: '2026-04-05', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'paris-roubaix-femmes-2026', name: 'París-Roubaix Femmes', start: '2026-04-12', end: '2026-04-12', country: 'Francia', category: 'women-worldtour' },
  { slug: 'amstel-gold-race-women-2026', name: 'Amstel Gold Race (femenino)', start: '2026-04-19', end: '2026-04-19', country: 'Países Bajos', category: 'women-worldtour' },
  { slug: 'la-fleche-wallonne-femmes-2026', name: 'La Flecha Valona Femmes', start: '2026-04-22', end: '2026-04-22', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'liege-bastogne-liege-femmes-2026', name: 'Lieja-Bastoña-Lieja Femmes', start: '2026-04-26', end: '2026-04-26', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'la-vuelta-femenina-2026', name: 'La Vuelta Femenina', start: '2026-05-03', end: '2026-05-09', country: 'España', category: 'women-worldtour', numStages: 7 },
  { slug: 'itzulia-women-2026', name: 'Itzulia Women', start: '2026-05-15', end: '2026-05-17', country: 'España', category: 'women-worldtour', numStages: 3 },
  { slug: 'vuelta-a-burgos-feminas-2026', name: 'Vuelta a Burgos Féminas', start: '2026-05-21', end: '2026-05-24', country: 'España', category: 'women-worldtour', numStages: 4 },
  { slug: 'giro-ditalia-women-2026', name: "Giro d'Italia Women", start: '2026-05-30', end: '2026-06-07', country: 'Italia', category: 'women-worldtour', numStages: 9 },
  { slug: 'copenhagen-sprint-women-2026', name: 'Copenhagen Sprint (femenino)', start: '2026-06-13', end: '2026-06-13', country: 'Dinamarca', category: 'women-worldtour' },
  { slug: 'tour-de-suisse-women-2026', name: 'Tour de Suiza (femenino)', start: '2026-06-17', end: '2026-06-21', country: 'Suiza', category: 'women-worldtour', numStages: 5 },
  { slug: 'tour-de-france-femmes-2026', name: 'Tour de Francia Femmes', start: '2026-08-01', end: '2026-08-09', country: 'Francia', category: 'women-worldtour', numStages: 9 },
  { slug: 'tour-of-britain-women-2026', name: 'Tour of Britain Women', start: '2026-08-19', end: '2026-08-23', country: 'Reino Unido', category: 'women-worldtour', numStages: 5 },
  { slug: 'classic-lorient-agglomeration-2026', name: 'Classic Lorient Agglomération', start: '2026-08-29', end: '2026-08-29', country: 'Francia', category: 'women-worldtour' },
  { slug: 'tour-of-chongming-island-2026', name: 'Tour of Chongming Island', start: '2026-10-13', end: '2026-10-15', country: 'China', category: 'women-worldtour', numStages: 3 },
]

interface TeamInput {
  slug: string
  name: string
  country: string
  category: 'worldtour' | 'women-worldtour'
}

const MENS_TEAMS: TeamInput[] = [
  { slug: 'alpecin-premier-tech', name: 'Alpecin–Premier Tech', country: 'Bélgica', category: 'worldtour' },
  { slug: 'decathlon-cma-cgm', name: 'Decathlon–CMA CGM', country: 'Francia', category: 'worldtour' },
  { slug: 'ef-education-easypost', name: 'EF Education–EasyPost', country: 'Estados Unidos', category: 'worldtour' },
  { slug: 'groupama-fdj-united', name: 'Groupama–FDJ United', country: 'Francia', category: 'worldtour' },
  { slug: 'lidl-trek', name: 'Lidl–Trek', country: 'Alemania', category: 'worldtour' },
  { slug: 'lotto-intermarche', name: 'Lotto–Intermarché', country: 'Bélgica', category: 'worldtour' },
  { slug: 'movistar-team', name: 'Movistar Team', country: 'España', category: 'worldtour' },
  { slug: 'netcompany-ineos', name: 'Netcompany INEOS', country: 'Reino Unido', category: 'worldtour' },
  { slug: 'nsn-cycling-team', name: 'NSN Cycling Team', country: 'Suiza', category: 'worldtour' },
  { slug: 'red-bull-bora-hansgrohe', name: 'Red Bull–BORA–hansgrohe', country: 'Alemania', category: 'worldtour' },
  { slug: 'soudal-quick-step', name: 'Soudal–Quick-Step', country: 'Bélgica', category: 'worldtour' },
  { slug: 'team-bahrain-victorious', name: 'Team Bahrain Victorious', country: 'Baréin', category: 'worldtour' },
  { slug: 'team-jayco-alula', name: 'Team Jayco–AlUla', country: 'Australia', category: 'worldtour' },
  { slug: 'team-picnic-postnl', name: 'Team Picnic–PostNL', country: 'Países Bajos', category: 'worldtour' },
  { slug: 'visma-lease-a-bike', name: 'Visma–Lease a Bike', country: 'Países Bajos', category: 'worldtour' },
  { slug: 'uae-team-emirates-xrg', name: 'UAE Team Emirates–XRG', country: 'Emiratos Árabes Unidos', category: 'worldtour' },
  { slug: 'uno-x-mobility', name: 'Uno-X Mobility', country: 'Noruega', category: 'worldtour' },
  { slug: 'xds-astana-team', name: 'XDS Astana Team', country: 'Kazajistán', category: 'worldtour' },
]

const WOMENS_TEAMS: TeamInput[] = [
  { slug: 'ag-insurance-soudal', name: 'AG Insurance–Soudal', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'canyon-sram', name: 'Canyon//SRAM', country: 'Alemania', category: 'women-worldtour' },
  { slug: 'ef-education-oatly', name: 'EF Education–Oatly', country: 'Estados Unidos', category: 'women-worldtour' },
  { slug: 'fdj-united-suez', name: 'FDJ United–Suez', country: 'Francia', category: 'women-worldtour' },
  { slug: 'fenix-premier-tech', name: 'Fenix–Premier Tech', country: 'Bélgica', category: 'women-worldtour' },
  { slug: 'human-powered-health', name: 'Human Powered Health', country: 'Estados Unidos', category: 'women-worldtour' },
  { slug: 'lidl-trek-women', name: 'Lidl–Trek (femenino)', country: 'Estados Unidos', category: 'women-worldtour' },
  { slug: 'liv-alula-jayco', name: 'Liv AlUla Jayco', country: 'Australia', category: 'women-worldtour' },
  { slug: 'movistar-team-women', name: 'Movistar Team (femenino)', country: 'España', category: 'women-worldtour' },
  { slug: 'team-picnic-postnl-women', name: 'Team Picnic–PostNL (femenino)', country: 'Países Bajos', category: 'women-worldtour' },
  { slug: 'team-sd-worx-protime', name: 'Team SD Worx–Protime', country: 'Países Bajos', category: 'women-worldtour' },
  { slug: 'uae-team-limad', name: "UAE Team L'Imad", country: 'Emiratos Árabes Unidos', category: 'women-worldtour' },
  { slug: 'uno-x-mobility-women', name: 'Uno-X Mobility (femenino)', country: 'Noruega', category: 'women-worldtour' },
  { slug: 'visma-lease-a-bike-women', name: 'Visma–Lease a Bike (femenino)', country: 'Países Bajos', category: 'women-worldtour' },
]


function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface RosterEntry {
  team: string
  riders: [string, string][] // [nombre, país]
}

const ROSTERS: RosterEntry[] = [
  { team: 'alpecin-premier-tech', riders: [['Maurice Ballerstedt', 'Alemania'], ['Tobias Bayer', 'Austria'], ['Lennert Belmans', 'Bélgica'], ['Francesco Busatto', 'Italia'], ['Lindsay De Vylder', 'Bélgica'], ['Ramses Debruyne', 'Bélgica'], ['Simon Dehairs', 'Bélgica'], ['Tibor Del Grosso', 'Países Bajos'], ['Silvan Dillier', 'Suiza'], ['Aaron Dockx', 'Bélgica'], ['Jonas Geens', 'Bélgica'], ['Gal Glivar', 'Eslovenia'], ['Michael Gogl', 'Austria'], ['Kaden Groves', 'Australia'], ['Hugo Houle', 'Canadá'], ['Tim Marsman', 'Países Bajos'], ['Jasper Philipsen', 'Bélgica'], ['Edward Planckaert', 'Bélgica'], ['Jensen Plowright', 'Australia'], ['Johan Price-Pejtersen', 'Dinamarca'], ['Senna Remijn', 'Países Bajos'], ['Jonas Rickaert', 'Bélgica'], ['Oscar Riesebeek', 'Países Bajos'], ['Florian Sénéchal', 'Francia'], ['Sente Sentjens', 'Bélgica'], ['Gerben Thijssen', 'Bélgica'], ['Henri Uhlig', 'Alemania'], ['Mathieu van der Poel', 'Países Bajos'], ['Luca Vergallito', 'Italia'], ['Emiel Verstrynge', 'Bélgica']] },
  { team: 'decathlon-cma-cgm', riders: [['Tobias Lund Andresen', 'Dinamarca'], ['Tiesj Benoot', 'Bélgica'], ['Léo Bisiaux', 'Francia'], ['Stefan Bissegger', 'Suiza'], ['Cees Bol', 'Países Bajos'], ['Oscar Chamberlain', 'Australia'], ['Sander De Pestel', 'Bélgica'], ['Stan Dewulf', 'Bélgica'], ['Felix Gall', 'Austria'], ['Pierre Gautherat', 'Francia'], ['Robbe Ghys', 'Bélgica'], ['Tord Gudmestad', 'Noruega'], ['Daan Hoole', 'Países Bajos'], ['Noa Isidore', 'Francia'], ['Olav Kooij', 'Países Bajos'], ['Jordan Labrosse', 'Francia'], ['Paul Lapeira', 'Francia'], ["Antoine L'Hote", 'Francia'], ['Gregor Mühlberger', 'Austria'], ['Oliver Naesen', 'Bélgica'], ['Aurélien Paret-Peintre', 'Francia'], ['Rasmus Søjberg Pedersen', 'Dinamarca'], ['Gianluca Pollefliet', 'Bélgica'], ['Nicolas Prodhomme', 'Francia'], ['Matthew Riccitello', 'Estados Unidos'], ['Callum Scotson', 'Australia'], ['Paul Seixas', 'Francia'], ['Johannes Staune-Mittet', 'Noruega']] },
  { team: 'ef-education-easypost', riders: [['Mattia Agostinacchio', 'Italia'], ['Vincenzo Albanese', 'Italia'], ['Kasper Asgreen', 'Dinamarca'], ['Samuele Battistella', 'Italia'], ['Alex Baudin', 'Francia'], ['Markel Beloki', 'España'], ['Richard Carapaz', 'Ecuador'], ['Jefferson Alexander Cepeda', 'Ecuador'], ['Ben Healy', 'Irlanda'], ['Noah Hobbs', 'Reino Unido'], ['Mikkel Frølich Honoré', 'Dinamarca'], ['Luke Lamperti', 'Estados Unidos'], ['Michael Leonard', 'Canadá'], ['Alastair Mackellar', 'Australia'], ['Madis Mihkels', 'Estonia'], ['Lukas Nerurkar', 'Reino Unido'], ['Neilson Powless', 'Estados Unidos'], ['Sean Quinn', 'Estados Unidos'], ['Darren Rafferty', 'Irlanda'], ['Juan Felipe Rodríguez', 'Colombia'], ['Archie Ryan', 'Irlanda'], ['Matthias Schwarzbacher', 'Eslovaquia'], ['James Shaw', 'Reino Unido'], ['Colby Simmons', 'Estados Unidos'], ['Georg Steinhauser', 'Alemania'], ['Harry Sweeny', 'Australia'], ['Michael Valgren', 'Dinamarca'], ['Marijn van den Berg', 'Países Bajos'], ['Jardi van der Lee', 'Países Bajos'], ['Max Walker', 'Reino Unido']] },
  { team: 'groupama-fdj-united', riders: [['Cyril Barthe', 'Francia'], ['Clément Berthet', 'Francia'], ['Lewis Bower', 'Nueva Zelanda'], ['Clément Braz Afonso', 'Francia'], ['Rémi Cavagna', 'Francia'], ['Ewen Costiou', 'Francia'], ['Maxime Decomble', 'Francia'], ['Tom Donnenwirth', 'Francia'], ['Titouan Fontaine', 'Francia'], ['David Gaudu', 'Francia'], ['Kévin Geniets', 'Luxemburgo'], ['Lorenzo Germani', 'Italia'], ['Romain Grégoire', 'Francia'], ['Thibaud Gruel', 'Francia'], ['Axel Huens', 'Francia'], ['Johan Jacobs', 'Suiza'], ['Josh Kench', 'Nueva Zelanda'], ['Olivier Le Gac', 'Francia'], ['Valentin Madouas', 'Francia'], ['Guillaume Martin', 'Francia'], ['Matteo Milan', 'Italia'], ['Rudy Molard', 'Francia'], ['Quentin Pacher', 'Francia'], ['Enzo Paleni', 'Francia'], ['Paul Penhoët', 'Francia'], ['Rémy Rochas', 'Francia'], ['Brieuc Rolland', 'Francia'], ['Clément Russo', 'Francia'], ['Bastien Tronchon', 'Francia']] },
  { team: 'lidl-trek', riders: [['Juan Ayuso', 'España'], ['Andrea Bagioli', 'Italia'], ['Julien Bernard', 'Francia'], ['Giulio Ciccone', 'Italia'], ['Simone Consonni', 'Italia'], ['Tao Geoghegan Hart', 'Reino Unido'], ['Amanuel Ghebreigzabhier', 'Eritrea'], ['Lennard Kämna', 'Alemania'], ['Patrick Konrad', 'Austria'], ['Søren Kragh Andersen', 'Dinamarca'], ['Jonathan Milan', 'Italia'], ['Bauke Mollema', 'Países Bajos'], ['Jacopo Mosca', 'Italia'], ['Mathias Norsgaard', 'Dinamarca'], ['Thibau Nys', 'Bélgica'], ['Sam Oomen', 'Países Bajos'], ['Mads Pedersen', 'Dinamarca'], ['Albert Withen Philipsen', 'Dinamarca'], ['Quinn Simmons', 'Estados Unidos'], ['Mattias Skjelmose', 'Dinamarca'], ['Toms Skujiņš', 'Letonia'], ['Matteo Sobrero', 'Italia'], ['Jakob Söderqvist', 'Suecia'], ['Tim Torn Teutenberg', 'Alemania'], ['Edward Theuns', 'Bélgica'], ['Mathias Vacek', 'República Checa'], ['Otto Vergaerde', 'Bélgica'], ['Carlos Verona', 'España'], ['Max Walscheid', 'Alemania']] },
  { team: 'lotto-intermarche', riders: [['Toon Aerts', 'Bélgica'], ['Huub Artz', 'Países Bajos'], ['Jenno Berckmoes', 'Bélgica'], ['Cédric Beullens', 'Bélgica'], ['Vito Braet', 'Bélgica'], ['Lars Craps', 'Bélgica'], ['Jasper De Buyst', 'Bélgica'], ['Arnaud De Lie', 'Bélgica'], ['Steffen De Schuyteneer', 'Bélgica'], ['Matthew Fox', 'Australia'], ['Joshua Giddings', 'Reino Unido'], ['Sébastien Grignard', 'Bélgica'], ['Matys Grisel', 'Francia'], ['Simone Gualdi', 'Italia'], ['Mathieu Kockelmann', 'Luxemburgo'], ['Milan Menten', 'Bélgica'], ['Robin Orins', 'Bélgica'], ['Lorenzo Rota', 'Italia'], ['Jonas Rutsch', 'Alemania'], ['Liam Slock', 'Bélgica'], ['Lionel Taminiaux', 'Bélgica'], ['Reuben Thompson', 'Nueva Zelanda'], ['Luca Van Boven', 'Bélgica'], ['Taco van der Hoorn', 'Países Bajos'], ['Lennert Van Eetvelt', 'Bélgica'], ['Roel van Sintmaartensdijk', 'Países Bajos'], ['Baptiste Veistroffer', 'Francia'], ['Jarno Widar', 'Bélgica'], ['Georg Zimmermann', 'Alemania'], ['Felix Ørn-Kristoff', 'Noruega']] },
  { team: 'movistar-team', riders: [['Roger Adrià', 'España'], ['Jorge Arcas', 'España'], ['Orluis Aular', 'Venezuela'], ['Jon Barrenetxea', 'España'], ['Carlos Canal', 'España'], ['Pablo Castrillo', 'España'], ['Jefferson Alveiro Cepeda', 'Ecuador'], ['Davide Formolo', 'Italia'], ['Iván García Cortina', 'España'], ['Raúl García Pierna', 'España'], ['Michel Hessmann', 'Alemania'], ['Juan Pedro López', 'España'], ['Enric Mas', 'España'], ['Lorenzo Milesi', 'Italia'], ['Manlio Moro', 'Italia'], ['Pavel Novák', 'República Checa'], ['Nelson Oliveira', 'Portugal'], ['Diego Pescador', 'Colombia'], ['Nairo Quintana', 'Colombia'], ['Iván Romeo', 'España'], ['Javier Romo', 'España'], ['Einer Rubio', 'Colombia'], ['Pelayo Sánchez', 'España'], ['Gonzalo Serrano', 'España'], ['Natnael Tesfatsion', 'Eritrea'], ['Albert Torres', 'España'], ['Cian Uijtdebroeks', 'Bélgica']] },
  { team: 'netcompany-ineos', riders: [['Thymen Arensman', 'Países Bajos'], ['Andrew August', 'Estados Unidos'], ['Egan Bernal', 'Colombia'], ['Laurens De Plus', 'Bélgica'], ['Tobias Foss', 'Noruega'], ['Filippo Ganna', 'Italia'], ['Dorian Godon', 'Francia'], ['Jack Haig', 'Australia'], ['Lucas Hamilton', 'Australia'], ['Kim Heiduk', 'Alemania'], ['Bob Jungels', 'Luxemburgo'], ['Michał Kwiatkowski', 'Polonia'], ['Victor Langellotti', 'Mónaco'], ['Axel Laurance', 'Francia'], ['Oscar Onley', 'Reino Unido'], ['Brandon Rivera', 'Colombia'], ['Carlos Rodríguez', 'España'], ['Óscar Rodríguez', 'España'], ['Magnus Sheffield', 'Estados Unidos'], ['Artem Shmidt', 'Estados Unidos'], ['Embret Svestad-Bårdseng', 'Noruega'], ['Ben Swift', 'Reino Unido'], ['Connor Swift', 'Reino Unido'], ['Joshua Tarling', 'Reino Unido'], ['Ben Turner', 'Reino Unido'], ['Kévin Vauquelin', 'Francia'], ['Samuel Watson', 'Reino Unido'], ['Sam Welsford', 'Australia'], ['Peter Øxenberg', 'Dinamarca']] },
  { team: 'nsn-cycling-team', riders: [['Lewis Askey', 'Reino Unido'], ['George Bennett', 'Nueva Zelanda'], ['Joseph Blackmore', 'Reino Unido'], ['Guillaume Boivin', 'Canadá'], ['Simon Clarke', 'Australia'], ['Pier-André Côté', 'Canadá'], ['Itamar Einhorn', 'Israel'], ['Marco Frigo', 'Italia'], ['Brady Gilmore', 'Australia'], ['Biniam Girmay', 'Eritrea'], ['Jan Hirt', 'República Checa'], ['Hugo Hofstetter', 'Francia'], ['Oded Kogut', 'Israel'], ['Matis Louvel', 'Francia'], ['Alexey Lutsenko', 'Kazajistán'], ['Pau Martí', 'España'], ['Ryan Mullen', 'Irlanda'], ['Krists Neilands', 'Letonia'], ['Alessandro Pinarello', 'Italia'], ['Nadav Raisberg', 'Israel'], ['Nick Schultz', 'Australia'], ['Riley Sheehan', 'Estados Unidos'], ['Jake Stewart', 'Reino Unido'], ['Corbin Strong', 'Nueva Zelanda'], ['Tom Van Asbroeck', 'Bélgica'], ['Floris Van Tricht', 'Bélgica'], ['Ethan Vernon', 'Reino Unido'], ['Stephen Williams', 'Reino Unido']] },
  { team: 'red-bull-bora-hansgrohe', riders: [['Giovanni Aleotti', 'Italia'], ['Adrien Boichis', 'Francia'], ['Mattia Cattaneo', 'Italia'], ['Nico Denz', 'Alemania'], ['Jarrad Drizners', 'Australia'], ['Haimar Etxeberria', 'España'], ['Remco Evenepoel', 'Bélgica'], ['Finn Fisher-Black', 'Nueva Zelanda'], ['Alexander Hajek', 'Austria'], ['Emil Herzog', 'Alemania'], ['Jai Hindley', 'Australia'], ['Florian Lipowitz', 'Alemania'], ['Arne Marit', 'Bélgica'], ['Daniel Martínez', 'Colombia'], ['Jordi Meeus', 'Bélgica'], ['Gianni Moscon', 'Italia'], ['Giulio Pellizzari', 'Italia'], ['Laurence Pithie', 'Nueva Zelanda'], ['Primož Roglič', 'Eslovenia'], ['Callum Thornley', 'Reino Unido'], ['Jan Tratnik', 'Eslovenia'], ['Luke Tuckwell', 'Australia'], ['Mick van Dijke', 'Países Bajos'], ['Tim van Dijke', 'Países Bajos'], ['Maxim Van Gils', 'Bélgica'], ['Danny van Poppel', 'Países Bajos'], ['Gianni Vermeersch', 'Bélgica'], ['Aleksandr Vlasov', 'Rusia'], ['Frederik Wandahl', 'Dinamarca'], ['Ben Zwiehoff', 'Alemania']] },
  { team: 'soudal-quick-step', riders: [['Ayco Bastiaens', 'Bélgica'], ['Steff Cras', 'Bélgica'], ['Alberto Dainese', 'Italia'], ['Pascal Eenkhoorn', 'Países Bajos'], ['Gianmarco Garofoli', 'Italia'], ['Gil Gelders', 'Bélgica'], ['Ethan Hayter', 'Reino Unido'], ['Yves Lampaert', 'Bélgica'], ['Mikel Landa', 'España'], ['Junior Lecerf', 'Bélgica'], ['Paul Magnier', 'Francia'], ['Tim Merlier', 'Bélgica'], ['Valentin Paret-Peintre', 'Francia'], ['Casper Pedersen', 'Dinamarca'], ['Pepijn Reinderink', 'Países Bajos'], ['Laurenz Rex', 'Bélgica'], ['Maximilian Schachmann', 'Alemania'], ['Jasper Stuyven', 'Bélgica'], ['Martin Svrček', 'Eslovaquia'], ['Dylan van Baarle', 'Países Bajos'], ['Fabio Van den Bossche', 'Bélgica'], ['Dries Van Gestel', 'Bélgica'], ['Bert Van Lerberghe', 'Bélgica'], ['Ilan Van Wilder', 'Bélgica'], ['Warre Vangheluwe', 'Bélgica'], ['Mauri Vansevenant', 'Bélgica'], ['Louis Vervaeke', 'Bélgica'], ['Filippo Zana', 'Italia']] },
  { team: 'team-bahrain-victorious', riders: [['Nikias Arndt', 'Alemania'], ['Phil Bauhaus', 'Alemania'], ['Pello Bilbao', 'España'], ['Alessandro Borgo', 'Italia'], ['Alberto Bruttomesso', 'Italia'], ['Santiago Buitrago', 'Colombia'], ['Damiano Caruso', 'Italia'], ['Roman Ermakov', 'Rusia'], ['Žak Eržen', 'Eslovenia'], ['Afonso Eulálio', 'Portugal'], ['Matevž Govekar', 'Eslovenia'], ['Kamil Gradek', 'Polonia'], ['Rainer Kepplinger', 'Austria'], ['Lenny Martinez', 'Francia'], ['Fran Miholjević', 'Croacia'], ['Pau Miquel', 'España'], ['Matej Mohorič', 'Eslovenia'], ['Jakob Omrzel', 'Eslovenia'], ['Mathijs Paasschens', 'Países Bajos'], ['Alec Segaert', 'Bélgica'], ['Daniel Skerl', 'Italia'], ['Robert Stannard', 'Australia'], ['Oliver Stockwell', 'Reino Unido'], ['Antonio Tiberi', 'Italia'], ['Attila Valter', 'Hungría'], ['Max van der Meulen', 'Países Bajos'], ['Vlad Van Mechelen', 'Bélgica'], ['Edoardo Zambanini', 'Italia']] },
  { team: 'team-jayco-alula', riders: [['Pascal Ackermann', 'Alemania'], ['Koen Bouwman', 'Países Bajos'], ['Amaury Capiot', 'Bélgica'], ['Filippo Conca', 'Italia'], ['Alessandro Covi', 'Italia'], ['Dries De Bondt', 'Bélgica'], ['Dries De Pooter', 'Bélgica'], ['Davide De Pretto', 'Italia'], ['Bob Donaldson', 'Reino Unido'], ['Paul Double', 'Reino Unido'], ['Luke Durbridge', 'Australia'], ['Felix Engelhardt', 'Alemania'], ['Anders Foldager', 'Dinamarca'], ['Patrick Gamper', 'Austria'], ['Alan Hatherly', 'Sudáfrica'], ['Asbjørn Hellemose', 'Dinamarca'], ['Christopher Juul-Jensen', 'Dinamarca'], ['Jelte Krijnsen', 'Países Bajos'], ['Michael Matthews', 'Australia'], ['Hamish McKenzie', 'Australia'], ['Luka Mezgec', 'Eslovenia'], ["Kelland O'Brien", 'Australia'], ["Ben O'Connor", 'Australia'], ['Finlay Pickering', 'Reino Unido'], ['Luke Plapp', 'Australia'], ['Rudy Porter', 'Australia'], ['Mauro Schmid', 'Suiza'], ['Jasha Sütterlin', 'Alemania'], ['Andrea Vendrame', 'Italia']] },
  { team: 'team-picnic-postnl', riders: [['Warren Barguil', 'Francia'], ['Pavel Bittner', 'República Checa'], ['Dillon Corkery', 'Irlanda'], ['John Degenkolb', 'Alemania'], ['Robbe Dhondt', 'Bélgica'], ['Matthew Dinham', 'Australia'], ['Nils Eekhoff', 'Países Bajos'], ['Alexy Faure Prost', 'Francia'], ['Sean Flynn', 'Reino Unido'], ['Mattia Gaffuri', 'Italia'], ['Chris Hamilton', 'Australia'], ['Fabio Jakobsen', 'Países Bajos'], ['Timo de Jong', 'Países Bajos'], ['James Knox', 'Reino Unido'], ['Gijs Leemreize', 'Países Bajos'], ['Enzo Leijnse', 'Países Bajos'], ['Niklas Märkl', 'Alemania'], ['Tim Naberman', 'Países Bajos'], ['Max Poole', 'Reino Unido'], ['Timo Roosen', 'Países Bajos'], ['Julius van den Berg', 'Países Bajos'], ['Frank van den Broek', 'Países Bajos'], ['Casper van Uden', 'Países Bajos'], ['Bram Welten', 'Países Bajos']] },
  { team: 'visma-lease-a-bike', riders: [['Edoardo Affini', 'Italia'], ['Bruno Armirail', 'Francia'], ['Louis Barré', 'Francia'], ['Niklas Behrens', 'Alemania'], ['Matthew Brennan', 'Reino Unido'], ['Victor Campenaerts', 'Bélgica'], ['Owain Doull', 'Reino Unido'], ['Filippo Fiorelli', 'Italia'], ['Tijmen Graat', 'Países Bajos'], ['Per Strand Hagenes', 'Noruega'], ['Menno Huising', 'Países Bajos'], ['Matteo Jorgenson', 'Estados Unidos'], ['Wilco Kelderman', 'Países Bajos'], ['Timo Kielich', 'Bélgica'], ['Steven Kruijswijk', 'Países Bajos'], ['Sepp Kuss', 'Estados Unidos'], ['Christophe Laporte', 'Francia'], ['Bart Lemmen', 'Países Bajos'], ['Jørgen Nordhagen', 'Noruega'], ['Pietro Mattio', 'Italia'], ['Davide Piganzoli', 'Italia'], ['Tim Rex', 'Bélgica'], ['Anton Schiffer', 'Alemania'], ['Ben Tulett', 'Reino Unido'], ['Wout van Aert', 'Bélgica'], ['Loe van Belle', 'Países Bajos'], ['Jonas Vingegaard', 'Dinamarca'], ['Axel Zingle', 'Francia']] },
  { team: 'uae-team-emirates-xrg', riders: [['João Almeida', 'Portugal'], ['Igor Arrieta', 'España'], ['Filippo Baroncini', 'Italia'], ['Mikkel Bjerg', 'Dinamarca'], ['Jan Christen', 'Suiza'], ['Benoît Cosnefroy', 'Francia'], ['Isaac del Toro', 'México'], ['Luca Giaimi', 'Italia'], ['Felix Großschartner', 'Austria'], ['Rune Herregodts', 'Bélgica'], ['Julius Johansen', 'Dinamarca'], ['Vegard Stake Laengen', 'Noruega'], ['Brandon McNulty', 'Estados Unidos'], ['Juan Sebastián Molano', 'Colombia'], ['António Morgado', 'Portugal'], ['Jhonatan Narváez', 'Ecuador'], ['Domen Novak', 'Eslovenia'], ['Ivo Oliveira', 'Portugal'], ['Rui Oliveira', 'Portugal'], ['Adrià Pericas', 'España'], ['Tadej Pogačar', 'Eslovenia'], ['Nils Politt', 'Alemania'], ['Pavel Sivakov', 'Francia'], ['Marc Soler', 'España'], ['Pablo Torres', 'España'], ['Kevin Vermaerke', 'Estados Unidos'], ['Florian Vermeersch', 'Bélgica'], ['Jay Vine', 'Australia'], ['Tim Wellens', 'Bélgica'], ['Adam Yates', 'Reino Unido']] },
  { team: 'uno-x-mobility', riders: [['Jonas Abrahamsen', 'Noruega'], ['Erlend Blikra', 'Noruega'], ['Martin Urianstad Bugge', 'Noruega'], ['Fredrik Dversnes', 'Noruega'], ['Stian Fredheim', 'Noruega'], ['Markus Hoelgaard', 'Noruega'], ['Ådne Holter', 'Noruega'], ['Jonas Iversby Hvideberg', 'Noruega'], ['Storm Ingebrigtsen', 'Noruega'], ['Anders Halland Johannessen', 'Noruega'], ['Tobias Halland Johannessen', 'Noruega'], ['Andreas Leknessund', 'Noruega'], ['Sakarias Koller Løland', 'Noruega'], ['Erik Resell', 'Noruega'], ['Anders Skaarseth', 'Noruega'], ['Rasmus Tiller', 'Noruega'], ['Martin Tjøtta', 'Noruega'], ['Søren Wærenskjold', 'Noruega'], ['Sven Erik Bystrøm', 'Noruega'], ['Torstein Træen', 'Noruega'], ['Carl-Frederik Bévort', 'Dinamarca'], ['William Blume Levy', 'Dinamarca'], ['Magnus Cort', 'Dinamarca'], ['Simon Dalby', 'Dinamarca'], ['Anthon Charmig', 'Dinamarca'], ['Andreas Kron', 'Dinamarca'], ['Johannes Kulset', 'Dinamarca'], ['Alexander Kamp', 'Dinamarca'], ['Henrik Pedersen', 'Dinamarca'], ['Tobias Svarre', 'Dinamarca']] },
  { team: 'xds-astana-team', riders: [['Davide Ballerini', 'Italia'], ['Alberto Bettiol', 'Italia'], ['Clément Champoussin', 'Francia'], ['Nicola Conci', 'Italia'], ['Yevgeniy Fedorov', 'Kazajistán'], ['Lorenzo Fortunato', 'Italia'], ['Aaron Gate', 'Nueva Zelanda'], ['Lev Gonov', 'Rusia'], ['Sergio Higuita', 'Colombia'], ['Florian Samuel Kajamini', 'Italia'], ['Max Kanter', 'Alemania'], ['Anton Kuzmin', 'Kazajistán'], ['Arjen Livyns', 'Bélgica'], ['Harold Martín López', 'Ecuador'], ['Matteo Malucelli', 'Italia'], ['Henok Mulubrhan', 'Eritrea'], ['Cristián Rodríguez', 'España'], ['Alessandro Romele', 'Italia'], ['Christian Scaroni', 'Italia'], ['Marco Schrettl', 'Austria'], ['Thomas Silva', 'Uruguay'], ['Su Haoyu', 'China'], ['Gleb Syritsa', 'Rusia'], ['Harold Tejada', 'Colombia'], ['Mike Teunissen', 'Países Bajos'], ['Davide Toneatti', 'Italia'], ['Diego Ulissi', 'Italia'], ['Darren van Bekkum', 'Países Bajos'], ['Simone Velasco', 'Italia'], ['Nicolas Vinokurov', 'Kazajistán']] },
  { team: 'ag-insurance-soudal', riders: [['Fauve Bastiaenssen', 'Bélgica'], ['Letizia Borghesi', 'Italia'], ['Shari Bossuyt', 'Bélgica'], ['Alana Castrique', 'Bélgica'], ['Kim Le Court-Pienaar', 'Mauricio'], ['Justine Ghekiere', 'Bélgica'], ['Sarah Gigante', 'Australia'], ['Marthe Goossens', 'Bélgica'], ['Anya Louw', 'Australia'], ['Alexandra Manly', 'Australia'], ['Ashleigh Moolman Pasio', 'Sudáfrica'], ['Mireia Benito Pellicer', 'España'], ['Ilse Pluimers', 'Países Bajos'], ['Lore De Schepper', 'Bélgica'], ['Julie Van de Velde', 'Bélgica'], ['Gladys Verhulst-Wild', 'Francia'], ['Urška Žigart', 'Eslovenia']] },
  { team: 'canyon-sram', riders: [['Katarzyna Niewiadoma-Phinney', 'Polonia'], ['Cecilie Uttrup Ludwig', 'Dinamarca'], ['Zoë Bäckstedt', 'Reino Unido'], ['Wilma Aintila', 'Finlandia'], ['Neve Bradbury', 'Australia'], ['Chiara Consonni', 'Italia'], ['Tiffany Cromwell', 'Australia'], ['Justyna Czapla', 'Alemania'], ['Chloé Dygert', 'Estados Unidos'], ['Rosa Maria Klöser', 'Alemania'], ['Anastasiya Kolesava', 'Bielorrusia'], ['Maria Martins', 'Portugal'], ['Antonia Niedermaier', 'Alemania'], ['Soraya Paladin', 'Italia'], ['Agnieszka Skalniak-Sojka', 'Polonia'], ['Maike van der Duin', 'Países Bajos']] },
  { team: 'ef-education-oatly', riders: [['Minke Solbjørk Anderson', 'Dinamarca'], ['Nina Berton', 'Luxemburgo'], ['Auke De Buysser', 'Bélgica'], ['Kim Cadzow', 'Nueva Zelanda'], ['Henrietta Christie', 'Nueva Zelanda'], ['Axelle Dubau-Prévot', 'Francia'], ['Kristen Faulkner', 'Estados Unidos'], ['Stina Kagevi', 'Suecia'], ['Cédrine Kerbaol', 'Francia'], ['Mirre Knaven', 'Países Bajos'], ['Alexis Magner', 'Estados Unidos'], ['Magdeleine Vallières', 'Canadá'], ["Caoimhe O'Brien", 'Irlanda'], ['Noemi Rüegg', 'Suiza'], ['Alice Towers', 'Reino Unido'], ['Alexandra Volstad', 'Canadá'], ['Babette van der Wolf', 'Países Bajos']] },
  { team: 'fdj-united-suez', riders: [['Sofia Bertizzolo', 'Italia'], ['Juliette Berthet', 'Francia'], ['Elise Chabbey', 'Suiza'], ['Kate Courtney', 'Estados Unidos'], ['Léa Curinier', 'Francia'], ['Lauren Dickson', 'Reino Unido'], ['Célia Géry', 'Francia'], ['Vittoria Guazzini', 'Italia'], ['Franziska Koch', 'Alemania'], ['Amber Kraak', 'Países Bajos'], ['Marie Le Net', 'Francia'], ['Evita Muzic', 'Francia'], ['Eglantine Rayer', 'Francia'], ['Eva van Agt', 'Países Bajos'], ['Demi Vollering', 'Países Bajos'], ['Jade Wiel', 'Francia'], ['Ally Wollaston', 'Nueva Zelanda']] },
  { team: 'fenix-premier-tech', riders: [['Puck Pieterse', 'Países Bajos'], ['Charlotte Kool', 'Países Bajos'], ['Ceylin del Carmen Alvarado', 'Países Bajos'], ['Sara Casasola', 'Italia'], ['Lotte Claes', 'Bélgica'], ['Millie Couzens', 'Reino Unido'], ['Julie De Wilde', 'Bélgica'], ['Flora Perkins', 'Reino Unido'], ['Yara Kastelijn', 'Países Bajos'], ['Evy Kuijpers', 'Países Bajos'], ['Carina Schrempf', 'Austria'], ['Christina Schweinberger', 'Austria'], ['Marthe Truyen', 'Bélgica'], ['Aniek van Alphen', 'Países Bajos'], ['Inge van der Heijden', 'Países Bajos'], ['Mylene de Zoete', 'Países Bajos'], ['Xaydée Van Sinaey', 'Bélgica'], ['Fien Van Eynde', 'Bélgica']] },
  { team: 'human-powered-health', riders: [['Yurani Blanco', 'España'], ['Giada Borghesi', 'Italia'], ['Nina Buijsman', 'Países Bajos'], ['Carlotta Cipressi', 'Italia'], ['Maggie Coles-Lyster', 'Canadá'], ['Jente Koops', 'Países Bajos'], ['Thalita de Jong', 'Países Bajos'], ['Ruth Edwards', 'Estados Unidos'], ['Marta Jaskulska', 'Polonia'], ['Barbara Malcotti', 'Italia'], ['Mona Mitterwallner', 'Austria'], ['Daria Pikulik', 'Polonia'], ['Wiktoria Pikulik', 'Polonia'], ['Marit Raaijmakers', 'Países Bajos'], ['Katia Ragusa', 'Italia'], ['Titia Ryo', 'Francia'], ['Kathrin Schweinberger', 'Austria'], ['Petra Stiasny', 'Suiza'], ['Lily Williams', 'Estados Unidos'], ['Silvia Zanardi', 'Italia']] },
  { team: 'lidl-trek-women', riders: [['Loes Adegeest', 'Países Bajos'], ['Shirin van Anrooij', 'Países Bajos'], ['Elisa Balsamo', 'Italia'], ['Ricarda Bauernfeind', 'Alemania'], ['Lucinda Brand', 'Países Bajos'], ['Clara Copponi', 'Francia'], ['Niamh Fisher-Black', 'Nueva Zelanda'], ['Lauretta Hanson', 'Australia'], ['Anna Henderson', 'Reino Unido'], ['Ava Holmgren', 'Canadá'], ['Isabella Holmgren', 'Canadá'], ['Marine Lenehan', 'Irlanda'], ['Riejanne Markus', 'Países Bajos'], ['Fleur Moors', 'Bélgica'], ['Emma Norsgaard', 'Dinamarca'], ['Gaia Realini', 'Italia'], ['Amanda Spratt', 'Australia'], ['Margot Vanpachtenbeke', 'Bélgica'], ['Felicity Wilson-Haffenden', 'Australia']] },
  { team: 'liv-alula-jayco', riders: [['Caroline Andersson', 'Suecia'], ['Georgia Baker', 'Australia'], ['Monica Trinca Colonel', 'Italia'], ['Mackenzie Coupland', 'Australia'], ['Nadia Gontova', 'Canadá'], ['Noa Jansen', 'Países Bajos'], ['Jeanne Korevaar', 'Países Bajos'], ['Amber Pate', 'Australia'], ['Letizia Paternoster', 'Italia'], ['Ruby Roseman-Gannon', 'Australia'], ['Silke Smulders', 'Países Bajos'], ['Josie Talbot', 'Australia'], ['Quinty Ton', 'Países Bajos'], ['Matilde Vitillo', 'Italia'], ['Ella Wyllie', 'Nueva Zelanda']] },
  { team: 'movistar-team-women', riders: [['Marlen Reusser', 'Suiza'], ['Liane Lippert', 'Alemania'], ['Aude Biannic', 'Francia'], ['Olivia Baril', 'Canadá'], ['Francesca Barale', 'Italia'], ['Sheyla Gutiérrez', 'España'], ['Cat Ferguson', 'Reino Unido'], ['Floortje Mackaij', 'Países Bajos'], ['Ana Magalhães', 'Brasil'], ['Sara Martín', 'España'], ['Mareille Meijering', 'Países Bajos'], ['Carys Lloyd', 'Reino Unido'], ['Laura Ruiz', 'España'], ['Lucía Ruiz', 'España'], ['Arlenis Sierra', 'Cuba'], ['Claire Steels', 'Reino Unido'], ['Paula Ostiz', 'España']] },
  { team: 'team-picnic-postnl-women', riders: [['Megan Arens', 'Países Bajos'], ['Rachele Barbieri', 'Italia'], ['Eleonora Ciabocco', 'Italia'], ['Robyn Clay', 'Reino Unido'], ['Lucie Fityus', 'Australia'], ['Pfeiffer Georgi', 'Reino Unido'], ['Mia Griffin', 'Irlanda'], ['Daniela Hezinová', 'República Checa'], ['Ella Heremans', 'Bélgica'], ['Audrey De Keersmaeker', 'Bélgica'], ['Juliana Londoño', 'Colombia'], ['Gaia Masetti', 'Italia'], ['Dilyxine Miermont', 'Francia'], ['Josie Nelson', 'Reino Unido'], ['Mara Roldan', 'Canadá'], ['Becky Storrie', 'Reino Unido'], ['Elise Uijen', 'Países Bajos']] },
  { team: 'team-sd-worx-protime', riders: [['Mischa Bredewold', 'Países Bajos'], ['Valentina Cavallar', 'Austria'], ['Elena Cecchini', 'Italia'], ['Femke Gerritse', 'Países Bajos'], ['Barbara Guarischi', 'Italia'], ['Steffi Häberlin', 'Suiza'], ['Mikayla Harvey', 'Nueva Zelanda'], ['Julia Kopecký', 'República Checa'], ['Lotte Kopecky', 'Bélgica'], ['Marta Lach', 'Polonia'], ['Femke Markus', 'Países Bajos'], ['Marie Schreiber', 'Luxemburgo'], ['Lisa van Belle', 'Países Bajos'], ['Anna van der Breggen', 'Países Bajos'], ['Blanka Vas', 'Hungría'], ['Nienke Vinke', 'Países Bajos'], ['Lorena Wiebes', 'Países Bajos']] },
  { team: 'uae-team-limad', riders: [['Alena Amialiusik', 'Bielorrusia'], ['Paula Blasi', 'España'], ['Elisa Longo Borghini', 'Italia'], ['Elynor Bäckstedt', 'Reino Unido'], ['Brodie Chapman', 'Australia'], ['Febe Jooris', 'Bélgica'], ['Mavi García', 'España'], ['Eleonora Gasparrini', 'Italia'], ['Lara Gillespie', 'Irlanda'], ['Alena Ivanchenko', 'Rusia'], ['Megan Jastrab', 'Estados Unidos'], ['Erica Magnaldi', 'Italia'], ['Greta Marturano', 'Italia'], ['Silvia Persico', 'Italia'], ['Pauliena Rooijakkers', 'Países Bajos'], ['Sofie van Rooijen', 'Países Bajos'], ['Safia Al-Sayegh', 'EAU'], ['Maëva Squiban', 'Francia'], ['Karlijn Swinkels', 'Países Bajos'], ['Federica Venturelli', 'Italia'], ['Dominika Włodarczyk', 'Polonia']] },
  { team: 'uno-x-mobility-women', riders: [['Katrine Aalerud', 'Noruega'], ['Kamilla Aasebø', 'Noruega'], ['Anniina Ahtosalo', 'Finlandia'], ['Susanne Andersen', 'Noruega'], ['Elinor Barker', 'Reino Unido'], ['Teuntje Beekhuis', 'Países Bajos'], ['Marte Berg Edseth', 'Noruega'], ['Jelena Erić', 'Serbia'], ['Mia Gjertsen', 'Noruega'], ['Alberte Greve', 'Dinamarca'], ['Ingvild Gåskjenn', 'Noruega'], ['Sigrid Ytterhus Haugset', 'Noruega'], ['Rebecca Koerner', 'Dinamarca'], ['Anouska Koster', 'Países Bajos'], ['Mie Bjørndal Ottestad', 'Noruega'], ['Francesca Pellegrini', 'Italia'], ['Laura Tomasi', 'Italia'], ['Alessia Vigilia', 'Italia'], ['Anne Dorthe Ysland', 'Noruega'], ['Linda Zanetti', 'Suiza']] },
  { team: 'visma-lease-a-bike-women', riders: [['Marion Bunel', 'Francia'], ['Viktória Chladoňová', 'Eslovaquia'], ['Sarah van Dam', 'Canadá'], ['Fem van Empel', 'Países Bajos'], ['Pauline Ferrand-Prévot', 'Francia'], ['Martina Fidanza', 'Italia'], ['Daniek Hengeveld', 'Países Bajos'], ['Lieke Nooijen', 'Países Bajos'], ['Maud Oudeman', 'Países Bajos'], ['Rosita Reijnhout', 'Países Bajos'], ['Katharina Sadnik', 'Austria'], ['Nienke Veenhoven', 'Países Bajos'], ['Margaux Vigié', 'Francia'], ['Marianne Vos', 'Países Bajos'], ['Femke de Vries', 'Países Bajos'], ['Imogen Wolff', 'Reino Unido']] },
]


export async function importUciRacesAndTeams() {
  let raceCount = 0
  for (const race of [...MENS_RACES, ...WOMENS_RACES, ...CHAMPIONSHIP_RACES, ...MTB_GRAVEL_RACES]) {
    const { slug, name, start, end, country, category, numStages } = race
    await prisma.race.upsert({
      where: { slug },
      update: { name, startDate: new Date(start), endDate: new Date(end), country, category, numStages, status: statusFor(start, end), year: 2026 },
      create: {
        slug,
        name,
        year: 2026,
        startDate: new Date(start),
        endDate: new Date(end),
        country,
        category,
        numStages,
        status: statusFor(start, end),
      },
    })
    raceCount++
  }

  let teamCount = 0
  for (const team of [...MENS_TEAMS, ...WOMENS_TEAMS]) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: { name: team.name, country: team.country, category: team.category },
      create: team,
    })
    teamCount++
  }

  return { raceCount, teamCount }
}

export async function importUciRiders() {
  let riderCount = 0
  const skippedTeams: string[] = []

  for (const { team: teamSlug, riders } of ROSTERS) {
    const team = await prisma.team.findUnique({ where: { slug: teamSlug } })
    if (!team) {
      skippedTeams.push(teamSlug)
      continue
    }

    for (const [name, nationality] of riders) {
      const slug = slugify(name)
      await prisma.rider.upsert({
        where: { slug },
        update: { name, nationality, currentTeamId: team.id },
        create: { slug, name, nationality, currentTeamId: team.id },
      })
      riderCount++
    }
  }

  return { riderCount, skippedTeams }
}

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

const vueltaStage19Content = `
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

export async function publishVueltaStage19Article() {
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
  const heroImageId = await ensureCustomHeroImage('dunbar-gana-etapa-19-vuelta-espana-mas-lidera', {
    url: '/images/headers/vuelta-stage19-cover.jpg',
    altText: 'Dunbar gana en Peñas Blancas y Enric Mas defiende el liderato a dos etapas del final',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Dunbar gana en Peñas Blancas y Enric Mas defiende el liderato a dos etapas del final',
    subtitle: 'El irlandés se impuso en solitario en la etapa reina del sur; Mas mantiene 1:37 sobre Roglič antes de la última cita de montaña',
    excerpt:
      'Eddie Dunbar ganó la etapa 19 de la Vuelta a España en el alto de Peñas Blancas tras una larga fuga. Enric Mas conserva el maillot rojo con 1:37 de ventaja sobre Primož Roglič a falta de dos etapas.',
    content: vueltaStage19Content,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
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

  return { slug: article.slug }
}

/**
 * Cierre real de la Vuelta a España 2026 — hechos verificados el
 * 2026-09-14 (un día después del final de carrera) vía la web oficial
 * de La Vuelta y prensa especializada, ver sourceUrls. Publica el
 * artículo del desenlace y carga los resultados estructurados (Result)
 * de la general final, las dos últimas etapas y las clasificaciones
 * secundarias.
 */
const vueltaFinalGC: { rider: string; team: string; time: string }[] = [
  { rider: 'enric-mas', team: 'movistar-team', time: "73h 52' 55\"" },
  { rider: 'primoz-roglic', team: 'red-bull-bora-hansgrohe', time: '+2:15' },
  { rider: 'felix-gall', team: 'decathlon-cma-cgm', time: '+2:44' },
  { rider: 'richard-carapaz', team: 'ef-education-easypost', time: '+6:54' },
  { rider: 'sepp-kuss', team: 'visma-lease-a-bike', time: '+8:45' },
  { rider: 'oscar-onley', team: 'netcompany-ineos', time: '+9:28' },
  { rider: 'jakob-omrzel', team: 'team-bahrain-victorious', time: '+10:38' },
  { rider: 'clement-berthet', team: 'groupama-fdj-united', time: '+11:41' },
  { rider: 'cristian-rodriguez', team: 'xds-astana-team', time: '+11:59' },
  { rider: 'harold-tejada', team: 'xds-astana-team', time: '+12:51' },
]

const vueltaFinalContent = `
<p>Enric Mas (Movistar Team) se proclamó campeón de la Vuelta a España 2026 tras completar la vigésimo primera y última etapa en Granada, sellando así el primer triunfo español en la ronda desde hace más de una década. Mas defendió el maillot rojo desde la contrarreloj de mitad de carrera y resistió los ataques de sus rivales directos en los Pirineos y Sierra Nevada hasta certificar matemáticamente el título en la etapa 20.</p>

<p>La clasificación general final quedó con Mas por delante de Primož Roglič (Red Bull-BORA-hansgrohe), a 2 minutos y 15 segundos, y Felix Gall (Decathlon CMA CGM), tercero a 2:44. Richard Carapaz (EF Education-EasyPost) y Sepp Kuss (Visma-Lease a Bike) completaron el top 5.</p>

<p>La penúltima etapa, una jornada reina de 186,8&nbsp;km entre La Calahorra y el Collado del Alguacil, tuvo un protagonista inesperado: Mikel Landa (Soudal-Quick-Step) se impuso en solitario a sus 36 años, su primera victoria de etapa en la Vuelta en cinco años, superando por 47 segundos al noruego Tobias Halland Johannessen (Uno-X Mobility). Fue precisamente en esa etapa donde Enric Mas certificó el título al controlar a sus rivales en el último puerto.</p>

<p>La etapa final, disputada en un circuito urbano de 112&nbsp;km por el centro de Granada con cuatro pasadas por una rampa adoquinada, terminó en un sprint reducido que ganó el propio Johannessen, por delante de Alessandro Romele y Ramses Debruyne — un cierre de fiesta antes de la ceremonia de coronación de Mas.</p>

<p>En las clasificaciones secundarias, Wout van Aert (Visma-Lease a Bike) se llevó el maillot verde de la regularidad, Santiago Buitrago (Team Bahrain Victorious) el de la montaña, y Oscar Onley (Netcompany Ineos) el de mejor joven.</p>
`.trim()

export async function publishVueltaFinalArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'grand-tours' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUniqueOrThrow({ where: { slug: 'vuelta-a-espana-2026' }, select: { id: true } })

  const gcRiderSlugs = vueltaFinalGC.map((r) => r.rider)
  const extraRiderSlugs = ['mikel-landa', 'tobias-halland-johannessen', 'wout-van-aert', 'santiago-buitrago', 'alessandro-romele', 'ramses-debruyne']
  const riders = await prisma.rider.findMany({
    where: { slug: { in: [...gcRiderSlugs, ...extraRiderSlugs] } },
    select: { id: true, slug: true },
  })
  const riderBySlug = new Map(riders.map((r) => [r.slug, r]))

  const teamSlugs = [...new Set(vueltaFinalGC.map((r) => r.team))]
  const teams = await prisma.team.findMany({ where: { slug: { in: teamSlugs } }, select: { id: true, slug: true } })
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))

  const heroImageId = await ensureCustomHeroImage('enric-mas-campeon-vuelta-espana-2026', {
    url: '/images/headers/vuelta-final-cover.jpg',
    altText: 'Enric Mas se corona campeón de la Vuelta a España 2026 en Granada',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Enric Mas se corona campeón de la Vuelta a España 2026 en Granada',
    subtitle: 'El español selló el título tras la etapa reina, ganada por Mikel Landa; Johannessen cerró la ronda con el triunfo en el sprint final de Granada',
    excerpt:
      'Enric Mas (Movistar) gana la Vuelta a España 2026 con 2:15 sobre Primož Roglič. Mikel Landa venció en la etapa reina y Tobias Johannessen cerró la ronda con la victoria en Granada.',
    content: vueltaFinalContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.lavuelta.es/en/rankings/stage-21',
      'https://ciclismointernacional.com/clasificaciones-finales-de-la-vuelta-a-espana-2026/',
      'https://en.brujulabike.com/tobias-johannessen-wins-a-spectacular-final-stage-of-vuelta-by-the-alhambra-and-enric-mas-is-crowned-in-granada/',
      'https://www.ciclismocolombiano.com/vuelta-a-espana/mikel-landa-gana-etapa-20-vuelta-espana-2026/',
    ]),
    sourceNames: toJsonField(['La Vuelta (oficial)', 'Ciclismo Internacional', 'Brújula Bike', 'Ciclismo Colombiano']),
    seoTitle: 'Enric Mas gana la Vuelta a España 2026',
    seoDescription:
      'Enric Mas se corona campeón de la Vuelta a España 2026 en Granada, por delante de Roglič y Gall. Repaso a las dos últimas etapas y las clasificaciones secundarias.',
    readingTime: 3,
  }

  const articleRiderIds = [...gcRiderSlugs, ...extraRiderSlugs]
    .map((slug) => riderBySlug.get(slug)?.id)
    .filter((id): id is number => id !== undefined)
  const articleTeamIds = teamSlugs.map((slug) => teamBySlug.get(slug)?.id).filter((id): id is number => id !== undefined)

  const article = await prisma.article.upsert({
    where: { slug: 'enric-mas-campeon-vuelta-espana-2026' },
    update: {
      ...baseFields,
      riders: { set: articleRiderIds.map((id) => ({ id })) },
      teams: { set: articleTeamIds.map((id) => ({ id })) },
      races: { set: [{ id: race.id }] },
    },
    create: {
      slug: 'enric-mas-campeon-vuelta-espana-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: articleRiderIds.map((id) => ({ id })) },
      teams: { connect: articleTeamIds.map((id) => ({ id })) },
      races: { connect: [{ id: race.id }] },
    },
  })

  // Resultados estructurados — general final (gc), ganadores de etapa
  // (stage) y clasificaciones secundarias (points/kom/youth). Se borran
  // los de esta carrera antes de recrearlos: sin esto, cada vez que se
  // vuelve a correr esta función (el botón de admin lo permite a
  // propósito) se duplicaban las filas de Result.
  await prisma.result.deleteMany({ where: { raceId: race.id } })
  let resultCount = 0
  const finalDate = new Date('2026-09-13')

  for (const [i, row] of vueltaFinalGC.entries()) {
    const rider = riderBySlug.get(row.rider)
    const team = teamBySlug.get(row.team)
    if (!rider) continue
    await prisma.result.create({
      data: {
        raceId: race.id,
        riderId: rider.id,
        teamId: team?.id,
        position: i + 1,
        time: row.time,
        date: finalDate,
        resultType: 'gc',
      },
    })
    resultCount++
  }

  const stageResults: { rider: string; position: number; date: string; time?: string }[] = [
    { rider: 'mikel-landa', position: 1, date: '2026-09-12', time: "4h 58' 01\"" },
    { rider: 'tobias-halland-johannessen', position: 2, date: '2026-09-12', time: '+0:47' },
    { rider: 'tobias-halland-johannessen', position: 1, date: '2026-09-13' },
    { rider: 'alessandro-romele', position: 2, date: '2026-09-13' },
    { rider: 'ramses-debruyne', position: 3, date: '2026-09-13' },
  ]
  for (const row of stageResults) {
    const rider = riderBySlug.get(row.rider)
    if (!rider) continue
    await prisma.result.create({
      data: { raceId: race.id, riderId: rider.id, position: row.position, time: row.time, date: new Date(row.date), resultType: 'stage' },
    })
    resultCount++
  }

  const jerseyResults: { rider: string; resultType: string }[] = [
    { rider: 'wout-van-aert', resultType: 'points' },
    { rider: 'santiago-buitrago', resultType: 'kom' },
    { rider: 'oscar-onley', resultType: 'youth' },
  ]
  for (const row of jerseyResults) {
    const rider = riderBySlug.get(row.rider)
    if (!rider) continue
    await prisma.result.create({
      data: { raceId: race.id, riderId: rider.id, position: 1, date: finalDate, resultType: row.resultType },
    })
    resultCount++
  }

  await prisma.race.update({ where: { id: race.id }, data: { status: 'finished' } })

  return { slug: article.slug, resultCount }
}

/**
 * Grand Prix Cycliste de Québec y de Montréal 2026 — hechos verificados
 * el 2026-09-14 vía prensa especializada (ciclismointernacional.com,
 * velo.outsideonline.com, cyclinguptodate.com), ver sourceUrls. Ambas
 * carreras ya estaban en el calendario UCI cargado. El Mundial de
 * ruta 2026 se corre en Montreal del 20 al 27 de septiembre — dato
 * verificado vía Wikipedia, no incluido aquí como artículo todavía
 * (pendiente en el checklist hasta que ocurra).
 */
const canadianClassicsContent = `
<p>La última semana antes del Mundial de ruta —que se disputa del 20 al 27 de septiembre en la propia Montreal— dejó dos vencedores de peso en las clásicas canadienses, la última prueba grande antes de la cita en el circuito del Mont Royal.</p>

<p>En Quebec, Remco Evenepoel (Red Bull-BORA-hansgrohe) lanzó el ataque decisivo a 27&nbsp;km de meta, en la Côte de la Montagne, y llegó a resolver el resto de la carrera en un sprint a dos contra Giulio Ciccone (Lidl-Trek), a quien superó con autoridad. Anthon Charmig (Uno-X Mobility) completó el podio.</p>

<p>Dos días después, en Montreal, Isaac del Toro (UAE Team Emirates-XRG) protagonizó una de las victorias más comentadas de la temporada: tras ir a rueda del francés Paul Seixas (Decathlon CMA CGM) buena parte del circuito de 214,4&nbsp;km, el mexicano lanzó un ataque demoledor a 150 metros de meta para superarlo en la subida final. Brandon McNulty (UAE Team Emirates-XRG) fue tercero, por delante de Quinn Simmons (Lidl-Trek).</p>

<p>Con 22 años y 290 días, Del Toro se convirtió en el vencedor más joven en la historia del GP de Montreal —prueba disputada desde 2010—, superando el récord que tenía Peter Sagan desde 2013, y en el primer mexicano en ganarla. Fue su victoria profesional número 33, la duodécima de la temporada 2026.</p>

<p>Ambos resultados sirven como termómetro de forma de cara al Mundial: Evenepoel y Del Toro llegan entre los nombres a seguir en un circuito, el del Mont Royal, que conocen de memoria tras estas dos citas.</p>
`.trim()

export async function publishCanadianClassicsArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'clasicas' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const [quebec, montreal] = await Promise.all([
    prisma.race.findUniqueOrThrow({ where: { slug: 'gp-cycliste-quebec-2026' }, select: { id: true } }),
    prisma.race.findUniqueOrThrow({ where: { slug: 'gp-cycliste-montreal-2026' }, select: { id: true } }),
  ])

  const riderSlugs = ['remco-evenepoel', 'giulio-ciccone', 'anthon-charmig', 'isaac-del-toro', 'paul-seixas', 'brandon-mcnulty', 'quinn-simmons']
  const teamSlugs = ['red-bull-bora-hansgrohe', 'lidl-trek', 'uno-x-mobility', 'uae-team-emirates-xrg', 'decathlon-cma-cgm']
  const [riders, teams] = await Promise.all([
    prisma.rider.findMany({ where: { slug: { in: riderSlugs } }, select: { id: true, slug: true } }),
    prisma.team.findMany({ where: { slug: { in: teamSlugs } }, select: { id: true, slug: true } }),
  ])
  const riderBySlug = new Map(riders.map((r) => [r.slug, r]))
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))

  const heroImageId = await ensureCustomHeroImage('evenepoel-quebec-del-toro-montreal-2026', {
    url: '/images/headers/canadian-classics-cover.jpg',
    altText: 'Evenepoel gana en Quebec e Isaac del Toro hace historia en Montreal antes del Mundial',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Evenepoel gana en Quebec e Isaac del Toro hace historia en Montreal antes del Mundial',
    subtitle: 'El mexicano se convirtió en el vencedor más joven del GP de Montreal, superando el récord de Sagan, a una semana del Mundial de ruta en la misma ciudad',
    excerpt:
      'Remco Evenepoel se impuso en el GP de Quebec y Isaac del Toro ganó el GP de Montreal con un ataque a falta de 150 metros, el mejor resultado de su carrera antes del Mundial de ruta en Montreal (20-27 de septiembre).',
    content: canadianClassicsContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: true,
    sourceUrls: toJsonField([
      'https://ciclismointernacional.com/gran-premio-de-quebec-2026-cronica-resultados/',
      'https://velo.outsideonline.com/road/road-racing/grand-prix-cycliste-de-montreal-2026-isaac-del-toro-wins/',
      'https://cyclinguptodate.com/cycling/results-gp-de-montreal-2026-isaac-del-toro-beats-paul-seixas-as-duo-dominate-with-final-lap-surge-as-focus-turns-to-world-championships',
    ]),
    sourceNames: toJsonField(['Ciclismo Internacional', 'Velo (Outside)', 'Cycling Up To Date']),
    seoTitle: 'Del Toro gana el GP de Montreal, Evenepoel el de Quebec',
    seoDescription:
      'Isaac del Toro hace historia en el GP de Montreal y Remco Evenepoel gana en Quebec, a una semana del Mundial de ruta 2026 en la misma ciudad canadiense.',
    readingTime: 2,
  }

  const riderIds = riderSlugs.map((s) => riderBySlug.get(s)?.id).filter((id): id is number => id !== undefined)
  const teamIds = teamSlugs.map((s) => teamBySlug.get(s)?.id).filter((id): id is number => id !== undefined)

  const article = await prisma.article.upsert({
    where: { slug: 'evenepoel-quebec-del-toro-montreal-2026' },
    update: {
      ...baseFields,
      riders: { set: riderIds.map((id) => ({ id })) },
      teams: { set: teamIds.map((id) => ({ id })) },
      races: { set: [{ id: quebec.id }, { id: montreal.id }] },
    },
    create: {
      slug: 'evenepoel-quebec-del-toro-montreal-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: riderIds.map((id) => ({ id })) },
      teams: { connect: teamIds.map((id) => ({ id })) },
      races: { connect: [{ id: quebec.id }, { id: montreal.id }] },
    },
  })

  // Se borran los resultados existentes de ambas carreras antes de
  // recrearlos — evita duplicar filas de Result cada vez que se corre
  // esta función (el botón de admin lo permite a propósito).
  await prisma.result.deleteMany({ where: { raceId: { in: [quebec.id, montreal.id] } } })
  let resultCount = 0
  const quebecPodium: { rider: string; position: number }[] = [
    { rider: 'remco-evenepoel', position: 1 },
    { rider: 'giulio-ciccone', position: 2 },
    { rider: 'anthon-charmig', position: 3 },
  ]
  for (const row of quebecPodium) {
    const rider = riderBySlug.get(row.rider)
    if (!rider) continue
    await prisma.result.create({
      data: { raceId: quebec.id, riderId: rider.id, position: row.position, date: new Date('2026-09-11'), resultType: 'stage' },
    })
    resultCount++
  }

  const montrealPodium: { rider: string; position: number; time?: string }[] = [
    { rider: 'isaac-del-toro', position: 1, time: "5h 13' 16\"" },
    { rider: 'paul-seixas', position: 2 },
    { rider: 'brandon-mcnulty', position: 3 },
    { rider: 'quinn-simmons', position: 4 },
  ]
  for (const row of montrealPodium) {
    const rider = riderBySlug.get(row.rider)
    if (!rider) continue
    await prisma.result.create({
      data: { raceId: montreal.id, riderId: rider.id, position: row.position, time: row.time, date: new Date('2026-09-13'), resultType: 'stage' },
    })
    resultCount++
  }

  await prisma.race.updateMany({ where: { id: { in: [quebec.id, montreal.id] } }, data: { status: 'finished' } })

  return { slug: article.slug, resultCount }
}

const ayusoCrashContent = `
<p>Juan Ayuso (UAE Team Emirates-XRG) sufrió una aparatosa caída a unos 50 metros de la meta en el esprint final del Grand Prix Cycliste de Québec, carrera que ganó Remco Evenepoel. Según la reconstrucción de los hechos, un volantazo de Quinten Hermans provocó que Simone Gualdi tocara a Paul Seixas, quien a su vez golpeó la rueda delantera de Ayuso. El español cruzó la línea de meta caminando, con la bicicleta en la mano.</p>

<p>El equipo emiratí optó por la cautela: la primera valoración médica no encontró motivo de alarma, pero decidieron esperar 48 horas para confirmar el alcance real del golpe, que dejó a Ayuso con una fuerte inflamación. Al día siguiente, el español lo intentó en el Grand Prix Cycliste de Montréal, pero terminó retirándose de la carrera.</p>

<p>La retirada en Montreal encendió las alarmas de la federación española a menos de una semana del inicio del Mundial de ruta, también en Montreal (20-27 de septiembre), donde Ayuso figuraba entre los nombres de referencia de la selección. Por ahora no hay un parte médico que descarte oficialmente su participación.</p>
`.trim()

/**
 * Caída de Juan Ayuso en el GP de Quebec — verificado vía ClaroSports,
 * Ciclismo Internacional, Cyclingnews, Ciclismo al Día y Diario del
 * Triatlón, consultado 2026-09-14.
 */
export async function publishAyusoCrashArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ultima-hora' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [rider, team, quebec] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'juan-ayuso' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'uae-team-emirates-xrg' }, select: { id: true } }),
    prisma.race.findUnique({ where: { slug: 'gp-cycliste-quebec-2026' }, select: { id: true } }),
  ])

  const heroImageId = await ensureHeroImage('juan-ayuso-caida-gp-quebec-2026', {
    title: 'Ayuso se cae en Quebec',
    label: 'Última hora',
    riders: rider ? [{ name: 'Juan Ayuso', team: 'uae-team-emirates-xrg' }] : [],
  })

  const baseFields = {
    title: 'Juan Ayuso se cae en el esprint del GP de Quebec, con el Mundial en el aire',
    subtitle: 'El español llegó a meta caminando tras un toque de rueda a 50 metros de la línea; al día siguiente se retiró del GP de Montreal',
    excerpt:
      'Juan Ayuso sufrió una aparatosa caída en el esprint del GP de Quebec y se retiró al día siguiente en Montreal. La federación española vigila su recuperación a menos de una semana del Mundial de ruta.',
    content: ayusoCrashContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: true,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.clarosports.com/ciclismo/juan-ayuso-sufre-aparatosa-caida-en-el-cierre-del-gran-premio-ciclista-de-quebec-2026/',
      'https://www.cyclingnews.com/pro-cycling/teams-riders/more-bad-luck-for-juan-ayuso-with-crash-in-finale-of-grand-prix-de-quebec-but-no-penalties-handed-out/',
      'https://ciclismoaldia.es/ciclismo/ultima-hora-sobre-el-estado-de-juan-ayuso-tras-su-caida-en-el-gp-de-quebec-peligra-el-mundial',
    ]),
    sourceNames: toJsonField(['ClaroSports', 'Cyclingnews', 'Ciclismo al Día']),
    seoTitle: 'Juan Ayuso se cae en el GP de Quebec 2026',
    seoDescription:
      'Juan Ayuso sufrió una caída en el esprint del GP de Quebec y se retiró al día siguiente en Montreal, a menos de una semana del Mundial de ruta 2026.',
    readingTime: 2,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'juan-ayuso-caida-gp-quebec-2026' },
    update: {
      ...baseFields,
      riders: rider ? { set: [{ id: rider.id }] } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
      races: quebec ? { set: [{ id: quebec.id }] } : undefined,
    },
    create: {
      slug: 'juan-ayuso-caida-gp-quebec-2026',
      ...baseFields,
      publishedAt: new Date(),
      riders: rider ? { connect: [{ id: rider.id }] } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
      races: quebec ? { connect: [{ id: quebec.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

const womensWorldsPreviewContent = `
<p>Un día antes de que Montreal decida el Mundial de ruta masculino, el sábado 26 de septiembre será el turno de la prueba en línea élite femenina: 180,1&nbsp;km con 2.570&nbsp;m de desnivel positivo, sobre un recorrido que comparte buena parte del guion con el de los hombres.</p>

<p>La carrera sale de Brossard, en la región de Montérégie, cruza el puente Samuel de Champlain hacia Montreal y entra en el circuito final de Mont Royal, con sus tres tramos característicos: la Voie Camillien-Houde, el Chemin de la Polytechnique —con rampas de más del 11%— y la recta final por la Avenue du Parc.</p>

<p>La cita llega al cierre de una temporada de Women's WorldTour que ya repartió los grandes títulos del año (Tour de Francia Femmes, Vuelta Femenina, Giro d'Italia Women), por lo que Montreal funciona como última gran oportunidad individual antes de que el calendario femenino cierre en octubre con el Tour of Chongming Island en China.</p>
`.trim()

/**
 * Previa del Mundial de ruta femenino 2026 — verificado vía el
 * comunicado oficial de Ville de Brossard/Newswire y Tourisme
 * Montréal, consultado 2026-09-14. Mismo circuito ya descrito en la
 * previa masculina (previa-mundial-ruta-2026-montreal), un día antes.
 */
export async function publishWomensWorldsPreviewArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'ciclismo-femenino' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUnique({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } })

  const heroImageId = await ensureHeroImage('previa-mundial-ruta-femenino-2026-montreal', {
    title: 'Mundial femenino en Montreal',
    label: 'Ciclismo femenino',
  })

  const baseFields = {
    title: 'La otra cita de Montreal: la previa del Mundial de ruta femenino 2026',
    subtitle: 'Las mujeres correrán 180,1 km el 26 de septiembre por el mismo circuito de Mont Royal que decidirá también el título masculino',
    excerpt:
      'El Mundial de ruta femenino 2026 se corre el 26 de septiembre en Montreal, un día antes que el masculino, sobre el mismo circuito de Mont Royal: 180,1 km y 2.570 m de desnivel.',
    content: womensWorldsPreviewContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.newswire.ca/news-releases/2026-uci-road-world-championships-in-montreal-the-elite-women-s-and-men-s-road-race-starts-to-be-held-at-quartier-dix30-on-september-26-and-27-2026-845943806.html',
      'https://www.mtl.org/en/experience/uci-road-world-championships',
    ]),
    sourceNames: toJsonField(['Newswire (Ville de Brossard)', 'Tourisme Montréal']),
    seoTitle: 'Mundial de ruta femenino 2026: previa y recorrido',
    seoDescription:
      'Previa del Mundial de ruta femenino 2026 en Montreal: recorrido de 180,1 km por el circuito de Mont Royal, un día antes de la prueba masculina.',
    readingTime: 2,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'previa-mundial-ruta-femenino-2026-montreal' },
    update: { ...baseFields, races: race ? { set: [{ id: race.id }] } : undefined },
    create: {
      slug: 'previa-mundial-ruta-femenino-2026-montreal',
      ...baseFields,
      publishedAt: new Date(),
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

const carapazSeasonContent = `
<p>Entre los ciclistas latinoamericanos, ninguno cierra 2026 con un balance tan completo como Richard Carapaz (EF Education-EasyPost). El ecuatoriano llegó a un nuevo nivel en el Tour de Francia: ganó en solitario en Alpe d'Huez, se llevó la clasificación de la montaña y terminó octavo en la general, volviendo a ser una referencia latinoamericana en la carrera más importante del calendario.</p>

<p>Semanas después, en la Vuelta a España, Carapaz confirmó su gran momento de forma con el cuarto lugar en la clasificación general final, a 6 minutos y 54 segundos de Enric Mas, por delante incluso de Sepp Kuss. Disputar dos Grand Tours de altísimo nivel en la misma temporada, con un top 10 y un top 5 respectivamente, es un balance que ningún otro corredor latinoamericano puede exhibir en 2026.</p>

<p>En el EF Education-EasyPost, Carapaz corrió acompañado de su compatriota Jefferson Alexander Cepeda y del colombiano Rigoberto Urán, quien ha declarado públicamente que su papel en las carreras que comparten con Carapaz es el de apoyarlo. No todos los latinoamericanos referentes del pelotón tuvieron una temporada tan sólida: Egan Bernal, por ejemplo, sufrió un Tour de Francia irregular, llegando a perder más de 14 minutos en una sola etapa.</p>
`.trim()

/**
 * Balance de temporada de Richard Carapaz — Tour de Francia verificado
 * vía Semana y Ciclismo Colombiano; resultado en la Vuelta a España
 * tomado de los datos ya verificados y publicados en
 * enric-mas-campeon-vuelta-espana-2026 (misma fuente interna, no se
 * reinventa). Consultado 2026-09-14.
 */
export async function publishCarapazSeasonArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'latinos' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const [carapaz, bernal, team] = await Promise.all([
    prisma.rider.findUnique({ where: { slug: 'richard-carapaz' }, select: { id: true } }),
    prisma.rider.findUnique({ where: { slug: 'egan-bernal' }, select: { id: true } }),
    prisma.team.findUnique({ where: { slug: 'ef-education-easypost' }, select: { id: true } }),
  ])
  const riderIds = [carapaz?.id, bernal?.id].filter((id): id is number => id !== undefined)

  const heroImageId = await ensureCustomHeroImage('richard-carapaz-temporada-2026-tour-vuelta', {
    url: '/images/headers/carapaz-temporada-cover.jpg',
    altText: 'Richard Carapaz, el latinoamericano más completo de 2026: puños, montaña y regularidad',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Richard Carapaz, el latinoamericano más completo de 2026: puños, montaña y regularidad',
    subtitle: 'El ecuatoriano ganó una etapa y la clasificación de la montaña en el Tour de Francia, y cerró la Vuelta a España entre los cinco primeros',
    excerpt:
      'Richard Carapaz ganó en Alpe d\'Huez y la montaña del Tour de Francia, y terminó cuarto en la Vuelta a España: el mejor balance de temporada entre los latinoamericanos del pelotón en 2026.',
    content: carapazSeasonContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.semana.com/deportes/ciclismo/articulo/sacudon-a-la-clasificacion-general-del-tour-de-francia-2026-carapaz-hizo-el-dano-y-egan-bernal-lo-pago/202633/',
      'https://www.ciclismocolombiano.com/actualidad/rigoberto-uran-apoyara-a-carapaz-en-las-carreras-que-hagan-juntos/',
    ]),
    sourceNames: toJsonField(['Semana', 'Ciclismo Colombiano']),
    seoTitle: 'Richard Carapaz: balance de su temporada 2026',
    seoDescription:
      'Richard Carapaz ganó en Alpe d\'Huez y la montaña del Tour de Francia 2026, y terminó cuarto en la Vuelta a España: el mejor latinoamericano de la temporada.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'richard-carapaz-temporada-2026-tour-vuelta' },
    update: {
      ...baseFields,
      riders: riderIds.length ? { set: riderIds.map((id) => ({ id })) } : undefined,
      teams: team ? { set: [{ id: team.id }] } : undefined,
    },
    create: {
      slug: 'richard-carapaz-temporada-2026-tour-vuelta',
      ...baseFields,
      publishedAt: new Date(),
      riders: riderIds.length ? { connect: riderIds.map((id) => ({ id })) } : undefined,
      teams: team ? { connect: [{ id: team.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

const uciTechRulesContent = `
<p>Por primera vez en mucho tiempo, la UCI cambia de dirección: en vez de perseguir más velocidad, el paquete de reglas técnicas que entra en vigor en 2026 le mete deliberadamente más resistencia aerodinámica a las bicicletas del pelotón, priorizando la seguridad sobre el cronómetro.</p>

<p>El cambio más visible es el del manillar: la anchura mínima pasa a ser de 400&nbsp;mm (medida de extremo a extremo) con al menos 280&nbsp;mm entre las manetas, y un límite de apertura ("flare") de 65&nbsp;mm. La UCI responde así a la tendencia de los últimos años hacia manillares ultraestrechos, señalados como un factor de inestabilidad en los momentos de mayor tensión del pelotón.</p>

<p>Las ruedas también quedan limitadas: en carreras en línea, la profundidad máxima de llanta baja a 65&nbsp;mm, dejando fuera a los perfiles más profundos y aerodinámicos. La marca Swiss Side ya ha enviado una carta abierta calificando la medida de "inefectiva y hasta contraproducente" para la estabilidad de la rueda, en un debate técnico que promete seguir abierto.</p>

<p>El cuadro y la horquilla también tienen ahora topes de anchura (115&nbsp;mm en la horquilla, 145&nbsp;mm en el triángulo trasero), pensados para frenar el diseño de formas cada vez más agresivas en busca de aerodinámica. Y los cascos se dividen en dos categorías —"tradicional" y "contrarreloj"—: los tradicionales deberán tener al menos tres orificios de ventilación, sin cobertura de las orejas ni visera.</p>
`.trim()

/**
 * Cambios reglamentarios técnicos UCI 2026 — verificado vía BikeRadar
 * y BikeTips, consultado 2026-09-14.
 */
export async function publishUciTechRulesArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'tecnologia' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })

  const heroImageId = await ensureHeroImage('nuevas-reglas-tecnicas-uci-2026', {
    title: 'Nuevas reglas técnicas UCI',
    label: 'Tecnología',
  })

  const baseFields = {
    title: 'Manillares más anchos, ruedas menos aerodinámicas: así cambian las reglas técnicas de la UCI en 2026',
    subtitle: 'La UCI prioriza la seguridad sobre la velocidad: anchura mínima de manillar, límite de altura de llantas y nuevas categorías de casco',
    excerpt:
      'La UCI mete freno a la aerodinámica en 2026: manillares más anchos, llantas de menos de 65 mm en carreras en línea, límites al ancho del cuadro y dos categorías de casco.',
    content: uciTechRulesContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://www.bikeradar.com/news/the-uci-rule-changes-for-2026-you-need-to-know-about',
      'https://biketips.com/uci-2026-rule-changes-handlebars-wheels-frames-explained/',
    ]),
    sourceNames: toJsonField(['BikeRadar', 'BikeTips']),
    seoTitle: 'Nuevas reglas técnicas de la UCI para 2026',
    seoDescription:
      'Repasamos los cambios reglamentarios técnicos de la UCI para 2026: manillares, llantas, límites de cuadro y horquilla, y nuevas categorías de casco.',
    readingTime: 3,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'nuevas-reglas-tecnicas-uci-2026' },
    update: baseFields,
    create: { slug: 'nuevas-reglas-tecnicas-uci-2026', ...baseFields, publishedAt: new Date() },
  })

  return { slug: article.slug }
}

const mtbWorldsRecapContent = `
<p>Val di Sole (Italia) volvió a acoger el Mundial de Mountain Bike de la UCI del 26 al 30 de agosto de 2026 —la cuarta vez que la localidad italiana organiza la cita, tras 2008, 2016 y 2021— repartiendo los maillots arcoíris de cross-country olímpico (XCO) y descenso (DHI) en categoría élite.</p>

<p>En cross-country, Tom Pidcock se proclamó campeón del mundo en la prueba masculina. En la femenina, la suiza Sina Frei dominó de principio a fin: atacó desde la primera vuelta y cruzó la meta en solitario con más de un minuto de ventaja sobre el resto del pelotón.</p>

<p>El descenso, disputado el 29 de agosto sobre el trazado Black Snake, dejó dos títulos consecutivos: el canadiense Jackson Goldstone revalidó el suyo por segundo año seguido en categoría masculina, mientras que la austríaca Valentina Höll firmó su quinto título mundial consecutivo, superando el mejor tiempo de la suiza Lisa Baumann.</p>

<p>Con el Mundial ya decidido, la temporada de MTB sigue su curso hacia Norteamérica: la Copa del Mundo llega a Soldier Hollow, Utah (19-20 de septiembre, cross-country y short track) y a Whistler, Columbia Británica (25-27 de septiembre, descenso), antes de que el calendario de superficie mixta se despida en octubre con el Mundial de Gravel en Nannup, Australia.</p>
`.trim()

/**
 * Artículo de lanzamiento de la sección MTB y Gravel: recapitula el
 * Mundial de MTB 2026 en Val di Sole (26-30 agosto, ya disputado) —
 * verificado vía Wikipedia, Pinkbike, time.news y UCI.org, consultado
 * 2026-09-14. No hay ciclistas de MTB en la base de datos de
 * ciclistas de ruta, así que este artículo no vincula riders/teams.
 */
export async function publishMtbWorldsRecapArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'mtb-gravel' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUnique({ where: { slug: 'uci-mtb-world-championships-2026' }, select: { id: true } })

  const heroImageId = await ensureHeroImage('mundial-mtb-2026-val-di-sole-resultados', {
    title: 'Mundial de MTB 2026',
    label: 'MTB y Gravel',
  })

  const baseFields = {
    title: 'Pidcock, Frei, Goldstone y Höll: así se repartieron los arcoíris del Mundial de MTB 2026',
    subtitle: 'Val di Sole coronó a sus campeones de cross-country y descenso del 26 al 30 de agosto, semanas antes del arranque de la sección en La Fuga',
    excerpt:
      'Tom Pidcock y Sina Frei ganaron el cross-country, y Jackson Goldstone y Valentina Höll revalidaron sus títulos de descenso en el Mundial de MTB 2026 en Val di Sole, Italia.',
    content: mtbWorldsRecapContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: false,
    sourceUrls: toJsonField([
      'https://en.wikipedia.org/wiki/2026_UCI_Mountain_Bike_World_Championships',
      'https://time.news/sina-frei-dominates-val-di-sole-to-win-2026-xco-world-championship/',
      'https://www.uci.org/article/uci-mountain-bike-world-championships-hoell-and-goldstone-retain-downhill-titles-in-devastating-fashion/4f9QsRTm02r2iOwmXGs1W9',
    ]),
    sourceNames: toJsonField(['Wikipedia', 'Time News', 'UCI (oficial)']),
    seoTitle: 'Mundial de MTB 2026: resultados de Val di Sole',
    seoDescription:
      'Resultados del Mundial de MTB 2026 en Val di Sole: Tom Pidcock y Sina Frei campeones de cross-country, Jackson Goldstone y Valentina Höll de descenso.',
    readingTime: 2,
  }

  const article = await prisma.article.upsert({
    where: { slug: 'mundial-mtb-2026-val-di-sole-resultados' },
    update: { ...baseFields, races: race ? { set: [{ id: race.id }] } : undefined },
    create: {
      slug: 'mundial-mtb-2026-val-di-sole-resultados',
      ...baseFields,
      publishedAt: new Date(),
      races: race ? { connect: [{ id: race.id }] } : undefined,
    },
  })

  return { slug: article.slug }
}

/**
 * Previa real del Mundial de Ruta UCI 2026 (Montreal, 20-27 sept) —
 * hechos verificados el 2026-09-14 vía UCI oficial, Eurosport y
 * Ciclismo Internacional (ver sourceUrls). Generada por el aviso
 * automático de detectUpcomingRacePreviews() en automation.ts.
 */
const worldsPreviewContent = `
<p>El Mundial de ruta 2026 arranca el domingo 20 de septiembre en Montreal con una noticia que reordena todo el panorama: Tadej Pogačar, doble campeón del mundo vigente, no estará en la salida. El esloveno sufrió una caída liderando la Vuelta a España en la etapa 8, con fractura de clavícula, fractura estable de la cervical C7 y conmoción, y tras operarse en Barcelona su equipo confirmó que no volverá a competir en lo que resta de temporada — se pierde también el Europeo y Il Lombardia.</p>

<p>La prueba en línea élite masculina, el domingo 27 de septiembre, recorrerá 273,7&nbsp;km con 3.803&nbsp;m de desnivel positivo. La carrera sale de Brossard, cruza el puente Samuel de Champlain hacia Montreal y entra en el circuito final de Mont Royal: 13,4&nbsp;km por vuelta, 269&nbsp;m de desnivel cada una, doce vueltas en total. Dentro del circuito, los puertos de Camillien-Houde y Polytechnique —este último con tramos de más del 11% de pendiente— serán decisivos antes de la línea de meta en Avenue du Parc.</p>

<p>Sin Pogačar, la nómina de favoritos la encabeza Remco Evenepoel (Red Bull-BORA-hansgrohe), que llega lanzado tras su victoria en el GP de Quebec. Le acompañan Mathieu van der Poel y Wout van Aert (ambos con el bagaje de clásicas duras a sus espaldas) y el danés Mattias Skjelmose. Pero el nombre que más ruido ha hecho en la previa es el de Isaac del Toro (UAE Team Emirates-XRG): el mexicano ganó hace apenas unos días el GP de Montreal en este mismo escenario, precisamente en el mismo circuito de Mont Royal que decidirá el Mundial.</p>

<p>Con el trono vacante y un circuito que conocen de memoria tras las clásicas canadienses, Montreal promete una carrera abierta como pocas.</p>
`.trim()

export async function publishWorldsPreviewArticle() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: 'analisis' } })
  const author = await prisma.author.findUniqueOrThrow({ where: { slug: 'redaccion' } })
  const race = await prisma.race.findUniqueOrThrow({ where: { slug: 'uci-road-world-championships-2026' }, select: { id: true } })

  const riderSlugs = ['remco-evenepoel', 'mathieu-van-der-poel', 'wout-van-aert', 'mattias-skjelmose', 'isaac-del-toro', 'tadej-pogacar']
  const teamSlugs = ['red-bull-bora-hansgrohe', 'alpecin-premier-tech', 'visma-lease-a-bike', 'lidl-trek', 'uae-team-emirates-xrg']
  const [riders, teams] = await Promise.all([
    prisma.rider.findMany({ where: { slug: { in: riderSlugs } }, select: { id: true, slug: true } }),
    prisma.team.findMany({ where: { slug: { in: teamSlugs } }, select: { id: true, slug: true } }),
  ])
  const riderBySlug = new Map(riders.map((r) => [r.slug, r]))
  const teamBySlug = new Map(teams.map((t) => [t.slug, t]))

  const heroImageId = await ensureCustomHeroImage('previa-mundial-ruta-2026-montreal', {
    url: '/images/headers/worlds-preview-2026-cover.jpg',
    altText: 'Sin Pogačar en la salida: la previa del Mundial de ruta 2026 en Montreal',
    credit: 'Ilustración: La Fuga',
    width: 1600,
    height: 900,
    source: 'cover-composited',
  })

  const baseFields = {
    title: 'Sin Pogačar en la salida: la previa del Mundial de ruta 2026 en Montreal',
    subtitle: 'El esloveno se pierde la cita tras su grave caída en la Vuelta; Evenepoel y Del Toro, favoritos en el circuito de Mont Royal',
    excerpt:
      'Tadej Pogačar no defenderá su título en el Mundial de Montreal (20-27 sept) tras su caída en la Vuelta. Evenepoel, Van der Poel y un lanzado Isaac del Toro encabezan la nómina de favoritos en el circuito de Mont Royal.',
    content: worldsPreviewContent,
    categoryId: category.id,
    authorId: author.id,
    heroImageId,
    status: 'published',
    breakingNews: false,
    featured: true,
    sourceUrls: toJsonField([
      'https://www.uci.org/pressrelease/200-days-to-go-a-look-at-the-courses-of-the-2026-uci-road-world/7MNCbBHZySudjNAoDW4R8x',
      'https://www.eurosport.es/ciclismo/vuelta-a-espana/2026/tadej-pogacar-caida-fracturas-pierde-temporada-adios-mundial-europeo-lombardia-informacion-oficial-hoy_sto23334418/story.shtml',
      'https://ciclismointernacional.com/tadej-pogacar-se-pierde-el-mundial-y-no-volvera-a-competir-en-2026',
    ]),
    sourceNames: toJsonField(['UCI (oficial)', 'Eurosport España', 'Ciclismo Internacional']),
    seoTitle: 'Mundial de ruta 2026: previa sin Pogačar',
    seoDescription:
      'Pogačar se pierde el Mundial de Montreal tras su caída en la Vuelta. Repasamos el recorrido de Mont Royal y los favoritos: Evenepoel, Van der Poel, Van Aert e Isaac del Toro.',
    readingTime: 3,
  }

  const riderIds = riderSlugs.map((s) => riderBySlug.get(s)?.id).filter((id): id is number => id !== undefined)
  const teamIds = teamSlugs.map((s) => teamBySlug.get(s)?.id).filter((id): id is number => id !== undefined)

  const article = await prisma.article.upsert({
    where: { slug: 'previa-mundial-ruta-2026-montreal' },
    update: {
      ...baseFields,
      riders: { set: riderIds.map((id) => ({ id })) },
      teams: { set: teamIds.map((id) => ({ id })) },
      races: { set: [{ id: race.id }] },
    },
    create: {
      slug: 'previa-mundial-ruta-2026-montreal',
      ...baseFields,
      publishedAt: new Date(),
      riders: { connect: riderIds.map((id) => ({ id })) },
      teams: { connect: teamIds.map((id) => ({ id })) },
      races: { connect: [{ id: race.id }] },
    },
  })

  // Cierra el candidato automático que generó esta previa (si existe).
  await prisma.newsCandidate.updateMany({
    where: { entities: { contains: 'uci-road-world-championships-2026' }, status: { not: 'published' } },
    data: { status: 'published', createdArticleId: article.id },
  })

  return { slug: article.slug }
}
