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
          resultados, análisis y la actualidad del WorldTour, los Grand Tours, las clásicas, el
          ciclismo femenino, el MTB y el gravel.
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
        <p>
          {branding.name} nace en 2026 como un proyecto editorial independiente, sin vínculo con
          ninguna federación, equipo profesional u organizador de carreras. Está operado por una
          persona física con base en México, con un proceso editorial que combina investigación
          humana con asistencia de inteligencia artificial bajo supervisión y verificación en cada
          publicación — el detalle completo está en nuestra{' '}
          <a href="/editorial-policy" className="text-accent hover:underline">
            política editorial
          </a>
          .
        </p>
        <p>
          Para conocer cómo tratamos tus datos personales o las condiciones de uso del sitio,
          consulta nuestro{' '}
          <a href="/privacy-policy" className="text-accent hover:underline">
            aviso de privacidad
          </a>{' '}
          y nuestros{' '}
          <a href="/terms" className="text-accent hover:underline">
            términos y condiciones
          </a>
          . Si quieres contactarnos, la vía está en{' '}
          <a href="/contact" className="text-accent hover:underline">
            contacto
          </a>
          .
        </p>
      </div>
    </Container>
  )
}
