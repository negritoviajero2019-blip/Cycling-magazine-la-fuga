import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { branding } from '@/lib/config/branding'
import { Analytics } from '@/components/layout/Analytics'
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner'
import { websiteJsonLd, organizationJsonLd } from '@/lib/seo/structured-data'

/**
 * Inter autoalojado por Next.js en build time (next/font) — cero
 * peticiones externas en runtime, cero salto de layout. Sustituye a
 * Georgia como tipografía única (upgrade de diseño, agosto 2026):
 * titulares grandes en negrita con tracking negativo en vez de serif
 * clásica, ver Hero/ArticleCard.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * Anton (SIL OFL, ya usada en las imágenes de portada horneadas vía
 * /api/og-cover) como fuente de titulares "de marca" — solo en los
 * puntos de mayor jerarquía del sitio editorial (Hero, tarjetas de
 * artículo, títulos de sección grandes), NO en todo lo que usa
 * font-heading: es una fuente muy condensada y de un solo peso, se ve
 * mal en texto pequeño. Panel de admin y páginas legales/utilitarias
 * se quedan en Inter a propósito — ver docs/VISUAL-AUDIT-2026-09-14.md.
 */
const anton = localFont({
  src: '../../public/fonts/Anton-Regular.ttf',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
})

// Título principal exacto pedido por la marca; el resto de páginas usa
// el template `%s | La Fuga` (ver también title:{absolute} en la home).
const SITE_DEFAULT_TITLE = 'LA FUGA | Cycling Magazine'

export const metadata: Metadata = {
  metadataBase: new URL(branding.url),
  title: { default: SITE_DEFAULT_TITLE, template: `%s | ${branding.name}` },
  description: branding.tagline,
  icons: { icon: branding.favicon },
  alternates: { types: { 'application/rss+xml': `${branding.url}/feed.xml` } },
}

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={branding.locale} className={`${inter.variable} ${anton.variable}`}>
      {/*
        Script de verificación/conexión de Google AdSense — Google lo
        pide como etiqueta <script> literal en <head> de cada página
        para poder revisar el sitio. Por sí solo NO muestra anuncios
        (eso depende de los ad-slots reales, gateados aparte por
        NEXT_PUBLIC_ADSENSE_ADS_READY, ver src/components/ads/AdBanner.tsx).
        A propósito NO se usa next/script aquí: con strategy
        "beforeInteractive" Next.js lo convierte en un <link
        rel="preload"> + inyección por runtime, no en la etiqueta
        <script src="..."> literal que el verificador de Google busca
        en el HTML servido — por eso la verificación fallaba.
      */}
      {ADSENSE_PUBLISHER_ID && (
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        </head>
      )}
      <body className="font-body antialiased">
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {/* WCAG 2.4.1 (Bypass Blocks) — permite saltar la navegación con teclado/lector de pantalla. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {children}
        <Analytics />
        <CookieConsentBanner />
      </body>
    </html>
  )
}
