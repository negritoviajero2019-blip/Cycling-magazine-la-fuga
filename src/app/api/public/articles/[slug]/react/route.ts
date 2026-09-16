import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const bodySchema = z.object({
  type: z.enum(['like', 'dislike']),
  previous: z.enum(['like', 'dislike']).nullable(),
})

/**
 * Reacción 👍/👎 por artículo, sin cuentas de usuario. El navegador
 * decide y recuerda el voto anterior (localStorage, ver
 * LikeDislike.tsx) y lo manda aquí para que el servidor calcule el
 * delta correcto: señal editorial liviana sobre qué contenido
 * funciona, no una votación a prueba de fraude (igual de espíritu que
 * viewCount — ver schema.prisma).
 */
export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }
  const { type, previous } = parsed.data

  // Mismo tipo que el voto anterior = quitar el voto (toggle off).
  const next = previous === type ? null : type

  const likeDelta = (next === 'like' ? 1 : 0) - (previous === 'like' ? 1 : 0)
  const dislikeDelta = (next === 'dislike' ? 1 : 0) - (previous === 'dislike' ? 1 : 0)

  try {
    const article = await prisma.article.update({
      where: { slug: params.slug },
      data: {
        likeCount: { increment: likeDelta },
        dislikeCount: { increment: dislikeDelta },
      },
      select: { likeCount: true, dislikeCount: true },
    })
    return NextResponse.json({ ok: true, next, likeCount: article.likeCount, dislikeCount: article.dislikeCount })
  } catch (error) {
    console.error('[react] error actualizando reacción:', error)
    return NextResponse.json({ error: 'No se pudo registrar la reacción' }, { status: 500 })
  }
}
