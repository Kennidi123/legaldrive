'use client'

import { useState } from 'react'
import { changePassword } from '@/lib/site-auth'

const inp =
  'w-full bg-white border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all placeholder:text-[var(--outline)]'

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.newPassword.length < 6) return setError('A nova senha deve ter ao menos 6 caracteres.')
    if (form.newPassword !== form.confirm) return setError('As senhas não coincidem.')
    setLoading(true)
    const r = await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
    setLoading(false)
    if (r.error) return setError(r.error)
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--outline-variant)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="dark-section px-6 py-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Minha conta</span>
            <h2 className="font-display text-xl font-bold text-[var(--on-surface)]">Redefinir senha</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="font-display text-lg font-bold text-[var(--on-surface)]">Senha alterada!</p>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-3">
            <input className={inp} type="password" placeholder="Senha atual" value={form.currentPassword} onChange={(e) => set('currentPassword', e.target.value)} required />
            <input className={inp} type="password" placeholder="Nova senha" value={form.newPassword} onChange={(e) => set('newPassword', e.target.value)} required minLength={6} />
            <input className={inp} type="password" placeholder="Confirmar nova senha" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required minLength={6} />
            {error && <p className="font-mono text-[11px] text-red-600 uppercase tracking-wider">{error}</p>}
            <button type="submit" disabled={loading} className="btn-shine w-full bg-[var(--secondary)] text-[var(--on-secondary)] py-3 rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
