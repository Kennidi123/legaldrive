import { buildMetadata } from '@/lib/seo'
import { getPayload } from '@/lib/getPayload'
import { getPostCoverImage } from '@/lib/lexical'
import FeaturedHero from '@/components/FeaturedHero'
import ArticleCard from '@/components/ArticleCard'
import ArticleCardHorizontal from '@/components/ArticleCardHorizontal'
import VideoEmbed from '@/components/VideoEmbed'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import CategoryTabs from '@/components/CategoryTabs'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({})

async function getData() {
  try {
    const payload = await getPayload()
    const [featured, latest, categories, videos] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { and: [{ featured: { equals: true } }, { status: { equals: 'published' } }] },
        depth: 2,
        limit: 4,
        sort: '-publishedAt',
      }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        depth: 2,
        limit: 8,
        sort: '-publishedAt',
      }),
      payload.find({ collection: 'categories', limit: 20, sort: 'name' }),
      payload.find({ collection: 'videos', limit: 3, sort: '-publishedAt' }),
    ])
    return { featured: featured.docs, latest: latest.docs, categories: categories.docs, videos: videos.docs }
  } catch {
    return { featured: [], latest: [], categories: [], videos: [] }
  }
}

function normalizePost(doc: any) {
  const cat = typeof doc.category === 'object' ? doc.category : null
  const auth = typeof doc.author === 'object' ? doc.author : null
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    coverImage: getPostCoverImage(doc),
    category: cat ? { name: cat.name, slug: cat.slug } : { name: '', slug: '' },
    author: auth ? { name: auth.name } : { name: '' },
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt) : null,
    readingTime: doc.readingTime ?? null,
    featured: doc.featured ?? false,
  }
}

export default async function HomePage() {
  const { featured, latest, categories, videos } = await getData()

  const featuredPosts = featured.map(normalizePost)
  const latestPosts = latest.map(normalizePost)
  const [heroPost, ...sidePosts] = featuredPosts
  const recentNews = latestPosts.filter((p) => p.id !== heroPost?.id).slice(0, 4)
  const editorialPosts = latestPosts
    .filter((p) => !recentNews.find((r) => r.id === p.id) && p.id !== heroPost?.id)
    .slice(0, 3)

  return (
    <main className="bg-[var(--background)]">
      {heroPost && (
        <section className="max-w-content mx-auto px-4 md:px-16 pt-12 pb-16">
          <FeaturedHero
            title={heroPost.title}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
            coverImage={heroPost.coverImage}
            category={heroPost.category}
            publishedAt={heroPost.publishedAt}
            readingTime={heroPost.readingTime}
            sidePosts={sidePosts.map((p) => ({
              title: p.title,
              slug: p.slug,
              categorySlug: p.category.slug,
              categoryName: p.category.name,
              excerpt: p.excerpt,
            }))}
          />
        </section>
      )}

      <section className="bg-[var(--surface-container-low)] border-y border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--error)] animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--error)]">
              Mudanças Legislativas — Alerta CTB
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--outline-variant)]">
            {[
              { status: 'Vigente Agora', text: 'Novas regras para o uso de viseiras em capacetes de motociclistas.' },
              { status: 'Em Votação', text: 'Alteração nos prazos de renovação para motoristas profissionais.' },
              { status: 'Jurisprudência', text: 'Decisão do STF sobre a validade da prova de recusa ao bafômetro.' },
            ].map((item, i) => (
              <div key={i} className="md:px-6 first:pl-0 last:pr-0 pt-4 md:pt-0 first:pt-0">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)] block mb-1">
                  {item.status}
                </span>
                <p className="font-mono text-xs text-[var(--on-surface-variant)] leading-relaxed hover:text-[var(--secondary)] transition-colors cursor-pointer">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        <div className="mb-8">
          <CategoryTabs categories={categories.map((c: any) => ({ name: c.name, slug: c.slug }))} />
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Notícias Recentes</h2>
          <Link href="/" className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] hover:opacity-80 flex items-center gap-1">
            Ver todas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {recentNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentNews.map((post, i) => (
              <ArticleCard key={post.id} {...post} animationDelay={i * 80} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">
              Nenhum artigo publicado ainda. Acesse <a href="/admin" className="text-[var(--secondary)] hover:underline">/admin</a> para criar conteúdo.
            </p>
          </div>
        )}
      </section>

      <WhatsAppBanner />

      {videos.length > 0 && (
        <section className="bg-[var(--surface-container-low)] py-16">
          <div className="max-w-content mx-auto px-4 md:px-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title">Vídeos em Destaque</h2>
              <Link href="/videos" className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] hover:opacity-80">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <VideoEmbed
                  youtubeId={(videos[0] as any).youtubeId}
                  title={(videos[0] as any).title}
                  description={(videos[0] as any).description}
                />
                <h3 className="font-display text-xl font-bold text-[var(--on-surface)] mt-4">
                  {(videos[0] as any).title}
                </h3>
              </div>
              {videos.length > 1 && (
                <div className="lg:col-span-5 flex flex-col gap-4 divide-y divide-[var(--outline-variant)]">
                  {videos.slice(1).map((video: any) => (
                    <div key={video.id} className="pt-4 first:pt-0">
                      <VideoEmbed youtubeId={video.youtubeId} title={video.title} thumbnail={video.thumbnail} />
                      <h4 className="font-display text-sm font-bold text-[var(--on-surface)] mt-2">{video.title}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {editorialPosts.length > 0 && (
        <section className="max-w-content mx-auto px-4 md:px-16 py-16">
          <h2 className="section-title mb-8">Análises & Opinião</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[var(--outline-variant)] rounded-lg overflow-hidden">
            <div className="lg:col-span-7 p-8 border-b lg:border-b-0 lg:border-r border-[var(--outline-variant)]">
              <ArticleCardHorizontal {...editorialPosts[0]} />
            </div>
            <div className="lg:col-span-5 flex flex-col divide-y divide-[var(--outline-variant)]">
              {editorialPosts.slice(1).map((post, i) => (
                <div key={post.id} className="p-6">
                  <ArticleCardHorizontal {...post} animationDelay={i * 80} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--primary-container)] border-t border-[var(--outline-variant)] py-24">
        <div className="max-w-content mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-4">
              Legal Drive — Especialistas
            </span>
            <h2 className="font-display text-4xl font-bold text-[var(--on-surface)] mb-6 leading-tight">
              Proteja seu direito de dirigir com inteligência.
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base leading-relaxed mb-8">
              O Legal Drive utiliza análise de dados e jurisprudência avançada para anular multas injustas e recuperar CNHs suspensas.
            </p>
            <div className="flex flex-wrap gap-8">
              {[{ v: '15k+', l: 'Casos Resolvidos' }, { v: '92%', l: 'Taxa de Sucesso' }].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-bold text-[var(--secondary)]">{s.v}</p>
                  <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--surface-container-high)] p-8 rounded-lg border border-[rgba(255,255,255,0.07)]">
            <h3 className="font-display text-xl font-bold text-[var(--primary)] mb-6">Consulta Rápida</h3>
            <form action="/contato" method="GET" className="space-y-4">
              <input name="nome" placeholder="Seu Nome" className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]" />
              <input name="whatsapp" placeholder="WhatsApp" type="tel" className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]" />
              <select name="tipo" className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors">
                <option>CNH Suspensa</option>
                <option>Lei Seca</option>
                <option>Multas Indevidas</option>
                <option>Radar/Velocidade</option>
              </select>
              <button type="submit" className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-sm font-bold tracking-widest uppercase py-4 rounded hover:brightness-110 transition-all">
                Consultar Agora
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
