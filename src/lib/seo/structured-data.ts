import { branding } from '@/lib/config/branding'

/** Constructores de JSON-LD (§38). Solo se usan los schemas que
 * corresponden al contenido real de cada página. */

export function newsArticleJsonLd(article: {
  title: string
  excerpt: string
  slug: string
  authorName: string
  publishedAt: Date
  updatedAt: Date
  imageUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { '@type': 'Person', name: article.authorName },
    publisher: {
      '@type': 'Organization',
      name: branding.name,
      logo: { '@type': 'ImageObject', url: `${branding.url}${branding.logo}` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${branding.url}/news/${article.slug}` },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: branding.name,
    url: branding.url,
    logo: `${branding.url}${branding.logo}`,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: branding.name,
    url: branding.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${branding.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function personJsonLd(rider: { name: string; nationality?: string | null; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: rider.name,
    nationality: rider.nationality || undefined,
    url: `${branding.url}/riders/${rider.slug}`,
  }
}

export function sportsEventJsonLd(race: {
  name: string
  slug: string
  startDate: Date
  endDate: Date
  country?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: race.name,
    startDate: race.startDate.toISOString(),
    endDate: race.endDate.toISOString(),
    location: race.country ? { '@type': 'Place', name: race.country } : undefined,
    url: `${branding.url}/races/${race.slug}`,
  }
}
