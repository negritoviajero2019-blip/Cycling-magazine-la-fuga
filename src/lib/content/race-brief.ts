/**
 * Fichas ligeras para carreras que no son monumentos, clásicas grandes ni
 * grandes vueltas (esas llevan ficha completa en race-info.ts): distancia,
 * perfil en una línea, un corredor confirmado del top 10 UCI y 2-4 datos.
 * Pocos bytes y poco esfuerzo; nunca se inventan datos.
 */

export interface RaceBrief {
  slug: string
  /** Una frase de contexto. */
  summary: string
  distance: string
  /** Altimetría/perfil en texto corto. */
  profile: string
  topRider?: { name: string; slug: string; note: string }
  details: string[]
  sources: string[]
}

export const RACE_BRIEFS: RaceBrief[] = [
  {
    slug: 'tour-of-guangxi-2026',
    summary:
      'Séptima edición del Tour de Guangxi (China), la última carrera por etapas del WorldTour de la temporada, del 13 al 18 de octubre.',
    distance: '6 etapas · 1.041 km (cifras oficiales; otros medios dan 1.043 km)',
    profile:
      'Primeras etapas llanas para velocistas; la general se decide en la sexta, con final en alto en Nongla (3,2 km al 7,3 % de media).',
    topRider: {
      name: 'Tom Pidcock',
      slug: 'tom-pidcock',
      note: 'Pinarello Q36.5, entre los diez primeros del ranking UCI; debuta en la carrera y es el gran favorito a la general.',
    },
    details: [
      'Campeón defensor: Paul Double (Jayco AlUla).',
      'Otros nombres de la lista: Juan Ayuso, Jarno Widar, Kévin Vauquelin y, para las llegadas masivas, Olav Kooij y Paul Magnier.',
      '151 corredores de 28 nacionalidades (listado oficial del 12 de octubre).',
      'Etapas: 149 km (Chongzuo), 180 km (a Jingxi), 212 km (a Bama), 166 km (a Tian\'e), 170 km (a Yizhou) y 166 km hasta Nongla; las distancias varían unos metros según la fuente.',
    ],
    sources: ['Ciclo21', 'Es Ciclismo', 'VAVEL', 'CyclingUpToDate'],
  },
]

export function getRaceBrief(slug: string): RaceBrief | undefined {
  return RACE_BRIEFS.find((b) => b.slug === slug)
}
