import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { runNewsDiscovery, runWeeklyContentPlanner, detectUpcomingRacePreviews } from '@/lib/content/automation'

const bodySchema = z.object({
  action: z.enum(['run-news-scan', 'pause', 'resume']),
})

/** §93: botones del panel /admin/automation — sesión de admin, nunca CRON_SECRET expuesto al navegador. */
export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })

  switch (parsed.data.action) {
    case 'run-news-scan': {
      const result = await runNewsDiscovery()
      await runWeeklyContentPlanner()
      const previews = await detectUpcomingRacePreviews()
      return NextResponse.json({ ...result, previews })
    }
    case 'pause':
      await prisma.siteSetting.upsert({
        where: { key: 'automationPaused' },
        update: { value: 'true' },
        create: { key: 'automationPaused', value: 'true' },
      })
      return NextResponse.json({ ok: true })
    case 'resume':
      await prisma.siteSetting.upsert({
        where: { key: 'automationPaused' },
        update: { value: 'false' },
        create: { key: 'automationPaused', value: 'false' },
      })
      return NextResponse.json({ ok: true })
  }
}
