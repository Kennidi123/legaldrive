import Link from 'next/link'
import { apiGet } from './actions'

export const dynamic = 'force-dynamic'

export default async function CmsDashboard() {
  const [postsData, categoriesData] = await Promise.all([
    apiGet('/api/posts?limit=50&sort=-updatedAt&depth=1'),
    apiGet('/api/categories?limit=50'),
  ])

  const posts = postsData?.docs || []
  const categories = categoriesData?.docs || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--on-surface)]">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded hover:brightness-110 transition-all"
        >
          + Novo Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'Publicados', value: posts.filter((p: any) => p.status === 'published').length },
          { label: 'Rascunhos', value: posts.filter((p: any) => p.status === 'draft').length },
          { label: 'Categorias', value: categories.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--surface-container-high)] rounded-lg border border-[rgba(255,255,255,0.07)] p-5">
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] mb-1">{stat.label}</p>
            <p className="font-display text-3xl font-bold text-[var(--secondary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Posts list */}
      <div className="bg-[var(--surface-container-high)] rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-5 border-b border-[var(--outline-variant)]">
          <h2 className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)]">Posts Recentes</h2>
        </div>
        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhum post ainda</p>
            <Link href="/admin/posts/new" className="mt-4 inline-block font-mono text-xs text-[var(--secondary)] uppercase tracking-widest hover:underline">
              Criar primeiro post →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--outline-variant)]">
                {['Título', 'Categoria', 'Status', 'Atualizado', 'Ações'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-mono text-[10px] tracking-widest uppercase text-[var(--outline)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => {
                const cat = typeof post.category === 'object' ? post.category : null
                return (
                  <tr key={post.id} className="border-b border-[var(--outline-variant)] last:border-0 hover:bg-[var(--surface-container)] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm text-[var(--on-surface)] font-medium truncate max-w-xs">{post.title}</p>
                      <p className="font-mono text-[10px] text-[var(--outline)]">{post.slug}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-[var(--on-surface-variant)]">
                      {cat?.name || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded ${post.status === 'published' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-[var(--outline)]">
                      {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/posts/${post.id}`} className="font-mono text-xs text-[var(--secondary)] hover:underline uppercase tracking-widest">
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
