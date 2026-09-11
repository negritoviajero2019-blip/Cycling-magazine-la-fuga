/**
 * §44: ads.txt configurable desde variable de entorno. Vacío hasta que
 * exista un publisher ID real de AdSense u otra red — un ads.txt vacío
 * no rompe nada, simplemente declara "sin vendedores autorizados" aún.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const content = process.env.ADS_TXT_CONTENT || ''
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
