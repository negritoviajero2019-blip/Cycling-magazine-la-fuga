'use client'

import { useState } from 'react'

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold text-muted">Compartir:</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-border px-2 py-1 hover:border-accent hover:text-accent"
        >
          {link.label}
        </a>
      ))}
      <button
        onClick={() => {
          navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        className="rounded border border-border px-2 py-1 hover:border-accent hover:text-accent"
      >
        {copied ? 'Copiado ✓' : 'Copiar enlace'}
      </button>
    </div>
  )
}
