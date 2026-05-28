'use client'

import Link from 'next/link'

export default function CategoryError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-content mx-auto px-4 md:px-16 py-32 text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-4 block">
        Erro ao carregar categoria
      </span>
      <h2 className="font-display text-3xl font-bold text-[var(--on-surface)] mb-4">
        Não foi possível carregar os artigos
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={reset}
          className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 rounded hover:brightness-110 transition-all"
        >
          Tentar Novamente
        </button>
        <Link href="/" className="border border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 rounded hover:border-[var(--secondary)] transition-colors">
          Início
        </Link>
      </div>
    </div>
  )
}
