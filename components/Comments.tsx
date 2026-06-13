'use client'

import { useCallback, useEffect, useState } from 'react'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

interface Comment {
  id: number
  author_name: string
  content: string
  likes: number
  created_at: string
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}

const CARD_BG = '#f1f5f9'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

export default function Comments({ postId }: { postId: string | number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/api/comments?postId=${postId}`, { cache: 'no-store' })
      const data = await res.json()
      setComments(Array.isArray(data?.docs) ? data.docs : [])
    } catch {
      // silencioso — apenas não mostra comentários
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    load()
    try {
      const raw = localStorage.getItem('ld:liked-comments')
      if (raw) setLiked(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [load])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text) {
      setError('Escreva um comentário.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, authorName: name.trim(), content: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Não foi possível enviar.')
        return
      }
      setComments((c) => [data.doc, ...c])
      setContent('')
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSubmitting(false)
    }
  }

  async function like(id: number) {
    if (liked[id]) return
    // otimista
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c)))
    const nextLiked = { ...liked, [id]: true }
    setLiked(nextLiked)
    try {
      localStorage.setItem('ld:liked-comments', JSON.stringify(nextLiked))
    } catch {
      /* ignore */
    }
    try {
      await fetch(`${BACKEND}/api/comments/${id}/like`, { method: 'POST', keepalive: true })
    } catch {
      /* mantém o estado otimista */
    }
  }

  return (
    <section className="mt-16">
      <h4 className="font-display text-2xl font-semibold text-[var(--on-surface)] mb-6">
        Comentários{comments.length > 0 && ` (${comments.length})`}
      </h4>

      {/* Formulário (sem login) */}
      <form onSubmit={submit} className="p-6 rounded-xl border border-[var(--on-primary-fixed-variant)] mb-8" style={{ background: CARD_BG }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome (opcional)"
          maxLength={80}
          className="w-full mb-3 p-3 rounded-lg border border-[var(--outline-variant)] focus:ring-1 focus:ring-[var(--secondary)] text-[var(--on-surface)] bg-white placeholder:text-[var(--on-surface-variant)] focus:outline-none text-sm"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Adicione seu comentário ou dúvida..."
          className="w-full p-4 rounded-lg border border-[var(--outline-variant)] focus:ring-1 focus:ring-[var(--secondary)] text-[var(--on-surface)] bg-white placeholder:text-[var(--on-surface-variant)] resize-none focus:outline-none"
        />
        {error && <p className="font-mono text-[11px] text-red-600 mt-2 uppercase tracking-wider">{error}</p>}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[var(--primary-container)] text-[var(--primary)] border border-[var(--primary)] px-8 py-2 rounded-lg font-mono text-xs hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Publicar'}
          </button>
        </div>
      </form>

      {/* Lista */}
      {loading ? (
        <p className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-widest">Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-widest">Seja o primeiro a comentar.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="p-5 rounded-xl border border-[var(--on-primary-fixed-variant)]" style={{ background: CARD_BG }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-container-high)] ring-2 ring-[var(--secondary)] flex items-center justify-center flex-none font-mono text-sm text-[var(--secondary)] uppercase">
                  {(c.author_name || 'A').charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-sm font-bold text-[var(--on-surface)]">{c.author_name || 'Anônimo'}</p>
                    <span className="font-mono text-[10px] text-[var(--on-surface-variant)]">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="mt-1 text-[var(--on-surface)] text-sm whitespace-pre-wrap break-words">{c.content}</p>
                  <button
                    type="button"
                    onClick={() => like(c.id)}
                    disabled={liked[c.id]}
                    aria-label="Curtir"
                    className={`mt-3 inline-flex items-center gap-1.5 font-mono text-xs transition-colors ${
                      liked[c.id] ? 'text-red-500' : 'text-[var(--on-surface-variant)] hover:text-red-500'
                    }`}
                  >
                    <HeartIcon filled={!!liked[c.id]} />
                    <span>{c.likes || 0}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
