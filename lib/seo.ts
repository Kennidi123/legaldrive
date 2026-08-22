import type { Metadata } from 'next'

/* ============================================================
   Configuração central de SEO — Legal Drive
   ============================================================ */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrivemultas.com.br').replace(/\/$/, '')
const siteName = 'Legal Drive'
const siteDescription =
  'Inteligência jurídica aplicada ao Direito de Trânsito. Análise técnica sobre multas, CNH, radares e legislação para o motorista brasileiro.'

/** Imagem OG padrão (branded, 1200x630) gerada dinamicamente em app/og/route.tsx. */
const defaultOgImage = `${siteUrl}/og`
/** Logotipo usado no publisher do JSON-LD (precisa existir em /public). */
const publisherLogo = `${siteUrl}/logo-completa.png`
const twitterHandle = '@legaldrive'

const DEFAULT_KEYWORDS = [
  'direito de trânsito',
  'multas de trânsito',
  'recurso de multa',
  'CNH suspensa',
  'lei seca',
  'radar',
  'CTB',
  'pontos na carteira',
  'defesa de multa',
  'legislação de trânsito',
]

/** Garante URL absoluta — crawlers de OG/Twitter/JSON-LD exigem URL completa. */
export function toAbsoluteUrl(url?: string | null): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Normaliza espaços e trunca preservando palavras (meta description ideal ≤ 160). */
export function truncate(text?: string | null, max = 160): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd() + '…'
}

/* ============================================================
   Metadata de páginas genéricas (home, categorias, institucionais)
   ============================================================ */
export function buildMetadata({
  title,
  description,
  slug,
  image,
  keywords,
  noIndex,
}: {
  title?: string
  description?: string
  slug?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Direito de Trânsito`
  const metaDesc = truncate(description || siteDescription)
  const canonical = slug ? `${siteUrl}/${slug}` : siteUrl
  const ogImage = toAbsoluteUrl(image) || defaultOgImage

  return {
    title: fullTitle,
    description: metaDesc,
    metadataBase: new URL(siteUrl),
    keywords: keywords && keywords.length ? keywords : DEFAULT_KEYWORDS,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonical,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDesc,
      images: [ogImage],
      site: twitterHandle,
      creator: twitterHandle,
    },
  }
}

/* ============================================================
   Metadata de artigos/notícias (compartilhamento com capa)
   ============================================================ */
export function buildArticleMetadata({
  title,
  metaTitle,
  description,
  excerpt,
  url,
  image,
  publishedAt,
  updatedAt,
  authorName,
  section,
  tags,
}: {
  title: string
  metaTitle?: string | null
  description?: string | null
  excerpt?: string | null
  url: string
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  authorName?: string | null
  section?: string | null
  tags?: string[]
}): Metadata {
  const headline = metaTitle || title
  const fullTitle = `${headline} | ${siteName}`
  const metaDesc = truncate(description || excerpt || siteDescription)
  const canonical = toAbsoluteUrl(url) || siteUrl
  // Capa da notícia como imagem de compartilhamento; cai para a OG branded se ausente.
  const ogImage = toAbsoluteUrl(image) || defaultOgImage

  return {
    title: fullTitle,
    description: metaDesc,
    metadataBase: new URL(siteUrl),
    keywords: tags && tags.length ? tags.map((t) => t.replace(/^#/, '')) : DEFAULT_KEYWORDS,
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: { canonical },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonical,
      siteName,
      type: 'article',
      locale: 'pt_BR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: headline }],
      publishedTime: publishedAt || undefined,
      modifiedTime: updatedAt || undefined,
      authors: authorName ? [authorName] : undefined,
      section: section || undefined,
      tags: tags?.map((t) => t.replace(/^#/, '')),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDesc,
      images: [ogImage],
      site: twitterHandle,
      creator: twitterHandle,
    },
  }
}

/* ============================================================
   JSON-LD (dados estruturados)
   ------------------------------------------------------------
   Regras seguidas (Google Search Central / schema.org):
   - Datas em ISO 8601 COM fuso horário (America/Sao_Paulo), nunca no futuro.
   - Campos vazios são OMITIDOS (nunca null / "" / "undefined").
   - Todo dado precisa corresponder ao que está visível na página.
   ============================================================ */

/** Fuso do veículo — as datas do JSON-LD saem com este offset (ex.: -03:00). */
const SITE_TIMEZONE = 'America/Sao_Paulo'

/** Offset (em minutos) do fuso do site na data informada — respeita horário de verão histórico. */
function timezoneOffsetMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0')
  const hour = get('hour') % 24
  const asLocal = Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'))
  return Math.round((asLocal - Math.floor(date.getTime() / 1000) * 1000) / 60000)
}

/**
 * ISO 8601 com fuso explícito (ex.: 2026-08-21T09:00:00-03:00).
 * Retorna undefined para data ausente/inválida — a propriedade some do JSON.
 */
export function toIsoWithOffset(input?: Date | string | null): string | undefined {
  if (!input) return undefined
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return undefined

  const offset = timezoneOffsetMinutes(date)
  const shifted = new Date(date.getTime() + offset * 60000)
  const pad = (n: number, size = 2) => String(Math.abs(n)).padStart(size, '0')
  const sign = offset >= 0 ? '+' : '-'
  const stamp = `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
    `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`
  return `${stamp}${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
}

/** Remove recursivamente chaves vazias (undefined, null, "", [], {}) do JSON-LD. */
function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    const list = value.map(compact).filter((v) => v !== undefined && v !== null && v !== '')
    return (list.length ? list : undefined) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      const clean = compact(raw)
      if (clean === undefined || clean === null || clean === '') continue
      out[key] = clean
    }
    return (Object.keys(out).length ? out : undefined) as unknown as T
  }
  return value
}

/** Nomes que NÃO identificam uma pessoa — nesses casos o autor vira a Organization. */
const GENERIC_AUTHORS = /^(admin|administrador|reda[cç][aã]o|equipe|editoria|legal\s*drive)/i

/** Publisher reutilizado por todos os blocos (artigo, organização, coleções). */
function publisherNode() {
  return {
    '@type': 'NewsMediaOrganization',
    '@id': `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: publisherLogo,
      width: 600,
      height: 60,
    },
  }
}

export type ArticleAuthor = {
  name?: string | null
  role?: string | null
  /** URL da página de autor, quando existir (reforça E-E-A-T). */
  url?: string | null
}

/**
 * NewsArticle da página de matéria.
 * `images` aceita as variações (16:9, 4:3, 1:1) — duplicatas e vazios são descartados.
 */
export function articleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  authors,
  images,
  url,
  section,
  tags,
  isAccessibleForFree = true,
  sponsored = false,
}: {
  title: string
  description?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  authors?: ArticleAuthor[]
  images?: (string | null | undefined)[]
  url: string
  section?: string | null
  tags?: string[]
  isAccessibleForFree?: boolean
  /** Conteúdo patrocinado usa AdvertiserContentArticle no lugar de NewsArticle. */
  sponsored?: boolean
}) {
  const canonical = toAbsoluteUrl(url) || siteUrl

  const imageList = Array.from(
    new Set((images || []).map((img) => toAbsoluteUrl(img)).filter((img): img is string => Boolean(img)))
  )
  const image = imageList.length ? imageList : [defaultOgImage]

  // Nunca declarar data futura; dateModified nunca anterior à publicação.
  const now = new Date()
  const published = publishedAt ? new Date(publishedAt) : null
  const publishedSafe = published && !Number.isNaN(published.getTime())
    ? new Date(Math.min(published.getTime(), now.getTime()))
    : null
  const modified = updatedAt ? new Date(updatedAt) : null
  const modifiedSafe = modified && !Number.isNaN(modified.getTime())
    ? new Date(Math.min(Math.max(modified.getTime(), publishedSafe?.getTime() ?? 0), now.getTime()))
    : publishedSafe

  const people = (authors || [])
    .filter((a) => a?.name && a.name.trim() && !GENERIC_AUTHORS.test(a.name.trim()))
    .map((a) => ({
      '@type': 'Person' as const,
      name: a.name!.trim(),
      jobTitle: a.role || undefined,
      url: toAbsoluteUrl(a.url) || undefined,
    }))

  // Sem pessoa identificada (Redação/admin/vazio) → autoria da organização.
  const author = people.length ? people : [{ '@type': 'Organization' as const, name: siteName, url: siteUrl }]

  return compact({
    '@context': 'https://schema.org',
    '@type': sponsored ? 'AdvertiserContentArticle' : 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: truncate(title, 110),
    description: truncate(description) || undefined,
    image,
    datePublished: toIsoWithOffset(publishedSafe),
    dateModified: toIsoWithOffset(modifiedSafe),
    author,
    publisher: publisherNode(),
    articleSection: section || undefined,
    keywords: tags && tags.length ? tags.map((t) => t.replace(/^#/, '')) : undefined,
    url: canonical,
    inLanguage: 'pt-BR',
    isAccessibleForFree,
  })
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Identidade da organização — usado na home para o Knowledge Graph do Google. */
export function organizationJsonLd() {
  return compact({
    '@context': 'https://schema.org',
    ...publisherNode(),
    description: siteDescription,
    sameAs: [
      process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL,
      process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL,
    ].filter(Boolean),
  })
}

/**
 * CollectionPage para páginas que NÃO são matéria (categoria, tag, busca).
 * NewsArticle nunca deve ser aplicado nessas páginas.
 */
export function collectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string
  description?: string | null
  url: string
  items?: { title: string; url: string }[]
}) {
  const canonical = toAbsoluteUrl(url) || siteUrl
  return compact({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description: truncate(description) || undefined,
    url: canonical,
    inLanguage: 'pt-BR',
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website` },
    publisher: { '@id': `${siteUrl}/#organization` },
    mainEntity:
      items && items.length
        ? {
            '@type': 'ItemList',
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: toAbsoluteUrl(item.url) || undefined,
            })),
          }
        : undefined,
  })
}

/** WebSite + SearchAction — habilita a caixa de busca de sitelinks no Google. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export { siteUrl, siteName, siteDescription }
