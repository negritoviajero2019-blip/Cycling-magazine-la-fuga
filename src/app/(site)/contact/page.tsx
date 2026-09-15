import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({ title: 'Contacto', description: 'Contacta con la redacción.', path: '/contact' })

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Contacto</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        {branding.contactEmail ? (
          <p>
            Para consultas de prensa, correcciones, propuestas editoriales o ejercer tus derechos
            sobre tus datos personales, escríbenos a{' '}
            <a href={`mailto:${branding.contactEmail}`} className="text-accent hover:underline">
              {branding.contactEmail}
            </a>
            .
          </p>
        ) : (
          <p className="text-muted">Estamos habilitando un correo de contacto dedicado. Vuelve a consultar esta página próximamente.</p>
        )}
        <p>
          {branding.name} es un proyecto editorial operado por una persona física (ver{' '}
          <a href="/about" className="text-accent hover:underline">
            Sobre nosotros
          </a>
          ). Para más detalle sobre cómo tratamos tus datos personales, consulta nuestro{' '}
          <a href="/privacy-policy" className="text-accent hover:underline">
            Aviso de Privacidad
          </a>
          .
        </p>
      </div>
    </Container>
  )
}
