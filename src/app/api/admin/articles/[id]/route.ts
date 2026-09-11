import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { articleInputSchema } from '@/lib/content/article-input'
import { estimateReadingTime } from '@/lib/content/reading-time'

interface Params {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const article = await prisma.article.findUnique({
    where: { id: Number(params.id) },
    include: { tags: true },
  })
  if (!article) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const parsed = articleInputSchema.partial().safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { tagIds, publishedAt, content, ...data } = parsed.data
  const articleId = Number(params.id)
  const existing = await prisma.article.findUnique({ where: { id: articleId } })
  if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const becomingPublished = data.status === 'published' && existing.status !== 'published'

  const updated = await prisma.article.update({
    where: { id: articleId },
    data: {
      ...data,
      ...(content ? { content, readingTime: estimateReadingTime(content) } : {}),
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      ...(becomingPublished && !publishedAt ? { publishedAt: new Date() } : {}),
      ...(tagIds ? { tags: { set: tagIds.map((id) => ({ id })) } } : {}),
      status: existing.status === 'published' && data.status && data.status !== existing.status ? 'updated' : data.status,
    },
  })

  // §41: registrar corrección cuando un artículo publicado cambia sustancialmente.
  if (existing.status === 'published' && (content || data.title)) {
    await prisma.articleRevision.create({
      data: { articleId, summary: 'Contenido actualizado desde el panel de administración.' },
    })
  }

  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.article.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
