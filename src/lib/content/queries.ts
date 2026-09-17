import { prisma, safeQuery } from '@/lib/db'
import { estimateReadingTime } from './reading-time'
import type { ArticleSummary } from '@/types/content'

/** Un artículo "updated" sigue siendo público — solo cambia el aviso de
 * actualización en la propia página, no su visibilidad en listados. */
const PUBLIC_STATUSES: string[] = ['published', 'updated']

const summarySelect = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  readingTime: true,
  breakingNews: true,
  viewCount: true,
  category: { select: { slug: true, name: true } },
  heroImage: { select: { url: true, altText: true, credit: true, source: true } },
} as const

/**
 * Home dinámica alimentada desde BD (§82) — nunca contenido hardcodeado.
 * Estructura de la portada (orden fijo acordado):
 * Hero (1 historia) → Últimas noticias (3) → Radar del Pelotón
 * (1 principal + 4 en feed) → Historias destacadas (hasta 6, curadas
 * con `featured`) → Próximas carreras → Análisis → Más leído.
 * Un mismo artículo nunca se repite entre Hero/Últimas/Radar.
 */
export async function getHomeSections() {
  const [featuredPool, recentPool, analysis, upcomingRaces, nextRace, mostRead] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: { in: PUBLIC_STATUSES }, featured: true },
          orderBy: { publishedAt: 'desc' },
          take: 7,
          select: summarySelect,
        }),
      [] as ArticleSummary[],
    ),
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: { in: PUBLIC_STATUSES } },
          orderBy: { publishedAt: 'desc' },
          take: 20,
          select: summarySelect,
        }),
      [] as ArticleSummary[],
    ),
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: { in: PUBLIC_STATUSES }, category: { slug: 'analisis' } },
          orderBy: { publishedAt: 'desc' },
          take: 6,
          select: summarySelect,
        }),
      [] as ArticleSummary[],
    ),
    getUpcomingRaces(),
    getNextRace(),
    getMostReadArticles(),
  ])

  const heroArticle: ArticleSummary | null = featuredPool[0] ?? recentPool[0] ?? null
  const usedSlugs = new Set(heroArticle ? [heroArticle.slug] : [])

  const latestThree: ArticleSummary[] = []
  for (const article of recentPool) {
    if (latestThree.length >= 3) break
    if (usedSlugs.has(article.slug)) continue
    latestThree.push(article)
    usedSlugs.add(article.slug)
  }

  const radarArticles: ArticleSummary[] = []
  for (const article of recentPool) {
    if (radarArticles.length >= 5) break
    if (usedSlugs.has(article.slug)) continue
    radarArticles.push(article)
    usedSlugs.add(article.slug)
  }

  // Excluye también lo ya mostrado en Últimas noticias/Radar, no solo el
  // hero — evita que el mismo artículo aparezca dos veces en la home.
  const featuredStandout = featuredPool.filter((a) => !usedSlugs.has(a.slug)).slice(0, 6)

  return { heroArticle, latestThree, radarArticles, featuredStandout, analysis, upcomingRaces, nextRace, mostRead }
}

export async function getUpcomingRaces() {
  return safeQuery(
    () =>
      prisma.race.findMany({
        where: { OR: [{ status: 'upcoming' }, { startDate: { gte: new Date() } }] },
        orderBy: { startDate: 'asc' },
        take: 5,
        select: { slug: true, name: true, startDate: true, country: true, category: true },
      }),
    [],
  )
}

/** Próximas carreras filtradas por Race.category — usado en la página
 * de categoría de MTB y Gravel para mostrar su propio calendario. */
export async function getUpcomingRacesByCategory(categories: string[]) {
  return safeQuery(
    () =>
      prisma.race.findMany({
        where: { category: { in: categories }, OR: [{ status: 'upcoming' }, { status: 'ongoing' }, { startDate: { gte: new Date() } }] },
        orderBy: { startDate: 'asc' },
        take: 10,
        select: { slug: true, name: true, startDate: true, endDate: true, country: true, category: true },
      }),
    [],
  )
}

/** La próxima carrera en orden cronológico — para la franja compacta del home. */
export async function getNextRace() {
  return safeQuery(
    () =>
      prisma.race.findFirst({
        where: { OR: [{ status: 'upcoming' }, { status: 'ongoing' }, { startDate: { gte: new Date() } }] },
        orderBy: { startDate: 'asc' },
        select: {
          slug: true,
          name: true,
          startDate: true,
          endDate: true,
          country: true,
          category: true,
          status: true,
        },
      }),
    null,
  )
}

/**
 * §94: "Más leído" se basa en viewCount real (incrementado en cada
 * visita de artículo, ver src/app/(site)/news/[slug]/page.tsx). Si
 * todavía no hay vistas registradas, se devuelve vacío — nunca se
 * simula un ranking sin datos reales.
 */
export async function getMostReadArticles(): Promise<ArticleSummary[]> {
  const candidates = await safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: { in: PUBLIC_STATUSES }, viewCount: { gt: 0 } },
        orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
        take: 5,
        select: summarySelect,
      }),
    [] as ArticleSummary[],
  )
  return candidates
}

export async function getArticleBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.article.findFirst({
        where: { slug, status: { in: ['published', 'updated'] } },
        include: {
          category: true,
          author: true,
          heroImage: true,
          tags: true,
          riders: { select: { slug: true, name: true } },
          teams: { select: { slug: true, name: true } },
          races: { select: { slug: true, name: true } },
        },
      }),
    null,
  )
}

export async function getRelatedArticles(articleId: number, categoryId: number): Promise<ArticleSummary[]> {
  return safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: { in: PUBLIC_STATUSES }, categoryId, NOT: { id: articleId } },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        select: summarySelect,
      }),
    [],
  )
}

export async function getCategoryBySlug(slug: string) {
  return safeQuery(() => prisma.category.findUnique({ where: { slug } }), null)
}

/**
 * Un artículo aparece en una categoría si es su categoría principal,
 * o si tiene una etiqueta con el mismo slug — así un artículo de
 * Leyendas (p.ej. un duelo histórico) puede listarse también en
 * Grand Tours sin duplicarlo ni cambiarle su categoría principal.
 */
export async function getArticlesByCategory(categoryId: number, categorySlug?: string, page = 1, pageSize = 12) {
  return safeQuery(
    () =>
      prisma.article.findMany({
        where: {
          status: { in: PUBLIC_STATUSES },
          OR: [{ categoryId }, ...(categorySlug ? [{ tags: { some: { slug: categorySlug } } }] : [])],
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: summarySelect,
      }),
    [],
  )
}

export async function getTagBySlug(slug: string) {
  return safeQuery(() => prisma.tag.findUnique({ where: { slug } }), null)
}

export async function getArticlesByTag(tagId: number) {
  return safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: { in: PUBLIC_STATUSES }, tags: { some: { id: tagId } } },
        orderBy: { publishedAt: 'desc' },
        take: 24,
        select: summarySelect,
      }),
    [],
  )
}

export async function getRiderBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.rider.findUnique({
        where: { slug },
        include: {
          currentTeam: true,
          articles: { where: { status: { in: PUBLIC_STATUSES } }, select: summarySelect, take: 12 },
        },
      }),
    null,
  )
}

export async function getTeamBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.team.findUnique({
        where: { slug },
        include: {
          riders: { select: { slug: true, name: true, photoUrl: true, specialty: true } },
          articles: { where: { status: { in: PUBLIC_STATUSES } }, select: summarySelect, take: 12 },
        },
      }),
    null,
  )
}

export async function getRaceBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.race.findUnique({
        where: { slug },
        include: {
          stages: { orderBy: { number: 'asc' } },
          articles: { where: { status: { in: PUBLIC_STATUSES } }, select: summarySelect, take: 12 },
        },
      }),
    null,
  )
}

export async function searchContent(query: string) {
  if (!query.trim()) return { articles: [], riders: [], teams: [], races: [] }

  const [articles, riders, teams, races] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where: {
            status: { in: PUBLIC_STATUSES },
            OR: [{ title: { contains: query } }, { excerpt: { contains: query } }],
          },
          take: 10,
          select: summarySelect,
        }),
      [] as ArticleSummary[],
    ),
    safeQuery(
      () => prisma.rider.findMany({ where: { name: { contains: query } }, take: 6 }),
      [],
    ),
    safeQuery(
      () => prisma.team.findMany({ where: { name: { contains: query } }, take: 6 }),
      [],
    ),
    safeQuery(
      () => prisma.race.findMany({ where: { name: { contains: query } }, take: 6 }),
      [],
    ),
  ])

  return { articles, riders, teams, races }
}

/**
 * Incrementa el contador de vistas de un artículo. Se llama sin
 * `await` desde la página del artículo (fire-and-forget): no debe
 * retrasar el render ni tumbar la página si falla. Válido en el
 * hosting Node.js persistente objetivo (Hostinger); en un runtime
 * serverless efímero habría que mover esto a un beacon/API dedicado.
 */
export function incrementArticleView(articleId: number): void {
  prisma.article
    .update({ where: { id: articleId }, data: { viewCount: { increment: 1 } } })
    .catch((error) => console.error('[queries] no se pudo incrementar viewCount:', error))
}

export { estimateReadingTime }
