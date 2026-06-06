'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Multas', href: '/multas' },
  { label: 'CNH', href: '/cnh' },
  { label: 'Radar', href: '/radar' },
  { label: 'Legislação', href: '/leis-de-transito' },
  { label: 'Tecnologia', href: '/mobilidade-eletrica' },
  { label: 'Cidadania', href: '/direitos-do-motorista' },
  { label: 'Análise', href: '/contato' },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const isHome = pathname === '/'

  return (
    <header className="dark-section border-b border-[var(--on-primary-fixed-variant)] sticky top-0 z-50">
      <div className="max-w-content mx-auto px-4 md:px-16 py-4">
        {/* Linha superior: logo + busca + ações */}
        <div className="flex items-center justify-between w-full md:mb-4">
          <Link href="/" className="flex items-center gap-2 flex-none">
            <Image src="/logovariavel1.png" alt="Legal Drive" width={44} height={44} priority className="h-9 md:h-10 w-auto object-contain" />
            {isHome && (
              <Image src="/logo-somenteescrita.png" alt="Legal Drive" width={280} height={150} priority className="h-14 md:h-16 w-auto object-contain -ml-2" />
            )}
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
                className="pl-10 pr-4 py-2 bg-[var(--tertiary-container)] border-none focus:ring-2 focus:ring-[var(--secondary)] rounded-xl text-sm text-[var(--primary-fixed)] placeholder:text-[var(--primary-fixed-dim)] w-64 transition-all focus:outline-none"
              />
            </form>

            <Link
              href="/contato"
              className="bg-[var(--secondary)] text-[var(--on-secondary)] px-6 py-2 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all whitespace-nowrap"
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

        {/* Linha inferior: navegação centralizada (desktop) */}
        <nav className="hidden md:flex gap-gutter items-center w-full justify-center border-t border-[var(--on-primary-fixed-variant)] pt-4">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors pb-1 ${
                  active
                    ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]'
                    : 'text-[var(--primary)] hover:text-[var(--secondary)]'
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
            <form role="search" action="/busca" method="GET" className="relative mb-3">
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
