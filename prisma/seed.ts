/**
 * DATOS DE PRUEBA — NO PUBLICAR EN PRODUCCIÓN
 * Contenido ficticio únicamente para visualizar el sitio durante el
 * desarrollo (§75 del brief editorial). Nunca ejecutar este seed
 * contra la base de datos de producción.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seed de datos ficticios bloqueado en producción.')
  }

  console.log('⚠️  Sembrando DATOS DE PRUEBA — no representan noticias reales.')

  const author = await prisma.author.upsert({
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

  const categories = await Promise.all(
    (
      [
        ['ultima-hora', 'Última Hora'],
        ['grand-tours', 'Grand Tours'],
        ['clasicas', 'Clásicas'],
        ['latinos', 'Latinos'],
        ['ciclismo-femenino', 'Ciclismo Femenino'],
        ['mtb-gravel', 'MTB y Gravel'],
        ['tecnologia', 'Tecnología'],
        ['analisis', 'Análisis'],
      ] satisfies [string, string][]
    ).map(([slug, name]) =>
      prisma.category.upsert({
        where: { slug },
        update: {},
        create: { slug, name },
      }),
    ),
  )
  const [catUltimaHora, catGrandTours, , catLatinos] = categories

  const team = await prisma.team.upsert({
    where: { slug: 'equipo-demo-ciclismo' },
    update: {},
    create: {
      slug: 'equipo-demo-ciclismo',
      name: 'Equipo Demo Ciclismo (DATO FICTICIO)',
      country: 'ES',
      category: 'worldtour',
    },
  })

  const rider = await prisma.rider.upsert({
    where: { slug: 'ciclista-demo' },
    update: {},
    create: {
      slug: 'ciclista-demo',
      name: 'Ciclista Demo (DATO FICTICIO)',
      nationality: 'ES',
      specialty: 'Escalador',
      currentTeamId: team.id,
      bio: 'Perfil de ejemplo generado únicamente para desarrollo.',
    },
  })

  const race = await prisma.race.upsert({
    where: { slug: 'gran-vuelta-demo-2026' },
    update: {},
    create: {
      slug: 'gran-vuelta-demo-2026',
      name: 'Gran Vuelta Demo (DATO FICTICIO)',
      year: 2026,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-22'),
      country: 'ES',
      category: 'grand-tour',
      numStages: 21,
      status: 'finished',
    },
  })

  await prisma.race.upsert({
    where: { slug: 'clasica-demo-2026' },
    update: {},
    create: {
      slug: 'clasica-demo-2026',
      name: 'Clásica Demo (DATO FICTICIO)',
      year: 2026,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      country: 'FR',
      category: 'classic',
      status: 'upcoming',
    },
  })

  const tag = await prisma.tag.upsert({
    where: { slug: 'ciclismo-demo' },
    update: {},
    create: { slug: 'ciclismo-demo', name: 'Ciclismo Demo', type: 'topic' },
  })

  await prisma.article.upsert({
    where: { slug: 'articulo-de-ejemplo-no-publicar' },
    update: {},
    create: {
      slug: 'articulo-de-ejemplo-no-publicar',
      title: '[EJEMPLO] Ciclista Demo gana la etapa 12 de la Gran Vuelta Demo',
      subtitle: 'Artículo de muestra para verificar el diseño — no es una noticia real',
      excerpt:
        'Este artículo es contenido de prueba generado durante el desarrollo del sitio y no describe un hecho real.',
      content: `<p>Este es un artículo de <strong>demostración</strong> usado únicamente para comprobar el diseño editorial durante el desarrollo.</p><p>No representa ninguna noticia real de ciclismo.</p>`,
      categoryId: catUltimaHora!.id,
      authorId: author.id,
      status: 'published',
      breakingNews: false,
      featured: true,
      publishedAt: new Date(),
      seoTitle: '[EJEMPLO] Artículo de prueba',
      seoDescription: 'Artículo de prueba para desarrollo, no es contenido real.',
      readingTime: 3,
      tags: { connect: [{ id: tag.id }] },
      riders: { connect: [{ id: rider.id }] },
      teams: { connect: [{ id: team.id }] },
      races: { connect: [{ id: race.id }] },
    },
  })

  await prisma.article.upsert({
    where: { slug: 'ejemplo-fichaje-no-publicar' },
    update: {},
    create: {
      slug: 'ejemplo-fichaje-no-publicar',
      title: '[EJEMPLO] Equipo Demo anuncia la renovación de Ciclista Demo',
      excerpt: 'Artículo de muestra de la sección de latinos.',
      content: `<p>Contenido de prueba para la sección de latinos.</p>`,
      categoryId: catLatinos!.id,
      authorId: author.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      readingTime: 2,
      teams: { connect: [{ id: team.id }] },
      riders: { connect: [{ id: rider.id }] },
    },
  })

  await prisma.article.upsert({
    where: { slug: 'ejemplo-previa-grand-tour' },
    update: {},
    create: {
      slug: 'ejemplo-previa-grand-tour',
      title: '[EJEMPLO] Todo lo que hay que saber sobre la Gran Vuelta Demo',
      excerpt: 'Previa de ejemplo para la sección de Grand Tours.',
      content: `<p>Contenido de prueba para una previa de carrera.</p>`,
      categoryId: catGrandTours!.id,
      authorId: author.id,
      status: 'published',
      featured: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      readingTime: 6,
      races: { connect: [{ id: race.id }] },
    },
  })

  const catCiclismoFemenino = categories.find((c) => c.slug === 'ciclismo-femenino')
  const catTecnologia = categories.find((c) => c.slug === 'tecnologia')
  const catAnalisis = categories.find((c) => c.slug === 'analisis')

  await prisma.article.upsert({
    where: { slug: 'ejemplo-ciclismo-femenino' },
    update: {},
    create: {
      slug: 'ejemplo-ciclismo-femenino',
      title: '[EJEMPLO] Ciclista Demo lidera la general femenina antes de la última etapa',
      excerpt: 'Artículo de muestra para la sección de ciclismo femenino.',
      content: `<p>Contenido de prueba sobre ciclismo femenino.</p>`,
      categoryId: (catCiclismoFemenino ?? catUltimaHora)!.id,
      authorId: author.id,
      status: 'published',
      featured: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 30),
      readingTime: 4,
    },
  })

  await prisma.article.upsert({
    where: { slug: 'ejemplo-tecnologia-bicis' },
    update: {},
    create: {
      slug: 'ejemplo-tecnologia-bicis',
      title: '[EJEMPLO] Así es la nueva bicicleta que probará el pelotón la próxima temporada',
      excerpt: 'Artículo de muestra para la sección de tecnología.',
      content: `<p>Contenido de prueba sobre tecnología y equipamiento.</p>`,
      categoryId: (catTecnologia ?? catUltimaHora)!.id,
      authorId: author.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      readingTime: 5,
    },
  })

  await prisma.article.upsert({
    where: { slug: 'ejemplo-analisis-temporada' },
    update: {},
    create: {
      slug: 'ejemplo-analisis-temporada',
      title: '[EJEMPLO] Cinco claves que están definiendo la temporada del pelotón',
      excerpt: 'Artículo de muestra para la sección de análisis.',
      content: `<p>Contenido de prueba de análisis en profundidad.</p>`,
      categoryId: (catAnalisis ?? catUltimaHora)!.id,
      authorId: author.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      readingTime: 9,
    },
  })

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const passwordHash =
    process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash('changeme123', 10))
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Administrador',
      passwordHash,
      role: 'admin',
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'automationPaused' },
    update: {},
    create: { key: 'automationPaused', value: 'false' },
  })

  console.log('✅ Seed de desarrollo completado (datos ficticios).')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
