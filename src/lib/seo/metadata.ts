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

/**
 * Carátula de marca genérica (fondo degradado + wordmark, sin foto),
 * generada una sola vez en dev vía /api/og-cover — ver
 * docs/SOCIAL-PREVIEW.md. Se usa como respaldo en cualquier página que
 * no tenga su propia imagen (home, categorías, ciclistas, equipos,
 * carreras) para que WhatsApp/Facebook siempre muestren una tarjeta
 * con imagen en vez de una sin nada.
 */
const DEFAULT_OG_IMAGE = { url: '/images/og/default-cover.jpg', width: 1600, height: 900 }

export function buildMetadata(input: PageSeoInput): Metadata {
  const url = `${branding.url}${input.path || ''}`
  const image = input.image ? { url: input.image, width: 1600, height: 900 } : DEFAULT_OG_IMAGE
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
      images: [image],
      ...(input.type === 'article' && input.publishedAt
        ? {
            publishedTime: input.publishedAt.toISOString(),
            modifiedTime: (input.updatedAt || input.publishedAt).toISOString(),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image.url],
    },
  }
}
