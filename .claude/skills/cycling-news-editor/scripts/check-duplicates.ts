#!/usr/bin/env tsx
/**
 * Comprueba si un candidato a noticia ya existe (mismo algoritmo que
 * src/lib/content/dedup.ts). Uso:
 *
 *   tsx .claude/skills/cycling-news-editor/scripts/check-duplicates.ts candidato.json
 *
 * candidato.json: { "headline": string, "entities": string[], "eventDate": string|null }
 * Compara contra los NewsCandidate/Article existentes en la BD (vía Prisma).
 */
import { readFileSync } from 'fs'
import { findLikelyDuplicate, type DedupCandidate } from '../../../../src/lib/content/dedup'
import { fromJsonField } from '../../../../src/lib/content/json-field'
import { PrismaClient } from '@prisma/client'

async function main() {
  const path = process.argv[2]
  if (!path) {
    console.error('Uso: check-duplicates.ts <ruta-al-json-del-candidato>')
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(path, 'utf-8'))
  const candidate: DedupCandidate = {
    id: 'new',
    headline: raw.headline,
    entities: raw.entities || [],
    eventDate: raw.eventDate ? new Date(raw.eventDate) : null,
  }

  const prisma = new PrismaClient()
  const existingCandidates = await prisma.newsCandidate.findMany({
    where: { status: { in: ['new', 'reviewing', 'approved', 'published'] } },
    select: { id: true, headline: true, entities: true, eventDate: true },
  })
  await prisma.$disconnect()

  const existing: DedupCandidate[] = existingCandidates.map((c) => ({
    id: c.id,
    headline: c.headline,
    entities: fromJsonField<string[]>(c.entities, []),
    eventDate: c.eventDate,
  }))

  const duplicate = findLikelyDuplicate(candidate, existing)

  if (duplicate) {
    console.log(`⚠️  Posible duplicado del NewsCandidate #${duplicate.id}: "${duplicate.headline}"`)
    console.log('   → Actualiza el existente en vez de crear uno nuevo.')
    process.exit(2)
  }

  console.log('✅ No se encontraron duplicados evidentes.')
}

main()
