'use client'

import { useState } from 'react'
import { registerUser, loginUser, type SiteUser } from '@/lib/site-auth'

const inp =
  'w-full bg-white border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all placeholder:text-[var(--outline)]'

interface AuthModalProps {
  mode: 'login' | 'register'
  onClose: () => void
  onAuthed: (user: SiteUser) => void
}

export default function AuthModal({ mode, onClose, onAuthed }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(mode)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'register') {
        if (form.name.trim().length < 2) return setError('Informe seu nome.')
        if (!form.whatsapp.trim()) return setError('Informe seu WhatsApp.')
        if (form.password.length < 6) return setError('A senha deve ter ao menos 6 caracteres.')
        const r = await registerUser({
          name: form.name.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          password: form.password,
        })
        if (r.error) return setError(r.error)
        if (r.user) onAuthed(r.user)
      } else {
        const r = await loginUser({ email: form.email.trim(), password: form.password })
        if (r.error) return setError(r.error)
        if (r.user) onAuthed(r.user)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--outline-variant)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="dark-section px-6 py-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Legal Drive</span>
            <h2 className="font-display text-xl font-bold text-[var(--on-surface)]">
              {tab === 'register' ? 'Criar conta' : 'Entrar'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-[var(--outline-variant)]">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-3 font-mono text-[11px] tracking-widest uppercase transition-colors ${
                tab === t ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]' : 'text-[var(--outline)] hover:text-[var(--on-surface)]'
              }`}
            >
              {t === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={submit} className="p-6 space-y-3">
          {tab === 'register' && (
            <>
              <input className={inp} placeholder="Nome completo" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={80} />
              <input className={inp} type="tel" placeholder="WhatsApp (ex.: 11 99999-9999)" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} maxLength={30} />
            </>
          )}
          <input className={inp} type="email" placeholder="E-mail" value={form.email} onChange={(e) => set('email', e.target.value)} required maxLength={160} />
          <input className={inp} type="password" placeholder="Senha" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />

          {error && <p className="font-mono text-[11px] text-red-600 uppercase tracking-wider">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full bg-[var(--secondary)] text-[var(--on-secondary)] py-3 rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : tab === 'register' ? 'Criar conta' : 'Entrar'}
          </button>

          <p className="text-center font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider pt-1">
            {tab === 'register' ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button type="button" onClick={() => { setTab(tab === 'register' ? 'login' : 'register'); setError('') }} className="text-[var(--secondary)] hover:underline">
              {tab === 'register' ? 'Entrar' : 'Cadastre-se'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
