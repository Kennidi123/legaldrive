'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

function getToken() {
  return document.cookie.split(';').find(c => c.trim().startsWith('cms_token='))?.split('=')[1] || ''
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '', author: '',
    status: 'draft', featured: false, coverImageUrl: '', youtubeId: '', readingTime: '',
  })

  useEffect(() => {
    const token = getToken()
    const headers = { Authorization: `JWT ${token}` }
    Promise.all([
      fetch(`${BACKEND}/api/categories?limit=50`, { headers }).then(r => r.json()),
      fetch(`${BACKEND}/api/authors?limit=50`, { headers }).then(r => r.json()),
    ]).then(([cats, auths]) => {
      setCategories(cats?.docs || [])
      setAuthors(auths?.docs || [])
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !form.slug ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getToken()
      const body: any = {
        title: form.title, slug: form.slug, excerpt: form.excerpt,
        status: form.status, featured: form.featured,
        coverImageUrl: form.coverImageUrl || undefined,
        youtubeId: form.youtubeId || undefined,
        readingTime: form.readingTime ? Number(form.readingTime) : undefined,
        publishedAt: form.status === 'published' ? new Date().toISOString() : undefined,
        content: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: form.content }], version: 1 }], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
      }
      if (form.category) body.category = form.category
      if (form.author) body.author = form.author

      const res = await fetch(`${BACKEND}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.errors?.[0]?.message || 'Erro ao criar post')
        setSaving(false)
        return
      }
      router.push('/cms')
    } catch (err) {
      setError('Erro de conexão')
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors"
  const labelClass = "font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] block mb-2"

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--on-surface)]">Novo Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Resumo *</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Conteúdo *</label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={10} className={inputClass} placeholder="Digite o conteúdo do artigo..." />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Categoria</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="">Selecionar...</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Autor</label>
            <select name="author" value={form.author} onChange={handleChange} className={inputClass}>
              <option value="">Selecionar...</option>
              {authors.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicar</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tempo leitura (min)</label>
            <input name="readingTime" type="number" value={form.readingTime} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[var(--secondary)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)]">Destaque Home</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>URL da Imagem de Capa</label>
            <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>ID do YouTube</label>
            <input name="youtubeId" value={form.youtubeId} onChange={handleChange} className={inputClass} placeholder="dQw4w9WgXcQ" />
          </div>
        </div>

        {error && <p className="font-mono text-xs text-red-400 uppercase tracking-wider">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={saving} className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 rounded hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Post'}
          </button>
          <button type="button" onClick={() => router.push('/cms')} className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
