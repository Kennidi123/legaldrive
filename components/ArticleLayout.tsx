import Image from 'next/image'
import type React from 'react'
import ArticleSidebar, { type RelatedItem } from './ArticleSidebar'
import ShareButtons from './ShareButtons'

export type { RelatedItem }

interface ArticleLayoutProps {
  /** Rótulo da editoria (ex.: "Fiscalização e Radar") */
  label: string
  title: string
  cover?: string | null
  caption?: string
  authorName: string
  authorRole: string
  avatar?: string | null
  dateStr: string
  readingTime: number
  tags: string[]
  related: RelatedItem[]
  whatsapp: string
  /** Caminho relativo do artigo (ex.: /multas/novas-regras) para compartilhamento */
  shareUrl: string
  /** Título usado no texto de compartilhamento */
  shareTitle: string
  /** Link externo (fonte) exibido no rodapé do artigo */
  externalLink?: string | null
  newsletterTitle?: string
  newsletterText?: string
  /** Corpo do artigo (conteúdo real em prose ou fallback estático) */
  children: React.ReactNode
}

/* Tom de superfície clara para cards/citações/CTA */
const CARD_BG = '#f1f5f9'

function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
const P = {
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  share:
    'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
  link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
}

export default function ArticleLayout({
  label,
  title,
  cover,
  caption,
  authorName,
  authorRole,
  avatar,
  dateStr,
  readingTime,
  tags,
  related,
  whatsapp,
  shareUrl,
  shareTitle,
  externalLink,
  newsletterTitle = 'Radar Legal Drive',
  newsletterText = 'Receba atualizações cruciais sobre leis de trânsito direto no seu e-mail.',
  children,
}: ArticleLayoutProps) {
  return (
    <main className="bg-[var(--primary-container)] text-[var(--on-surface)]">
      <div className="max-w-content mx-auto px-4 md:px-16 pt-4 pb-12 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* ============ ARTIGO ============ */}
        <article className="lg:col-span-8">
          <header className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)]">{label}</span>
              <span className="text-[var(--on-surface-variant)]">—</span>
              <span className="font-mono text-xs tracking-widest text-[var(--on-surface-variant)] line-clamp-1">{title}</span>
            </div>
            <h1 className="font-display text-[1.7rem] leading-[1.15] sm:text-4xl md:text-5xl md:leading-tight font-extrabold text-[var(--on-surface)] mb-6">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-[var(--on-primary-fixed-variant)] mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[var(--secondary)] relative bg-[var(--surface-container-high)] flex items-center justify-center">
                  {avatar ? (
                    <Image src={avatar} alt={authorName} fill sizes="40px" className="object-cover" />
                  ) : (
                    <span className="font-mono text-sm text-[var(--secondary)]">{authorName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-mono text-xs text-[var(--on-surface)]">{authorName}</p>
                  <p className="font-mono text-[11px] text-[var(--on-surface-variant)]">{authorRole}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-[var(--on-primary-fixed-variant)] hidden md:block" />
              <div className="flex items-center gap-2 text-[var(--on-surface-variant)] font-mono text-[11px]">
                <Icon d={P.calendar} className="w-[18px] h-[18px]" /> {dateStr}
              </div>
              <div className="flex items-center gap-2 text-[var(--on-surface-variant)] font-mono text-[11px]">
                <Icon d={P.clock} className="w-[18px] h-[18px]" /> {readingTime} min de leitura
              </div>
            </div>
          </header>

          <figure className="mb-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--tertiary-container)]" style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}>
              {cover ? (
                <Image src={cover} alt={title} fill priority sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
              ) : null}
            </div>
            {caption && (
              <figcaption className="mt-4 font-mono text-[11px] text-[var(--on-surface-variant)] italic text-center">
                {caption}
              </figcaption>
            )}
          </figure>

          {/* Corpo do artigo */}
          {children}

          {/* Rodapé do artigo */}
          <footer className="mt-16 pt-8 border-t border-[var(--on-primary-fixed-variant)]">
            {/* Bloco final: autor, data, tempo de leitura e fonte */}
            <div className="mb-10 p-6 rounded-xl border border-[var(--on-primary-fixed-variant)]" style={{ background: CARD_BG }}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[var(--secondary)] relative bg-[var(--surface-container-high)] flex items-center justify-center flex-none">
                    {avatar ? (
                      <Image src={avatar} alt={authorName} fill sizes="48px" className="object-cover" />
                    ) : (
                      <span className="font-mono text-base text-[var(--secondary)]">{authorName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Escrito por</p>
                    <p className="font-display text-base font-bold text-[var(--on-surface)] leading-tight">{authorName}</p>
                    <p className="font-mono text-[11px] text-[var(--on-surface-variant)]">{authorRole}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-[var(--on-primary-fixed-variant)] hidden sm:block" />
                <div className="flex items-center gap-2 text-[var(--on-surface-variant)] font-mono text-[11px]">
                  <Icon d={P.calendar} className="w-[18px] h-[18px]" /> {dateStr}
                </div>
                <div className="flex items-center gap-2 text-[var(--on-surface-variant)] font-mono text-[11px]">
                  <Icon d={P.clock} className="w-[18px] h-[18px]" /> {readingTime} min de leitura
                </div>
              </div>

              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-3 p-4 rounded-lg border border-[var(--on-primary-fixed-variant)] hover:border-[var(--secondary)] transition-colors group bg-[var(--primary-container)]"
                >
                  <Icon d={P.link} className="w-5 h-5 text-[var(--secondary)] flex-none" />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">Fonte / Leia também</p>
                    <p className="text-sm text-[var(--on-surface)] truncate group-hover:text-[var(--secondary)] transition-colors">{externalLink}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <ShareButtons url={shareUrl} title={shareTitle} variant="bottom" />
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full font-mono text-[11px] text-[var(--on-surface-variant)]" style={{ background: '#e9eef3' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Comentários */}
            <section className="mt-16">
              <h4 className="font-display text-2xl font-semibold text-[var(--on-surface)] mb-6">Comentários (12)</h4>
              <div className="p-6 rounded-xl border border-[var(--on-primary-fixed-variant)]" style={{ background: CARD_BG }}>
                <textarea
                  rows={3}
                  placeholder="Adicione seu comentário ou dúvida..."
                  className="w-full p-4 rounded-lg border border-[var(--outline-variant)] focus:ring-1 focus:ring-[var(--secondary)] text-[var(--on-surface)] bg-white placeholder:text-[var(--on-surface-variant)] resize-none focus:outline-none"
                />
                <div className="flex justify-end mt-4">
                  <button className="bg-[var(--primary-container)] text-[var(--primary)] border border-[var(--primary)] px-8 py-2 rounded-lg font-mono text-xs hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-colors uppercase tracking-wider">
                    Publicar
                  </button>
                </div>
              </div>
            </section>
          </footer>
        </article>

        {/* ============ SIDEBAR ============ */}
        <ArticleSidebar related={related} whatsapp={whatsapp} newsletterTitle={newsletterTitle} newsletterText={newsletterText} />
      </div>
    </main>
  )
}
