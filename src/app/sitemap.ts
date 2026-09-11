import type { MetadataRoute } from 'next'
import { prisma, safeQuery } from '@/lib/db'
import { branding } from '@/lib/config/branding'

/**
 * §87: sitemap dinámico generado desde la BD, sin regeneración manual.
 * Solo se listan páginas con contenido real (§86: sin thin content).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, riders, teams, races, categories] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: { in: ['published', 'updated'] } },
          select: { slug: true, updatedAt: true },
        }),
      [],
    ),
    safeQuery(() => prisma.rider.findMany({ select: { slug: true } }), []),
    safeQuery(() => prisma.team.findMany({ select: { slug: true } }), []),
    safeQuery(() => prisma.race.findMany({ select: { slug: true } }), []),
    safeQuery(() => prisma.category.findMany({ select: { slug: true } }), []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: branding.url, changeFrequency: 'hourly', priority: 1 },
    { url: `${branding.url}/riders`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${branding.url}/teams`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${branding.url}/races`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${branding.url}/search`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${branding.url}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${branding.url}/editorial-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [
    ...staticPages,
    ...categories.map((c) => ({
      url: `${branding.url}/category/${c.slug}`,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${branding.url}/news/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...riders.map((r) => ({ url: `${branding.url}/riders/${r.slug}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...teams.map((t) => ({ url: `${branding.url}/teams/${t.slug}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...races.map((r) => ({ url: `${branding.url}/races/${r.slug}`, changeFrequency: 'daily' as const, priority: 0.6 })),
  ]
}
