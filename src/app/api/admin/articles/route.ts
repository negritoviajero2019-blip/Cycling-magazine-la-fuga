import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { articleInputSchema } from '@/lib/content/article-input'
import { estimateReadingTime } from '@/lib/content/reading-time'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: { id: true, slug: true, title: true, status: true, breakingNews: true, featured: true, updatedAt: true, publishedAt: true },
  })
  return NextResponse.json(articles)
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const parsed = articleInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { tagIds, publishedAt, ...data } = parsed.data

  const existing = await prisma.article.findUnique({ where: { slug: data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un artículo con ese slug' }, { status: 409 })
  }

  const article = await prisma.article.create({
    data: {
      ...data,
      readingTime: estimateReadingTime(data.content),
      publishedAt: data.status === 'published' ? new Date(publishedAt || Date.now()) : publishedAt ? new Date(publishedAt) : null,
      tags: { connect: tagIds.map((id) => ({ id })) },
    },
  })

  return NextResponse.json(article, { status: 201 })
}
