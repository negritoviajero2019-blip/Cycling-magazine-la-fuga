'use client'

import { useEffect, useState } from 'react'

type Vote = 'like' | 'dislike' | null

/** Namespace propio en localStorage para no chocar con otras claves del sitio. */
function storageKey(slug: string) {
  return `la-fuga-reaction-${slug}`
}

/**
 * 👍/👎 por artículo — señal editorial simple sobre qué funciona,
 * sin cuentas de usuario (ver /api/public/articles/[slug]/react). El
 * voto de este navegador se recuerda en localStorage para no poder
 * votar dos veces sin querer; tocar el mismo botón otra vez quita el
 * voto. Los contadores del servidor no se leen de vuelta tras votar
 * (se actualizan de forma optimista) para no depender de una segunda
 * petición.
 */
export function LikeDislike({
  slug,
  initialLikes,
  initialDislikes,
}: {
  slug: string
  initialLikes: number
  initialDislikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [vote, setVote] = useState<Vote>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(slug))
      if (stored === 'like' || stored === 'dislike') setVote(stored)
    } catch {
      // localStorage no disponible (modo privado, etc.) — se vota igual, solo sin persistencia.
    }
  }, [slug])

  async function handleVote(type: 'like' | 'dislike') {
    if (pending) return
    setPending(true)

    const previous = vote
    const next: Vote = previous === type ? null : type

    // Actualización optimista de los contadores visibles.
    if (previous === 'like') setLikes((n) => n - 1)
    if (previous === 'dislike') setDislikes((n) => n - 1)
    if (next === 'like') setLikes((n) => n + 1)
    if (next === 'dislike') setDislikes((n) => n + 1)
    setVote(next)

    try {
      const res = await fetch(`/api/public/articles/${slug}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, previous }),
      })
      if (!res.ok) throw new Error('request failed')
      try {
        if (next) localStorage.setItem(storageKey(slug), next)
        else localStorage.removeItem(storageKey(slug))
      } catch {
        // sin persistencia local — el voto de este clic ya se contó en el servidor.
      }
    } catch {
      // Revertir el optimismo si la petición falló.
      if (previous === 'like') setLikes((n) => n + 1)
      if (previous === 'dislike') setDislikes((n) => n + 1)
      if (next === 'like') setLikes((n) => n - 1)
      if (next === 'dislike') setDislikes((n) => n - 1)
      setVote(previous)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-muted">¿Te sirvió este artículo?</span>
      <button
        type="button"
        onClick={() => handleVote('like')}
        aria-pressed={vote === 'like'}
        aria-label="Me gusta"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          vote === 'like'
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-border text-ink hover:border-accent hover:text-accent'
        }`}
      >
        <svg viewBox="0 0 24 24" fill={vote === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M7 11v9H3v-9h4Zm0 0 4.5-7.5a1.5 1.5 0 0 1 2.7.9V9h4.6a2 2 0 0 1 1.96 2.4l-1.2 6A2 2 0 0 1 17.6 19H7" />
        </svg>
        {likes}
      </button>
      <button
        type="button"
        onClick={() => handleVote('dislike')}
        aria-pressed={vote === 'dislike'}
        aria-label="No me gusta"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          vote === 'dislike'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border text-ink hover:border-primary hover:text-primary'
        }`}
      >
        <svg viewBox="0 0 24 24" fill={vote === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 rotate-180" aria-hidden="true">
          <path d="M7 11v9H3v-9h4Zm0 0 4.5-7.5a1.5 1.5 0 0 1 2.7.9V9h4.6a2 2 0 0 1 1.96 2.4l-1.2 6A2 2 0 0 1 17.6 19H7" />
        </svg>
        {dislikes}
      </button>
    </div>
  )
}
