'use client'

import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-content mx-auto px-4 md:px-16 py-32 flex flex-col items-center justify-center text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-4">
        Erro Inesperado
      </span>
      <h1 className="font-display text-4xl font-bold text-[var(--on-surface)] mb-4">
        Algo deu errado
      </h1>
      <p className="text-[var(--on-surface-variant)] text-base mb-8 max-w-md">
        Ocorreu um erro ao carregar esta página. Tente novamente ou volte para a página inicial.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 rounded hover:brightness-110 transition-all"
        >
          Tentar Novamente
        </button>
        <Link
          href="/"
          className="border border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 rounded hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors"
        >
          Página Inicial
        </Link>
      </div>
    </div>
  )
}
