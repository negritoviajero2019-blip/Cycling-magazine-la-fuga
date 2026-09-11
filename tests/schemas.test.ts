import { describe, it, expect } from 'vitest'
import { GeneratedArticleSchema, INSUFFICIENT_VERIFICATION } from '@/lib/ai/schemas'

describe('GeneratedArticleSchema', () => {
  const base = {
    title: 'Un titular suficientemente largo para pasar la validación',
    subtitle: null,
    excerpt: 'Un extracto suficientemente largo para pasar la validación del schema.',
    category: 'ultima-hora',
    tags: ['ciclismo'],
    sourceUrls: ['https://example.com/fuente'],
    sourceNames: ['Fuente de ejemplo'],
    seoTitle: 'Título SEO',
    seoDescription: 'Descripción SEO',
    breaking: false,
    confidenceScore: 90,
  }

  it('acepta un artículo válido con contenido real', () => {
    const result = GeneratedArticleSchema.safeParse({
      ...base,
      content: 'x'.repeat(120),
      status: 'review',
    })
    expect(result.success).toBe(true)
  })

  it('acepta el sentinel INSUFFICIENT_VERIFICATION como contenido', () => {
    const result = GeneratedArticleSchema.safeParse({
      ...base,
      content: INSUFFICIENT_VERIFICATION,
      status: 'review',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza un confidenceScore fuera de rango', () => {
    const result = GeneratedArticleSchema.safeParse({
      ...base,
      content: 'x'.repeat(120),
      confidenceScore: 150,
    })
    expect(result.success).toBe(false)
  })
})
