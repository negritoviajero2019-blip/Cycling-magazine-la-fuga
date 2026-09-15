import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import {
  publishWorldsScheduleArticle,
  publishVdpLuxembourgArticle,
  publishQuintanaFroomeArticle,
  publishLombardiaPreviewArticle,
  publishWomensRankingChangeArticle,
  publishMtbWorldCupPreviewArticle,
  publishGravelWorldsPreviewArticle,
  publishBuitragoTejadaArticle,
  publishTarmacSl9Article,
} from '@/lib/content/batch-articles-sept'

/** Tanda de 10 artículos reales de septiembre 2026 (ver batch-articles-sept.ts). Seguro de correr más de una vez. */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const results = await Promise.all([
      publishWorldsScheduleArticle(),
      publishVdpLuxembourgArticle(),
      publishQuintanaFroomeArticle(),
      publishLombardiaPreviewArticle(),
      publishWomensRankingChangeArticle(),
      publishMtbWorldCupPreviewArticle(),
      publishGravelWorldsPreviewArticle(),
      publishBuitragoTejadaArticle(),
      publishTarmacSl9Article(),
    ])
    return NextResponse.json({ ok: true, articles: results })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
