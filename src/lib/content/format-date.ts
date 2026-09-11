import { branding } from '@/lib/config/branding'

/** §64: fechas siempre en formato explícito del locale, nunca "ayer" ambiguo. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(branding.locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: branding.defaultTimezone,
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(branding.locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: branding.defaultTimezone,
  }).format(date)
}

/**
 * Tiempo relativo corto para feeds de actualidad ("Hace 18 min", "Hace
 * 1 h", "Hoy", "Ayer"). Solo para lectura rápida en listados — el
 * artículo siempre muestra también la fecha explícita (§64), esto no
 * la sustituye.
 */
export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return 'Ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 6) return `Hace ${diffHours} h`

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (sameDay) return 'Hoy'

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`

  return formatDate(date)
}
