import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({
  title: 'Términos y condiciones',
  description: `Condiciones de uso de ${branding.name}.`,
  path: '/terms',
})

export default function TermsPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-2 font-heading text-3xl font-bold">Términos y condiciones</h1>
      <p className="mb-6 text-xs text-muted">Última actualización: {branding.legal.lastUpdatedTerms}</p>
      <div className="space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">1. Objeto y aceptación</h2>
          <p>
            Estos términos regulan el acceso y uso de {branding.name} ({branding.url}). Al navegar
            el sitio aceptas estas condiciones; si no estás de acuerdo con alguna de ellas, te
            pedimos no continuar usándolo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">2. Titularidad</h2>
          <p>
            {branding.name} es un proyecto editorial independiente operado por una persona física
            con domicilio en México. No forma parte de ninguna empresa editora, federación
            ciclista, equipo profesional ni organizador de carreras; toda referencia a equipos,
            ciclistas o competiciones se hace con fines exclusivamente informativos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">3. Propiedad intelectual</h2>
          <p>
            Los textos, análisis y la estructura editorial del sitio son propiedad de {branding.name}
            {' '}salvo que se indique lo contrario. Puedes citar fragmentos breves con fines
            informativos o educativos siempre que incluyas atribución y un enlace al artículo
            original; la reproducción total de artículos sin autorización previa no está
            permitida. Las imágenes de cabecera son ilustraciones generadas o compuestas para uso
            editorial del sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">4. Uso del sitio</h2>
          <p>
            Te pedimos usar el sitio de forma lícita: no intentar vulnerar su seguridad, no extraer
            contenido de forma masiva y automatizada sin autorización, y no usarlo para difundir
            contenido ilegal, difamatorio o que infrinja derechos de terceros, incluso si lo haces
            a través de comentarios o formularios habilitados en el sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">5. Contenido y enlaces de terceros</h2>
          <p>
            El sitio puede enlazar a fuentes externas (organizadores, equipos, medios, redes
            sociales) citadas como respaldo de la información publicada. No controlamos ni
            respaldamos necesariamente el contenido de esos sitios externos, y no somos
            responsables de su disponibilidad ni de sus propias políticas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">6. Uso de inteligencia artificial</h2>
          <p>
            Parte de nuestro proceso editorial se apoya en asistencia de inteligencia artificial,
            bajo un proceso de verificación e investigación con fuentes reales. Puedes leer el
            detalle completo en nuestra{' '}
            <a href="/editorial-policy" className="text-accent hover:underline">
              política editorial
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">7. Exención de responsabilidad</h2>
          <p>
            Trabajamos para que la información publicada sea precisa y esté verificada, pero el
            ciclismo profesional cambia con rapidez (resultados, alineaciones, calendarios): no
            garantizamos que el contenido esté siempre actualizado en tiempo real ni libre de
            errores. Cuando identificamos un error, lo corregimos y lo señalamos conforme a nuestra
            política editorial. El sitio se ofrece &ldquo;tal cual&rdquo;, sin garantías de ningún
            tipo sobre su disponibilidad ininterrumpida.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">8. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos para reflejar cambios en el sitio o en la
            normatividad aplicable. La fecha de la versión vigente aparece al inicio de esta
            página.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">9. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
            controversia derivada de su interpretación o cumplimiento se someterá a los tribunales
            competentes en México, salvo que la ley aplicable disponga otra cosa.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">10. Contacto</h2>
          {branding.contactEmail ? (
            <p>
              Para dudas sobre estos términos, escríbenos a{' '}
              <a href={`mailto:${branding.contactEmail}`} className="text-accent hover:underline">
                {branding.contactEmail}
              </a>
              .
            </p>
          ) : (
            <p className="text-muted">
              Consulta nuestros canales vigentes en la página de{' '}
              <a href="/contact" className="text-accent hover:underline">
                contacto
              </a>
              .
            </p>
          )}
        </section>
      </div>
    </Container>
  )
}
