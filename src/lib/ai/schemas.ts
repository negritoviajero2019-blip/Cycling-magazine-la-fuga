/**
 * Formas JSON validadas con Zod para cada tarea de IA (§61 del brief).
 * Ninguna respuesta del modelo se usa sin pasar por uno de estos schemas.
 */
import { z } from 'zod'
import { ARTICLE_STATUS } from '@/lib/content/enums'

/** Sentinel obligatorio (§62): si el modelo no puede verificar un hecho,
 * debe devolver esto en vez de inventarlo. */
export const INSUFFICIENT_VERIFICATION = 'INSUFFICIENT_VERIFICATION' as const

export const NewsDiscoveryResultSchema = z.object({
  headline: z.string().min(5),
  summary: z.string().min(10),
  sourceUrls: z.array(z.string().url()).min(1),
  sourceNames: z.array(z.string()).min(1),
  eventDate: z.string().datetime().nullable(),
  entities: z.array(z.string()),
  category: z.string(),
  isRumor: z.boolean(),
})
export type NewsDiscoveryResult = z.infer<typeof NewsDiscoveryResultSchema>

export const FactCheckResultSchema = z.object({
  verified: z.boolean(),
  confidenceScore: z.number().min(0).max(100),
  contradictionsFound: z.boolean(),
  hasOfficialSource: z.boolean(),
  independentConfirmations: z.number().min(0),
  notes: z.string(),
})
export type FactCheckResult = z.infer<typeof FactCheckResultSchema>

export const GeneratedArticleSchema = z.object({
  title: z.string().min(10),
  subtitle: z.string().nullable(),
  excerpt: z.string().min(20),
  content: z.union([z.string().min(100), z.literal(INSUFFICIENT_VERIFICATION)]),
  category: z.string(),
  tags: z.array(z.string()),
  sourceUrls: z.array(z.string().url()),
  sourceNames: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  breaking: z.boolean(),
  confidenceScore: z.number().min(0).max(100),
  status: z.enum(ARTICLE_STATUS).default('review'),
})
export type GeneratedArticle = z.infer<typeof GeneratedArticleSchema>
