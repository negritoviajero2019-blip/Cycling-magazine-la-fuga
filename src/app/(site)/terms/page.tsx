import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({ title: 'Términos y condiciones', description: 'Condiciones de uso del sitio.', path: '/terms' })

export default function TermsPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Términos y condiciones</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          El acceso y uso de este sitio implica la aceptación de estas condiciones. Todo el
          contenido editorial es propiedad de la publicación salvo que se indique lo contrario.
        </p>
        <p className="italic text-muted">
          [PLACEHOLDER — REVISAR ANTES DE PRODUCCIÓN] Términos y condiciones definitivos
          pendientes de redacción/revisión legal, incluyendo titularidad de la empresa editora,
          jurisdicción aplicable y condiciones de uso de contenido de terceros.
        </p>
      </div>
    </Container>
  )
}
