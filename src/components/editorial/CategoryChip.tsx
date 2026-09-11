import Link from 'next/link'

/**
 * Chip de categoría en píldora (upgrade UI, agosto 2026): relleno lima
 * sólido con texto oscuro — el lima se reserva para este tipo de
 * relleno, nunca como color de texto suelto sobre fondo claro (falla
 * contraste). Sustituye al enlace de texto plano que se usaba antes.
 */
export function CategoryChip({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary transition-transform duration-200 hover:-translate-y-0.5"
    >
      {name}
    </Link>
  )
}
