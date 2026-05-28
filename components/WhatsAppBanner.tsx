import Link from 'next/link'

interface WhatsAppBannerProps {
  variant?: 'full' | 'sidebar'
}

export default function WhatsAppBanner({ variant = 'full' }: WhatsAppBannerProps) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '#'

  if (variant === 'sidebar') {
    return (
      <div className="bg-[var(--secondary)] p-6 rounded-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[var(--primary-container)] rounded-lg flex items-center justify-center flex-none">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--on-secondary)]">
              Foi multado injustamente?
            </h3>
            <p className="text-sm text-[var(--on-secondary)] opacity-90 mt-1">
              Análise técnica gratuita e especializada.
            </p>
          </div>
        </div>
        <Link
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[var(--primary-container)] text-[var(--secondary)] font-mono text-xs font-medium tracking-widest uppercase py-3 px-4 rounded hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.77 11.77 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Iniciar Defesa Agora
        </Link>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden border-t-2 border-[var(--secondary)]"
      style={{ background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--surface-container-low) 100%)' }}
    >
      <div className="max-w-content mx-auto px-4 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-3 block">
            Legal Drive — Defesa Especializada
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--on-surface)] mb-4">
            Foi multado injustamente? <br />
            <span className="text-[var(--secondary)]">Sua defesa começa aqui.</span>
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base leading-relaxed">
            Utilizamos análise de dados e jurisprudência avançada para anular multas injustas e recuperar CNHs suspensas. Análise técnica gratuita.
          </p>
        </div>

        <div className="flex flex-col gap-4 flex-none">
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-sm font-bold tracking-widest uppercase py-4 px-8 rounded hover:brightness-110 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.77 11.77 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar via WhatsApp
          </Link>
          <p className="font-mono text-[10px] text-center text-[var(--outline)] uppercase tracking-wider">
            Análise gratuita · Resposta em até 2h
          </p>
        </div>
      </div>
    </section>
  )
}
