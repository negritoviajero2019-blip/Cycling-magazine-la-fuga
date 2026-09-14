import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { publishCanadianClassicsArticle } from '@/lib/content/uci-import'

/** Publica el artículo de las clásicas canadienses (Quebec + Montreal
 * 2026) y sus resultados estructurados. */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const result = await publishCanadianClassicsArticle()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
