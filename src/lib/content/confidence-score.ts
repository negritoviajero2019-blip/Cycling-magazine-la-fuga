/**
 * Confidence Score (§31): 0-100, basado en credibilidad y cantidad de
 * fuentes. Determina si un NewsCandidate puede auto-publicarse,
 * requiere revisión humana o no debe publicarse (§77).
 */
import type { SourceCredibilityTier } from './enums'

const TIER_WEIGHT: Record<SourceCredibilityTier, number> = {
  official: 40,
  uci: 38,
  team: 32,
  agency: 26,
  media: 20,
  journalist: 16,
  other: 6,
}

export interface ConfidenceInput {
  sourceTiers: SourceCredibilityTier[]
  independentConfirmations: number // fuentes que confirman el hecho de forma independiente
  hasOfficialSource: boolean
  contradictionsFound: boolean
}

export function computeConfidenceScore(input: ConfidenceInput): number {
  if (input.contradictionsFound) return Math.min(35, baseScore(input))
  return Math.min(100, baseScore(input))
}

function baseScore(input: ConfidenceInput): number {
  const bestTier = input.sourceTiers.reduce(
    (max, tier) => Math.max(max, TIER_WEIGHT[tier] ?? 0),
    0,
  )
  const confirmationBonus = Math.min(30, input.independentConfirmations * 12)
  const officialBonus = input.hasOfficialSource ? 25 : 0
  return bestTier + confirmationBonus + officialBonus
}

import type { EditorialAction } from './enums'

/**
 * Clasificación §77: decide si un candidato puede auto-publicarse,
 * necesita revisión humana, o se descarta directamente.
 */
export function classifyEditorialAction(params: {
  confidenceScore: number
  isSensitiveTopic: boolean // dopaje, salud, legal, acusaciones, accidentes graves
  isRumor: boolean
  hasCopyrightIssue: boolean
  isDuplicate: boolean
}): EditorialAction {
  if (params.hasCopyrightIssue || params.isDuplicate) return 'do_not_publish'
  if (params.isSensitiveTopic || params.isRumor) return 'requires_review'
  if (params.confidenceScore >= 85) return 'auto_publish_safe'
  if (params.confidenceScore >= 50) return 'requires_review'
  return 'do_not_publish'
}
