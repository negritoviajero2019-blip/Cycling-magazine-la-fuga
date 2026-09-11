import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({
  title: 'Política editorial',
  description: 'Cómo investigamos, verificamos y publicamos en ' + branding.name + '.',
  path: '/editorial-policy',
})

export default function EditorialPolicyPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Política editorial</h1>
      <div className="space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">Cómo investigamos</h2>
          <p>
            Priorizamos fuentes oficiales: organizadores de carrera, la UCI, equipos oficiales,
            comunicados de ciclistas por canales verificados, agencias de noticias y periodistas
            especializados de confianza. Toda información temporal (&ldquo;hoy&rdquo;, &ldquo;acaba de&rdquo;, &ldquo;última
            hora&rdquo;) se comprueba con una búsqueda actualizada antes de publicarse — nunca se
            afirma a partir de conocimiento no verificado.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">Cómo verificamos</h2>
          <p>
            Para noticias importantes buscamos confirmación independiente además de la fuente
            original. Cuando la información es un rumor, lo indicamos explícitamente como tal —
            nunca lo presentamos como hecho confirmado. En temas sensibles (salud, accidentes,
            dopaje, investigaciones legales) usamos lenguaje neutral y distinguimos entre
            acusación, investigación, sanción y hecho probado.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">Uso de inteligencia artificial</h2>
          <p>
            Parte de nuestro proceso de investigación, redacción y clasificación editorial se
            apoya en un sistema de IA (Claude, de Anthropic) trabajando con una política editorial
            estricta: no puede inventar hechos y debe declarar explícitamente cuándo no puede
            verificar algo. Todo contenido generado con asistencia de IA que trate temas sensibles
            pasa por revisión humana antes de publicarse.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">Correcciones</h2>
          <p>
            Cuando un artículo se actualiza de forma sustancial, lo indicamos con la fecha y hora
            de la actualización visible en el propio artículo.
          </p>
        </section>
      </div>
    </Container>
  )
}
