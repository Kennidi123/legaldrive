import Link from 'next/link'
import type React from 'react'

interface LegalPageProps {
  /** Rótulo curto acima do título (ex.: "Legal", "Privacidade"). */
  label: string
  title: string
  intro: string
  /** Data por extenso (ex.: "19 de junho de 2026"). */
  updatedAt: string
  children: React.ReactNode
}

const CONTACT_EMAIL = 'contato@legaldrivemultas.com.br'

/**
 * Layout das páginas institucionais/legais (Termos, Privacidade, Compliance).
 * Hero claro + corpo em `.legal-prose` + cartão de contato no rodapé.
 */
export default function LegalPage({ label, title, intro, updatedAt, children }: LegalPageProps) {
  return (
    <main>
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-16 md:py-20">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-4">{label}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-5 leading-tight max-w-3xl">
            {title}
          </h1>
          <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed max-w-2xl">{intro}</p>
          <p className="font-mono text-[11px] text-[var(--outline)] uppercase tracking-wider mt-6">
            Última atualização: {updatedAt}
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        <div className="reveal max-w-article legal-prose">
          {children}

          <div className="mt-12 p-6 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
            <h3 className="font-display text-lg font-bold text-[var(--on-surface)] mb-2">Ficou com dúvidas?</h3>
            <p className="text-sm text-[var(--on-surface-variant)] mb-4">
              Fale com a nossa equipe pelo e-mail{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--secondary)] underline">
                {CONTACT_EMAIL}
              </a>{' '}
              ou pela nossa página de contato.
            </p>
            <Link
              href="/contato"
              className="btn-shine inline-flex items-center bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Falar com a Legal Drive
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
