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
    instagram: '',
  },
  contactEmail: 'redaccion@example.com',
} as const

export const nav = [
  { label: 'Inicio', href: '/' },
  { label: 'Últimas noticias', href: '/category/ultima-hora' },
  { label: 'Grand Tours', href: '/category/grand-tours' },
  { label: 'Clásicas', href: '/category/clasicas' },
  { label: 'Ciclismo femenino', href: '/category/ciclismo-femenino' },
  { label: 'Fichajes', href: '/category/fichajes' },
  { label: 'Equipos', href: '/teams' },
  { label: 'Ciclistas', href: '/riders' },
  { label: 'Tecnología', href: '/category/tecnologia' },
  { label: 'Análisis', href: '/category/analisis' },
] as const

export const footerLinks = [
  { label: 'Sobre nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
  { label: 'Política editorial', href: '/editorial-policy' },
  { label: 'Privacidad', href: '/privacy-policy' },
  { label: 'Cookies', href: '/cookie-policy' },
  { label: 'Términos', href: '/terms' },
] as const
