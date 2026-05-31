const API = (process.env.NEXT_PUBLIC_PAYLOAD_URL || '').replace(/\/$/, '')

const opts: RequestInit = { next: { revalidate: 60 } }

async function fetchAPI<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, opts)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Types ──────────────────────────────────────────────────────────

export interface Category {
  id: string | number
  name: string
  slug: string
  color?: string
  description?: string
}

export interface Author {
  id: string | number
  name: string
  bio?: string
  role?: string
  avatarUrl?: string
  avatar?: { url?: string }
}

export interface Tag {
  id: string | number
  name: string
  slug: string
}

export interface Post {
  id: string | number
  title: string
  slug: string
  excerpt?: string
  status?: string
  featured?: boolean
  publishedAt?: string
  readingTime?: number
  coverImageUrl?: string
  coverImage?: { url?: string }
  youtubeId?: string
  content?: unknown
  category?: Category
  author?: Author
  tags?: Tag[]
  metaTitle?: string
  metaDesc?: string
}

export interface Video {
  id: string | number
  title: string
  youtubeId: string
  description?: string
  thumbnail?: string
  publishedAt?: string
  featured?: boolean
}

interface PayloadList<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
}

// ── API functions ──────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const data = await fetchAPI<PayloadList<Category>>('/api/categories?limit=20&sort=name')
  return data?.docs ?? []
}

export async function getCategory(slug: string): Promise<Category | null> {
  const data = await fetchAPI<PayloadList<Category>>(
    `/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`
  )
  return data?.docs[0] ?? null
}

export interface GetPostsOptions {
  featured?: boolean
  categorySlug?: string
  limit?: number
  sort?: string
  depth?: number
}

export async function getPosts(options: GetPostsOptions = {}): Promise<PayloadList<Post>> {
  const { featured, categorySlug, limit = 12, sort = '-publishedAt', depth = 2 } = options

  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('sort', sort)
  params.set('depth', String(depth))
  params.set('where[status][equals]', 'published')

  if (featured) params.set('where[featured][equals]', 'true')
  if (categorySlug) params.set('where[category.slug][equals]', categorySlug)

  const data = await fetchAPI<PayloadList<Post>>(`/api/posts?${params.toString()}`)
  return data ?? { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await fetchAPI<PayloadList<Post>>(
    `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&depth=2&limit=1`
  )
  return data?.docs[0] ?? null
}

export async function getAllPostSlugs(): Promise<{ categoria: string; slug: string }[]> {
  const data = await fetchAPI<PayloadList<Post>>(
    '/api/posts?where[status][equals]=published&depth=1&limit=500&sort=-publishedAt'
  )
  return (data?.docs ?? []).flatMap((post) => {
    const cat = typeof post.category === 'object' ? post.category?.slug : null
    if (!cat || !post.slug) return []
    return [{ categoria: cat, slug: post.slug }]
  })
}

export async function getVideos(limit = 50): Promise<Video[]> {
  const data = await fetchAPI<PayloadList<Video>>(
    `/api/videos?limit=${limit}&sort=-publishedAt`
  )
  return data?.docs ?? []
}

export function getPostCoverImage(post: Post): string | null {
  if (post.coverImageUrl) return post.coverImageUrl
  if (post.coverImage?.url) return post.coverImage.url
  return null
}

export function getAuthorAvatar(author: Author): string | null {
  if (author.avatarUrl) return author.avatarUrl
  if (author.avatar?.url) return author.avatar.url
  return null
}
