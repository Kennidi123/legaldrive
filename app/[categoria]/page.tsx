import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { buildMetadata } from '@/lib/seo'
import ArticleCard from '@/components/ArticleCard'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({ select: { slug: true } })
    return categories.map((c) => ({ categoria: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  try {
    const category = await prisma.category.findUnique({ where: { slug: categoria } })
    if (!category) return {}
    return buildMetadata({
      title: `${category.name} — Notícias e Análises`,
      description: `Análises, notícias e artigos jurídicos sobre ${category.name} no Brasil. Especialistas em Direito de Trânsito.`,
      slug: categoria,
    })
  } catch {
    return {}
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params

  const category = await prisma.category.findUnique({ where: { slug: categoria } })
  if (!category) notFound()

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, publishedAt: { not: null } },
    include: { category: true, author: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  })

  return (
    <main>
      {/* Category Header */}
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
            Análises aprofundadas, jurisprudência e notícias sobre {category.name} para o motorista brasileiro.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] mb-4">
              Nenhum artigo encontrado
            </p>
            <p className="text-[var(--on-surface-variant)]">
              Novos conteúdos serão publicados em breve.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <ArticleCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={{ name: post.category.name, slug: post.category.slug }}
                publishedAt={post.publishedAt}
                readingTime={post.readingTime}
                animationDelay={i * 60}
              />
            ))}
          </div>
        )}
      </section>

      <WhatsAppBanner />
    </main>
  )
}
