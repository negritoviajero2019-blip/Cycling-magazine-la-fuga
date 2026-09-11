import { z } from 'zod'
import { ARTICLE_STATUS } from './enums'

export const articleInputSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug debe ser minúsculas y guiones'),
  subtitle: z.string().optional().nullable(),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  categoryId: z.number().int(),
  authorId: z.number().int(),
  status: z.enum(ARTICLE_STATUS).default('draft'),
  breakingNews: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  tagIds: z.array(z.number().int()).default([]),
  publishedAt: z.string().datetime().optional().nullable(),
})

export type ArticleInput = z.infer<typeof articleInputSchema>
