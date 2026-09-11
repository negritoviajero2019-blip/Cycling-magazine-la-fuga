import type { Metadata } from 'next'
import { branding } from '@/lib/config/branding'

interface PageSeoInput {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  publishedAt?: Date | null
  updatedAt?: Date | null
  noindex?: boolean
}

export function buildMetadata(input: PageSeoInput): Metadata {
  const url = `${branding.url}${input.path || ''}`
  // El sufijo " | {marca}" lo añade automáticamente el template del
  // layout raíz (ver src/app/layout.tsx) — aquí solo va el título propio
  // de la página, para no duplicarlo.
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: branding.name,
      locale: branding.locale,
      type: input.type || 'website',
      images: input.image ? [{ url: input.image }] : undefined,
      ...(input.type === 'article' && input.publishedAt
        ? {
            publishedTime: input.publishedAt.toISOString(),
            modifiedTime: (input.updatedAt || input.publishedAt).toISOString(),
          }
        : {}),
    },
    twitter: {
      card: input.image ? 'summary_large_image' : 'summary',
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
  }
}
