import { NextResponse } from 'next/server'
import { isAuthorizedCronRequest } from '@/lib/auth/cron'
import { runNewsDiscovery } from '@/lib/content/automation'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const result = await runNewsDiscovery()
  return NextResponse.json(result)
}
