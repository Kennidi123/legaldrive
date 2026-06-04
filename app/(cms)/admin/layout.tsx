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
      <header className="bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logovariavel3.png" alt="Legal Drive" width={32} height={32} className="h-7 w-auto object-contain" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] font-bold">
                Legal Drive CMS
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/admin" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/posts/new" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors">
                Novo Post
              </Link>
              <Link href="/" target="_blank" className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors">
                Ver Site ↗
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
