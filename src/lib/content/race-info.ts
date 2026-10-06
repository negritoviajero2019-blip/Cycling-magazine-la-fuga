/**
 * Fichas ricas de carrera, curadas a mano y verificadas con fuentes.
 * Viven en código (no en la BD) para poder ampliarse sin migraciones;
 * la página /races/[slug] y la lista de "Próximas carreras" las usan
 * si existe una ficha para el slug. Nunca se inventan datos: lo que no
 * se pudo verificar no se incluye.
 */

export interface RaceClimb {
  name: string
  /** Kilómetros que faltan para la meta cuando se corona/inicia la subida. */
  kmToGo: number
  detail?: string
}

export interface RaceFavorite {
  name: string
  slug: string
  team?: string
  note: string
}

export interface RaceWinner {
  year: number
  winner: string
  team?: string
  detail?: string
}

export interface RaceBroadcast {
  region: string
  channels: string
  note?: string
}

export interface RaceHistoryItem {
  title: string
  text: string
}

export interface RaceInfo {
  slug: string
  tagline: string
  edition: string
  level: string
  start: string
  finish: string
  /** Hora de salida y llegada estimada, en UTC (ISO). */
  startUtc: string
  finishUtc: string
  distanceKm: number
  elevationM: number
  climbsCount: number
  /** Ilustración de cabecera (ruta pública); si falta, se usa un fondo ilustrado por código. */
  heroImage?: string
  climbs: RaceClimb[]
  finale: string
  broadcasts: RaceBroadcast[]
  favorites: RaceFavorite[]
  lastWinner: RaceWinner & { podium: string[] }
  recentWinners: RaceWinner[]
  history: RaceHistoryItem[]
  facts: string[]
  latinos?: string
  sources: { name: string; url: string }[]
}

/** Zonas horarias para mostrar el horario de la carrera. */
export const BROADCAST_TIMEZONES: { label: string; timeZone: string }[] = [
  { label: 'Italia / España', timeZone: 'Europe/Madrid' },
  { label: 'México', timeZone: 'America/Mexico_City' },
  { label: 'Colombia, Perú, Ecuador', timeZone: 'America/Bogota' },
  { label: 'Venezuela', timeZone: 'America/Caracas' },
  { label: 'Argentina, Uruguay', timeZone: 'America/Argentina/Buenos_Aires' },
  { label: 'Chile', timeZone: 'America/Santiago' },
]

export function formatInZone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(new Date(iso))
}

const ilLombardia2026: RaceInfo = {
  slug: 'il-lombardia-2026',
  tagline: 'La clásica de las hojas muertas: el último monumento del año y la gran carrera de los escaladores.',
  edition: '120.ª edición',
  level: 'UCI WorldTour · Monumento',
  start: 'Bérgamo',
  finish: 'Como',
  startUtc: '2026-10-10T08:45:00Z',
  finishUtc: '2026-10-10T15:30:00Z',
  distanceKm: 239,
  elevationM: 4600,
  climbsCount: 9,
  heroImage: '/images/races/il-lombardia-2026-hero.jpg',
  climbs: [
    { name: 'Colle dei Pasta / Bocche di Gavarno', kmToGo: 224 },
    { name: 'Selvino', kmToGo: 207 },
    { name: 'Colle di Berbenno', kmToGo: 173 },
    { name: 'Valpiana', kmToGo: 153 },
    { name: 'Giovenzana', kmToGo: 136 },
    { name: 'Madonna del Ghisallo', kmToGo: 60.6, detail: '8,6 km al 5,4 % de media; su santuario está dedicado a la patrona de los ciclistas' },
    { name: 'San Fermo della Battaglia (1.ª vez)', kmToGo: 27.1 },
    { name: 'Civiglio', kmToGo: 16.7, detail: '4,2 km al 9,7 %, con descenso técnico' },
    { name: 'San Fermo della Battaglia (2.ª vez)', kmToGo: 5.2, detail: 'la cima queda a 5,2 km de la meta' },
  ],
  finale:
    'El final vuelve a ser un circuito en torno a Como, como en 2022: tras coronar San Fermo por última vez quedan unos 5 km de descenso por carretera ancha, con dos túneles iluminados y dos grandes rotondas antes de la línea.',
  broadcasts: [
    {
      region: 'España',
      channels: 'Eurosport 1 y 2 · HBO Max (sin anuncios)',
      note: 'También en operadoras como Movistar, Orange, Vodafone o DAZN, según Ciclismo al Día.',
    },
    {
      region: 'México y Centroamérica',
      channels: 'ESPN · Disney+',
      note: 'Fox Sports México y Domestique indican ESPN; Ciclismo al Día cita Claro Sports. Confirma con tu proveedor.',
    },
    {
      region: 'Colombia',
      channels: 'DirecTV Sports (DGO) · Claro Sports en YouTube',
      note: 'Según Ciclismo al Día.',
    },
    {
      region: 'Sudamérica',
      channels: 'DirecTV · ESPN Latinoamérica / Disney+',
      note: 'Los derechos pueden variar por país.',
    },
  ],
  favorites: [
    { name: 'Remco Evenepoel', slug: 'remco-evenepoel', team: 'Red Bull-Bora', note: 'Segundo en 2024 y 2025 y campeón de Europa desde el 4 de octubre.' },
    { name: 'Paul Seixas', slug: 'paul-seixas', team: 'Decathlon CMA CGM', note: 'Entre los favoritos que destaca CyclingUpToDate.' },
    { name: 'Tom Pidcock', slug: 'tom-pidcock', team: 'Pinarello-Q36.5', note: 'Segundo por tercer año seguido en el Giro dell\'Emilia.' },
    { name: 'Giulio Ciccone', slug: 'giulio-ciccone', note: 'Plata en el Europeo a milímetros de Evenepoel.' },
    { name: 'Matteo Jorgenson', slug: 'matteo-jorgenson', team: 'Visma | Lease a Bike', note: 'Quinto en el Giro dell\'Emilia, a 12 segundos de su compañero Piganzoli.' },
    { name: 'Davide Piganzoli', slug: 'davide-piganzoli', team: 'Visma | Lease a Bike', note: 'Ganador del Giro dell\'Emilia a una semana de la carrera.' },
    { name: 'Isaac del Toro', slug: 'isaac-del-toro', team: 'UAE Team Emirates-XRG', note: 'Quinto en 2025 y en el Mundial de Montreal; el mexicano que vuelve a competir.' },
    { name: 'Brandon McNulty', slug: 'brandon-mcnulty', team: 'UAE Team Emirates-XRG', note: 'Campeón del mundo; Olympics.com lo cita entre las estrellas de la carrera.' },
    { name: 'Enric Mas', slug: 'enric-mas', team: 'Movistar', note: 'Campeón de la Vuelta a España 2026, según Domestique entre los aspirantes.' },
  ],
  lastWinner: {
    year: 2025,
    winner: 'Tadej Pogačar',
    team: 'UAE Team Emirates-XRG',
    detail: 'Atacó a 36 km de meta y llegó en solitario: 5 h 45\' 53".',
    podium: ['1. Tadej Pogačar — 5 h 45\' 53"', '2. Remco Evenepoel — a 1\' 48"', '3. Michael Storer — a 3\' 14"'],
  },
  recentWinners: [
    { year: 2025, winner: 'Tadej Pogačar', team: 'UAE Team Emirates-XRG' },
    { year: 2024, winner: 'Tadej Pogačar', team: 'UAE Team Emirates' },
    { year: 2023, winner: 'Tadej Pogačar', team: 'UAE Team Emirates' },
    { year: 2022, winner: 'Tadej Pogačar', team: 'UAE Team Emirates' },
    { year: 2021, winner: 'Tadej Pogačar', team: 'UAE Team Emirates' },
    { year: 2020, winner: 'Jakob Fuglsang', team: 'Astana' },
  ],
  history: [
    {
      title: '1905 · Nace «Milano–Milano»',
      text: 'La carrera se creó a partir de una idea del periodista Tullo Morgagni. El primer ganador fue Giovanni Gerbi, que llegó unos 40 minutos por delante de Giovanni Rossignoli y Luigi Ganna, según la web oficial de la prueba.',
    },
    {
      title: '1907 · La Gazzetta se hace cargo',
      text: 'La Gazzetta dello Sport organiza la carrera desde 1907 y la consolida como una de las grandes citas italianas. Solo se paró en 1943-1944, durante la guerra.',
    },
    {
      title: 'La clásica de las hojas muertas',
      text: 'Por su fecha, en pleno otoño, se la conoce como «la classica delle foglie morte». Durante unos setenta años, cuando el Mundial se disputaba a final del verano, se la consideraba el «Mundial de otoño».',
    },
    {
      title: 'Ghisallo y Sormano: las subidas míticas',
      text: 'El Madonna del Ghisallo, que sube desde Bellagio hasta un santuario declarado patrona de los ciclistas, es el símbolo de la carrera. El Muro di Sormano, de 1,7 km con rampas cercanas al 27 %, se incluyó entre 1960 y 1962 y regresó en 2012.',
    },
    {
      title: 'Los reyes del Lombardia',
      text: 'Fausto Coppi ganó cinco veces (1946, 1947, 1948, 1949 y 1954) y Alfredo Binda cuatro (1925, 1926, 1927 y 1931). Gino Bartali sumó tres victorias y nueve podios, y el irlandés Sean Kelly ganó en 1983, 1985 y 1991.',
    },
    {
      title: '2021-2025 · El dominio de Pogačar',
      text: 'Tadej Pogačar ganó cinco ediciones seguidas y igualó el récord de Coppi. Es la primera vez desde 2020 que el nombre del campeón estará abierto.',
    },
  ],
  facts: [
    'Es la quinta y última de las cinco grandes clásicas «monumento» del calendario y la única que todavía no tiene versión femenina; ProCyclingUK informa de que RCS Sport proyecta una para 2027.',
    'La edición 2026 estrena una presentación oficial de equipos en Bérgamo la víspera, siguiendo el modelo de otros monumentos como la París-Roubaix.',
    'Paolo Bettini ganó la edición número 100 (2006) y es uno de los pocos corredores que lograron ganar este monumento y el campeonato del mundo.',
    'La carrera fue la última prueba de la Copa del Mundo UCI hasta 2004 y cerró el ProTour entre 2005 y 2007.',
    'Es la primera vez en cinco años que no estará Tadej Pogačar, que se rompió la clavícula en la Vuelta a España.',
  ],
  latinos:
    'El mexicano Isaac del Toro (UAE Team Emirates-XRG) es la gran baza latinoamericana: fue quinto en 2025 trabajando para Pogačar y llega tras el Mundial de Montreal, donde fue quinto en la prueba en línea.',
  sources: [
    { name: 'ProCyclingUK — recorrido', url: 'https://procyclinguk.com/il-lombardia-2026-route-guide-ghisallo-civiglio-and-double-san-fermo-finale/' },
    { name: 'Domestique — novedades', url: 'https://www.domestiquecycling.com/en/news/no-pogacar-a-circuit-finale-and-a-team-presentation-whats-new-at-il-lombardia-in-2026/' },
    { name: 'CyclingUpToDate — previa', url: 'https://cyclinguptodate.com/cycling/il-lombardia-2026-preview-profile-favourites-predictions-who-will-win-after-5-years-of-tadej-pogacar-dominance' },
    { name: 'Ciclismo al Día — TV y horarios', url: 'https://ciclismoaldia.es/ciclismo/cuando-ver-por-tv-y-seguir-online-en-directo-il-lombardia-2026-en-espana-y-latinoamerica-fecha-y-horarios' },
    { name: 'Domestique — dónde verla', url: 'https://www.domestiquecycling.com/en/news/how-to-watch-the-2026-il-lombardia-streaming-and-tv-by-country/' },
    { name: 'Web oficial — historia', url: 'https://www.ilombardia.it/en/news/the-history-of-the-il-lombardia/' },
    { name: 'ProCyclingUK — historia', url: 'https://procyclinguk.com/a-brief-history-of-il-lombardia/' },
    { name: 'Wikipedia — Il Lombardia 2025', url: 'https://en.wikipedia.org/wiki/2025_Il_Lombardia' },
  ],
}

export const RACE_INFO: Record<string, RaceInfo> = {
  [ilLombardia2026.slug]: ilLombardia2026,
}

export function getRaceInfo(slug: string): RaceInfo | undefined {
  return RACE_INFO[slug]
}
