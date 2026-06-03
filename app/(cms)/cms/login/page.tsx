'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

export default function LoginPage() {
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
      document.cookie = `cms_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
      router.push('/cms')
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
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--surface-container-high)] rounded-lg border border-[rgba(255,255,255,0.07)] p-8 space-y-5">
          <div>
            <label className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] block mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors"
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
              className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 uppercase tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-4 rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
