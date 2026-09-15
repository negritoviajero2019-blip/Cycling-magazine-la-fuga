import { NewsletterForm } from './NewsletterForm'

/**
 * Panel oscuro de newsletter (upgrade UI, agosto 2026) — tratamiento de
 * alto impacto para el homepage, con titular grande. La versión
 * compacta del formulario (footer, pie de artículo) usa NewsletterForm
 * directamente sin este envoltorio.
 */
export function NewsletterSection() {
  return (
    <section className="my-10 overflow-hidden rounded-lg bg-primary px-6 py-12 text-white sm:px-10 sm:py-16">
      <span className="mb-4 inline-block rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
        Newsletter
      </span>
      <h2 className="max-w-2xl font-heading text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
        El ciclismo no se detiene. Tú tampoco tienes que perderte nada.
      </h2>
      <p className="mt-4 max-w-lg text-white/65">
        Las noticias más importantes, análisis, MTB y gravel, y grandes historias del ciclismo
        profesional directamente en tu correo.
      </p>
      <div className="mt-8 max-w-lg">
        <NewsletterForm dark submitLabel="Quiero recibirlo" placeholder="Tu correo electrónico" />
      </div>
    </section>
  )
}
