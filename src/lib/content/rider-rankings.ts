import { prisma } from '@/lib/db'

/**
 * UCI World Ranking individual masculino (ProCyclingStats, corte
 * 2026-09-22) + datos biográficos y foto real con licencia libre
 * (Wikipedia/Wikidata/Wikimedia Commons, todas CC BY-SA / CC0 / CC BY
 * / dominio público, con crédito). Se usa para ordenar /riders, elegir
 * las 3 tarjetas destacadas y completar la hoja de datos de cada uno.
 * Ver rider-profiles.ts sobre el mismo criterio de no inventar datos
 * para el resto de la base — `bio` se omite aquí para isaac-del-toro
 * porque ya tiene una biografía más detallada en ese archivo.
 */
interface RankedRider {
  slug: string
  name: string
  uciRanking: number
  nationality: string
  birthDate?: string
  weightKg?: number
  bio?: string
  photoUrl: string
  photoCredit: string
  photoSourceUrl: string
}

const RANKED_RIDERS: RankedRider[] = [
  {
    slug: 'tadej-pogacar',
    name: 'Tadej Pogačar',
    uciRanking: 1,
    nationality: 'Eslovenia',
    birthDate: '1998-09-21',
    weightKg: 66,
    bio: 'Tadej Pogačar, apodado "Pogi", es un ciclista esloveno del UAE Team Emirates-XRG. Entre sus logros están cinco Tours de Francia, el Giro de Italia 2024 y trece clásicas Monumento, además de dos títulos mundiales en ruta. Comparado con corredores completos como Eddy Merckx y Bernard Hinault, es considerado uno de los mejores ciclistas de la historia pese a su juventud.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Tour_of_Slovenia_%28Stage_3%2C_Tadej_Poga%C4%8Dar_celebrating_victory_on_Celje_Castle_v2%29.jpg/500px-2022_Tour_of_Slovenia_%28Stage_3%2C_Tadej_Poga%C4%8Dar_celebrating_victory_on_Celje_Castle_v2%29.jpg',
    photoCredit: 'Foto: Petar Milošević / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:2022_Tour_of_Slovenia_(Stage_3,_Tadej_Poga%C4%8Dar_celebrating_victory_on_Celje_Castle_v2).jpg',
  },
  {
    slug: 'remco-evenepoel',
    name: 'Remco Evenepoel',
    uciRanking: 2,
    nationality: 'Bélgica',
    birthDate: '2000-01-25',
    weightKg: 62,
    bio: 'Remco Evenepoel es un ciclista belga del Red Bull-BORA-hansgrohe, campeón olímpico de ruta y contrarreloj en París 2024. En 2026 conquistó su cuarto título mundial consecutivo de contrarreloj en Montreal, un logro sin precedentes en la historia de la disciplina.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Remco_Evenepoel_WC_2022.jpg/500px-Remco_Evenepoel_WC_2022.jpg',
    photoCredit: 'Foto: Matheusikidia / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Remco_Evenepoel_WC_2022.jpg',
  },
  {
    slug: 'isaac-del-toro',
    name: 'Isaac del Toro',
    uciRanking: 3,
    nationality: 'México',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Isaac_del_Toro_on_the_podium_at_the_presentation_ceremony_for_Stage_5_of_the_2026_Tour_de_France.jpg/500px-Isaac_del_Toro_on_the_podium_at_the_presentation_ceremony_for_Stage_5_of_the_2026_Tour_de_France.jpg',
    photoCredit: 'Foto: Hugo LUC / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Isaac_del_Toro_on_the_podium_at_the_presentation_ceremony_for_Stage_5_of_the_2026_Tour_de_France.jpg',
  },
  {
    slug: 'paul-seixas',
    name: 'Paul Seixas',
    uciRanking: 4,
    nationality: 'Francia',
    birthDate: '2006-09-24',
    weightKg: 64,
    bio: 'Paul Seixas es un ciclista francés del Decathlon CMA CGM Team. Ganó la contrarreloj junior del Mundial de ciclismo 2024 y el Tour de l\'Avenir 2025, y a los 19 años sorprendió con el bronce en la contrarreloj élite del Mundial de Montreal 2026 — ya se le describe como "el próximo gran talento" del ciclismo profesional.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Paul_Seixas_-_podium_medaille_bronze_-_2025_European_road_championship.jpg/500px-Paul_Seixas_-_podium_medaille_bronze_-_2025_European_road_championship.jpg',
    photoCredit: 'Foto: Kakoula10 / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Paul_Seixas_-_podium_medaille_bronze_-_2025_European_road_championship.jpg',
  },
  {
    slug: 'jonas-vingegaard',
    name: 'Jonas Vingegaard',
    uciRanking: 5,
    nationality: 'Dinamarca',
    birthDate: '1996-12-10',
    bio: 'Jonas Vingegaard Hansen es un ciclista danés del Team Visma | Lease a Bike, considerado uno de los mejores escaladores de la actualidad. Es uno de solo ocho corredores en la historia en ganar las tres grandes vueltas: Tour de Francia (2022 y 2023), Vuelta a España (2025) y Giro de Italia (2026).',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/David_Gaudu%2C_Tadej_Poga%C4%8Dar%2C_Jonas_Vingegaard%2C_2023_Paris-Nice_%2852929456925%29_%28cropped2%29.jpg/500px-David_Gaudu%2C_Tadej_Poga%C4%8Dar%2C_Jonas_Vingegaard%2C_2023_Paris-Nice_%2852929456925%29_%28cropped2%29.jpg',
    photoCredit: 'Foto: Martino Photos / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:David_Gaudu,_Tadej_Poga%C4%8Dar,_Jonas_Vingegaard,_2023_Paris-Nice_(52929456925)_(cropped2).jpg',
  },
  {
    slug: 'jasper-philipsen',
    name: 'Jasper Philipsen',
    uciRanking: 6,
    nationality: 'Bélgica',
    birthDate: '1998-03-02',
    weightKg: 69,
    bio: 'Jasper Philipsen es un ciclista belga del Alpecin-Premier Tech especializado en el sprint. Suma once victorias de etapa en el Tour de Francia y seis en la Vuelta a España, además de la clasificación por puntos del Tour de Francia 2023.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jasper_Philipsen_%282026%29.jpg/500px-Jasper_Philipsen_%282026%29.jpg',
    photoCredit: 'Foto: Joost Pauwels / Wikimedia Commons (CC0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Jasper_Philipsen_(2026).jpg',
  },
  {
    slug: 'tom-pidcock',
    name: 'Tom Pidcock',
    uciRanking: 7,
    nationality: 'Gran Bretaña',
    birthDate: '1999-07-30',
    weightKg: 58,
    bio: 'Tom Pidcock es un ciclista británico que compite en ciclocrós, montaña y ruta para el Pinarello Q36.5 Pro Cycling Team, tras dejar el Ineos Grenadiers en diciembre de 2024.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tom_PIDCOCK_cropped.jpg/500px-Tom_PIDCOCK_cropped.jpg',
    photoCredit: 'Foto: Shougissime / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Tom_PIDCOCK_cropped.jpg',
  },
  {
    slug: 'wout-van-aert',
    name: 'Wout van Aert',
    uciRanking: 8,
    nationality: 'Bélgica',
    birthDate: '1994-09-15',
    weightKg: 70,
    bio: 'Wout van Aert es un ciclista belga del Team Visma | Lease a Bike, especialista en ruta y ciclocrós. Ganó tres campeonatos mundiales consecutivos de ciclocrós (2016, 2017 y 2018).',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/WVA_Paris-Roubaix_2022.jpg/500px-WVA_Paris-Roubaix_2022.jpg',
    photoCredit: 'Foto: Clémence LN / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:WVA_Paris-Roubaix_2022.jpg',
  },
  {
    slug: 'felix-gall',
    name: 'Felix Gall',
    uciRanking: 9,
    nationality: 'Austria',
    birthDate: '1998-02-27',
    bio: 'Felix Gall es un ciclista austriaco del Decathlon CMA CGM Team, considerado uno de los mejores de la historia de su país. Ganó una etapa del Tour de Francia 2023, fue quinto en la general del Tour de Francia 2025 y segundo en el Giro de Italia 2026 — el único corredor con dos podios de grandes vueltas ese año.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Felix_Gall_2025.jpg/500px-Felix_Gall_2025.jpg',
    photoCredit: 'Foto: Tweichhart / Wikimedia Commons (CC0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Felix_Gall_2025.jpg',
  },
  {
    slug: 'lenny-martinez',
    name: 'Lenny Martinez',
    uciRanking: 10,
    nationality: 'Francia',
    birthDate: '2003-07-11',
    bio: 'Lenny Martinez es un ciclista francés del Bahrain-Victorious. Es hijo, nieto y sobrino de los también ciclistas profesionales Miguel, Mariano y Yannick Martinez.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lenny_Martinez_2024.jpg/500px-Lenny_Martinez_2024.jpg',
    photoCredit: 'Foto: MFonzatti / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Lenny_Martinez_2024.jpg',
  },
  {
    slug: 'richard-carapaz',
    name: 'Richard Carapaz',
    uciRanking: 11,
    nationality: 'Ecuador',
    birthDate: '1993-05-29',
    weightKg: 62,
    bio: 'Richard Carapaz es un ciclista ecuatoriano del EF Education-EasyPost. Ganó el Giro de Italia 2019 — el primer ecuatoriano en lograrlo — y el oro olímpico en ruta en Tokio 2020, siendo el primer corredor en la historia en combinar un oro olímpico en ruta con podios en las tres grandes vueltas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Strade_Bianche-4_%2851964440683%29.jpg/500px-Strade_Bianche-4_%2851964440683%29.jpg',
    photoCredit: 'Foto: Adrian Betteridge / Wikimedia Commons (CC BY 2.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Strade_Bianche-4_(51964440683).jpg',
  },
  {
    slug: 'mattias-skjelmose',
    name: 'Mattias Skjelmose',
    uciRanking: 12,
    nationality: 'Dinamarca',
    birthDate: '2000-09-26',
    bio: 'Mattias Skjelmose Jensen es un ciclista danés del Lidl-Trek.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Mattias_Skjelmose_at_the_rider_presentation_of_Itzulia_Basque_Country_stage_3.jpg/500px-Mattias_Skjelmose_at_the_rider_presentation_of_Itzulia_Basque_Country_stage_3.jpg',
    photoCredit: 'Foto: Hugo LUC / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Mattias_Skjelmose_at_the_rider_presentation_of_Itzulia_Basque_Country_stage_3.jpg',
  },
  {
    slug: 'mathieu-van-der-poel',
    name: 'Mathieu van der Poel',
    uciRanking: 13,
    nationality: 'Países Bajos',
    birthDate: '1995-01-19',
    bio: 'Mathieu van der Poel, apodado "El Holandés Volador", es un ciclista neerlandés del Alpecin-Premier Tech que compite en ciclocrós, montaña, gravel y ruta.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/MSR2026-06_MVDP.jpg/500px-MSR2026-06_MVDP.jpg',
    photoCredit: 'Foto: MFonzatti / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:MSR2026-06_MVDP.jpg',
  },
  {
    slug: 'mauro-schmid',
    name: 'Mauro Schmid',
    uciRanking: 14,
    nationality: 'Suiza',
    birthDate: '1999-12-04',
    bio: 'Mauro Schmid es un ciclista suizo del Team Jayco AlUla, con paso también por el ciclismo en pista — fue 7º en el scratch del Mundial de pista 2019.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2021_UEC_Track_Jun_%26_U23_European_Championships_177.jpg/500px-2021_UEC_Track_Jun_%26_U23_European_Championships_177.jpg',
    photoCredit: 'Foto: Nicola / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:2021_UEC_Track_Jun_%26_U23_European_Championships_177.jpg',
  },
  {
    slug: 'tobias-halland-johannessen',
    name: 'Tobias Halland Johannessen',
    uciRanking: 15,
    nationality: 'Noruega',
    birthDate: '1999-08-23',
    bio: 'Tobias Halland Johannessen es un ciclista noruego del Uno-X Mobility. Junto a su hermano gemelo Anders, empezó compitiendo en montaña y ciclocrós antes de enfocarse en la ruta; en 2021 fue convocado a los Juegos Olímpicos de Tokio 2020.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tobias_Halland_Johannessen_-_2023_UCI_Road_World_Championships_%28Men%27s_road_race%29.jpg/500px-Tobias_Halland_Johannessen_-_2023_UCI_Road_World_Championships_%28Men%27s_road_race%29.jpg',
    photoCredit: 'Foto: Cs-wolves / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Tobias_Halland_Johannessen_-_2023_UCI_Road_World_Championships_(Men%27s_road_race).jpg',
  },
  {
    slug: 'christian-scaroni',
    name: 'Christian Scaroni',
    uciRanking: 16,
    nationality: 'Italia',
    birthDate: '1997-10-16',
    bio: 'Christian Scaroni es un ciclista italiano del XDS Astana Team.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Deux_coureurs_de_l%27%C3%A9quipe_cycliste_Gazprom-RusVelo_au_matin_de_la_premi%C3%A8re_%C3%A9tape_du_Tour_de_l%27Ain_2021_%28cropped%29.jpg/500px-Deux_coureurs_de_l%27%C3%A9quipe_cycliste_Gazprom-RusVelo_au_matin_de_la_premi%C3%A8re_%C3%A9tape_du_Tour_de_l%27Ain_2021_%28cropped%29.jpg',
    photoCredit: 'Foto: Benoît Prieur / Wikimedia Commons (CC0)',
    photoSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Deux_coureurs_de_l'%C3%A9quipe_cycliste_Gazprom-RusVelo_au_matin_de_la_premi%C3%A8re_%C3%A9tape_du_Tour_de_l'Ain_2021_(cropped).jpg",
  },
  {
    slug: 'romain-gregoire',
    name: 'Romain Grégoire',
    uciRanking: 17,
    nationality: 'Francia',
    birthDate: '2003-01-21',
    bio: 'Romain Grégoire es un ciclista francés del Groupama-FDJ United.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/2025_ToBM_-_1st_Romain_Gregoire.JPG/500px-2025_ToBM_-_1st_Romain_Gregoire.JPG',
    photoCredit: 'Foto: Geof Sheppard / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_ToBM_-_1st_Romain_Gregoire.JPG',
  },
  {
    slug: 'mads-pedersen',
    name: 'Mads Pedersen',
    uciRanking: 18,
    nationality: 'Dinamarca',
    birthDate: '1995-12-18',
    bio: 'Mads Pedersen es un ciclista danés del Lidl-Trek, el corredor danés con más victorias profesionales de la historia. Ha ganado etapas en las tres grandes vueltas y es el único danés en ganar el Mundial de ruta (Yorkshire 2019); además es uno de solo seis corredores en ganar la clasificación por puntos de las tres grandes vueltas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mads_Pedersen.jpg/500px-Mads_Pedersen.jpg',
    photoCredit: 'Foto: Mogens Engelund / Wikimedia Commons (CC BY-SA 3.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Mads_Pedersen.jpg',
  },
  {
    slug: 'paul-magnier',
    name: 'Paul Magnier',
    uciRanking: 19,
    nationality: 'Francia',
    birthDate: '2004-04-14',
    bio: 'Paul Magnier es un ciclista francés del Soudal Quick-Step.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Paul_Magnier.jpg/500px-Paul_Magnier.jpg',
    photoCredit: 'Foto: MFonzatti / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Paul_Magnier.jpg',
  },
  {
    slug: 'tobias-lund-andresen',
    name: 'Tobias Lund Andresen',
    uciRanking: 20,
    nationality: 'Dinamarca',
    birthDate: '2002-08-20',
    bio: 'Tobias Lund Andresen es un ciclista danés del Decathlon CMA CGM Team.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Tobias_Lund_Andresen_%282024-08-18%29.jpeg/500px-Tobias_Lund_Andresen_%282024-08-18%29.jpeg',
    photoCredit: 'Foto: Leif Jørgensen / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Tobias_Lund_Andresen_(2024-08-18).jpeg',
  },
  {
    slug: 'primoz-roglic',
    name: 'Primož Roglič',
    uciRanking: 21,
    nationality: 'Eslovenia',
    birthDate: '1989-10-29',
    weightKg: 65,
    bio: 'Primož Roglič es un ciclista esloveno del Red Bull-BORA-hansgrohe. Exsaltador de esquí, cambió al ciclismo tras un accidente en Planica y, pese a debutar como profesional a los 23 años, se convirtió en uno de los corredores más exitosos de su generación en contrarrelojes, carreras de una semana y grandes vueltas.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Primo%C5%BE_Rogli%C4%8D_%28Team_Jumbo-Visma%2C_2019%29.jpg/500px-Primo%C5%BE_Rogli%C4%8D_%28Team_Jumbo-Visma%2C_2019%29.jpg',
    photoCredit: 'Foto: Petar Milošević / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Primo%C5%BE_Rogli%C4%8D_(Team_Jumbo-Visma,_2019).jpg',
  },
  {
    slug: 'benoit-cosnefroy',
    name: 'Benoît Cosnefroy',
    uciRanking: 22,
    nationality: 'Francia',
    birthDate: '1995-10-17',
    weightKg: 64,
    bio: 'Benoît Cosnefroy es un ciclista francés del UAE Team Emirates-XRG.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Beno%C3%AEt_Cosnefroy%2C_Grand_Prix_Cycliste_de_Qu%C3%A9bec_2022_%28UCI_WorldTour%29_%28cropped%29.jpg/500px-Beno%C3%AEt_Cosnefroy%2C_Grand_Prix_Cycliste_de_Qu%C3%A9bec_2022_%28UCI_WorldTour%29_%28cropped%29.jpg',
    photoCredit: 'Foto: Lëa-Kim Châteauneuf / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Beno%C3%AEt_Cosnefroy,_Grand_Prix_Cycliste_de_Qu%C3%A9bec_2022_(UCI_WorldTour)_(cropped).jpg',
  },
  {
    slug: 'giulio-ciccone',
    name: 'Giulio Ciccone',
    uciRanking: 23,
    nationality: 'Italia',
    birthDate: '1994-12-20',
    weightKg: 58,
    bio: 'Giulio Ciccone es un ciclista italiano del Lidl-Trek. Entre sus logros destacan varias etapas del Giro de Italia y la clasificación de la montaña del Tour de Francia 2023.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CICCONE_Giulio.jpg/500px-CICCONE_Giulio.jpg',
    photoCredit: 'Foto: FGphotographic / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:CICCONE_Giulio.jpg',
  },
  {
    slug: 'enric-mas',
    name: 'Enric Mas',
    uciRanking: 24,
    nationality: 'España',
    birthDate: '1995-01-07',
    weightKg: 61,
    bio: 'Enric Mas Nicolau es un ciclista español del Movistar Team, escalador y aspirante a la general. Ganó la Vuelta a España 2026 (con etapas también en 2018 y 2026) tras haber sido segundo en tres ocasiones anteriores; suma además el Tour de Guangxi 2019, una etapa en la Vuelta al País Vasco y la clásica Giro dell\'Emilia.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/TdB_2014_-_Enric_Mas.jpg/500px-TdB_2014_-_Enric_Mas.jpg',
    photoCredit: 'Foto: Petro / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:TdB_2014_-_Enric_Mas.jpg',
  },
  {
    slug: 'matthew-brennan',
    name: 'Matthew Brennan',
    uciRanking: 25,
    nationality: 'Gran Bretaña',
    birthDate: '2005-08-06',
    bio: 'James Matthew Brennan es un ciclista británico del Team Visma | Lease a Bike. En 2023 fue campeón mundial junior de pista en madison y persecución individual, prueba en la que además batió el récord mundial junior.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Matthew_Brennan_%282025%29.jpg/500px-Matthew_Brennan_%282025%29.jpg',
    photoCredit: 'Foto: Joost Pauwels / Wikimedia Commons (CC0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Matthew_Brennan_(2025).jpg',
  },
  {
    slug: 'christophe-laporte',
    name: 'Christophe Laporte',
    uciRanking: 26,
    nationality: 'Francia',
    birthDate: '1992-12-11',
    weightKg: 76,
    bio: 'Christophe Laporte es un ciclista francés del Team Visma | Lease a Bike, velocista y corredor de clásicas con más de 30 victorias profesionales, incluidas Gante-Wevelgem y Dwars door Vlaanderen en 2023. Suma una etapa del Tour de Francia 2022, la plata en el Mundial de ruta 2022 y el bronce olímpico en París 2024.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Christophe_Laporte_Paris-Roubaix_2022.jpg/500px-Christophe_Laporte_Paris-Roubaix_2022.jpg',
    photoCredit: 'Foto: Clémence LN / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Christophe_Laporte_Paris-Roubaix_2022.jpg',
  },
  {
    slug: 'jordi-meeus',
    name: 'Jordi Meeus',
    uciRanking: 27,
    nationality: 'Bélgica',
    birthDate: '1998-07-01',
    bio: 'Jordi Meeus es un ciclista belga del Red Bull-BORA-hansgrohe, velocista. Su victoria más recordada es la última etapa del Tour de Francia 2023 en los Campos Elíseos, por delante de Jasper Philipsen.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rund_um_K%C3%B6ln_2023_102.jpg/500px-Rund_um_K%C3%B6ln_2023_102.jpg',
    photoCredit: 'Foto: Nicola / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Rund_um_K%C3%B6ln_2023_102.jpg',
  },
  {
    slug: 'giulio-pellizzari',
    name: 'Giulio Pellizzari',
    uciRanking: 28,
    nationality: 'Italia',
    birthDate: '2003-11-21',
    bio: 'Giulio Pellizzari es un ciclista italiano del Red Bull-BORA-hansgrohe.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/GIRO8062_Pellizzari_%2853750349298%29.jpg/500px-GIRO8062_Pellizzari_%2853750349298%29.jpg',
    photoCredit: 'Foto: filip bossuyt (Kortrijk) / Wikimedia Commons (CC BY 2.0)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:GIRO8062_Pellizzari_(53750349298).jpg',
  },
  {
    slug: 'florian-lipowitz',
    name: 'Florian Lipowitz',
    uciRanking: 29,
    nationality: 'Alemania',
    birthDate: '2000-09-21',
    bio: 'Florian Lipowitz es un ciclista alemán del Red Bull-BORA-hansgrohe.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Florian_Lipowitz_-_Tour_de_France_2025_final_podium.jpg/500px-Florian_Lipowitz_-_Tour_de_France_2025_final_podium.jpg',
    photoCredit: 'Foto: Žan Kolman / Wikimedia Commons (dominio público)',
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Florian_Lipowitz_-_Tour_de_France_2025_final_podium.jpg',
  },
  {
    slug: 'laurence-pithie',
    name: 'Laurence Pithie',
    uciRanking: 30,
    nationality: 'Nueva Zelanda',
    birthDate: '2002-07-17',
    bio: 'Laurence Pithie es un ciclista neozelandés del Red Bull-BORA-hansgrohe.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Laurence_Pithie_%28team_Red_Bull-Bora-hansgrohe%29_winner_of_Points_classification_%282026_Tour_of_Slovenia%29.jpg/500px-Laurence_Pithie_%28team_Red_Bull-Bora-hansgrohe%29_winner_of_Points_classification_%282026_Tour_of_Slovenia%29.jpg',
    photoCredit: 'Foto: Petar Milošević / Wikimedia Commons (CC BY-SA 4.0)',
    photoSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Laurence_Pithie_(team_Red_Bull-Bora-hansgrohe)_winner_of_Points_classification_(2026_Tour_of_Slovenia).jpg',
  },
]

/** Corredores retirados ya presentes en la base (perfiles de leyendas) — nunca deben aparecer en el ranking activo. */
const RETIRED_SLUGS = ['alberto-contador', 'andy-schleck', 'annemiek-van-vleuten']

/**
 * Aplica el ranking UCI verificado, la foto real con crédito y los
 * datos biográficos disponibles. Idempotente: seguro de volver a
 * correr.
 */
export async function backfillRiderRankings() {
  const ranked: { slug: string; applied: boolean }[] = []

  for (const rider of RANKED_RIDERS) {
    await prisma.rider.upsert({
      where: { slug: rider.slug },
      update: {
        uciRanking: rider.uciRanking,
        nationality: rider.nationality,
        birthDate: rider.birthDate ? new Date(rider.birthDate) : undefined,
        weightKg: rider.weightKg,
        bio: rider.bio,
        photoUrl: rider.photoUrl,
        photoCredit: rider.photoCredit,
        photoSourceUrl: rider.photoSourceUrl,
        profileVerifiedAt: new Date(),
      },
      create: {
        slug: rider.slug,
        name: rider.name,
        uciRanking: rider.uciRanking,
        nationality: rider.nationality,
        birthDate: rider.birthDate ? new Date(rider.birthDate) : undefined,
        weightKg: rider.weightKg,
        bio: rider.bio,
        photoUrl: rider.photoUrl,
        photoCredit: rider.photoCredit,
        photoSourceUrl: rider.photoSourceUrl,
        profileVerifiedAt: new Date(),
      },
    })
    ranked.push({ slug: rider.slug, applied: true })
  }

  const retired = await prisma.rider.updateMany({
    where: { slug: { in: RETIRED_SLUGS } },
    data: { isRetired: true },
  })

  return { ranked: ranked.length, retiredMarked: retired.count }
}
