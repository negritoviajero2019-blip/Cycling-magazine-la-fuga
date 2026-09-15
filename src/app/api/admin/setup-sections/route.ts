import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { ensureSiteCategories } from '@/lib/content/uci-import'

/** Agrega "MTB y Gravel" y renombra "Fichajes" a "Latinos". Seguro de correr más de una vez. */
export async function POST() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const result = await ensureSiteCategories()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
