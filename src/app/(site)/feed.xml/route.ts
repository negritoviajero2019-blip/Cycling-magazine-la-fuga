import { prisma, safeQuery } from '@/lib/db'
import { branding } from '@/lib/config/branding'

export const dynamic = 'force-dynamic'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** §88: RSS general de la revista. */
export async function GET() {
  const articles = await safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: { in: ['published', 'updated'] } },
        orderBy: { publishedAt: 'desc' },
        take: 30,
        select: { slug: true, title: true, excerpt: true, publishedAt: true, updatedAt: true },
      }),
    [],
  )

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${branding.url}/news/${a.slug}</link>
      <guid>${branding.url}/news/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${(a.publishedAt || a.updatedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(branding.name)}</title>
    <link>${branding.url}</link>
    <description>${escapeXml(branding.tagline)}</description>
    <language>${branding.locale}</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
