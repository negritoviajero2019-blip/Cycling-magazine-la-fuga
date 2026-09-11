#!/usr/bin/env tsx
/**
 * Calcula relevance score y tier editorial (mismo algoritmo que
 * src/lib/content/relevance-score.ts). Uso:
 *
 *   tsx .claude/skills/cycling-news-editor/scripts/score-news.ts input.json
 *
 * input.json: los 7 factores 0-10 de RelevanceInput (ver el módulo).
 */
import { readFileSync } from 'fs'
import { computeRelevanceScore, relevanceTier, type RelevanceInput } from '../../../../src/lib/content/relevance-score'

const path = process.argv[2]
if (!path) {
  console.error('Uso: score-news.ts <ruta-al-json>')
  process.exit(1)
}

const input: RelevanceInput = JSON.parse(readFileSync(path, 'utf-8'))
const score = computeRelevanceScore(input)
const tier = relevanceTier(score)

console.log(`Relevance score: ${score}/100`)
console.log(`Tier: ${tier}`)
console.log(
  {
    breaking: '90-100 → publicar como breaking news',
    publish_asap: '75-89 → publicar cuanto antes',
    candidate: '60-74 → candidato a publicación',
    discard: '<60 → almacenar como información / descartar',
  }[tier],
)
