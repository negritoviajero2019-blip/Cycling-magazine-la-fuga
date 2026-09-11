#!/usr/bin/env tsx
/**
 * Valida un borrador de artículo (JSON) contra el mismo schema Zod que
 * usa el pipeline de producción — única fuente de verdad en
 * src/lib/ai/schemas.ts. Uso:
 *
 *   tsx .claude/skills/cycling-news-editor/scripts/validate-article.ts borrador.json
 */
import { readFileSync } from 'fs'
import { GeneratedArticleSchema, INSUFFICIENT_VERIFICATION } from '../../../../src/lib/ai/schemas'

const path = process.argv[2]
if (!path) {
  console.error('Uso: validate-article.ts <ruta-al-json>')
  process.exit(1)
}

const raw = JSON.parse(readFileSync(path, 'utf-8'))
const result = GeneratedArticleSchema.safeParse(raw)

if (!result.success) {
  console.error('❌ Artículo inválido:')
  console.error(result.error.format())
  process.exit(1)
}

if (result.data.content === INSUFFICIENT_VERIFICATION) {
  console.error('⛔ El contenido está marcado como INSUFFICIENT_VERIFICATION — no publicar.')
  process.exit(1)
}

console.log('✅ Artículo válido.')
console.log(`   Título: ${result.data.title}`)
console.log(`   Confianza: ${result.data.confidenceScore}`)
console.log(`   Estado sugerido: ${result.data.status}`)
