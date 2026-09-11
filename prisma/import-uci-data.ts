/**
 * Carga de datos REALES y verificados — calendario UCI WorldTour 2026
 * (masculino y femenino) y equipos WorldTour 2026 (masculino y
 * femenino). Fuente: Wikipedia, consultado el 2026-09-11, reflejando
 * el calendario/equipos oficiales publicados por la UCI:
 * - https://en.wikipedia.org/wiki/2026_UCI_World_Tour
 * - https://en.wikipedia.org/wiki/2026_UCI_Women%27s_World_Tour
 * - https://en.wikipedia.org/wiki/List_of_2026_UCI_WorldTeams_and_riders
 * - https://en.wikipedia.org/wiki/List_of_UCI_Women%27s_Teams
 *
 * NO es contenido ficticio — son carreras y equipos reales. Seguro de
 * correr más de una vez (usa upsert). El calendario "no se mueve"
 * (temporada cerrada de antemano), así que esto no necesita re-scrapeo
 * constante — solo actualizar si la UCI publica cambios de fechas.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  category: 'grand-tour' | 'classic' | 'worldtour' | 'women-worldtour'
  numStages?: number
}

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

async function main() {
  let raceCount = 0
  for (const race of [...MENS_RACES, ...WOMENS_RACES]) {
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
  console.log(`✅ ${raceCount} carreras del calendario UCI 2026 (masculino + femenino) cargadas.`)

  let teamCount = 0
  for (const team of [...MENS_TEAMS, ...WOMENS_TEAMS]) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: { name: team.name, country: team.country, category: team.category },
      create: team,
    })
    teamCount++
  }
  console.log(`✅ ${teamCount} equipos UCI WorldTour 2026 (masculino + femenino) cargados.`)

  console.log('🎉 Importación de datos reales UCI completada.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
