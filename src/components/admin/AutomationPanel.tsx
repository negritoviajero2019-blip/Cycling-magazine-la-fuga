'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AutomationPanel({ isPaused, aiConfigured }: { isPaused: boolean; aiConfigured: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function trigger(action: 'run-news-scan' | 'pause' | 'resume') {
    setLoading(action)
    await fetch('/api/admin/automation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="rounded border border-border bg-background p-5">
      {!aiConfigured && (
        <p className="mb-4 rounded bg-warning/10 p-3 text-sm text-warning">
          ANTHROPIC_API_KEY no configurado — la automatización está inactiva. Añádelo en las
          variables de entorno para activar la búsqueda y generación real de noticias.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => trigger('run-news-scan')}
          disabled={loading !== null}
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading === 'run-news-scan' ? 'Buscando...' : 'Run News Scan'}
        </button>
        {isPaused ? (
          <button
            onClick={() => trigger('resume')}
            disabled={loading !== null}
            className="rounded border border-border px-4 py-2 text-sm font-semibold text-success"
          >
            Reanudar automatización
          </button>
        ) : (
          <button
            onClick={() => trigger('pause')}
            disabled={loading !== null}
            className="rounded border border-border px-4 py-2 text-sm font-semibold text-breaking"
          >
            Pause Automation
          </button>
        )}
      </div>
    </div>
  )
}
