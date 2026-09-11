import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const bodySchema = z.object({ email: z.string().email() })

/** §47: guarda el email; el adapter de proveedor real (Brevo/Mailchimp/
 * ConvertKit) se conecta aquí cuando NEWSLETTER_PROVIDER esté configurado. */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email, status: 'pending' },
    })
  } catch (error) {
    console.error('[newsletter] error guardando suscriptor:', error)
    return NextResponse.json({ error: 'No se pudo guardar la suscripción' }, { status: 500 })
  }

  // TODO: cuando NEWSLETTER_PROVIDER esté configurado, disparar el
  // adapter correspondiente aquí (doble opt-in vía proveedor externo).

  return NextResponse.json({ ok: true })
}
