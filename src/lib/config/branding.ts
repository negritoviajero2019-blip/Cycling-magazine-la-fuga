/**
 * Configuración centralizada de marca (§3, §80 del brief).
 * Cambiar nombre, dominio, colores o tagline solo requiere editar
 * este archivo y las variables de entorno — no hay strings de marca
 * repetidos por el resto del código.
 */

export const branding = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'La Fuga',
  shortName: 'LF',
  tagline:
    'Noticias, análisis, carreras, equipos, ciclistas y las historias que están moviendo el mundo del ciclismo profesional.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: process.env.NEXT_PUBLIC_SITE_LOCALE || 'es',
  defaultTimezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'Europe/Madrid',
  logo: '/images/la-fuga-logo.png',
  logoWidth: 2054,
  logoHeight: 766,
  favicon: '/favicon-la-fuga.png',
  social: {
    twitter: '',
    facebook: '',
    instagram: 'https://www.instagram.com/la_fuga_cycling_magazine',
  },
  /**
   * Sin correo real configurado, dejamos vacío en vez de una dirección
   * inventada — publicar un email que nadie revisa es peor que no
   * publicar ninguno. Cuando exista uno real, se activa por variable de
   * entorno (Hostinger → variables de entorno del sitio) sin tocar código.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  /** Identidad legal del titular del sitio, usada en Aviso de Privacidad, Términos y Sobre nosotros. */
  legal: {
    holderName: 'Humberto Cruz',
    holderType: 'persona física' as const,
    jurisdiction: 'México',
    lastUpdatedTerms: '16 de septiembre de 2026',
    lastUpdatedPrivacy: '18 de septiembre de 2026',
  },
} as const

export const nav = [
  { label: 'Inicio', href: '/' },
  { label: 'Últimas noticias', href: '/category/ultima-hora' },
  { label: 'Grand Tours', href: '/category/grand-tours' },
  { label: 'Clásicas', href: '/category/clasicas' },
  { label: 'Ciclismo femenino', href: '/category/ciclismo-femenino' },
  { label: 'MTB y Gravel', href: '/category/mtb-gravel' },
  { label: 'Latinos', href: '/category/latinos' },
  { label: 'Equipos', href: '/teams' },
  { label: 'Ciclistas', href: '/riders' },
  { label: 'Tecnología', href: '/category/tecnologia' },
  { label: 'Análisis', href: '/category/analisis' },
  { label: 'Leyendas', href: '/category/leyendas' },
] as const

export const footerLinks = [
  { label: 'Sobre nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
  { label: 'Política editorial', href: '/editorial-policy' },
  { label: 'Privacidad', href: '/privacy-policy' },
  { label: 'Cookies', href: '/cookie-policy' },
  { label: 'Términos', href: '/terms' },
] as const
