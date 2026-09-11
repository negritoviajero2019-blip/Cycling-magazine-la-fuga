import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({ title: 'Política de cookies', description: 'Qué cookies usamos y para qué.', path: '/cookie-policy' })

export default function CookiePolicyPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Política de cookies</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Usamos cookies técnicas imprescindibles para el funcionamiento del sitio y, cuando el
          usuario lo consiente, cookies de analítica (Google Analytics) y de publicidad (Google
          AdSense).
        </p>
        <p className="italic text-muted">
          [PLACEHOLDER — REVISAR ANTES DE PRODUCCIÓN] Falta implementar el banner de
          consentimiento (CMP) y detallar aquí cada cookie real una vez se activen Analytics y
          AdSense, con su finalidad, duración y si es propia o de terceros.
        </p>
      </div>
    </Container>
  )
}
