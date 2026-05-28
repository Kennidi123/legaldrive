import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-16 py-32 flex flex-col items-center justify-center text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-4">
        Erro 404
      </span>
      <h1 className="font-display text-6xl font-bold text-[var(--on-surface)] mb-4">
        Página não encontrada
      </h1>
      <p className="text-[var(--on-surface-variant)] text-base mb-8 max-w-md">
        A página que você está procurando não existe ou foi removida. Volte para a página inicial.
      </p>
      <Link
        href="/"
        className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-8 py-4 rounded hover:brightness-110 transition-all"
      >
        Voltar ao Início
      </Link>
    </div>
  )
}
