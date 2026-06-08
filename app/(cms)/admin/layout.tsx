import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { logoutAction } from './actions'

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('cms_token')?.value

  if (!token) {
    redirect('/admin-login')
  }

  // Segurança: valida a sessão no backend a cada acesso ao painel.
  // Token ausente, inválido ou expirado → volta para o login.
  const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')
  let authed = false
  try {
    const meRes = await fetch(`${BACKEND}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
      cache: 'no-store',
    })
    if (meRes.ok) {
      const me = await meRes.json()
      authed = Boolean(me?.user)
    }
  } catch {
    authed = false
  }

  if (!authed) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="dark-section border-b border-[var(--on-primary-fixed-variant)] sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image src="/logo-completa.png" alt="Legal Drive" width={160} height={42} priority className="h-9 w-auto object-contain" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--secondary)] border border-[var(--secondary)] rounded px-1.5 py-0.5 font-bold">
                CMS
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-5">
              <Link href="/admin" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/videos" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
                Vídeos
              </Link>
              <Link href="/admin/authors" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
                Autores
              </Link>
              <Link href="/" target="_blank" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors">
                Ver Site ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts/new"
              className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              + Nova Notícia
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
