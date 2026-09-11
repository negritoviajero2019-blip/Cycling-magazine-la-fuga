import { branding } from '@/lib/config/branding'

/**
 * §24: fallback visual cuando no existe fotografía con licencia clara.
 * Nunca se sacrifica el copyright por tener una imagen — se muestra
 * esta tarjeta de marca en su lugar.
 */
export function EditorialFallbackCard({
  label,
  className = '',
  variant = 'default',
}: {
  label: string
  className?: string
  /** "minimal" se usa cuando un titular real se superpone encima
   * (p. ej. Hero) — evita que el texto centrado choque con el overlay. */
  variant?: 'default' | 'minimal'
}) {
  if (variant === 'minimal') {
    return (
      <div className={`flex aspect-[16/9] w-full items-end justify-end bg-primary p-4 ${className}`}>
        <span className="text-xs uppercase tracking-widest text-white/30">{branding.name}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-primary px-6 text-center text-white ${className}`}
    >
      <span className="font-heading text-xl font-bold uppercase tracking-wide">{label}</span>
      <span className="text-xs uppercase tracking-widest text-white/60">{branding.name}</span>
    </div>
  )
}
