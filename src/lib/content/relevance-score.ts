/**
 * Relevance Score (§30 del brief): 0-100, orientativo — nunca sustituye
 * al criterio editorial humano. Usado tanto por el pipeline automatizado
 * (src/app/api/internal/automation) como por la Skill interactiva
 * (.claude/skills/cycling-news-editor/scripts/score-news.ts), que
 * implementa la misma fórmula.
 *
 * 90-100 breaking news · 75-89 publicar cuanto antes
 * 60-74 candidato a publicación · <60 almacenar / descartar
 */

export interface RelevanceInput {
  riderImportance: number // 0-10: renombre/palmarés del ciclista implicado
  teamImportance: number // 0-10: relevancia del equipo (WorldTour top vs continental)
  raceCategory: number // 0-10: Grand Tour/Mundial > Clásica > WorldTour > resto
  impact: number // 0-10: alcance de la noticia (título, récord, accidente grave...)
  timeliness: number // 0-10: qué tan reciente/actual es el hecho
  internationalInterest: number // 0-10: interés fuera del mercado local
  exclusivity: number // 0-10: primicia vs. ya cubierto ampliamente
}

const WEIGHTS: Record<keyof RelevanceInput, number> = {
  riderImportance: 0.18,
  teamImportance: 0.1,
  raceCategory: 0.2,
  impact: 0.22,
  timeliness: 0.15,
  internationalInterest: 0.1,
  exclusivity: 0.05,
}

export function computeRelevanceScore(input: RelevanceInput): number {
  const clamp = (n: number) => Math.min(10, Math.max(0, n))
  const weighted = (Object.keys(WEIGHTS) as (keyof RelevanceInput)[]).reduce(
    (sum, key) => sum + clamp(input[key]) * WEIGHTS[key],
    0,
  )
  return Math.round(weighted * 10) // escala 0-100
}

export function relevanceTier(score: number): 'breaking' | 'publish_asap' | 'candidate' | 'discard' {
  if (score >= 90) return 'breaking'
  if (score >= 75) return 'publish_asap'
  if (score >= 60) return 'candidate'
  return 'discard'
}
