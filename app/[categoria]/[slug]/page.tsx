import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/getPayload'
import { articleJsonLd, breadcrumbJsonLd, siteUrl } from '@/lib/seo'
import { lexicalToHTML, getPostCoverImage, getAuthorAvatar } from '@/lib/lexical'
import CategoryBadge from '@/components/CategoryBadge'
import ShareButtons from '@/components/ShareButtons'
import ArticleCardHorizontal from '@/components/ArticleCardHorizontal'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import VideoEmbed from '@/components/VideoEmbed'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      depth: 1,
      limit: 200,
    })
    return posts.docs.map((p: any) => ({
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
    const payload = await getPayload()
    const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
    const post = result.docs[0] as any
    if (!post) return {}
    const cat = typeof post.category === 'object' ? post.category : null
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDesc || post.excerpt,
      openGraph: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDesc || post.excerpt,
        images: getPostCoverImage(post) ? [{ url: getPostCoverImage(post)! }] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
      },
      alternates: { canonical: cat ? `${siteUrl}/${cat.slug}/${post.slug}` : `${siteUrl}/${slug}` },
    }
  } catch {
    return {}
  }
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

export default async function ArticlePage({ params }: Props) {
  const { categoria, slug } = await params

  let post: any = null
  let related: any[] = []

  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      depth: 2,
      limit: 1,
    })
    post = result.docs[0]
    if (!post) notFound()

    const cat = typeof post.category === 'object' ? post.category : null
    if (cat && cat.slug !== categoria) notFound()

    if (cat) {
      const relResult = await payload.find({
        collection: 'posts',
        where: { and: [{ 'category.slug': { equals: cat.slug } }, { status: { equals: 'published' } }, { id: { not_equals: post.id } }] },
        depth: 2,
        limit: 3,
        sort: '-publishedAt',
      })
      related = relResult.docs
    }
  } catch {
    notFound()
  }

  const cat = typeof post.category === 'object' ? post.category : { name: '', slug: categoria }
  const author = typeof post.author === 'object' ? post.author : null
  const tags = Array.isArray(post.tags) ? post.tags.filter((t: any) => typeof t === 'object') : []
  const coverImage = getPostCoverImage(post)
  const avatarUrl = getAuthorAvatar(author)
  const htmlContent = lexicalToHTML(post.content)
  const articleUrl = `/${cat.slug}/${post.slug}`
  const fullUrl = `${siteUrl}${articleUrl}`

  const jsonLd = articleJsonLd({
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    updatedAt: new Date(post.updatedAt),
    author: author?.name || 'Legal Drive',
    image: coverImage,
    url: fullUrl,
  })

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Início', url: siteUrl },
    { name: cat.name, url: `${siteUrl}/${cat.slug}` },
    { name: post.title, url: fullUrl },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main>
        <div className="max-w-content mx-auto px-4 md:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <article className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 font-mono text-xs text-[var(--on-surface-variant)] mb-8 uppercase tracking-wider flex-wrap">
                <Link href="/" className="hover:text-[var(--secondary)] transition-colors">Início</Link>
                <span className="text-[var(--outline-variant)]">›</span>
                <Link href={`/${cat.slug}`} className="hover:text-[var(--secondary)] transition-colors">{cat.name}</Link>
                <span className="text-[var(--outline-variant)]">›</span>
                <span className="text-[var(--secondary)] truncate max-w-[180px]">{post.title}</span>
              </nav>

              <header className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <CategoryBadge name={cat.name} slug={cat.slug} />
                  <span className="h-px w-6 bg-[var(--secondary)]" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--on-surface)] leading-tight mb-6">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 py-5 border-y border-[var(--outline-variant)]">
                  {avatarUrl && (
                    <Image src={avatarUrl} alt={author?.name || ''} width={40} height={40} className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--secondary)]" />
                  )}
                  <div>
                    <p className="font-mono text-xs text-[var(--on-surface)] uppercase tracking-wider">{author?.name}</p>
                    {author?.role && <p className="font-mono text-[10px] text-[var(--outline)] uppercase">{author.role}</p>}
                  </div>
                  {post.publishedAt && (
                    <>
                      <span className="h-6 w-px bg-[var(--outline-variant)] hidden md:block" />
                      <span className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-wider">
                        {formatDate(post.publishedAt)}
                      </span>
                    </>
                  )}
                  {post.readingTime && (
                    <>
                      <span className="text-[var(--outline-variant)]">·</span>
                      <span className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-wider">
                        {post.readingTime} min de leitura
                      </span>
                    </>
                  )}
                </div>
              </header>

              {coverImage && (
                <figure className="mb-10">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image src={coverImage} alt={post.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                  </div>
                </figure>
              )}

              {post.youtubeId && (
                <div className="mb-10">
                  <VideoEmbed youtubeId={post.youtubeId} title={post.title} />
                </div>
              )}

              <div className="article-prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <span key={tag.id} className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-[var(--outline-variant)]">
                <ShareButtons url={articleUrl} title={post.title} />
              </div>
            </article>

            <aside className="lg:col-span-4 space-y-8">
              <WhatsAppBanner variant="sidebar" />

              <div className="bg-[var(--surface-container-high)] p-6 rounded-lg border border-[rgba(255,255,255,0.07)]">
                <h3 className="font-display text-lg font-bold text-[var(--on-surface)] mb-2">Radar Legal Drive</h3>
                <p className="text-sm text-[var(--on-surface-variant)] mb-5">Receba atualizações cruciais sobre leis de trânsito direto no seu e-mail.</p>
                <form className="space-y-3">
                  <input type="email" placeholder="Seu melhor e-mail" className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]" />
                  <button type="submit" className="w-full bg-[var(--on-surface)] text-[var(--surface)] font-mono text-xs font-bold tracking-widest uppercase py-3 rounded hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all">
                    Inscrever Agora
                  </button>
                </form>
              </div>

              {related.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-5 border-b border-[var(--outline-variant)] pb-2">
                    Artigos Relacionados
                  </h3>
                  <div className="space-y-5 divide-y divide-[var(--outline-variant)]">
                    {related.map((rel: any) => {
                      const relCat = typeof rel.category === 'object' ? rel.category : { name: '', slug: '' }
                      return (
                        <div key={rel.id} className="pt-5 first:pt-0">
                          <ArticleCardHorizontal
                            title={rel.title}
                            slug={rel.slug}
                            coverImage={getPostCoverImage(rel)}
                            category={{ name: relCat.name, slug: relCat.slug }}
                            publishedAt={rel.publishedAt ? new Date(rel.publishedAt) : null}
                            readingTime={rel.readingTime}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
        <WhatsAppBanner />
      </main>
    </>
  )
}
