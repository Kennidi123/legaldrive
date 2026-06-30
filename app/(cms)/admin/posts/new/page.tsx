'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../ImageUpload'
import SectionsField from '../../SectionsField'
import { htmlToLexical, newSection, serializeSections, type SectionValue } from '../../content-utils'
import SourceLinksField from '../../SourceLinksField'
import { type SourceLink } from '@/lib/sources'

/** Limpa as linhas de fontes: remove vazias e normaliza os campos. */
function cleanSources(sources: SourceLink[]): SourceLink[] {
  return sources
    .map(s => ({ url: (s.url || '').trim(), label: (s.label || '').trim() }))
    .filter(s => s.url)
    .map(s => (s.label ? { url: s.url, label: s.label } : { url: s.url }))
}

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

function getToken() {
  const match = document.cookie.match(/(?:^|;\s*)cms_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

// Saneia o slug enquanto digita: sem acento, sem espaço/símbolo (vira "-"). Mantém
// o "-" final para não atrapalhar a digitação. Evita slugs com acento (que dão 404).
function sanitizeSlugInput(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-')
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

function SectionHeader({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-[var(--outline-variant)]">
      <span className="text-xl leading-none mt-0.5">{icon}</span>
      <div>
        <h2 className="font-display text-base font-bold text-[var(--on-surface)] leading-tight">{title}</h2>
        {desc && <p className="font-sans text-[11px] text-[var(--outline)] mt-0.5 leading-snug">{desc}</p>}
      </div>
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
    title: '', slug: '', excerpt: '', category: '',
    author: '', status: 'draft' as 'draft' | 'published' | 'scheduled',
    featureLevel: 'normal', scheduledAt: '', coverImageUrl: '', coverImageMediumUrl: '', coverImageSquareUrl: '', youtubeId: '', readingTime: '',
  })
  const [sources, setSources] = useState<SourceLink[]>([])
  const [sections, setSections] = useState<SectionValue[]>([newSection()])

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
    if (serializeSections(sections).length === 0) { showToast('Adicione ao menos uma seção com texto ou mídia.', 'error'); return }
    if (!form.coverImageUrl) { showToast('A imagem de capa é obrigatória.', 'error'); return }
    if (form.status === 'scheduled' && !form.scheduledAt) { showToast('Defina a data e hora do agendamento.', 'error'); return }
    setSaving(true)
    try {
      const token = getToken()
      const serializedSections = serializeSections(sections)
      const body: any = {
        title: form.title, slug: form.slug, excerpt: form.excerpt,
        status: form.status === 'draft' ? 'draft' : 'published', featureLevel: form.featureLevel,
        sections: serializedSections,
        // Mantém o campo legado `content` preenchido (1ª seção) por compatibilidade.
        content: serializedSections[0]?.content || htmlToLexical(''),
      }
      if (form.category) body.category = /^\d+$/.test(form.category) ? Number(form.category) : form.category
      if (form.author) body.author = /^\d+$/.test(form.author) ? Number(form.author) : form.author
      if (form.coverImageUrl) body.coverImageUrl = form.coverImageUrl
      if (form.coverImageMediumUrl) body.coverImageMediumUrl = form.coverImageMediumUrl
      if (form.coverImageSquareUrl) body.coverImageSquareUrl = form.coverImageSquareUrl
      if (form.youtubeId) body.youtubeId = form.youtubeId
      const cleanedSources = cleanSources(sources)
      if (cleanedSources.length) body.sources = cleanedSources
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

  const inp = "w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all placeholder:text-[var(--outline)]"
  const lbl = "font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5"
  const card = "bg-[var(--surface-container-high)] border border-[var(--outline-variant)] rounded-2xl p-6 shadow-sm"

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}

      {/* Top bar */}
      <div>
        <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
        <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-1">Nova Notícia</h1>
        <p className="font-sans text-sm text-[var(--outline)] mt-1">Preencha as informações, organize o conteúdo e publique.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ===== COLUNA PRINCIPAL ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações básicas */}
          <div className={card}>
            <SectionHeader icon="📝" title="Informações Básicas" />
            <div className="space-y-5">
              <div>
                <label className={lbl}>Título *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Novas regras para multas de radar em 2025" className={`${inp} text-base`} />
              </div>
              <div>
                <label className={lbl}>Slug (URL) *</label>
                <div className="flex gap-2">
                  <input name="slug" value={form.slug} onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: sanitizeSlugInput(e.target.value) })) }} required placeholder="novas-regras-multas-radar-2025" className={inp} />
                  <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.title) })) }} className="px-3 py-2 rounded-lg border border-[var(--outline-variant)] font-mono text-[10px] text-[var(--outline)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] transition-colors whitespace-nowrap">↺ Gerar</button>
                </div>
              </div>
              <div>
                <label className={lbl}>Resumo * <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(exibido nos cards)</span></label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} placeholder="Breve descrição do artigo..." className={inp} />
              </div>
            </div>
          </div>

          {/* Corpo em seções dinâmicas (texto + mídia), com adicionar/mover/excluir */}
          <div className={card}>
            <SectionHeader icon="📰" title="Conteúdo do Artigo" desc="Monte a notícia em seções: cada uma tem um texto e, opcionalmente, mídia (imagem/galeria/vídeo). Adicione quantas quiser e reordene com ↑/↓." />
            <SectionsField value={sections} onChange={setSections} />
          </div>
        </div>

        {/* ===== BARRA LATERAL ===== */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          {/* Publicação */}
          <div className={card}>
            <SectionHeader icon="🚀" title="Publicação" />
            <div className="space-y-4">
              <div>
                <label className={lbl}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inp}>
                  <option value="draft">📝 Rascunho</option>
                  <option value="published">✅ Publicar agora</option>
                  <option value="scheduled">🕒 Agendar</option>
                </select>
              </div>
              {form.status === 'scheduled' && (
                <div>
                  <label className={lbl}>Publicar em (data e hora)</label>
                  <input name="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={handleChange} className={inp} />
                  <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">O post é publicado automaticamente nesse horário.</p>
                </div>
              )}
              <button type="submit" disabled={saving} className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
                {saving ? 'Salvando...' : form.status === 'published' ? '✅ Publicar' : form.status === 'scheduled' ? '🕒 Agendar' : '💾 Salvar Rascunho'}
              </button>
              <button type="button" onClick={() => router.push('/admin')} className="w-full font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors py-2">
                Cancelar
              </button>
            </div>
          </div>

          {/* Capa & Links */}
          <div className={card}>
            <SectionHeader icon="🖼️" title="Capa & Links" />
            <div className="space-y-4">
              <div>
                <ImageUpload
                  label="Imagem de Capa — GRANDE (destaque) *"
                  value={form.coverImageUrl}
                  onChange={url => setForm(f => ({ ...f, coverImageUrl: url }))}
                />
                <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">Tamanho ideal: <strong>1200 × 675 px</strong> (16:9). Usada no destaque e no topo da notícia.</p>
              </div>
              <div>
                <ImageUpload
                  label="Imagem MÉDIA (seção de notícias)"
                  value={form.coverImageMediumUrl}
                  onChange={url => setForm(f => ({ ...f, coverImageMediumUrl: url }))}
                />
                <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">Opcional. Tamanho ideal: <strong>800 × 450 px</strong> (16:9). Usada nos cards das listas. Se vazio, usa a capa.</p>
              </div>
              <div>
                <ImageUpload
                  label="Imagem PEQUENA / quadrada (relacionados)"
                  value={form.coverImageSquareUrl}
                  onChange={url => setForm(f => ({ ...f, coverImageSquareUrl: url }))}
                />
                <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">Opcional. Tamanho ideal: <strong>400 × 400 px</strong> (1:1). Usada nas miniaturas de artigos relacionados. Se vazio, usa a capa.</p>
              </div>
              <div>
                <label className={lbl}>Vídeo de Capa <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(YouTube, opcional)</span></label>
                <input name="youtubeId" value={form.youtubeId} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className={inp} />
                <p className="font-sans text-[10px] text-[var(--outline)] mt-1.5 normal-case tracking-normal">Se preencher, a capa da notícia vira um player. A imagem acima é usada como prévia.</p>
              </div>
              <SourceLinksField value={sources} onChange={setSources} />
            </div>
          </div>

          {/* Classificação */}
          <div className={card}>
            <SectionHeader icon="🗂️" title="Classificação" />
            <div className="space-y-4">
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
                    {showAuthorForm ? '✕ Fechar' : '+ Novo'}
                  </button>
                </div>
                <select name="author" value={form.author} onChange={handleChange} className={inp}>
                  <option value="">Sem autor</option>
                  {authors.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              {showAuthorForm && (
                <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg p-4 space-y-3">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)]">Criar Novo Autor</p>
                  <div>
                    <label className={lbl}>Nome *</label>
                    <input value={newAuthor.name} onChange={e => setNewAuthor(a => ({ ...a, name: e.target.value }))} placeholder="Dr. João Silva" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Cargo</label>
                    <input value={newAuthor.role} onChange={e => setNewAuthor(a => ({ ...a, role: e.target.value }))} placeholder="Advogado de Trânsito" className={inp} />
                  </div>
                  <ImageUpload
                    label="Foto do Autor"
                    value={newAuthor.avatarUrl}
                    onChange={url => setNewAuthor(a => ({ ...a, avatarUrl: url }))}
                  />
                  <button type="button" onClick={createAuthor} disabled={creatingAuthor || !newAuthor.name.trim()} className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
                    {creatingAuthor ? 'Criando...' : 'Criar Autor'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Leitura (min)</label>
                  <input name="readingTime" type="number" min="1" value={form.readingTime} onChange={handleChange} placeholder="5" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Destaque</label>
                  <select name="featureLevel" value={form.featureLevel} onChange={handleChange} className={inp}>
                    <option value="normal">Normal</option>
                    <option value="destaque">⭐ Categoria</option>
                    <option value="principal">🏆 Home</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
