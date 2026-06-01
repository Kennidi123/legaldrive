'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

function getToken() {
  const match = document.cookie.match(/(?:^|;\s*)cms_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function lexicalToText(content: any): string {
  try {
    const children = content?.root?.children || []
    return children.map((node: any) =>
      (node.children || []).map((c: any) => c.text || '').join('')
    ).join('\n\n')
  } catch { return '' }
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 ${type === 'success' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'}`}>
      <span>{type === 'success' ? '✓' : '✗'}</span> {msg}
    </div>
  )
}

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showAuthorForm, setShowAuthorForm] = useState(false)
  const [newAuthor, setNewAuthor] = useState({ name: '', role: '', avatarUrl: '' })
  const [creatingAuthor, setCreatingAuthor] = useState(false)

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', status: 'draft' as 'draft' | 'published',
    featured: false, category: '', author: '', coverImageUrl: '', youtubeId: '', externalLink: '', readingTime: '',
  })

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    const token = getToken()
    const h = { Authorization: `JWT ${token}` }
    Promise.all([
      fetch(`${BACKEND}/api/posts/${id}?depth=1`, { headers: h }).then(r => r.json()),
      fetch(`${BACKEND}/api/categories?limit=50&sort=name`, { headers: h }).then(r => r.json()),
      fetch(`${BACKEND}/api/authors?limit=50`, { headers: h }).then(r => r.json()),
    ]).then(([post, cats, auths]) => {
      setCategories(cats?.docs || [])
      setAuthors(auths?.docs || [])
      if (post?.id) {
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: lexicalToText(post.content),
          status: post.status || 'draft',
          featured: post.featured || false,
          category: typeof post.category === 'object' ? post.category?.id : post.category || '',
          author: typeof post.author === 'object' ? post.author?.id : post.author || '',
          coverImageUrl: post.coverImageUrl || '',
          youtubeId: post.youtubeId || '',
          externalLink: post.externalLink || '',
          readingTime: post.readingTime?.toString() || '',
        })
      }
      setLoading(false)
    })
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm(f => ({ ...f, [name]: val }))
  }

  async function createAuthor() {
    if (!newAuthor.name.trim()) return
    setCreatingAuthor(true)
    try {
      const token = getToken()
      const res = await fetch(`${BACKEND}/api/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(newAuthor),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.errors?.[0]?.message || 'Erro ao criar autor', 'error'); return }
      const created = data.doc
      setAuthors(a => [...a, created])
      setForm(f => ({ ...f, author: created.id }))
      setShowAuthorForm(false)
      setNewAuthor({ name: '', role: '', avatarUrl: '' })
      showToast(`Autor "${created.name}" criado!`, 'success')
    } finally {
      setCreatingAuthor(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug || !form.excerpt) { showToast('Título, slug e resumo são obrigatórios.', 'error'); return }
    setSaving(true)
    try {
      const token = getToken()
      const body: any = {
        title: form.title, slug: form.slug, excerpt: form.excerpt,
        status: form.status, featured: form.featured,
        content: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: form.content, version: 1 }], version: 1, direction: 'ltr', format: '', indent: 0 }], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
      }
      if (form.category) body.category = /^\d+$/.test(form.category) ? Number(form.category) : form.category
      body.author = form.author ? (/^\d+$/.test(form.author) ? Number(form.author) : form.author) : null
      body.coverImageUrl = form.coverImageUrl || null
      body.youtubeId = form.youtubeId || null
      body.externalLink = form.externalLink || null
      if (form.readingTime) body.readingTime = Number(form.readingTime)
      if (form.status === 'published') body.publishedAt = new Date().toISOString()

      const res = await fetch(`${BACKEND}/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.errors?.[0]?.message || 'Erro ao salvar', 'error'); setSaving(false); return }
      showToast('Alterações salvas!', 'success')
      setTimeout(() => router.push('/cms'), 1000)
    } catch { showToast('Erro de conexão', 'error'); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) return
    setDeleting(true)
    try {
      const token = getToken()
      const res = await fetch(`${BACKEND}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `JWT ${token}` },
      })
      if (!res.ok) { showToast('Erro ao excluir', 'error'); setDeleting(false); return }
      showToast('Post excluído', 'success')
      setTimeout(() => router.push('/cms'), 1000)
    } catch { showToast('Erro de conexão', 'error'); setDeleting(false) }
  }

  if (loading) return <div className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest py-20 text-center">Carregando post...</div>

  const inp = "w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
  const lbl = "font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5"
  const sec = "bg-[var(--surface-container-high)] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 space-y-5"

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <Toast {...toast} />}

      <div className="flex items-center justify-between">
        <div>
          <Link href="/cms" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
          <h1 className="font-display text-2xl font-bold text-[var(--on-surface)] mt-1">Editar Post</h1>
        </div>
        <span className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg ${form.status === 'published' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
          {form.status === 'published' ? 'Publicado' : 'Rascunho'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={sec}>
          <div>
            <label className={lbl}>Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inp} />
          </div>
          <div>
            <label className={lbl}>Slug (URL) *</label>
            <div className="flex gap-2">
              <input name="slug" value={form.slug} onChange={handleChange} required className={inp} />
              <button type="button" onClick={() => setForm(f => ({ ...f, slug: slugify(f.title) }))} className="px-3 py-2 rounded-lg border border-[var(--outline-variant)] font-mono text-[10px] text-[var(--outline)] hover:text-[var(--secondary)] transition-colors whitespace-nowrap">↺ Gerar</button>
            </div>
          </div>
          <div>
            <label className={lbl}>Resumo *</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} className={inp} />
          </div>
        </div>

        <div className={sec}>
          <div>
            <label className={lbl}>Conteúdo do Artigo</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={14} className={`${inp} font-mono text-sm leading-relaxed`} />
          </div>
        </div>

        <div className={sec}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Classificação</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Categoria *</label>
              <select name="category" value={form.category} onChange={handleChange} required className={inp}>
                <option value="">Selecionar categoria...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${lbl} mb-0`}>Autor</label>
                <button type="button" onClick={() => setShowAuthorForm(v => !v)} className="font-mono text-[10px] text-[var(--secondary)] hover:underline">
                  {showAuthorForm ? '✕ Fechar' : '+ Novo Autor'}
                </button>
              </div>
              <select name="author" value={form.author} onChange={handleChange} className={inp}>
                <option value="">Sem autor</option>
                {authors.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {showAuthorForm && (
            <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg p-4 space-y-3">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)]">Criar Novo Autor</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Nome *</label>
                  <input value={newAuthor.name} onChange={e => setNewAuthor(a => ({ ...a, name: e.target.value }))} placeholder="Dr. João Silva" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Cargo</label>
                  <input value={newAuthor.role} onChange={e => setNewAuthor(a => ({ ...a, role: e.target.value }))} placeholder="Advogado de Trânsito" className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Foto (URL)</label>
                <input value={newAuthor.avatarUrl} onChange={e => setNewAuthor(a => ({ ...a, avatarUrl: e.target.value }))} placeholder="https://..." className={inp} />
              </div>
              <button type="button" onClick={createAuthor} disabled={creatingAuthor || !newAuthor.name.trim()} className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
                {creatingAuthor ? 'Criando...' : 'Criar Autor'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div>
              <label className={lbl}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inp}>
                <option value="draft">📝 Rascunho</option>
                <option value="published">✅ Publicado</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Leitura (min)</label>
              <input name="readingTime" type="number" min="1" value={form.readingTime} onChange={handleChange} className={inp} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[var(--secondary)]" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] group-hover:text-[var(--on-surface)] transition-colors">⭐ Destaque Home</span>
              </label>
            </div>
          </div>
        </div>

        <div className={sec}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Mídia & Links</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Imagem de Capa (URL)</label>
              <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} placeholder="https://imagem.jpg" className={inp} />
            </div>
            <div>
              <label className={lbl}>Vídeo YouTube (ID)</label>
              <input name="youtubeId" value={form.youtubeId} onChange={handleChange} placeholder="dQw4w9WgXcQ" className={inp} />
            </div>
          </div>
          <div>
            <label className={lbl}>Link Externo <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(fonte original ou notícia)</span></label>
            <input name="externalLink" type="url" value={form.externalLink} onChange={handleChange} placeholder="https://g1.globo.com/..." className={inp} />
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <button type="submit" disabled={saving} className="flex-1 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? 'Salvando...' : '💾 Salvar Alterações'}
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting} className="px-6 font-mono text-xs tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors border border-red-900/50 rounded-xl disabled:opacity-50">
            {deleting ? 'Excluindo...' : '🗑 Excluir'}
          </button>
          <button type="button" onClick={() => router.push('/cms')} className="px-6 font-mono text-xs tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors border border-[var(--outline-variant)] rounded-xl">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
