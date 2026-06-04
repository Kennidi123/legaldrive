import type { Metadata } from 'next'

/* ============================================================
   Configuração central de SEO — Legal Drive
   ============================================================ */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br').replace(/\/$/, '')
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
   ============================================================ */
export function articleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  authorRole,
  image,
  url,
  section,
}: {
  title: string
  description: string
  publishedAt: Date | null
  updatedAt: Date
  author: string
  authorRole?: string | null
  image?: string | null
  url: string
  section?: string | null
}) {
  const img = toAbsoluteUrl(image) || defaultOgImage
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: truncate(title, 110),
    description: truncate(description),
    image: [img],
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: section || undefined,
    author: {
      '@type': 'Person',
      name: author,
      ...(authorRole ? { jobTitle: authorRole } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
        width: 600,
        height: 60,
      },
    },
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt.toISOString(),
    url,
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
  }
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: publisherLogo,
    description: siteDescription,
    sameAs: [
      process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL,
      process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL,
    ].filter(Boolean),
  }
}

/** WebSite + SearchAction — habilita a caixa de busca de sitelinks no Google. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
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
