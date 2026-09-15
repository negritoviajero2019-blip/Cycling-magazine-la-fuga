import { AdminShell } from '@/components/admin/AdminShell'
import { AutomationPanel } from '@/components/admin/AutomationPanel'
import { PublishActionButton } from '@/components/admin/PublishActionButton'
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

      <PublishActionButton
        endpoint="/api/admin/setup-sections"
        label="Agregar MTB y Gravel / renombrar Fichajes a Latinos"
        description="Crea la sección MTB y Gravel y renombra Fichajes a Latinos, preservando los artículos ya vinculados. Seguro de correr más de una vez."
        resultKind="generic"
      />
      <PublishActionButton
        endpoint="/api/admin/import-uci"
        label="Cargar datos UCI reales"
        description="Carga el calendario, equipos y ciclistas reales de la UCI 2026, y publica el artículo de la etapa 19 de la Vuelta. Seguro de correr más de una vez."
        resultKind="import-uci"
      />
      <PublishActionButton
        endpoint="/api/admin/publish-vuelta-final"
        label="Publicar cierre de la Vuelta"
        description="Publica el artículo del desenlace de la Vuelta 2026 (Enric Mas campeón) y carga la general final, últimas etapas y clasificaciones secundarias. Seguro de correr más de una vez."
        resultKind="publish"
      />
      <PublishActionButton
        endpoint="/api/admin/publish-canadian-classics"
        label="Publicar clásicas canadienses"
        description="Publica el artículo de Quebec y Montreal 2026 (Evenepoel y Del Toro) y sus resultados. Seguro de correr más de una vez."
        resultKind="publish"
      />
      <PublishActionButton
        endpoint="/api/admin/publish-worlds-preview"
        label="Publicar previa del Mundial"
        description="Publica la previa del Mundial de ruta 2026 en Montreal (sin Pogačar, favoritos Evenepoel/Del Toro/Van der Poel). Seguro de correr más de una vez."
        resultKind="publish"
      />
      <PublishActionButton
        endpoint="/api/admin/publish-batch-sept"
        label="Publicar tanda de 10 artículos (septiembre)"
        description="Publica los artículos nuevos de la tanda de 10 (uno o dos por sección) conforme se van agregando. Seguro de correr más de una vez."
        resultKind="generic"
      />
      <PublishActionButton
        endpoint="/api/admin/publish-section-launch-articles"
        label="Publicar primer artículo de cada sección nueva"
        description="Publica un artículo real en cada sección que todavía no tenía uno: caída de Ayuso en Quebec (Última hora), previa del Mundial femenino (Ciclismo femenino), temporada de Richard Carapaz (Latinos), nuevas reglas técnicas UCI (Tecnología) y resultados del Mundial de MTB en Val di Sole (MTB y Gravel). Seguro de correr más de una vez."
        resultKind="generic"
      />

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
