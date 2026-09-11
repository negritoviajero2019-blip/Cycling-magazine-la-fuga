import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({ title: 'Política de privacidad', description: 'Cómo tratamos tus datos.', path: '/privacy-policy' })

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Política de privacidad</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Recopilamos datos mínimos necesarios para el funcionamiento del sitio: analítica
          agregada (Google Analytics), el email que nos facilites voluntariamente al suscribirte
          a la newsletter, y datos técnicos estándar de servidor.
        </p>
        <p className="italic text-muted">
          [PLACEHOLDER — REVISAR ANTES DE PRODUCCIÓN] Este texto debe ser sustituido por una
          política de privacidad completa, redactada o revisada por un profesional legal,
          conforme al RGPD/LOPDGDD y adaptada a los proveedores reales que se activen
          (Analytics, AdSense, newsletter). Debe incluir: responsable del tratamiento, base
          legal, finalidad, plazos de conservación, derechos ARCO-POL y datos de contacto del
          delegado de protección de datos si aplica.
        </p>
      </div>
    </Container>
  )
}
