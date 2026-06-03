import Link from 'next/link'
import Image from 'next/image'

export interface RelatedItem {
  id: string | number
  label: string
  title: string
  href: string
  img: string | null
}

interface ArticleSidebarProps {
  related: RelatedItem[]
  whatsapp: string
  newsletterTitle?: string
  newsletterText?: string
}

const NAVY_1 = '#112240'

function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
const GAVEL = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
const DOC = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'

export default function ArticleSidebar({
  related,
  whatsapp,
  newsletterTitle = 'Radar Legal Drive',
  newsletterText = 'Receba atualizações cruciais sobre leis de trânsito direto no seu e-mail.',
}: ArticleSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-12">
      {/* Artigos Relacionados */}
      {related.length > 0 && (
        <section>
          <h3 className="font-mono text-xs text-[var(--secondary)] uppercase tracking-widest mb-6 border-b border-[var(--on-primary-fixed-variant)] pb-2">
            Artigos Relacionados
          </h3>
          <div className="space-y-6">
            {related.map((r) => (
              <Link key={r.id} href={r.href} className="group block">
                <article className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--on-primary-fixed-variant)] relative bg-[#112240]">
                    {r.img ? (
                      <Image src={r.img} alt={r.title} fill sizes="96px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[var(--secondary)] font-mono text-[11px] uppercase mb-1">{r.label}</span>
                    <h4 className="font-mono text-xs text-[var(--on-surface)] leading-tight group-hover:text-[var(--secondary)] transition-colors line-clamp-3">
                      {r.title}
                    </h4>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="p-8 rounded-xl flex flex-col gap-6 border border-[rgba(185,199,228,0.2)]" style={{ background: NAVY_1, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}>
        <div className="w-12 h-12 bg-[var(--secondary)] rounded-xl flex items-center justify-center text-[var(--on-secondary)] shadow-lg">
          <Icon d={GAVEL} className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-[var(--on-surface)] mb-2">Foi multado injustamente?</h3>
          <p className="font-body text-base text-[var(--on-surface-variant)]">
            Deixe que a Legal Drive cuide da sua defesa. Análise técnica gratuita e especializada.
          </p>
        </div>
        <Link
          href={whatsapp}
          className="inline-flex items-center justify-center gap-2 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs py-4 px-6 rounded-lg hover:bg-[var(--secondary-container)] transition-colors shadow-lg uppercase tracking-wider"
        >
          <Icon d={DOC} className="w-5 h-5" /> Iniciar Defesa Agora
        </Link>
      </div>

      {/* Newsletter */}
      <div className="p-8 rounded-xl border border-[var(--on-primary-fixed-variant)]" style={{ background: '#233554' }}>
        <h3 className="font-display text-2xl font-semibold text-[var(--on-surface)] mb-4">{newsletterTitle}</h3>
        <p className="font-body text-base text-[var(--on-surface-variant)] mb-6">{newsletterText}</p>
        <form action="/contato" method="GET" className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Seu melhor e-mail"
            className="w-full rounded-lg p-4 border border-[var(--on-primary-fixed-variant)] bg-[var(--primary-container)] focus:ring-1 focus:ring-[var(--secondary)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-[var(--on-surface)] text-[var(--primary-container)] py-4 rounded-lg font-mono text-xs hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all uppercase tracking-widest"
          >
            Inscrever Agora
          </button>
        </form>
      </div>
    </aside>
  )
}
