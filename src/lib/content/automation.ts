/**
 * Orquestación del pipeline editorial automatizado (§28, §57).
 * Cada función corresponde a un cron job y siempre registra su
 * ejecución en CronExecution, incluso cuando queda inactivo por falta
 * de configuración — nunca falla en silencio (§92).
 */
import { prisma } from '@/lib/db'
import { getAiProvider } from '@/lib/ai/provider'
import { NEWS_DISCOVERY_SYSTEM_PROMPT } from '@/lib/ai/prompts/news-discovery'
import { NewsDiscoveryResultSchema } from '@/lib/ai/schemas'
import { findLikelyDuplicate, type DedupCandidate } from './dedup'
import { classifyEditorialAction } from './confidence-score'
import { toJsonField, fromJsonField } from './json-field'

async function isAutomationPaused(): Promise<boolean> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'automationPaused' } })
  return setting?.value === 'true'
}

async function startExecution(jobName: string) {
  return prisma.cronExecution.create({ data: { jobName, status: 'running' } })
}

async function finishExecution(
  id: number,
  status: 'success' | 'error' | 'skipped',
  extra: { itemsFound?: number; articlesCreated?: number; errorLog?: string } = {},
) {
  await prisma.cronExecution.update({
    where: { id },
    data: { status, finishedAt: new Date(), ...extra },
  })
}

export async function runNewsDiscovery() {
  const execution = await startExecution('news-discovery')

  if (await isAutomationPaused()) {
    await finishExecution(execution.id, 'skipped', { errorLog: 'Automatización pausada manualmente.' })
    return { status: 'skipped' as const }
  }

  const provider = await getAiProvider()
  if (!provider.isConfigured) {
    await finishExecution(execution.id, 'skipped', {
      errorLog: 'ANTHROPIC_API_KEY no configurado — automatización inactiva.',
    })
    return { status: 'skipped' as const }
  }

  try {
    const result = await provider.generateStructured({
      task: 'news-discovery',
      systemPrompt: NEWS_DISCOVERY_SYSTEM_PROMPT,
      userInput:
        'Busca los acontecimientos más importantes de las últimas horas en el ciclismo profesional (WorldTour, Grand Tours, clásicas, ciclismo femenino, fichajes).',
      schema: NewsDiscoveryResultSchema,
      allowWebSearch: true,
    })

    const existing = await prisma.newsCandidate.findMany({
      where: { status: { in: ['new', 'reviewing', 'approved'] } },
      select: { id: true, headline: true, entities: true, eventDate: true },
    })
    const existingForDedup: DedupCandidate[] = existing.map((c) => ({
      id: c.id,
      headline: c.headline,
      entities: fromJsonField<string[]>(c.entities, []),
      eventDate: c.eventDate,
    }))

    const duplicate = findLikelyDuplicate(
      { id: 'new', headline: result.headline, entities: result.entities, eventDate: result.eventDate ? new Date(result.eventDate) : null },
      existingForDedup,
    )

    const editorialAction = classifyEditorialAction({
      confidenceScore: 0, // se recalcula tras fact-check (tarea separada)
      isSensitiveTopic: false,
      isRumor: result.isRumor,
      hasCopyrightIssue: false,
      isDuplicate: Boolean(duplicate),
    })

    await prisma.newsCandidate.create({
      data: {
        headline: result.headline,
        summary: result.summary,
        sourceUrls: toJsonField(result.sourceUrls),
        sourceNames: toJsonField(result.sourceNames),
        eventDate: result.eventDate ? new Date(result.eventDate) : null,
        category: result.category,
        entities: toJsonField(result.entities),
        status: duplicate ? 'duplicate' : 'new',
        duplicateOfId: duplicate ? Number(duplicate.id) : null,
        editorialAction,
      },
    })

    await finishExecution(execution.id, 'success', { itemsFound: 1 })
    return { status: 'success' as const }
  } catch (error) {
    await finishExecution(execution.id, 'error', { errorLog: String(error) })
    return { status: 'error' as const }
  }
}

/** §25: vigila la cuota semanal (Lun/Mié/Vie/Dom) sin forzar noticias falsas. */
export async function runWeeklyContentPlanner() {
  const execution = await startExecution('weekly-content-planner')

  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const publishedThisWeek = await prisma.article.count({
    where: { status: { in: ['published', 'updated'] }, publishedAt: { gte: startOfWeek } },
  })

  const pendingCandidates = await prisma.newsCandidate.count({
    where: { status: { in: ['new', 'approved'] }, editorialAction: { not: 'do_not_publish' } },
  })

  await finishExecution(execution.id, 'success', {
    itemsFound: pendingCandidates,
    articlesCreated: publishedThisWeek,
  })

  return { publishedThisWeek, pendingCandidates, quotaMet: publishedThisWeek >= 4 }
}

/** Publica NewsCandidate/Article programados cuya fecha ya llegó. */
export async function runScheduledPublisher() {
  const execution = await startExecution('scheduled-publisher')

  try {
    const due = await prisma.article.findMany({
      where: { status: 'scheduled', publishedAt: { lte: new Date() } },
      select: { id: true },
    })

    if (due.length > 0) {
      await prisma.article.updateMany({
        where: { id: { in: due.map((a) => a.id) } },
        data: { status: 'published' },
      })
    }

    await finishExecution(execution.id, 'success', { articlesCreated: due.length })
    return { published: due.length }
  } catch (error) {
    await finishExecution(execution.id, 'error', { errorLog: String(error) })
    return { published: 0 }
  }
}
