import { notFound } from 'next/navigation'
import { getCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/payload-api'
import { buildMetadata } from '@/lib/seo'
import { getPostCoverImage } from '@/lib/lexical'
import ArticleCard from '@/components/ArticleCard'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  try {
    const result = await getCategories()
    return (result?.docs || []).map((c: any) => ({ categoria: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  try {
    const cat = await getCategoryBySlug(categoria)
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

  const category = await getCategoryBySlug(categoria)
  if (!category) notFound()

  const postsResult = await getPostsByCategory(categoria)
  const posts = postsResult?.docs || []

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
              Acesse <Link href="/admin" className="text-[var(--secondary)] hover:underline">/admin</Link> para criar o primeiro artigo.
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
