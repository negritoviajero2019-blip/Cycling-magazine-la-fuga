import { describe, it, expect } from 'vitest'
import { findLikelyDuplicate } from '@/lib/content/dedup'

describe('findLikelyDuplicate', () => {
  const existing = [
    {
      id: 1,
      headline: 'Pogačar gana la etapa 14 del Tour de Francia',
      entities: ['tadej-pogacar', 'tour-de-france'],
      eventDate: new Date('2026-07-14'),
    },
  ]

  it('detecta un duplicado evidente (misma entidad + titular similar)', () => {
    const duplicate = findLikelyDuplicate(
      {
        id: 'new',
        headline: 'Pogačar gana la etapa 14 del Tour de France',
        entities: ['tadej-pogacar', 'tour-de-france'],
        eventDate: new Date('2026-07-14'),
      },
      existing,
    )
    expect(duplicate?.id).toBe(1)
  })

  it('no marca como duplicado un evento distinto', () => {
    const duplicate = findLikelyDuplicate(
      {
        id: 'new',
        headline: 'Vingegaard confirma su participación en la Vuelta',
        entities: ['jonas-vingegaard', 'vuelta-a-espana'],
        eventDate: new Date('2026-08-01'),
      },
      existing,
    )
    expect(duplicate).toBeNull()
  })
})
