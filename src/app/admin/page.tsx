import { AdminShell } from '@/components/admin/AdminShell'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [published, drafts, scheduled, breaking, recent] = await Promise.all([
    prisma.article.count({ where: { status: { in: ['published', 'updated'] } } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.article.count({ where: { status: 'scheduled' } }),
    prisma.article.count({ where: { breakingNews: true, status: { in: ['published', 'updated'] } } }),
    prisma.article.findMany({ orderBy: { updatedAt: 'desc' }, take: 8, select: { id: true, title: true, status: true, updatedAt: true } }),
  ])

  const stats = [
    { label: 'Publicados', value: published },
    { label: 'Borradores', value: drafts },
    { label: 'Programados', value: scheduled },
    { label: 'Breaking news activas', value: breaking },
  ]

  return (
    <AdminShell>
      <h1 className="mb-6 font-heading text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded border border-border bg-background p-4">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-heading text-lg font-bold">Últimas modificaciones</h2>
      <div className="overflow-hidden rounded border border-border bg-background">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {recent.map((article) => (
              <tr key={article.id}>
                <td className="p-3">
                  <a href={`/admin/articles/${article.id}/edit`} className="hover:text-accent">
                    {article.title}
                  </a>
                </td>
                <td className="p-3 text-xs uppercase text-muted">{article.status}</td>
                <td className="p-3 text-right text-xs text-muted">
                  {new Intl.DateTimeFormat('es-ES').format(article.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
