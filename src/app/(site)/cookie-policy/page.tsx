import { Container } from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({ title: 'Política de cookies', description: 'Qué cookies usamos y para qué.', path: '/cookie-policy' })

export default function CookiePolicyPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Política de cookies</h1>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Al entrar al sitio te preguntamos si aceptas o rechazas las cookies no esenciales. Tu
          elección se guarda en tu propio navegador (no en nuestros servidores) y puedes cambiarla
          cuando quieras desde &ldquo;Preferencias de cookies&rdquo;, al pie de cualquier página.
        </p>
        <div>
          <h2 className="mb-2 font-heading text-lg font-bold">Cookies técnicas (siempre activas)</h2>
          <p>
            Imprescindibles para que el sitio funcione: recuerdan tu elección de cookies y
            mantienen la sesión si accedes como administrador. No requieren consentimiento porque
            no se usan para rastrear ni personalizar publicidad.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-heading text-lg font-bold">Cookies de analítica (solo si las aceptas)</h2>
          <p>
            Google Analytics, para entender qué contenido interesa más y mejorar el sitio. Solo se
            cargan después de que aceptes las cookies no esenciales en el banner.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-heading text-lg font-bold">Cookies de publicidad</h2>
          <p>
            Todavía no mostramos publicidad en el sitio. Cuando se active (Google AdSense),
            funcionará bajo la misma regla: solo se cargará si aceptas las cookies no esenciales,
            y esta política se actualizará con el detalle de cada cookie antes de activarla.
          </p>
        </div>
      </div>
    </Container>
  )
}
