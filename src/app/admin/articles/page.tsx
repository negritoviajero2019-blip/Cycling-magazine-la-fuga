import Link from 'next/link'
import { AdminShell } from '@/components/admin/AdminShell'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, status: true, breakingNews: true, featured: true, updatedAt: true },
  })

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Artículos</h1>
        <Link href="/admin/articles/new" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
          + Nuevo artículo
        </Link>
      </div>

      <div className="overflow-hidden rounded border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Marcas</th>
              <th className="p-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="p-3">
                  <Link href={`/admin/articles/${article.id}/edit`} className="font-medium hover:text-accent">
                    {article.title}
                  </Link>
                </td>
                <td className="p-3 uppercase text-xs text-muted">{article.status}</td>
                <td className="p-3 text-xs">
                  {article.breakingNews && <span className="mr-1 text-breaking">● Breaking</span>}
                  {article.featured && <span className="text-accent">★ Destacado</span>}
                </td>
                <td className="p-3 text-xs text-muted">{new Intl.DateTimeFormat('es-ES').format(article.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
