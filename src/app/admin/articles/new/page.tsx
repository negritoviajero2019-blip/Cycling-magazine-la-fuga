import { AdminShell } from '@/components/admin/AdminShell'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const [categories, authors, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <AdminShell>
      <h1 className="mb-6 font-heading text-2xl font-bold">Nuevo artículo</h1>
      <ArticleForm categories={categories} authors={authors} tags={tags} />
    </AdminShell>
  )
}
