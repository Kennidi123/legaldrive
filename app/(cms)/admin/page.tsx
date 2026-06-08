/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { apiGet } from './actions'
import { getPostCoverImage } from '@/lib/lexical'
import DeletePostButton from './DeletePostButton'

export const dynamic = 'force-dynamic'

function statusInfo(post: any) {
  const scheduled = post.status === 'published' && post.publishedAt && new Date(post.publishedAt).getTime() > Date.now()
  if (scheduled) return { label: 'Agendado', cls: 'bg-amber-900/80 text-amber-200' }
  if (post.status === 'published') return { label: 'Publicado', cls: 'bg-green-900/80 text-green-200' }
  return { label: 'Rascunho', cls: 'bg-yellow-900/80 text-yellow-200' }
}

const featureBadge: Record<string, string> = {
  destaque: '⭐ Destaque',
  principal: '🏆 Home',
}

export default async function CmsDashboard() {
  const [postsData, categoriesData] = await Promise.all([
    apiGet('/api/posts?limit=100&sort=-updatedAt&depth=1'),
    apiGet('/api/categories?limit=50'),
  ])

  const posts = postsData?.docs || []
  const categories = categoriesData?.docs || []

  const totalViews = posts.reduce((sum: number, p: any) => sum + (p.views || 0), 0)
  const stats = [
    { label: 'Total', value: posts.length, icon: '📰' },
    { label: 'Publicados', value: posts.filter((p: any) => p.status === 'published').length, icon: '✅' },
    { label: 'Rascunhos', value: posts.filter((p: any) => p.status === 'draft').length, icon: '📝' },
    { label: 'Visualizações', value: totalViews, icon: '👁' },
    { label: 'Categorias', value: categories.length, icon: '🗂️' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--on-surface)]">Dashboard</h1>
          <p className="font-sans text-sm text-[var(--outline)] mt-1">Gerencie as notícias do portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/authors"
            className="border border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
          >
            👤 Autores
          </Link>
          <Link
            href="/admin/videos"
            className="border border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
          >
            🎬 Vídeos
          </Link>
          <Link
            href="/admin/posts/new"
            className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-sm"
          >
            + Nova Notícia
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)]">{stat.label}</p>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="font-display text-4xl font-bold text-[var(--secondary)] mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Histórico de notícias em cards */}
      <div>
        <h2 className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] mb-4">
          Histórico de Notícias {posts.length > 0 && <span className="text-[var(--outline)]">({posts.length})</span>}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] p-12 text-center">
            <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhuma notícia ainda</p>
            <Link href="/admin/posts/new" className="mt-4 inline-block font-mono text-xs text-[var(--secondary)] uppercase tracking-widest hover:underline">
              Criar primeira notícia →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {posts.map((post: any) => {
              const cat = typeof post.category === 'object' ? post.category : null
              const st = statusInfo(post)
              const cover = getPostCoverImage(post)
              const viewHref = cat && post.status === 'published' ? `/${cat.slug}/${post.slug}` : null
              return (
                <div
                  key={post.id}
                  className="group bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] overflow-hidden shadow-sm hover:border-[var(--secondary)] transition-colors flex flex-col"
                >
                  {/* Capa */}
                  <Link href={`/admin/posts/${post.id}`} className="relative block aspect-video bg-[var(--surface-container)] overflow-hidden">
                    {cover ? (
                      <img src={cover} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">🖼️</div>
                    )}
                    <span className={`absolute top-2 left-2 font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded ${st.cls}`}>
                      {st.label}
                    </span>
                    {featureBadge[post.featureLevel] && (
                      <span className="absolute top-2 right-2 font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded bg-black/70 text-[var(--secondary)]">
                        {featureBadge[post.featureLevel]}
                      </span>
                    )}
                  </Link>

                  {/* Detalhes */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--secondary)]">{cat?.name || 'Sem categoria'}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-[var(--on-surface)] leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs text-[var(--on-surface-variant)] line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--outline-variant)]">
                      <span className="font-mono text-[9px] text-[var(--outline)] uppercase tracking-wider flex items-center gap-2">
                        {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
                        <span className="text-[var(--secondary)]">· 👁 {post.views ?? 0}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        {viewHref && (
                          <Link href={viewHref} target="_blank" className="font-mono text-[9px] text-[var(--outline)] hover:text-[var(--secondary)] uppercase tracking-widest transition-colors">
                            Ver ↗
                          </Link>
                        )}
                        <Link href={`/admin/posts/${post.id}`} className="font-mono text-[9px] text-[var(--secondary)] hover:underline uppercase tracking-widest font-bold">
                          Editar
                        </Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
