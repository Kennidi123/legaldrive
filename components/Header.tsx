'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSiteAuth } from './SiteAuthProvider'

const navLinks = [
  { label: 'Multas', href: '/multas' },
  { label: 'CNH', href: '/cnh' },
  { label: 'Radar', href: '/radar' },
  { label: 'Legislação', href: '/leis-de-transito' },
  { label: 'Tecnologia', href: '/mobilidade-eletrica' },
  { label: 'Cidadania', href: '/direitos-do-motorista' },
  { label: 'Vídeos', href: '/videos' },
]

function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  )
}

function RssIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a14 14 0 0114 14M5 12a7 7 0 017 7M6 18a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const { user, openAuth, openPassword, logout } = useSiteAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`dark-section border-b border-[var(--on-primary-fixed-variant)] sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-xl shadow-black/30' : ''
      }`}
    >
      <div
        className={`max-w-content mx-auto px-4 md:px-16 transition-all duration-300 ${
          scrolled ? 'py-2 md:py-1.5' : 'py-3 md:py-2.5'
        }`}
      >
        {/* Linha superior: logo + busca + ações */}
        <div className="flex items-center justify-between w-full md:mb-2.5">
          <Link href="/" className="flex items-center flex-none">
            <Image src="/logo-completa.png" alt="Legal Drive" width={200} height={54} priority className="h-9 md:h-9 w-auto object-contain" />
          </Link>

          {/* Busca + ações (desktop) */}
          <div className="hidden md:flex items-center gap-gutter">
            <form role="search" action="/busca" method="GET" className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--primary-fixed-dim)]">
                <SearchIcon />
              </span>
              <input
                name="q"
                type="text"
                aria-label="Buscar"
                placeholder="Buscar leis, multas..."
                className="pl-10 pr-4 py-1.5 bg-[var(--tertiary-container)] border-none focus:ring-2 focus:ring-[var(--secondary)] rounded-xl text-sm text-[var(--primary-fixed)] placeholder:text-[var(--primary-fixed-dim)] w-64 transition-all focus:outline-none"
              />
            </form>

            {/* Auth do usuário do site */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 group"
                  aria-label="Minha conta"
                >
                  <span className="w-8 h-8 rounded-full bg-[var(--secondary)] text-[var(--on-secondary)] flex items-center justify-center font-mono text-xs font-bold uppercase flex-none">
                    {(user.name || 'U').charAt(0)}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors max-w-[110px] truncate">
                    {(user.name || '').split(' ')[0]}
                  </span>
                  <svg className="w-3.5 h-3.5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                      <p className="px-4 py-2 border-b border-slate-100">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-400">Conta</span>
                        <span className="block text-sm text-slate-800 truncate">{user.email}</span>
                      </p>
                      <button onClick={() => { setUserMenuOpen(false); openPassword() }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                        Redefinir senha
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); logout() }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-slate-100 transition-colors">
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('register')}
                className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] hover:text-[var(--secondary)] transition-colors whitespace-nowrap"
              >
                Cadastrar
              </button>
            )}

            <Link
              href="/contato"
              className="btn-shine bg-[var(--secondary)] text-[var(--on-secondary)] px-6 py-1.5 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all whitespace-nowrap"
            >
              Painel CNH
            </Link>

            <Link
              href="/contato"
              aria-label="RSS"
              className="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
            >
              <RssIcon />
            </Link>
          </div>

          {/* Toggle mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Busca (mobile) — sempre visível no cabeçalho */}
        <form role="search" action="/busca" method="GET" className="md:hidden relative mt-3">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--primary-fixed-dim)]">
            <SearchIcon />
          </span>
          <input
            name="q"
            type="text"
            aria-label="Buscar"
            placeholder="Buscar leis, multas..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--tertiary-container)] border-none focus:ring-2 focus:ring-[var(--secondary)] rounded-xl text-sm text-[var(--primary-fixed)] placeholder:text-[var(--primary-fixed-dim)] transition-all focus:outline-none"
          />
        </form>

        {/* Linha inferior: navegação centralizada (desktop) */}
        <nav className="hidden md:flex gap-gutter items-center w-full justify-center border-t border-[var(--on-primary-fixed-variant)] pt-2.5">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors pb-1 ${
                  active
                    ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]'
                    : 'nav-underline text-[var(--primary)] hover:text-[var(--secondary)]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--primary-container)] border-t border-[var(--on-primary-fixed-variant)]">
          <div className="max-w-content mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-mono text-xs tracking-widest uppercase py-3 px-3 rounded transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--secondary)] bg-[var(--tertiary-container)]'
                    : 'text-[var(--primary)] hover:text-[var(--secondary)] hover:bg-[var(--tertiary-container)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth do usuário (mobile) */}
            {user ? (
              <div className="mt-3 pt-3 border-t border-[var(--on-primary-fixed-variant)] flex flex-col gap-1">
                <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-[var(--primary-fixed-dim)]">{user.name}</span>
                <button onClick={() => { setMobileOpen(false); openPassword() }} className="text-left font-mono text-xs tracking-widest uppercase py-3 px-3 rounded text-[var(--primary)] hover:bg-[var(--tertiary-container)] transition-colors">
                  Redefinir senha
                </button>
                <button onClick={() => { setMobileOpen(false); logout() }} className="text-left font-mono text-xs tracking-widest uppercase py-3 px-3 rounded text-red-400 hover:bg-[var(--tertiary-container)] transition-colors">
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); openAuth('register') }}
                className="mt-3 font-mono text-xs tracking-widest uppercase py-3 px-3 rounded border border-[var(--on-primary-fixed-variant)] text-[var(--primary)] hover:bg-[var(--tertiary-container)] transition-colors"
              >
                Criar conta / Entrar
              </button>
            )}

            <Link
              href="/contato"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3 rounded-full"
            >
              Painel CNH
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
