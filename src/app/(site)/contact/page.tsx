import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({ title: 'Contacto', description: 'Contacta con la redacción.', path: '/contact' })

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Contacto</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Para consultas de prensa, correcciones o propuestas editoriales, escríbenos a{' '}
          <a href={`mailto:${branding.contactEmail}`} className="text-accent hover:underline">
            {branding.contactEmail}
          </a>
          .
        </p>
        <p className="italic text-muted">
          [PLACEHOLDER] Formulario de contacto y datos de la empresa editora pendientes de
          confirmación antes de producción.
        </p>
      </div>
    </Container>
  )
}
