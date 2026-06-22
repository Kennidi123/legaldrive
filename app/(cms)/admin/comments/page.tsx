import Link from 'next/link'
import { apiGet } from '../actions'
import DeleteCommentButton from './DeleteCommentButton'

export const dynamic = 'force-dynamic'

interface AdminComment {
  id: number
  author_name: string
  content: string
  likes: number
  created_at: string
  post_id: number
  post_title?: string | null
  post_slug?: string | null
  author_email?: string | null
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  } catch {
    return ''
  }
}

export default async function CommentsAdminPage() {
  const data = await apiGet('/api/comments?all=1')
  const comments: AdminComment[] = data?.docs || []
  const totalLikes = comments.reduce((s, c) => s + (c.likes || 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
          <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-1">Comentários</h1>
          <p className="font-sans text-sm text-[var(--outline)] mt-1">Comentários do público nas notícias. Você pode excluir qualquer um.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-[var(--secondary)] leading-none">{comments.length}</p>
            <p className="font-mono text-[9px] tracking-widest uppercase text-[var(--outline)] mt-1">Comentários</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-[var(--secondary)] leading-none">{totalLikes}</p>
            <p className="font-mono text-[9px] tracking-widest uppercase text-[var(--outline)] mt-1">❤ Curtidas</p>
          </div>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] p-12 text-center">
          <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhum comentário ainda</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display text-sm font-bold text-[var(--on-surface)]">{c.author_name || 'Anônimo'}</span>
                    {c.author_email && <span className="font-mono text-[10px] text-[var(--secondary)]">{c.author_email}</span>}
                    <span className="font-mono text-[10px] text-[var(--outline)]">{formatDate(c.created_at)}</span>
                    <span className="font-mono text-[10px] text-red-400">❤ {c.likes || 0}</span>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)] whitespace-pre-wrap break-words">{c.content}</p>
                  {c.post_title && (
                    <p className="mt-2 font-mono text-[10px] tracking-wider uppercase text-[var(--outline)]">
                      em: <span className="text-[var(--secondary)]">{c.post_title}</span>
                    </p>
                  )}
                </div>
                <DeleteCommentButton id={c.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
