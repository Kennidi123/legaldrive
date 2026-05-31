import { MetadataRoute } from 'next'
import { getPosts, getCategories } from '@/lib/payload-api'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const [postsResult, categories] = await Promise.all([
    getPosts({ limit: 500, depth: 1 }),
    getCategories(),
  ])

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = postsResult.docs.map((post) => {
    const cat = typeof post.category === 'object' ? post.category : null
    return {
      url: cat ? `${siteUrl}/${cat.slug}/${post.slug}` : `${siteUrl}/${post.slug}`,
      lastModified: new Date(post.publishedAt || ''),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }
  })

  return [...staticRoutes, ...categoryRoutes, ...postRoutes]
}
