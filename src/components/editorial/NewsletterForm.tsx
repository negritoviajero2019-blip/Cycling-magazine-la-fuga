'use client'

import { useState } from 'react'

/**
 * §47: infraestructura frontend lista, sin proveedor conectado aún.
 * El POST llega a /api/public/newsletter, que guarda el email y deja
 * preparado el adapter para Brevo/Mailchimp/ConvertKit (§ ver esa ruta).
 */
export function NewsletterForm({
  dark = false,
  submitLabel = 'Suscribirme',
  placeholder = 'tu@email.com',
}: {
  dark?: boolean
  submitLabel?: string
  placeholder?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className={`text-sm ${dark ? 'text-lime' : 'text-success'}`}>
        Gracias, revisa tu email para confirmar la suscripción.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`min-h-[48px] flex-1 rounded-full border px-5 text-sm focus:outline-none focus:ring-2 ${
          dark
            ? 'border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:ring-lime'
            : 'border-border bg-background text-ink focus:ring-accent'
        }`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-[48px] rounded-full bg-lime px-6 text-sm font-bold text-primary transition-transform duration-200 ease-editorial hover:-translate-y-0.5 disabled:opacity-50"
      >
        {status === 'loading' ? 'Enviando...' : submitLabel}
      </button>
      {status === 'error' && <p className="text-xs text-breaking">Algo falló, inténtalo de nuevo.</p>}
    </form>
  )
}
