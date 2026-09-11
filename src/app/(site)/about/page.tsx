import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({
  title: 'Sobre nosotros',
  description: `Quiénes somos en ${branding.name}.`,
  path: '/about',
})

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Sobre nosotros</h1>
      <div className="space-y-4 text-sm leading-relaxed text-ink">
        <p>
          {branding.name} es una revista digital dedicada al ciclismo profesional: noticias,
          resultados, análisis, fichajes y la actualidad del WorldTour, los Grand Tours, las
          clásicas y el ciclismo femenino.
        </p>
        <p>
          Nuestro compromiso es la credibilidad: investigamos, verificamos con fuentes
          contrastadas y distinguimos siempre entre hecho confirmado y rumor. Puedes leer el
          detalle de cómo trabajamos en nuestra{' '}
          <a href="/editorial-policy" className="text-accent hover:underline">
            política editorial
          </a>
          .
        </p>
        <p className="italic text-muted">
          [PLACEHOLDER] Este texto se completará con la historia, el equipo y los datos legales
          definitivos de la publicación antes de salir a producción.
        </p>
      </div>
    </Container>
  )
}
