import { MetadataRoute } from 'next'
import { getPayload } from '@/lib/getPayload'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  try {
    const payload = await getPayload()
    const [posts, categories] = await Promise.all([
      payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, depth: 1, limit: 500 }),
      payload.find({ collection: 'categories', limit: 50 }),
    ])

    const categoryRoutes: MetadataRoute.Sitemap = categories.docs.map((cat: any) => ({
      url: `${siteUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    const postRoutes: MetadataRoute.Sitemap = posts.docs.map((post: any) => {
      const cat = typeof post.category === 'object' ? post.category : null
      return {
        url: cat ? `${siteUrl}/${cat.slug}/${post.slug}` : `${siteUrl}/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }
    })

    return [...staticRoutes, ...categoryRoutes, ...postRoutes]
  } catch {
    return staticRoutes
  }
}
