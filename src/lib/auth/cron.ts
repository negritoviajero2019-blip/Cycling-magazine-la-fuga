/**
 * Protege los endpoints internos de automatización (§57, §93). Los cron
 * jobs de hPanel deben enviar el header `x-cron-secret` con el valor de
 * CRON_SECRET. Sin CRON_SECRET configurado, el endpoint se considera no
 * configurado y rechaza cualquier llamada (fail-closed, nunca abierto).
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('x-cron-secret') === secret
}
