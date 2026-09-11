import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreakingNewsBar } from '@/components/layout/BreakingNewsBar'
import { AdMobileSticky } from '@/components/ads/AdMobileSticky'
import { prisma, safeQuery } from '@/lib/db'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const breaking = await safeQuery(
    () =>
      prisma.article.findMany({
        where: { breakingNews: true, status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { slug: true, title: true },
      }),
    [],
  )

  return (
    <>
      <BreakingNewsBar items={breaking} />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <AdMobileSticky />
    </>
  )
}
