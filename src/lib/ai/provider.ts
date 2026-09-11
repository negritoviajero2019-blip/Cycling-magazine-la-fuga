/**
 * Capa provider-agnostic de IA (§59): el resto de la app nunca importa
 * el SDK de Anthropic directamente, solo esta interfaz. Cambiar de
 * proveedor en el futuro es implementar `AiProvider` una vez, no tocar
 * cada punto de uso.
 */
import type { ZodSchema } from 'zod'

export type AiTask =
  | 'news-discovery'
  | 'fact-check'
  | 'article-writing'
  | 'headline'
  | 'seo'
  | 'classification'
  | 'update-existing-article'
  | 'breaking-news'

export interface GenerateStructuredParams<T> {
  task: AiTask
  systemPrompt: string
  userInput: string
  schema: ZodSchema<T>
  /** Si la tarea necesita buscar en internet (news-discovery, fact-check). */
  allowWebSearch?: boolean
}

export interface AiProvider {
  readonly name: string
  readonly isConfigured: boolean
  generateStructured<T>(params: GenerateStructuredParams<T>): Promise<T>
}

class NotConfiguredProvider implements AiProvider {
  readonly name = 'none'
  readonly isConfigured = false
  async generateStructured<T>(): Promise<T> {
    throw new Error(
      'AI provider no configurado: falta ANTHROPIC_API_KEY. La automatización queda inactiva hasta que se añada.',
    )
  }
}

let cachedProvider: AiProvider | null = null

export async function getAiProvider(): Promise<AiProvider> {
  if (cachedProvider) return cachedProvider

  const providerName = process.env.AI_PROVIDER || 'anthropic'
  if (!process.env.ANTHROPIC_API_KEY) {
    cachedProvider = new NotConfiguredProvider()
    return cachedProvider
  }

  if (providerName === 'anthropic') {
    const { AnthropicProvider } = await import('./anthropic')
    cachedProvider = new AnthropicProvider()
    return cachedProvider
  }

  cachedProvider = new NotConfiguredProvider()
  return cachedProvider
}
