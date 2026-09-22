import Image from 'next/image'

/**
 * Foto real solo cuando hay fuente con licencia clara (photoUrl +
 * photoCredit verificados a mano). Si no, silueta genérica con las
 * iniciales del corredor — nunca una cara generada por IA que finja
 * ser la suya. Ver docs/EDITORIAL-CHECKLIST.md.
 */
export function RiderAvatar({
  name,
  photoUrl,
  photoCredit,
  size = 240,
}: {
  name: string
  photoUrl?: string | null
  photoCredit?: string | null
  size?: number
}) {
  if (photoUrl) {
    return (
      <div>
        <Image
          src={photoUrl}
          alt={name}
          width={size}
          height={size}
          className="aspect-square w-full rounded-lg object-cover"
        />
        {photoCredit && <p className="mt-1 text-right text-[11px] text-muted">{photoCredit}</p>}
      </div>
    )
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden="true">
        <circle cx="50" cy="38" r="20" fill="white" />
        <path d="M10 100 C10 68 30 58 50 58 C70 58 90 68 90 100 Z" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-4xl font-bold text-lime">{initials || '?'}</span>
      </div>
    </div>
  )
}
