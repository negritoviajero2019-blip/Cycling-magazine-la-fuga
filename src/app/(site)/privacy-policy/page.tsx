import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const metadata = buildMetadata({
  title: 'Aviso de privacidad',
  description: `Cómo trata ${branding.name} tus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.`,
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-2 font-heading text-3xl font-bold">Aviso de privacidad</h1>
      <p className="mb-6 text-xs text-muted">Última actualización: {branding.legal.lastUpdatedPrivacy}</p>
      <div className="space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">1. Identidad del responsable</h2>
          <p>
            {branding.name} es un proyecto editorial independiente operado por{' '}
            {branding.legal.holderName}, una persona física con domicilio en México. Por tratarse
            de un proyecto personal, no publicamos un domicilio físico completo por razones de
            seguridad; el canal de contacto oficial para cualquier asunto relacionado con tus datos
            personales es el correo electrónico indicado en la sección 7 de este aviso.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">2. Datos personales que recabamos</h2>
          <p>Dependiendo de cómo uses el sitio, podemos recabar:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas
              visitadas y tiempo de permanencia, recabados de forma agregada mediante herramientas
              de analítica web.
            </li>
            <li>
              <strong>Correo electrónico</strong>, si te suscribes voluntariamente a nuestro boletín
              (newsletter).
            </li>
            <li>
              <strong>Nombre y correo electrónico</strong>, si nos escribes a través del correo de
              contacto.
            </li>
            <li>
              <strong>Datos técnicos de servidor</strong> (registros de acceso), generados
              automáticamente por el funcionamiento del sitio.
            </li>
            <li>
              <strong>Identificadores de cookies publicitarias (cuando la publicidad esté activa):</strong>{' '}
              si en el futuro activamos Google AdSense, y solo si aceptas las cookies no esenciales
              en nuestro banner, Google puede usar cookies u otros identificadores para mostrar
              anuncios y medir su desempeño. Ver la sección 5 para más detalle.
            </li>
          </ul>
          <p>No recabamos datos personales sensibles (salud, origen étnico, creencias, etc.).</p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">3. Finalidades del tratamiento</h2>
          <p>
            <strong>Finalidades primarias</strong> (necesarias para la relación contigo, no
            requieren consentimiento adicional):
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Mostrarte el contenido del sitio y garantizar su funcionamiento técnico.</li>
            <li>Enviarte el boletín editorial, únicamente si te suscribiste voluntariamente.</li>
            <li>Responder a tus mensajes cuando nos contactas.</li>
          </ul>
          <p>
            <strong>Finalidades secundarias</strong> (opcionales, puedes oponerte sin que afecte el
            servicio principal):
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Analítica agregada para entender qué contenido interesa más y mejorar la línea
              editorial.
            </li>
            <li>Eventuales comunicaciones sobre novedades del proyecto.</li>
            <li>
              Mostrar publicidad de terceros (Google AdSense), una vez que esté activa en el sitio
              y solo si aceptaste las cookies no esenciales en el banner.
            </li>
          </ul>
          <p>
            Si no deseas que tus datos se usen para finalidades secundarias, puedes indicarlo en
            cualquier momento escribiendo al correo de contacto, o rechazando las cookies no
            esenciales en el banner del sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">4. Fundamento legal</h2>
          <p>
            Este tratamiento se realiza conforme a la Ley Federal de Protección de Datos Personales
            en Posesión de los Particulares (LFPDPPP) y su Reglamento, bajo la supervisión del
            Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos
            Personales (INAI) y las autoridades que, en su caso, asuman sus funciones.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">5. Transferencia de datos y publicidad de terceros</h2>
          <p>
            No vendemos tus datos personales. Utilizamos proveedores de infraestructura tecnológica
            (alojamiento del sitio, analítica web y, en su caso, envío del boletín) que procesan
            datos técnicamente en nuestro nombre y están obligados contractualmente a resguardarlos;
            esto no constituye una transferencia para fines distintos a los aquí descritos.
          </p>
          <p>
            Cuando activemos publicidad en el sitio mediante Google AdSense, Google podrá usar
            cookies y datos de navegación para mostrar anuncios personalizados o no personalizados,
            según la elección que hagas en nuestro banner de cookies. En ese caso, Google actúa como
            proveedor independiente sujeto a su propia{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              política de privacidad
            </a>{' '}
            y a su{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              política de anuncios
            </a>
            . Puedes gestionar la personalización de anuncios de Google desde{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              adssettings.google.com
            </a>
            , además de rechazar las cookies no esenciales en nuestro propio banner. Esta sección se
            ampliará con el detalle de cada cookie en cuanto la publicidad esté activa.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">6. Cookies</h2>
          <p>
            Usamos cookies técnicas (necesarias para el funcionamiento del sitio) y, solo si las
            aceptas expresamente en nuestro banner de consentimiento, cookies de analítica. Las
            cookies de publicidad (Google AdSense) todavía no están activas en el sitio; cuando lo
            estén, seguirán la misma regla: solo se cargarán si aceptas las cookies no esenciales.
            Puedes revisar y cambiar tu elección en cualquier momento desde &ldquo;Preferencias de
            cookies&rdquo; al pie de cualquier página. El detalle completo está en nuestra{' '}
            <a href="/cookie-policy" className="text-accent hover:underline">
              política de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">7. Derechos ARCO y cómo ejercerlos</h2>
          <p>
            Tienes derecho a Acceder a tus datos personales, Rectificarlos si son inexactos,
            Cancelarlos cuando consideres que no se requieren para alguna de las finalidades
            señaladas, y Oponerte a su tratamiento para fines específicos (derechos ARCO).
            Asimismo, puedes revocar en cualquier momento el consentimiento que nos hayas otorgado
            y limitar el uso o divulgación de tus datos.
          </p>
          {branding.contactEmail ? (
            <p>
              Para ejercer cualquiera de estos derechos, escríbenos a{' '}
              <a href={`mailto:${branding.contactEmail}`} className="text-accent hover:underline">
                {branding.contactEmail}
              </a>{' '}
              indicando tu nombre, el derecho que deseas ejercer y, de ser posible, copia de una
              identificación que permita acreditar tu identidad. Responderemos dentro de los plazos
              que establece la LFPDPPP.
            </p>
          ) : (
            <p className="text-muted">
              Estamos habilitando un correo dedicado para solicitudes de derechos ARCO. Mientras
              tanto, puedes escribirnos a través de los canales listados en la página de{' '}
              <a href="/contact" className="text-accent hover:underline">
                contacto
              </a>
              .
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-bold">8. Cambios a este aviso</h2>
          <p>
            Podemos actualizar este aviso de privacidad para reflejar cambios en el sitio o en la
            normatividad aplicable. La fecha de la versión vigente aparece al inicio de esta
            página; los cambios sustanciales se anunciarán de forma visible en el sitio.
          </p>
        </section>
      </div>
    </Container>
  )
}
