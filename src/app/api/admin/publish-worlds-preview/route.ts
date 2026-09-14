import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { publishWorldsPreviewArticle } from '@/lib/content/uci-import'

/** Publica la previa real del Mundial de ruta 2026 (Montreal). */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const result = await publishWorldsPreviewArticle()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
