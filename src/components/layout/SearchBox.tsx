'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBox({ className = '' }: { className?: string }) {
  const router = useRouter()
  const [q, setQ] = useState('')

  return (
    <form
      role="search"
      className={`flex items-center ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Buscar
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar noticias, ciclistas, equipos..."
        className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </form>
  )
}
