/**
 * Bootstrap de producción — SOLO estructura editorial real, nunca
 * contenido ficticio (a diferencia de seed.ts, que está bloqueado en
 * producción a propósito). Crea: categorías base, un autor editorial,
 * el usuario admin (desde ADMIN_EMAIL/ADMIN_PASSWORD_HASH), y el flag
 * de automatización. Seguro de correr más de una vez (usa upsert).
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    ['ultima-hora', 'Última Hora'],
    ['grand-tours', 'Grand Tours'],
    ['clasicas', 'Clásicas'],
    ['fichajes', 'Fichajes'],
    ['ciclismo-femenino', 'Ciclismo Femenino'],
    ['tecnologia', 'Tecnología'],
    ['analisis', 'Análisis'],
  ] satisfies [string, string][]

  for (const [slug, name] of categories) {
    await prisma.category.upsert({ where: { slug }, update: {}, create: { slug, name } })
  }
  console.log(`✅ ${categories.length} categorías listas.`)

  await prisma.author.upsert({
    where: { slug: 'redaccion' },
    update: {},
    create: {
      slug: 'redaccion',
      name: 'Redacción La Fuga',
      bio: 'Equipo editorial de La Fuga — Cycling Magazine.',
      specialty: 'Ciclismo profesional',
      isAiAssisted: true,
    },
  })
  console.log('✅ Autor "Redacción La Fuga" listo.')

  const adminEmail = process.env.ADMIN_EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminEmail || !passwordHash) {
    throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD_HASH en las variables de entorno.')
  }
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: 'admin' },
    create: { email: adminEmail, name: 'Administrador', passwordHash, role: 'admin' },
  })
  console.log(`✅ Usuario admin (${adminEmail}) listo.`)

  await prisma.siteSetting.upsert({
    where: { key: 'automationPaused' },
    update: {},
    create: { key: 'automationPaused', value: 'false' },
  })
  console.log('✅ Configuración inicial lista.')

  console.log('🎉 Bootstrap de producción completado — sin contenido ficticio.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
