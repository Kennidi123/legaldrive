import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPublishedPosts, getRelatedPosts } from '@/lib/payload-api'
import { articleJsonLd, breadcrumbJsonLd, buildArticleMetadata, siteUrl } from '@/lib/seo'
import { lexicalToHTML, getPostCoverImage, getAuthorAvatar } from '@/lib/lexical'
import ArticleLayout, { type RelatedItem } from '@/components/ArticleLayout'
import VideoEmbed from '@/components/VideoEmbed'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const result = await getAllPublishedPosts()
    if (!result) return []
    return result.docs.map((p: any) => ({
      categoria: typeof p.category === 'object' ? p.category.slug : '',
      slug: p.slug,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug, 1)
    if (!post) return {}
    const cat = typeof post.category === 'object' ? post.category : null
    const author = typeof post.author === 'object' ? post.author : null
    const tags = Array.isArray(post.tags)
      ? post.tags.filter((t: any) => typeof t === 'object').map((t: any) => t.name)
      : []
    return buildArticleMetadata({
      title: post.title,
      metaTitle: post.seo?.metaTitle,
      description: post.seo?.metaDesc,
      excerpt: post.excerpt,
      url: cat ? `/${cat.slug}/${post.slug}` : `/${slug}`,
      image: getPostCoverImage(post),
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      authorName: author?.name,
      section: cat?.name,
      tags,
    })
  } catch {
    return {}
  }
}

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

export default async function ArticlePage({ params }: Props) {
  const { categoria, slug } = await params

  const post = await getPostBySlug(slug, 2)
  if (!post) notFound()

  const postCat = typeof post.category === 'object' ? post.category : null
  if (postCat && postCat.slug !== categoria) notFound()

  let relatedDocs: any[] = []
  if (postCat) {
    const relResult = await getRelatedPosts(postCat.slug, post.id, 3)
    relatedDocs = relResult?.docs || []
  }

  const cat = postCat || { name: slugToName(categoria), slug: categoria }
  const author = typeof post.author === 'object' ? post.author : null
  const tags = Array.isArray(post.tags)
    ? post.tags.filter((t: any) => typeof t === 'object').map((t: any) => `#${t.name}`)
    : []
  const coverImage = getPostCoverImage(post)
  const avatarUrl = getAuthorAvatar(author)
  const htmlContent = lexicalToHTML(post.content)
  const articleUrl = `/${cat.slug}/${post.slug}`
  const fullUrl = `${siteUrl}${articleUrl}`

  const jsonLd = articleJsonLd({
    title: post.title,
    description: post.seo?.metaDesc || post.excerpt,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    updatedAt: new Date(post.updatedAt),
    author: author?.name || 'Redação Legal Drive',
    authorRole: author?.role,
    image: coverImage,
    url: fullUrl,
    section: cat.name,
  })

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Início', url: siteUrl },
    { name: cat.name, url: `${siteUrl}/${cat.slug}` },
    { name: post.title, url: fullUrl },
  ])

  const related: RelatedItem[] = relatedDocs.map((rel: any) => {
    const rc = typeof rel.category === 'object' ? rel.category : { name: '', slug: '' }
    return { id: rel.id, label: rc.name, title: rel.title, href: `/${rc.slug}/${rel.slug}`, img: getPostCoverImage(rel) }
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <ArticleLayout
        label={cat.name}
        title={post.title}
        cover={coverImage}
        authorName={author?.name ?? 'Redação Legal Drive'}
        authorRole={author?.role ?? 'Especialistas em Trânsito'}
        avatar={avatarUrl}
        dateStr={formatDate(post.publishedAt)}
        readingTime={post.readingTime ?? 5}
        tags={tags.length > 0 ? tags : ['#LegalDrive']}
        related={related}
        whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '/contato'}
        shareUrl={articleUrl}
        shareTitle={post.title}
      >
        <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {post.youtubeId && (
          <div className="my-8">
            <VideoEmbed youtubeId={post.youtubeId} title={post.title} />
          </div>
        )}

        {post.externalLink && (
          <a
            href={post.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-3 p-4 rounded-lg border border-[var(--on-primary-fixed-variant)] hover:border-[var(--secondary)] transition-colors group bg-[var(--surface-container-low)]"
          >
            <svg className="w-5 h-5 text-[var(--secondary)] flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Fonte Externa</p>
              <p className="text-sm text-[var(--on-surface)] truncate group-hover:text-[var(--secondary)] transition-colors">{post.externalLink}</p>
            </div>
          </a>
        )}
      </ArticleLayout>
    </>
  )
}
