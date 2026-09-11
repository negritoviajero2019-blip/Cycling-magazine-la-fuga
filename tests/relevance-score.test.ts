import { describe, it, expect } from 'vitest'
import { computeRelevanceScore, relevanceTier } from '@/lib/content/relevance-score'

describe('computeRelevanceScore', () => {
  it('devuelve un score alto para un evento de máxima relevancia', () => {
    const score = computeRelevanceScore({
      riderImportance: 10,
      teamImportance: 10,
      raceCategory: 10,
      impact: 10,
      timeliness: 10,
      internationalInterest: 10,
      exclusivity: 10,
    })
    expect(score).toBe(100)
    expect(relevanceTier(score)).toBe('breaking')
  })

  it('devuelve un score bajo para un evento irrelevante', () => {
    const score = computeRelevanceScore({
      riderImportance: 1,
      teamImportance: 1,
      raceCategory: 1,
      impact: 1,
      timeliness: 1,
      internationalInterest: 1,
      exclusivity: 1,
    })
    expect(score).toBeLessThan(60)
    expect(relevanceTier(score)).toBe('discard')
  })

  it('clampa valores fuera de rango 0-10', () => {
    const score = computeRelevanceScore({
      riderImportance: 999,
      teamImportance: -50,
      raceCategory: 5,
      impact: 5,
      timeliness: 5,
      internationalInterest: 5,
      exclusivity: 5,
    })
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})
