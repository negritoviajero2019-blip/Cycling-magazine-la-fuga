'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/** Botón de un solo uso: publica el artículo del desenlace de la
 * Vuelta 2026 y sus resultados estructurados. */
export function PublishVueltaFinalButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/publish-vuelta-final', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setResult(`✅ Artículo "${data.slug}" publicado, ${data.resultCount} resultados cargados.`)
    } catch (e) {
      setResult(`❌ ${e instanceof Error ? e.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="mb-6 rounded border border-border bg-background p-5">
      <p className="mb-3 text-sm text-muted">
        Publica el artículo del desenlace de la Vuelta 2026 (Enric Mas campeón) y carga la general
        final, últimas etapas y clasificaciones secundarias. Seguro de correr más de una vez.
      </p>
      <button
        onClick={run}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Publicando...' : 'Publicar cierre de la Vuelta'}
      </button>
      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  )
}
