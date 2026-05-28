'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const navLinks = [
  { label: 'Multas', href: '/multas' },
  { label: 'CNH', href: '/cnh' },
  { label: 'Radar', href: '/radar' },
  { label: 'Fiscalização', href: '/fiscalizacao' },
  { label: 'Leis', href: '/leis-de-transito' },
  { label: 'Casos Reais', href: '/casos-reais' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)] sticky top-0 z-50">
      <div className="max-w-content mx-auto px-4 md:px-16 py-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-none">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Tm5UMKTE9Q5ektWrY3AzFp_OUS_tG-8wsEBzSfQu1ftMGf9Ihg3XQo2YIyNyRyhNUAe_VLoCqMStnLctC1AYKVE84CHVuQAdNptbzSA9rkQCStHULZiCtc75mu21KuIQeBWo76NUt31boM0aLSkd8FcnQ-wKCpRxJvt_c3jd98NS7de3r_DnQIGWlu_9zUNkPAJ_IXbPlrucnpXeS2fe6okq6xEBH80tVHBB_qNyUO5ska7niP6VXAKjfJ2W1Jn8n8QcBJ5r6g"
              alt="Legal Drive"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/contato"
              className="hidden md:inline-flex items-center gap-2 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-5 py-2 rounded hover:brightness-110 transition-all"
            >
              Análise Grátis
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)]">
          <nav className="max-w-content mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs tracking-widest uppercase text-[var(--on-surface-variant)] hover:text-[var(--secondary)] py-3 px-3 rounded hover:bg-[var(--surface-container)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contato"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase py-3 rounded"
            >
              Análise Grátis
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
