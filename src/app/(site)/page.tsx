import Link from 'next/link'
import { Hero } from '@/components/editorial/Hero'
import { ArticleCard } from '@/components/editorial/ArticleCard'
import { PelotonRadar } from '@/components/editorial/PelotonRadar'
import { UpcomingRaces } from '@/components/editorial/UpcomingRaces'
import { NextRaceStrip } from '@/components/editorial/NextRaceStrip'
import { MostRead } from '@/components/editorial/MostRead'
import { NewsletterSection } from '@/components/editorial/NewsletterSection'
import { AdBanner } from '@/components/ads/AdBanner'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { getHomeSections } from '@/lib/content/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { branding } from '@/lib/config/branding'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...buildMetadata({ title: 'LA FUGA | Cycling Magazine', description: branding.tagline }),
  title: { absolute: 'LA FUGA | Cycling Magazine' },
}

function Section({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <section className="py-10">
      <div className="mb-7 flex items-end justify-between gap-6">
        <h2 className="font-heading text-3xl font-extrabold leading-none tracking-tight md:text-5xl">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="whitespace-nowrap text-sm font-bold text-accent transition-opacity hover:opacity-60"
          >
            Ver todo →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export default async function HomePage() {
  const { heroArticle, latestThree, radarArticles, featuredStandout, analysis, upcomingRaces, nextRace, mostRead } =
    await getHomeSections()

  // §83: nunca "No articles found" en producción — cada sección vacía se oculta.
  return (
    <Container>
      {heroArticle && (
        <div className="py-6">
          <Hero article={heroArticle} />
        </div>
      )}

      <div className="pb-6">
        <NextRaceStrip race={nextRace} />
      </div>

      {latestThree.length > 0 && (
        <Section title="Últimas noticias" href="/category/ultima-hora">
          <div className="grid gap-6 sm:grid-cols-3">
            {latestThree.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </Section>
      )}

      <PelotonRadar articles={radarArticles} />

      <div className="py-4">
        <AdBanner />
      </div>

      {featuredStandout.length > 0 && (
        <Section title="Historias destacadas">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStandout.map((article, i) => (
              <Reveal key={article.slug} delayMs={i * 60}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <UpcomingRaces races={upcomingRaces} />

      {analysis.length > 0 && (
        <Section title="Análisis" href="/category/analisis">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.map((article) => (
              <ArticleCard key={article.slug} article={article} size="compact" />
            ))}
          </div>
        </Section>
      )}

      <MostRead articles={mostRead} />

      <div className="py-4">
        <AdBanner label="Publicidad" />
      </div>

      <NewsletterSection />
    </Container>
  )
}
