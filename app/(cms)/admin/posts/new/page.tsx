'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../ImageUpload'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

function getToken() {
  const match = document.cookie.match(/(?:^|;\s*)cms_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 ${type === 'success' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'}`}>
      <span>{type === 'success' ? '✓' : '✗'}</span> {msg}
    </div>
  )
}

export default function NewPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showAuthorForm, setShowAuthorForm] = useState(false)
  const [newAuthor, setNewAuthor] = useState({ name: '', role: '', avatarUrl: '' })
  const [creatingAuthor, setCreatingAuthor] = useState(false)
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '',
    author: '', status: 'draft' as 'draft' | 'published' | 'scheduled',
    featureLevel: 'normal', scheduledAt: '', coverImageUrl: '', youtubeId: '', externalLink: '', readingTime: '',
  })

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    const token = getToken()
    const h = { Authorization: `JWT ${token}` }
    Promise.all([
      fetch(`${BACKEND}/api/categories?limit=50&sort=name`, { headers: h }).then(r => r.json()),
      fetch(`${BACKEND}/api/authors?limit=50`, { headers: h }).then(r => r.json()),
    ]).then(([cats, auths]) => {
      setCategories(cats?.docs || [])
      setAuthors(auths?.docs || [])
      if ((cats?.docs || []).length === 0) showToast('Sem categorias. Acesse /api/seed para criar.', 'error')
    })
  }, [showToast])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm(f => {
      const next: any = { ...f, [name]: val }
      if (name === 'title' && !slugManual) next.slug = slugify(value as string)
      return next
    })
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
    if (form.status === 'scheduled' && !form.scheduledAt) { showToast('Defina a data e hora do agendamento.', 'error'); return }
    setSaving(true)
    try {
      const token = getToken()
      const body: any = {
        title: form.title, slug: form.slug, excerpt: form.excerpt,
        status: form.status === 'draft' ? 'draft' : 'published', featureLevel: form.featureLevel,
        content: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: form.content, version: 1 }], version: 1, direction: 'ltr', format: '', indent: 0 }], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
      }
      if (form.category) body.category = /^\d+$/.test(form.category) ? Number(form.category) : form.category
      if (form.author) body.author = /^\d+$/.test(form.author) ? Number(form.author) : form.author
      if (form.coverImageUrl) body.coverImageUrl = form.coverImageUrl
      if (form.youtubeId) body.youtubeId = form.youtubeId
      if (form.externalLink) body.externalLink = form.externalLink
      if (form.readingTime) body.readingTime = Number(form.readingTime)
      if (form.status === 'published') body.publishedAt = new Date().toISOString()
      if (form.status === 'scheduled') body.publishedAt = new Date(form.scheduledAt).toISOString()

      const res = await fetch(`${BACKEND}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { const msg = data.errors?.[0]?.message || data.message || data.error || `Erro ${res.status}`; console.error('[Admin] criar post:', data); showToast(msg, 'error'); setSaving(false); return }
      showToast('Post criado com sucesso!', 'success')
      setTimeout(() => router.push('/admin'), 1200)
    } catch { showToast('Erro de conexão', 'error'); setSaving(false) }
  }

  const inp = "w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
  const lbl = "font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5"
  const sec = "bg-[var(--surface-container-high)] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 space-y-5"

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <Toast {...toast} />}

      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
          <h1 className="font-display text-2xl font-bold text-[var(--on-surface)] mt-1">Novo Post</h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setForm(f => ({ ...f, status: 'draft' }))} className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-colors ${form.status === 'draft' ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700' : 'border-[var(--outline-variant)] text-[var(--outline)]'}`}>Rascunho</button>
          <button type="button" onClick={() => setForm(f => ({ ...f, status: 'published' }))} className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-colors ${form.status === 'published' ? 'bg-green-900/40 text-green-300 border-green-700' : 'border-[var(--outline-variant)] text-[var(--outline)]'}`}>Publicar</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Título e Slug */}
        <div className={sec}>
          <div>
            <label className={lbl}>Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Novas regras para multas de radar em 2025" className={inp} />
          </div>
          <div>
            <label className={lbl}>Slug (URL) *</label>
            <div className="flex gap-2">
              <input name="slug" value={form.slug} onChange={e => { setSlugManual(true); handleChange(e) }} required placeholder="novas-regras-multas-radar-2025" className={inp} />
              <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.title) })) }} className="px-3 py-2 rounded-lg border border-[var(--outline-variant)] font-mono text-[10px] text-[var(--outline)] hover:text-[var(--secondary)] transition-colors whitespace-nowrap">↺ Gerar</button>
            </div>
          </div>
          <div>
            <label className={lbl}>Resumo * <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(exibido nos cards)</span></label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} placeholder="Breve descrição do artigo..." className={inp} />
          </div>
        </div>

        {/* Conteúdo */}
        <div className={sec}>
          <div>
            <label className={lbl}>Conteúdo do Artigo</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={14} placeholder="Escreva o conteúdo completo do artigo aqui..." className={`${inp} font-mono text-sm leading-relaxed`} />
          </div>
        </div>

        {/* Classificação */}
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
              <ImageUpload
                label="Foto do Autor"
                value={newAuthor.avatarUrl}
                onChange={url => setNewAuthor(a => ({ ...a, avatarUrl: url }))}
              />
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
                <option value="published">✅ Publicar agora</option>
                <option value="scheduled">🕒 Agendar</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Leitura (min)</label>
              <input name="readingTime" type="number" min="1" value={form.readingTime} onChange={handleChange} className={inp} />
            </div>
            <div>
              <label className={lbl}>Destaque</label>
              <select name="featureLevel" value={form.featureLevel} onChange={handleChange} className={inp}>
                <option value="normal">Normal</option>
                <option value="destaque">⭐ Destaque (categoria)</option>
                <option value="principal">🏆 Destaque Principal (Home)</option>
              </select>
            </div>
          </div>

          {form.status === 'scheduled' && (
            <div>
              <label className={lbl}>Publicar em (data e hora)</label>
              <input name="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={handleChange} className={inp} />
              <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">O post é publicado automaticamente nesse horário.</p>
            </div>
          )}
        </div>

        {/* Mídia e Links */}
        <div className={sec}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Mídia & Links</p>
          <ImageUpload
            label="Imagem de Capa"
            value={form.coverImageUrl}
            onChange={url => setForm(f => ({ ...f, coverImageUrl: url }))}
          />
          <div>
            <label className={lbl}>Vídeo YouTube (ID)</label>
            <input name="youtubeId" value={form.youtubeId} onChange={handleChange} placeholder="dQw4w9WgXcQ" className={inp} />
          </div>
          <div>
            <label className={lbl}>Link Externo <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(fonte original ou notícia)</span></label>
            <input name="externalLink" type="url" value={form.externalLink} onChange={handleChange} placeholder="https://g1.globo.com/..." className={inp} />
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pb-4">
          <button type="submit" disabled={saving} className="flex-1 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? 'Salvando...' : form.status === 'published' ? '✅ Publicar Post' : '💾 Salvar Rascunho'}
          </button>
          <button type="button" onClick={() => router.push('/admin')} className="px-6 font-mono text-xs tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors border border-[var(--outline-variant)] rounded-xl">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
