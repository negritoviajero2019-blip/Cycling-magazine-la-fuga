export interface ArticleSummary {
  slug: string
  title: string
  excerpt: string
  publishedAt: Date | null
  readingTime: number
  breakingNews: boolean
  viewCount: number
  category: { slug: string; name: string }
  heroImage: { url: string; altText: string | null; credit: string | null } | null
}
