import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import {
  publishPogacarBackOnBikeArticle,
  publishDelToroEvenepoelAnalysisArticle,
  publishLuxembourg2026Article,
  publishVanVleutenLegendArticle,
  publishLuxembourgStage1ResultArticle,
  publishDelToroProfileArticle,
  publishLuxembourgStage2ResultArticle,
  publishContadorSchleckRivalryArticle,
  publishWorldsTTOutsidersArticle,
  publishTransferMarket2027Article,
} from '@/lib/content/daily-news'

/**
 * Artículos publicados uno por uno a partir de la lista diaria de
 * noticias (ver daily-news.ts) — a diferencia de publish-batch-sept,
 * esta lista crece con cada artículo nuevo. Seguro de correr más de
 * una vez.
 */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const results = await Promise.all([
      publishPogacarBackOnBikeArticle(),
      publishDelToroEvenepoelAnalysisArticle(),
      publishLuxembourg2026Article(),
      publishVanVleutenLegendArticle(),
      publishLuxembourgStage1ResultArticle(),
      publishDelToroProfileArticle(),
      publishLuxembourgStage2ResultArticle(),
      publishContadorSchleckRivalryArticle(),
      publishWorldsTTOutsidersArticle(),
      publishTransferMarket2027Article(),
    ])
    return NextResponse.json({ ok: true, articles: results })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
