'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../ImageUpload'
import { createAuthorAction, updateAuthorAction, deleteAuthorAction } from '../actions'

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

type AuthorForm = { name: string; role: string; avatarUrl: string }
const empty: AuthorForm = { name: '', role: '', avatarUrl: '' }

export default function AuthorAdmin({ authors }: { authors: any[] }) {
  const router = useRouter()
  const [createForm, setCreateForm] = useState<AuthorForm>({ ...empty })
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [editForm, setEditForm] = useState<AuthorForm>({ ...empty })
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [pending, startTransition] = useTransition()

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name.trim()) { showToast('Informe o nome do autor.', 'error'); return }
    startTransition(async () => {
      const res = await createAuthorAction(createForm)
      if (res?.error) { showToast(res.error, 'error'); return }
      showToast('Autor criado!', 'success')
      setCreateForm({ ...empty })
      router.refresh()
    })
  }

  function startEdit(a: any) {
    setEditingId(a.id)
    setEditForm({ name: a.name || '', role: a.role || '', avatarUrl: a.avatarUrl || '' })
  }

  function handleUpdate() {
    if (!editForm.name.trim()) { showToast('Informe o nome do autor.', 'error'); return }
    startTransition(async () => {
      const res = await updateAuthorAction(editingId!, editForm)
      if (res?.error) { showToast(res.error, 'error'); return }
      showToast('Autor atualizado!', 'success')
      setEditingId(null)
      router.refresh()
    })
  }

  function handleDelete(id: string | number, name: string) {
    if (!confirm(`Excluir o autor "${name}"?\n\nAs notícias dele ficam sem autor (mostram "Redação Legal Drive").`)) return
    startTransition(async () => {
      const res = await deleteAuthorAction(id)
      if (res?.error) { showToast(res.error, 'error'); return }
      showToast('Autor excluído', 'success')
      if (editingId === id) setEditingId(null)
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {toast && <Toast {...toast} />}

      {/* Criar autor */}
      <form onSubmit={handleCreate} className={`${card} lg:sticky lg:top-20`}>
        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-[var(--outline-variant)]">
          <span className="text-xl leading-none mt-0.5">👤</span>
          <div>
            <h2 className="font-display text-base font-bold text-[var(--on-surface)] leading-tight">Novo Autor</h2>
            <p className="font-sans text-[11px] text-[var(--outline)] mt-0.5 leading-snug">Os autores aparecem no rodapé das notícias.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={lbl}>Nome *</label>
            <input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Dr. João Silva" className={inp} />
          </div>
          <div>
            <label className={lbl}>Cargo / Especialidade</label>
            <input value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))} placeholder="Advogado de Trânsito" className={inp} />
          </div>
          <ImageUpload label="Foto do Autor" value={createForm.avatarUrl} onChange={url => setCreateForm(f => ({ ...f, avatarUrl: url }))} />
          <button type="submit" disabled={pending} className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
            {pending ? 'Salvando...' : '+ Criar Autor'}
          </button>
        </div>
      </form>

      {/* Lista de autores */}
      <div className="lg:col-span-2">
        <h2 className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] mb-4">
          Autores {authors.length > 0 && <span className="text-[var(--outline)]">({authors.length})</span>}
        </h2>

        {authors.length === 0 ? (
          <div className={`${card} text-center py-12`}>
            <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhum autor ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {authors.map((a) => (
              <div key={a.id} className={card}>
                {editingId === a.id ? (
                  /* Modo edição */
                  <div className="space-y-4">
                    <div>
                      <label className={lbl}>Nome *</label>
                      <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Cargo / Especialidade</label>
                      <input value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className={inp} />
                    </div>
                    <ImageUpload label="Foto do Autor" value={editForm.avatarUrl} onChange={url => setEditForm(f => ({ ...f, avatarUrl: url }))} />
                    <div className="flex gap-2">
                      <button type="button" onClick={handleUpdate} disabled={pending} className="flex-1 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
                        {pending ? 'Salvando...' : '💾 Salvar'}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="px-4 font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors border border-[var(--outline-variant)] rounded-lg">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo visualização */
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[var(--secondary)] bg-[var(--surface-container)] flex items-center justify-center flex-none">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-lg text-[var(--secondary)]">{(a.name || '?').charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-bold text-[var(--on-surface)] leading-tight truncate">{a.name}</p>
                      <p className="font-mono text-[11px] text-[var(--on-surface-variant)] truncate">{a.role || 'Sem cargo'}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-none">
                      <button type="button" onClick={() => startEdit(a)} className="font-mono text-[10px] text-[var(--secondary)] hover:underline uppercase tracking-widest font-bold">
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDelete(a.id, a.name)} disabled={pending} className="font-mono text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors disabled:opacity-50">
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
