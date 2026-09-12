'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/** Botón de un solo uso: carga calendario/equipos/ciclistas UCI reales
 * y publica el artículo de la etapa 19 de la Vuelta, corriendo dentro
 * del propio servidor de producción (sin SSH). Ver §uci-import. */
export function ImportUciButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/import-uci', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setResult(
        `✅ ${data.races.raceCount} carreras, ${data.races.teamCount} equipos, ${data.riders.riderCount} ciclistas, artículo "${data.article.slug}" publicado.`,
      )
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
        Carga el calendario, equipos y ciclistas reales de la UCI 2026, y publica el artículo de la
        etapa 19 de la Vuelta. Seguro de correr más de una vez.
      </p>
      <button
        onClick={run}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Cargando...' : 'Cargar datos UCI reales'}
      </button>
      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  )
}
