import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, categories, authors, tags] = await Promise.all([
    prisma.article.findUnique({ where: { id: Number(params.id) }, include: { tags: true } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!article) notFound()

  return (
    <AdminShell>
      <h1 className="mb-6 font-heading text-2xl font-bold">Editar artículo</h1>
      <ArticleForm
        categories={categories}
        authors={authors}
        tags={tags}
        initial={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          subtitle: article.subtitle,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          authorId: article.authorId,
          status: article.status,
          breakingNews: article.breakingNews,
          featured: article.featured,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          tagIds: article.tags.map((t) => t.id),
        }}
      />
    </AdminShell>
  )
}
