import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { searchContent } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Buscar',
  description: 'Busca noticias, ciclistas, equipos y carreras.',
  noindex: true,
})

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ''
  const results = query ? await searchContent(query) : { articles: [], riders: [], teams: [], races: [] }

  return (
    <Container className="py-6">
      <h1 className="mb-6 font-heading text-3xl font-bold">
        {query ? `Resultados para "${query}"` : 'Buscar'}
      </h1>

      {query && results.articles.length === 0 && results.riders.length === 0 && results.teams.length === 0 && results.races.length === 0 && (
        <p className="text-muted">No se encontraron resultados. Prueba con otro término.</p>
      )}

      {results.articles.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-bold">Artículos</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </section>
      )}

      {(results.riders.length > 0 || results.teams.length > 0 || results.races.length > 0) && (
        <section className="grid gap-8 sm:grid-cols-3">
          {results.riders.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-lg font-bold">Ciclistas</h2>
              <ul className="space-y-2 text-sm">
                {results.riders.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/riders/${r.slug}`} className="hover:text-accent">
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.teams.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-lg font-bold">Equipos</h2>
              <ul className="space-y-2 text-sm">
                {results.teams.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/teams/${t.slug}`} className="hover:text-accent">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.races.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-lg font-bold">Carreras</h2>
              <ul className="space-y-2 text-sm">
                {results.races.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/races/${r.slug}`} className="hover:text-accent">
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </Container>
  )
}
