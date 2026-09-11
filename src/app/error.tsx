'use client'

import { Container } from '@/components/ui/Container'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-6xl font-bold text-breaking">500</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Algo ha fallado</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Ha ocurrido un error inesperado. Ya hemos sido notificados.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Reintentar
      </button>
    </Container>
  )
}
