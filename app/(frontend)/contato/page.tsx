import { buildMetadata } from '@/lib/seo'
import WhatsAppBanner from '@/components/WhatsAppBanner'

export const metadata = buildMetadata({
  title: 'Contato — Análise Gratuita do Seu Caso',
  description: 'Entre em contato com os especialistas da Legal Drive. Análise técnica gratuita para multas, CNH suspensa e casos de Lei Seca.',
  slug: 'contato',
})

export default function ContatoPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '#'

  return (
    <main>
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-16">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-4">
            Análise Gratuita
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-4">
            Recupere sua liberdade agora.
          </h1>
          <p className="text-[var(--primary)] text-lg max-w-2xl leading-relaxed">
            Não espere o prazo do recurso acabar. Nossa equipe técnica está pronta para analisar seu caso e traçar a melhor estratégia de defesa.
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--on-surface)] mb-8">
              Como podemos ajudar?
            </h2>
            <div className="space-y-6 mb-10">
              {[
                { label: 'CNH Suspensa ou Cassada', desc: 'Revertemos processos administrativos com falhas formais.' },
                { label: 'Multas por Radar', desc: 'Analisamos a conformidade técnica do equipamento e sinalização.' },
                { label: 'Lei Seca', desc: 'Identificamos vícios procedimentais para anulação da autuação.' },
                { label: 'Gestão de Frotas', desc: 'Reduzimos custos e gerenciamos pontos de motoristas profissionais.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--secondary)] mt-2 flex-none" />
                  <div>
                    <p className="font-display text-base font-bold text-[var(--on-surface)]">{item.label}</p>
                    <p className="text-[var(--on-surface-variant)] text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--surface-container)] flex items-center justify-center rounded">
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">Fale Conosco</p>
                  <p className="text-[var(--on-surface)] font-bold">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--surface-container)] flex items-center justify-center rounded">
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">Atendimento</p>
                  <p className="text-[var(--on-surface)] font-bold">Nacional (Online & Presencial)</p>
                </div>
              </div>
            </div>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-[#25D366] text-white font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 rounded hover:brightness-110 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.77 11.77 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chamar no WhatsApp
            </a>
          </div>

          <div className="bg-[var(--surface-container-high)] p-8 rounded-lg border border-[rgba(255,255,255,0.07)]">
            <h3 className="font-display text-xl font-bold text-[var(--primary)] mb-6">
              Formulário de Defesa
            </h3>
            <form className="space-y-5">
              <div>
                <label className="block font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider mb-2">
                    Urgência
                  </label>
                  <select className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors">
                    <option>Baixa</option>
                    <option>Média (Prazo correndo)</option>
                    <option>Alta (CNH bloqueada)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider mb-2">
                  O que aconteceu?
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva brevemente sua multa ou situação da CNH"
                  className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-sm font-bold tracking-widest uppercase py-4 rounded hover:brightness-110 transition-all"
              >
                Enviar para Avaliação Técnica
              </button>
              <p className="font-mono text-[10px] text-center text-[var(--outline)] uppercase tracking-wider">
                Seus dados estão protegidos pela LGPD.
              </p>
            </form>
          </div>
        </div>
      </section>

      <WhatsAppBanner />
    </main>
  )
}
