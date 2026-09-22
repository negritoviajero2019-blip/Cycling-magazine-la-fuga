import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { backfillCoreRiderProfiles } from '@/lib/content/rider-profiles'

/**
 * Aplica los perfiles de corredor verificados a mano (ver
 * rider-profiles.ts) — pensado para correr desde el panel de admin en
 * producción, sin SSH. Idempotente: seguro de volver a correr.
 */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const riders = await backfillCoreRiderProfiles()
    return NextResponse.json({ ok: true, riders })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
