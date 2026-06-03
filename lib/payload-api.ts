const BASE = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

type PayloadList = { docs: any[]; totalDocs: number }

// "Agora" arredondado ao minuto — habilita o agendamento: posts com publishedAt
// no futuro só aparecem quando a hora chega. Arredondar ao minuto preserva o cache de 60s.
function nowParam() {
  const d = new Date()
  d.setSeconds(0, 0)
  return encodeURIComponent(d.toISOString())
}

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
    // Só tenta parsear quando a resposta é realmente JSON. Se o backend estiver
    // fora (ou a URL apontar para algo que devolve HTML com status 200), evita o
    // crash "Unexpected token '<' ... is not valid JSON" e cai no fallback.
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) return null
    return (await res.json()) as T
  } catch { return null }
}

export async function getFeaturedPosts(limit = 4) {
  return get<PayloadList>(`/api/posts?where[featured][equals]=true&where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getLatestPosts(limit = 8) {
  return get<PayloadList>(`/api/posts?where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=2&limit=${limit}&sort=-publishedAt`)
}

/** Destaque Principal da Home (post mais recente com featureLevel = principal). */
export async function getMainFeatured() {
  const res = await get<PayloadList>(`/api/posts?where[featureLevel][equals]=principal&where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=2&limit=1&sort=-publishedAt`)
  return res?.docs?.[0] ?? null
}

/** Busca posts publicados por termo (título ou resumo). */
export async function searchPosts(query: string, limit = 24) {
  const q = encodeURIComponent(query)
  return get<PayloadList>(
    `/api/posts?where[and][0][status][equals]=published` +
      `&where[and][1][or][0][title][like]=${q}` +
      `&where[and][1][or][1][excerpt][like]=${q}` +
      `&where[and][2][publishedAt][less_than_equal]=${nowParam()}` +
      `&depth=2&limit=${limit}&sort=-publishedAt`,
  )
}

export async function getCategories(limit = 50) {
  return get<PayloadList>(`/api/categories?limit=${limit}&sort=name`)
}

export async function getCategoryBySlug(slug: string) {
  const res = await get<PayloadList>(`/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
  return res?.docs[0] ?? null
}

export async function getPostsByCategory(categorySlug: string, limit = 12) {
  return get<PayloadList>(`/api/posts?where[category.slug][equals]=${encodeURIComponent(categorySlug)}&where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getPostBySlug(slug: string, depth = 2) {
  const res = await get<PayloadList>(`/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=${depth}&limit=1`)
  return res?.docs[0] ?? null
}

export async function getAllPublishedPosts(limit = 500) {
  return get<PayloadList>(`/api/posts?where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&depth=1&limit=${limit}`)
}

export async function getRelatedPosts(categorySlug: string, excludeId: string | number, limit = 3) {
  return get<PayloadList>(`/api/posts?where[category.slug][equals]=${encodeURIComponent(categorySlug)}&where[status][equals]=published&where[publishedAt][less_than_equal]=${nowParam()}&where[id][not_equals]=${excludeId}&depth=2&limit=${limit}&sort=-publishedAt`)
}

export async function getVideos(limit = 50) {
  return get<PayloadList>(`/api/videos?limit=${limit}&sort=-publishedAt`)
}
