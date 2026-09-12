import { AdminShell } from '@/components/admin/AdminShell'
import { AutomationPanel } from '@/components/admin/AutomationPanel'
import { ImportUciButton } from '@/components/admin/ImportUciButton'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AutomationPage() {
  const [pausedSetting, executions, candidates] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'automationPaused' } }),
    prisma.cronExecution.findMany({ orderBy: { startedAt: 'desc' }, take: 15 }),
    prisma.newsCandidate.findMany({ orderBy: { detectedAt: 'desc' }, take: 15 }),
  ])

  const isPaused = pausedSetting?.value === 'true'
  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY)

  return (
    <AdminShell>
      <h1 className="mb-6 font-heading text-2xl font-bold">Automatización</h1>

      <ImportUciButton />

      <AutomationPanel isPaused={isPaused} aiConfigured={aiConfigured} />

      <h2 className="mb-3 mt-8 font-heading text-lg font-bold">Candidatos a noticia</h2>
      <div className="overflow-hidden rounded border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Titular</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acción editorial</th>
              <th className="p-3">Detectado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted">
                  Sin candidatos todavía.
                </td>
              </tr>
            )}
            {candidates.map((c) => (
              <tr key={c.id}>
                <td className="p-3">{c.headline}</td>
                <td className="p-3 text-xs uppercase text-muted">{c.status}</td>
                <td className="p-3 text-xs uppercase text-muted">{c.editorialAction || '—'}</td>
                <td className="p-3 text-xs text-muted">{new Intl.DateTimeFormat('es-ES').format(c.detectedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-8 font-heading text-lg font-bold">Últimas ejecuciones</h2>
      <div className="overflow-hidden rounded border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Job</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Inicio</th>
              <th className="p-3">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {executions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted">
                  Todavía no se ha ejecutado ningún job.
                </td>
              </tr>
            )}
            {executions.map((exec) => (
              <tr key={exec.id}>
                <td className="p-3">{exec.jobName}</td>
                <td className="p-3 text-xs uppercase text-muted">{exec.status}</td>
                <td className="p-3 text-xs text-muted">{new Intl.DateTimeFormat('es-ES').format(exec.startedAt)}</td>
                <td className="p-3 text-xs text-muted">{exec.errorLog || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
