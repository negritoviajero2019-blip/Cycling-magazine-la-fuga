'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function formatResult(kind: 'import-uci' | 'publish' | 'generic', data: Record<string, unknown>): string {
  if (kind === 'import-uci') {
    const races = data.races as { raceCount: number; teamCount: number }
    const riders = data.riders as { riderCount: number }
    const article = data.article as { slug: string }
    return `${races.raceCount} carreras, ${races.teamCount} equipos, ${riders.riderCount} ciclistas, artículo "${article.slug}" publicado.`
  }
  if (kind === 'generic') return 'Listo.'
  const resultCountText = typeof data.resultCount === 'number' ? `, ${data.resultCount} resultados cargados` : ''
  return `Artículo "${data.slug}" publicado${resultCountText}.`
}

/** Botón genérico de un solo uso para acciones de publicación manual
 * del panel de admin (POST a una ruta protegida por sesión de admin,
 * sin depender de SSH). Reutilizado por cada artículo/carga puntual. */
export function PublishActionButton({
  endpoint,
  label,
  description,
  resultKind,
}: {
  endpoint: string
  label: string
  description: string
  resultKind: 'import-uci' | 'publish' | 'generic'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(endpoint, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setResult(`✅ ${formatResult(resultKind, data)}`)
    } catch (e) {
      setResult(`❌ ${e instanceof Error ? e.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="mb-6 rounded border border-border bg-background p-5">
      <p className="mb-3 text-sm text-muted">{description}</p>
      <button
        onClick={run}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Cargando...' : label}
      </button>
      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  )
}
