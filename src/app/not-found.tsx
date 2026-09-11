import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        El contenido que buscas no existe o se ha movido.
      </p>
      <Link href="/" className="mt-6 rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
        Volver al inicio
      </Link>
    </Container>
  )
}
