'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

export default function CmsLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const res = await fetch(`${BACKEND}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('Email ou senha incorretos')
        setLoading(false)
        return
      }

      const { token } = await res.json()
      // Cookie de SESSÃO (sem expires): cai ao fechar o navegador → pede login de novo.
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `cms_token=${token}; path=/; SameSite=Lax${secure}`
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erro de conexão com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)]">Legal Drive</span>
          <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-2">Painel CMS</h1>
          <p className="font-mono text-xs text-[var(--outline)] mt-2 uppercase tracking-widest">
            Entre com sua conta de administrador
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--surface-container-high)] rounded-lg border border-[rgba(255,255,255,0.07)] p-8 space-y-5"
        >
          <div>
            <label className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] block mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
            />
          </div>

          <div>
            <label className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] block mb-2">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 uppercase tracking-wider bg-red-900/20 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-4 rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  )
}
