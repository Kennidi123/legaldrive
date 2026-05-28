import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { articleJsonLd, breadcrumbJsonLd, siteUrl } from '@/lib/seo'
import CategoryBadge from '@/components/CategoryBadge'
import ShareButtons from '@/components/ShareButtons'
import ArticleCardHorizontal from '@/components/ArticleCardHorizontal'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import VideoEmbed from '@/components/VideoEmbed'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ categoria: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      select: { slug: true, category: { select: { slug: true } } },
      where: { publishedAt: { not: null } },
    })
    return posts.map((p) => ({ categoria: p.category.slug, slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!post) return {}
    return {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDesc || post.excerpt,
        images: post.coverImage ? [{ url: post.coverImage }] : [],
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
      },
      alternates: { canonical: `${siteUrl}/${post.category.slug}/${post.slug}` },
    }
  } catch {
    return {}
  }
}

function formatDate(date?: Date | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

export default async function ArticlePage({ params }: Props) {
  const { categoria, slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true, tags: true },
  })

  if (!post || post.category.slug !== categoria) notFound()

  const related = await prisma.post.findMany({
    where: { categoryId: post.categoryId, id: { not: post.id }, publishedAt: { not: null } },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  const articleUrl = `/${categoria}/${slug}`
  const fullUrl = `${siteUrl}${articleUrl}`

  const jsonLd = articleJsonLd({
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author.name,
    image: post.coverImage,
    url: fullUrl,
  })

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Início', url: siteUrl },
    { name: post.category.name, url: `${siteUrl}/${post.category.slug}` },
    { name: post.title, url: fullUrl },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main>
        <div className="max-w-content mx-auto px-4 md:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article */}
            <article className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 font-mono text-xs text-[var(--on-surface-variant)] mb-8 uppercase tracking-wider">
                <Link href="/" className="hover:text-[var(--secondary)] transition-colors">Início</Link>
                <span className="text-[var(--outline-variant)]">›</span>
                <Link href={`/${post.category.slug}`} className="hover:text-[var(--secondary)] transition-colors">
                  {post.category.name}
                </Link>
                <span className="text-[var(--outline-variant)]">›</span>
                <span className="text-[var(--secondary)] truncate max-w-[200px]">{post.title}</span>
              </nav>

              {/* Header */}
              <header className="mb-10">
                <div className="flex items-center gap-2 text-[var(--secondary)] mb-4">
                  <CategoryBadge name={post.category.name} slug={post.category.slug} />
                  <span className="h-px w-6 bg-[var(--secondary)]" />
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--on-surface)] leading-tight mb-6">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 py-5 border-y border-[var(--outline-variant)]">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    />
                  )}
                  <div>
                    <p className="font-mono text-xs text-[var(--on-surface)] uppercase tracking-wider">
                      {post.author.name}
                    </p>
                    {post.author.bio && (
                      <p className="font-mono text-[10px] text-[var(--outline)] uppercase">
                        {post.author.bio.split('.')[0]}
                      </p>
                    )}
                  </div>

                  <div className="h-6 w-px bg-[var(--outline-variant)] hidden md:block" />

                  {post.publishedAt && (
                    <span className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(post.publishedAt)}
                    </span>
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

              {/* Cover Image */}
              {post.coverImage && (
                <figure className="mb-10">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </figure>
              )}

              {/* YouTube embed if applicable */}
              {post.youtubeUrl && (
                <div className="mb-10">
                  <VideoEmbed
                    youtubeId={post.youtubeUrl}
                    title={post.title}
                  />
                </div>
              )}

              {/* Article Content */}
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-10 pt-8 border-t border-[var(--outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <ShareButtons url={articleUrl} title={post.title} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* CTA */}
              <WhatsAppBanner variant="sidebar" />

              {/* Newsletter */}
              <div className="bg-[var(--surface-container-high)] p-6 rounded-lg border border-[rgba(255,255,255,0.07)]">
                <h3 className="font-display text-lg font-bold text-[var(--on-surface)] mb-2">
                  Radar Legal Drive
                </h3>
                <p className="text-sm text-[var(--on-surface-variant)] mb-5">
                  Receba atualizações cruciais sobre leis de trânsito direto no seu e-mail.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[var(--on-surface)] text-[var(--surface)] font-mono text-xs font-bold tracking-widest uppercase py-3 rounded hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all"
                  >
                    Inscrever Agora
                  </button>
                </form>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-5 border-b border-[var(--outline-variant)] pb-2">
                    Artigos Relacionados
                  </h3>
                  <div className="space-y-5 divide-y divide-[var(--outline-variant)]">
                    {related.map((rel) => (
                      <div key={rel.id} className="pt-5 first:pt-0">
                        <ArticleCardHorizontal
                          title={rel.title}
                          slug={rel.slug}
                          coverImage={rel.coverImage}
                          category={{ name: rel.category.name, slug: rel.category.slug }}
                          publishedAt={rel.publishedAt}
                          readingTime={rel.readingTime}
                        />
                      </div>
                    ))}
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
