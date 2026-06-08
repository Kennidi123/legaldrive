'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createVideoAction, deleteVideoAction } from '../actions'
import { extractYouTubeId } from '@/lib/youtube'

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 ${type === 'success' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'}`}>
      <span>{type === 'success' ? '✓' : '✗'}</span> {msg}
    </div>
  )
}

const inp = 'w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all placeholder:text-[var(--outline)]'
const lbl = 'font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5'
const card = 'bg-[var(--surface-container-high)] border border-[var(--outline-variant)] rounded-2xl p-6 shadow-sm'

export default function VideoAdmin({ videos }: { videos: any[] }) {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', link: '', description: '' })
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [pending, startTransition] = useTransition()

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Pré-visualização do vídeo enquanto digita
  const previewId = extractYouTubeId(form.link)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { showToast('Informe o título do vídeo.', 'error'); return }
    if (!previewId) { showToast('Link do YouTube inválido.', 'error'); return }
    startTransition(async () => {
      const res = await createVideoAction({ title: form.title.trim(), youtubeId: form.link.trim(), description: form.description.trim() })
      if (res?.error) { showToast(res.error, 'error'); return }
      showToast('Vídeo adicionado!', 'success')
      setForm({ title: '', link: '', description: '' })
      router.refresh()
    })
  }

  function handleDelete(id: string | number, title: string) {
    if (!confirm(`Excluir o vídeo "${title}"?`)) return
    startTransition(async () => {
      const res = await deleteVideoAction(id)
      if (res?.error) { showToast(res.error, 'error'); return }
      showToast('Vídeo excluído', 'success')
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {toast && <Toast {...toast} />}

      {/* Formulário de adicionar */}
      <form onSubmit={handleAdd} className={`${card} lg:sticky lg:top-20`}>
        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-[var(--outline-variant)]">
          <span className="text-xl leading-none mt-0.5">🎬</span>
          <div>
            <h2 className="font-display text-base font-bold text-[var(--on-surface)] leading-tight">Adicionar Vídeo</h2>
            <p className="font-sans text-[11px] text-[var(--outline)] mt-0.5 leading-snug">Cole o link do YouTube. Os vídeos aparecem na seção &ldquo;Vídeos em Destaque&rdquo; da home.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={lbl}>Título *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Documentário sobre mobilidade" className={inp} />
          </div>
          <div>
            <label className={lbl}>Link do YouTube *</label>
            <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://youtube.com/watch?v=..." className={inp} />
          </div>
          <div>
            <label className={lbl}>Descrição <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(opcional)</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Breve descrição..." className={inp} />
          </div>

          {previewId && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[var(--surface-container)]">
              <img src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="Prévia" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )}

          <button type="submit" disabled={pending} className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
            {pending ? 'Salvando...' : '+ Adicionar Vídeo'}
          </button>
        </div>
      </form>

      {/* Lista de vídeos */}
      <div className="lg:col-span-2">
        <h2 className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] mb-4">
          Vídeos {videos.length > 0 && <span className="text-[var(--outline)]">({videos.length})</span>}
        </h2>

        {videos.length === 0 ? (
          <div className={`${card} text-center py-12`}>
            <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhum vídeo ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v) => {
              const id = extractYouTubeId(v.youtubeId) || v.youtubeId
              const thumb = v.thumbnail || `https://img.youtube.com/vi/${id}/hqdefault.jpg`
              return (
                <div key={v.id} className="group bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] overflow-hidden shadow-sm flex flex-col">
                  <a href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="relative block aspect-video bg-[var(--surface-container)] overflow-hidden">
                    <img src={thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 ml-0.5 text-[var(--on-secondary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </span>
                  </a>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-sm font-bold text-[var(--on-surface)] leading-snug line-clamp-2">{v.title}</h3>
                    {v.description && <p className="font-sans text-xs text-[var(--on-surface-variant)] line-clamp-2 mt-1">{v.description}</p>}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--outline-variant)]">
                      <span className="font-mono text-[9px] text-[var(--outline)] uppercase tracking-wider">{id}</span>
                      <button type="button" onClick={() => handleDelete(v.id, v.title)} disabled={pending} className="font-mono text-[9px] text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors disabled:opacity-50">
                        Excluir
                      </button>
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
