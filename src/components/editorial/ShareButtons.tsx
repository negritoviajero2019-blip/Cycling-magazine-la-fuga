'use client'

import { useEffect, useState } from 'react'

/**
 * Iconos propios en SVG (sin librería externa): trazos simples,
 * monocromos por defecto y coloreados solo al pasar el ratón — mismo
 * lenguaje visual minimalista del resto del sitio, en vez de insignias
 * multicolor de red social (el estilo "plugin de WordPress 2014" que
 * hacía ver el share row anterior anticuado).
 */
const ICONS: Record<string, JSX.Element> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.41a8.17 8.17 0 0 1 2.4 5.83c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.55 3.7-8.24 8.28-8.24Zm-4.5 4.58c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.13.17 1.72 2.7 4.23 3.71 2.1.85 2.52.68 2.98.64.45-.04 1.46-.59 1.67-1.17.2-.57.2-1.06.14-1.17-.06-.1-.23-.16-.48-.29-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.38-.78-1.88-.2-.48-.41-.42-.56-.43h-.6Z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.05 3.79 2.98 10.77c-1.23.49-1.22 1.17-.22 1.47l4.63 1.45 1.79 5.44c.22.6.36.84.74.84.3 0 .43-.14.6-.3l1.65-1.6 4.68 3.45c.86.48 1.48.23 1.7-.8l3.07-14.47c.3-1.26-.48-1.83-1.57-1.36Zm-3.36 3.66-8.4 7.6-.35 3.6-1.55-4.9 9.77-6.6c.46-.3.88-.14.53.16Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 3h-2.25C10.1 3 8.5 4.6 8.5 6.75V9H6.25a.25.25 0 0 0-.25.25v2.75c0 .14.11.25.25.25H8.5V21c0 .14.11.25.25.25h3a.25.25 0 0 0 .25-.25v-8.75h2.42c.13 0 .23-.09.25-.21l.4-2.75a.25.25 0 0 0-.25-.29h-2.82v-1.9c0-.53.43-.85.96-.85H14.75a.25.25 0 0 0 .25-.25V3.25A.25.25 0 0 0 14.75 3h-.25Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.24 3h2.9l-6.33 7.24L22.3 21h-5.83l-4.57-5.98L6.66 21H3.75l6.77-7.74L2.3 3h5.98l4.13 5.46L18.24 3Zm-1.02 16.2h1.6L7.85 4.7H6.13l11.09 14.5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.1V21H3.4V8.75Zm6.2 0h2.98v1.68h.04c.42-.77 1.43-1.58 2.95-1.58 3.15 0 3.73 2 3.73 4.6V21h-3.1v-5.9c0-1.4-.03-3.2-1.96-3.2-1.97 0-2.27 1.5-2.27 3.1V21H9.6V8.75Z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.4 5.1a3.5 3.5 0 0 1 5 5L16 11.5" />
      <path d="M13 17.5 11.6 18.9a3.5 3.5 0 0 1-5-5L8 12.5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 15V4" />
      <path d="M7.5 8.5 12 4l4.5 4.5" />
      <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" />
    </svg>
  ),
}

function IconButton({
  label,
  href,
  onClick,
  children,
}: {
  label: string
  href?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  const className =
    'flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent'
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={className}>
        <span className="h-[18px] w-[18px]">{children}</span>
      </a>
    )
  }
  return (
    <button onClick={onClick} aria-label={label} title={label} className={className}>
      <span className="h-[18px] w-[18px]">{children}</span>
    </button>
  )
}

/**
 * `compact`: icon-only, sin la etiqueta "Compartir" — pensado para ir
 * justo debajo del título (donde muchos lectores deciden compartir
 * antes de terminar de leer). El uso por defecto (pie del artículo)
 * lleva la etiqueta.
 */
export function ShareButtons({
  url,
  title,
  compact = false,
}: {
  url: string
  title: string
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const links = [
    { key: 'whatsapp', label: 'Compartir en WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { key: 'telegram', label: 'Compartir en Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { key: 'facebook', label: 'Compartir en Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { key: 'x', label: 'Compartir en X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { key: 'linkedin', label: 'Compartir en LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ]

  function copyLink() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {})
    } else {
      // Navegadores/contextos sin Clipboard API disponible.
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch {
        // Sin soporte alguno para copiar — el enlace sigue visible en la barra de direcciones.
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url })
    } catch {
      // El usuario canceló el share sheet — no es un error real.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!compact && <span className="mr-1 text-sm font-semibold text-muted">Compartir</span>}

      {canNativeShare && (
        <IconButton label="Compartir" onClick={nativeShare}>
          {ICONS.share}
        </IconButton>
      )}

      {links.map((link) => (
        <IconButton key={link.key} label={link.label} href={link.href}>
          {ICONS[link.key]}
        </IconButton>
      ))}

      <IconButton label={copied ? 'Enlace copiado' : 'Copiar enlace'} onClick={copyLink}>
        {copied ? ICONS.check : ICONS.link}
      </IconButton>
    </div>
  )
}
