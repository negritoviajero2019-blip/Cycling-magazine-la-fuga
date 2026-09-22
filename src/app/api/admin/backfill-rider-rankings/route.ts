import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { backfillRiderRankings } from '@/lib/content/rider-rankings'

/**
 * Aplica el Top 30 del UCI World Ranking verificado (ver
 * rider-rankings.ts) y marca a los corredores retirados conocidos.
 * Idempotente: seguro de volver a correr.
 */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const result = await backfillRiderRankings()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
