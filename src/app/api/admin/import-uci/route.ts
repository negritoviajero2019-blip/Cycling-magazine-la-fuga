import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { importUciRacesAndTeams, importUciRiders, publishVueltaStage19Article } from '@/lib/content/uci-import'

/**
 * Carga el calendario/equipos/ciclistas UCI reales y publica el
 * artículo de la etapa 19 de la Vuelta — pensado para correr una sola
 * vez desde el panel de admin en producción (evita depender de SSH,
 * cuyo directorio de build Hostinger puede podar entre despliegues).
 * Idempotente: seguro de volver a correr.
 */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const races = await importUciRacesAndTeams()
    const riders = await importUciRiders()
    const article = await publishVueltaStage19Article()

    return NextResponse.json({ ok: true, races, riders, article })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
