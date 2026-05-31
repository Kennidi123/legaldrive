const BASE = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

type PayloadList = { docs: any[]; totalDocs: number }

async function get<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getFeaturedPosts(limit = 4) {
  return get<PayloadList>(`/api/posts?where[featured][equals]=true&where[status][equals]=published&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getLatestPosts(limit = 8) {
  return get<PayloadList>(`/api/posts?where[status][equals]=published&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getCategories(limit = 50) {
  return get<PayloadList>(`/api/categories?limit=${limit}&sort=name`)
}

export async function getCategoryBySlug(slug: string) {
  const res = await get<PayloadList>(`/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
  return res?.docs[0] ?? null
}

export async function getPostsByCategory(categorySlug: string, limit = 12) {
  return get<PayloadList>(`/api/posts?where[category.slug][equals]=${encodeURIComponent(categorySlug)}&where[status][equals]=published&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getPostBySlug(slug: string, depth = 2) {
  const res = await get<PayloadList>(`/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&depth=${depth}&limit=1`)
  return res?.docs[0] ?? null
}

export async function getAllPublishedPosts(limit = 500) {
  return get<PayloadList>(`/api/posts?where[status][equals]=published&depth=1&limit=${limit}`)
}

export async function getRelatedPosts(categorySlug: string, excludeId: string | number, limit = 3) {
  return get<PayloadList>(`/api/posts?where[category.slug][equals]=${encodeURIComponent(categorySlug)}&where[status][equals]=published&where[id][not_equals]=${excludeId}&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getVideos(limit = 50) {
  return get<PayloadList>(`/api/videos?limit=${limit}&sort=-publishedAt`)
}
