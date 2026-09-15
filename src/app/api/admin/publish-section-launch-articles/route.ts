import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import {
  publishAyusoCrashArticle,
  publishWomensWorldsPreviewArticle,
  publishCarapazSeasonArticle,
  publishUciTechRulesArticle,
  publishMtbWorldsRecapArticle,
} from '@/lib/content/uci-import'

/** Publica el primer artículo real de cada sección que todavía no tenía uno
 * (Última Hora, Ciclismo Femenino, Latinos, Tecnología, MTB y Gravel).
 * Seguro de correr más de una vez. */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const results = await Promise.all([
      publishAyusoCrashArticle(),
      publishWomensWorldsPreviewArticle(),
      publishCarapazSeasonArticle(),
      publishUciTechRulesArticle(),
      publishMtbWorldsRecapArticle(),
    ])
    return NextResponse.json({ ok: true, articles: results })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
