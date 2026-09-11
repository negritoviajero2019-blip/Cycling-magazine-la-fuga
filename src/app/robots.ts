import type { MetadataRoute } from 'next'
import { branding } from '@/lib/config/branding'

/** §89: bloquea admin, endpoints privados, preview y staging. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${branding.url}/sitemap.xml`,
  }
}
