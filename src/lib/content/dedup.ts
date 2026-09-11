/**
 * Detector de duplicados (§29): antes de crear un NewsCandidate/Article
 * nuevo, compara contra los existentes por entidad principal + evento +
 * fecha + similitud de titular. Heurística simple y explicable — no un
 * modelo de embeddings — suficiente para el volumen editorial del MVP
 * (~4-8 artículos/semana) y fácil de auditar.
 */

export interface DedupCandidate {
  id: number | string
  headline: string
  entities: string[] // slugs normalizados: riders, teams, races mencionados
  eventDate: Date | null
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

function tokenSet(text: string): Set<string> {
  return new Set(normalize(text).split(/\s+/).filter(Boolean))
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0
  const intersection = [...a].filter((token) => b.has(token)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : intersection / union
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10)
}

export function findLikelyDuplicate(
  candidate: DedupCandidate,
  existing: DedupCandidate[],
  { headlineThreshold = 0.45 }: { headlineThreshold?: number } = {},
): DedupCandidate | null {
  const candidateTokens = tokenSet(candidate.headline)
  const candidateEntities = new Set(candidate.entities)

  for (const item of existing) {
    if (item.id === candidate.id) continue

    const sharedEntities = item.entities.filter((e) => candidateEntities.has(e))
    const entityOverlap = sharedEntities.length > 0
    const headlineSim = jaccardSimilarity(candidateTokens, tokenSet(item.headline))
    const closeInTime = sameDay(candidate.eventDate, item.eventDate)

    if (entityOverlap && (headlineSim >= headlineThreshold || closeInTime)) {
      return item
    }
  }
  return null
}
