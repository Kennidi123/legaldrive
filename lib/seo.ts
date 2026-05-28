import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br'
const siteName = 'Legal Drive'
const siteDescription =
  'Inteligência jurídica aplicada ao Direito de Trânsito. Análise técnica sobre multas, CNH, radares e legislação para o motorista brasileiro.'

export function buildMetadata({
  title,
  description,
  slug,
  image,
}: {
  title?: string
  description?: string
  slug?: string
  image?: string
}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Direito de Trânsito`
  const metaDesc = description || siteDescription
  const canonical = slug ? `${siteUrl}/${slug}` : siteUrl
  const ogImage = image || `${siteUrl}/og-default.jpg`

  return {
    title: fullTitle,
    description: metaDesc,
    metadataBase: new URL(siteUrl),
    alternates: { canonical },
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
    },
  }
}

export function articleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  image,
  url,
}: {
  title: string
  description: string
  publishedAt: Date | null
  updatedAt: Date
  author: string
  image?: string | null
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || `${siteUrl}/og-default.jpg`,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt.toISOString(),
    url,
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

export { siteUrl, siteName, siteDescription }
