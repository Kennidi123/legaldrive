import { MetadataRoute } from 'next'
import { getAllPublishedPosts, getCategories, getVideos } from '@/lib/payload-api'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrivemultas.com.br'

/** Data mais recente de uma lista, ignorando valores inválidos. */
function maisRecente(datas: (string | undefined | null)[]): Date | undefined {
  const tempos = datas
    .map((d) => (d ? new Date(d).getTime() : NaN))
    .filter((t) => Number.isFinite(t))
  return tempos.length ? new Date(Math.max(...tempos)) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas institucionais e legais: existem independentemente do CMS, então
  // entram mesmo se a API estiver fora. Sem lastModified — elas mudam por
  // deploy, e uma data de build faria o lastmod variar sem conteúdo novo.
  const paginasFixas: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/sobre`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contato`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/compliance`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/politica-de-privacidade`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/termos-de-uso`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // /busca fica de fora de propósito: é página de resultado, sem conteúdo
  // próprio para indexar (e o robots.ts a bloqueia).

  try {
    const [postsResult, categoriesResult, videosResult] = await Promise.all([
      getAllPublishedPosts(500),
      getCategories(50),
      getVideos(50),
    ])

    const posts: any[] = postsResult?.docs || []
    const categorias: any[] = categoriesResult?.docs || []
    const videos: any[] = videosResult?.docs || []

    const slugDaCategoria = (post: any): string | null => {
      const cat = post?.category
      if (cat && typeof cat === 'object' && typeof cat.slug === 'string') return cat.slug
      return null
    }

    // Só entram notícias que resolvem para uma URL real (/[categoria]/[slug]).
    // Sem categoria, o link cairia em 404 — pior para SEO do que ficar de fora.
    const rotasPosts: MetadataRoute.Sitemap = posts.flatMap((post) => {
      const catSlug = slugDaCategoria(post)
      if (!catSlug || !post?.slug) return []
      return [{
        url: `${siteUrl}/${catSlug}/${post.slug}`,
        lastModified: maisRecente([post.updatedAt, post.publishedAt]),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }]
    })

    const rotasCategorias: MetadataRoute.Sitemap = categorias.flatMap((cat) => {
      if (!cat?.slug) return []
      const daCategoria = posts.filter((p) => slugDaCategoria(p) === cat.slug)
      return [{
        url: `${siteUrl}/${cat.slug}`,
        lastModified: maisRecente(daCategoria.flatMap((p) => [p.updatedAt, p.publishedAt])),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }]
    })

    const home: MetadataRoute.Sitemap = [{
      url: siteUrl,
      lastModified: maisRecente(posts.flatMap((p) => [p.updatedAt, p.publishedAt])),
      changeFrequency: 'daily',
      priority: 1,
    }]

    const rotaVideos: MetadataRoute.Sitemap = [{
      url: `${siteUrl}/videos`,
      lastModified: maisRecente(videos.flatMap((v) => [v.updatedAt, v.publishedAt])),
      changeFrequency: 'weekly',
      priority: 0.8,
    }]

    return [...home, ...rotasCategorias, ...rotasPosts, ...rotaVideos, ...paginasFixas]
  } catch {
    // API fora: devolve o que não depende dela, em vez de um sitemap vazio.
    return [
      { url: siteUrl, changeFrequency: 'daily', priority: 1 },
      { url: `${siteUrl}/videos`, changeFrequency: 'weekly', priority: 0.8 },
      ...paginasFixas,
    ]
  }
}
