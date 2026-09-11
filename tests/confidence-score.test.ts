import { describe, it, expect } from 'vitest'
import { computeConfidenceScore, classifyEditorialAction } from '@/lib/content/confidence-score'

describe('computeConfidenceScore', () => {
  it('puntúa alto con fuente oficial y confirmaciones', () => {
    const score = computeConfidenceScore({
      sourceTiers: ['official'],
      independentConfirmations: 2,
      hasOfficialSource: true,
      contradictionsFound: false,
    })
    expect(score).toBeGreaterThanOrEqual(85)
  })

  it('penaliza fuertemente si hay contradicciones', () => {
    const score = computeConfidenceScore({
      sourceTiers: ['official'],
      independentConfirmations: 2,
      hasOfficialSource: true,
      contradictionsFound: true,
    })
    expect(score).toBeLessThanOrEqual(35)
  })
})

describe('classifyEditorialAction', () => {
  it('bloquea contenido con problema de copyright', () => {
    expect(
      classifyEditorialAction({
        confidenceScore: 100,
        isSensitiveTopic: false,
        isRumor: false,
        hasCopyrightIssue: true,
        isDuplicate: false,
      }),
    ).toBe('do_not_publish')
  })

  it('exige revisión humana para rumores aunque la confianza sea alta', () => {
    expect(
      classifyEditorialAction({
        confidenceScore: 95,
        isSensitiveTopic: false,
        isRumor: true,
        hasCopyrightIssue: false,
        isDuplicate: false,
      }),
    ).toBe('requires_review')
  })

  it('permite auto-publicar solo con confianza alta y sin temas sensibles', () => {
    expect(
      classifyEditorialAction({
        confidenceScore: 90,
        isSensitiveTopic: false,
        isRumor: false,
        hasCopyrightIssue: false,
        isDuplicate: false,
      }),
    ).toBe('auto_publish_safe')
  })
})
