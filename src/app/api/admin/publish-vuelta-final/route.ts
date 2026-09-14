import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { publishVueltaFinalArticle } from '@/lib/content/uci-import'

/** Publica el artículo del desenlace de la Vuelta 2026 y los resultados
 * estructurados (general final, últimas etapas, clasificaciones). */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const result = await publishVueltaFinalArticle()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
