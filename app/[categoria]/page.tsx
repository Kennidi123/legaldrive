import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/getPayload'
import { buildMetadata } from '@/lib/seo'
import { getPostCoverImage } from '@/lib/lexical'
import ArticleCard from '@/components/ArticleCard'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const categories = await payload.find({ collection: 'categories', limit: 50 })
    return categories.docs.map((c: any) => ({ categoria: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  try {
    const payload = await getPayload()
    const result = await payload.find({ collection: 'categories', where: { slug: { equals: categoria } }, limit: 1 })
    const cat = result.docs[0] as any
    if (!cat) return {}
    return buildMetadata({
      title: `${cat.name} — Notícias e Análises`,
      description: cat.description || `Análises e notícias sobre ${cat.name} no Brasil.`,
      slug: categoria,
    })
  } catch {
    return {}
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params

  let category: any = null
  let posts: any[] = []

  try {
    const payload = await getPayload()
    const catResult = await payload.find({ collection: 'categories', where: { slug: { equals: categoria } }, limit: 1 })
    category = catResult.docs[0]
    if (!category) notFound()

    const postsResult = await payload.find({
      collection: 'posts',
      where: { and: [{ 'category.slug': { equals: categoria } }, { status: { equals: 'published' } }] },
      depth: 2,
      limit: 12,
      sort: '-publishedAt',
    })
    posts = postsResult.docs
  } catch {
    notFound()
  }

  return (
    <main>
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-16">
          <div className="flex items-center gap-2 text-[var(--secondary)] mb-4">
            <span className="font-mono text-xs tracking-widest uppercase">Especialidade Jurídica</span>
            <span className="h-px w-8 bg-[var(--secondary)]" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-4">
            {category.name}
          </h1>
          <p className="font-body text-lg text-[var(--primary)] max-w-2xl leading-relaxed">
            {category.description || `Análises aprofundadas, jurisprudência e notícias sobre ${category.name} para o motorista brasileiro.`}
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] mb-3">
              Nenhum artigo publicado nesta categoria
            </p>
            <p className="text-[var(--on-surface-variant)] text-sm">
              Acesse <a href="/admin" className="text-[var(--secondary)] hover:underline">/admin</a> para criar o primeiro artigo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any, i: number) => {
              const cat = typeof post.category === 'object' ? post.category : { name: category.name, slug: categoria }
              return (
                <ArticleCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImage={getPostCoverImage(post)}
                  category={{ name: cat.name, slug: cat.slug }}
                  publishedAt={post.publishedAt ? new Date(post.publishedAt) : null}
                  readingTime={post.readingTime}
                  animationDelay={i * 60}
                />
              )
            })}
          </div>
        )}
      </section>

      <WhatsAppBanner />
    </main>
  )
}
