import Anthropic from '@anthropic-ai/sdk'
import type { AiProvider, GenerateStructuredParams } from './provider'

/**
 * Implementación Anthropic de AiProvider. Usa la herramienta de
 * búsqueda web nativa de Claude para las tareas que la necesitan
 * (news-discovery, fact-check) — decisión documentada en el plan de
 * arquitectura (§59 del brief): un solo proveedor, provider-agnostic
 * por diseño, sustituible sin tocar el resto de la app.
 */
export class AnthropicProvider implements AiProvider {
  readonly name = 'anthropic'
  readonly isConfigured = true
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async generateStructured<T>({
    systemPrompt,
    userInput,
    schema,
    allowWebSearch,
  }: GenerateStructuredParams<T>): Promise<T> {
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

    const response = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }],
      tools: allowWebSearch
        ? [{ type: 'web_search_20250305', name: 'web_search' } as never]
        : undefined,
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Respuesta de IA sin contenido de texto utilizable.')
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('La respuesta de IA no contenía JSON válido.')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return schema.parse(parsed)
  }
}
