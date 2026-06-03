import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Análise Gratuita do Seu Caso',
  description:
    'Tecnologia aplicada à defesa de trânsito. Análise técnica gratuita para multas, CNH suspensa e casos de Lei Seca.',
  slug: 'contato',
})

/* Níveis tonais navy específicos deste mockup */
const C = {
  bg: '#0a192f', // background / primary-container
  lowest: '#040b15', // surface-container-lowest
  container: '#081426', // surface-container / low
  high: '#0d1e38', // surface-container-high
  highest: '#102341', // surface-variant / bright
  borderv: '#1f2d42', // outline-variant
  outline: '#4a5d7c', // outline
  onPrimaryContainer: '#74829d',
}

const IMG = {
  hero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDpBq2ozZ1k4DSg9zjtHzQEGO8G9G8DOc5zxrw5eVOa6RWsxLXouCHJlFPxgBiXO06hdOP-mRqqAmLe9S-UeSBPK13PdrYL0eAjPZWCzr4n5wzCykTys-6re5lpCtWzUJdNTBGP4ecVBQsii3wi_1RTFYSmqqRgAY5tE52Rxhzk-7sWK8UWZKtn2n18bx7oLcL5Vl750qAlfMZ5poQly2zoyHj27R_OyxFG8ckQUWeMUdT4uVP4lzEWx_q37wdr3rTz8ncxr9jNLQ',
  specialist:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB5rBR1dEUjJhUatHWzRcA74c2CFVtk4rswGY_XMkw-vhfCSddFO5LNhny-rV18j13Xg_WYz6wIWlEOMOZLk08L-ZJEL2RvRGm93vIBmUcup0Enp9_YYTvoGD-eLXvVMeg9JqcoBnTk44p20MWlbTjfcZWWkJfoEb1Ud-baLbvKl848MR9qGNGu7_20isBfUqP_ulkIfSkgnjqiQA1v7qaKAa5Mp5QKBMWmRfAw3sKf7_MQBR-pwqQ9UeEiXCi7_6sSD5TIAXkrjA',
  monitoring:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuARuB2CPiASncZ8WBadxTikIZpEV-dsHWP6G4GjoyXOn9MsVMpkoGfmuycSlTg2PqwQEZr3gSN402FOM5m2e8rqhfEleCgnNnn7bu_CTt0FpqIbzF97Ky3OnWpQLcmJABpGoF-3hHibo-24Xec2nOzbPJRupjiDpuJ1p9ty1FsfFowFxGS7rUSMSU8E2eLk9sYM8x59GPvgHs83DDq8Ra8Eo1bS8Wrb6h0_IFPmpTqrLnjTXIQSKPXxag4Nqy3zDvNSxOmPNWFwSA',
}

function Icon({ d, className = 'w-6 h-6' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
const P = {
  analytics: 'M3 3v18h18 M7 14l3-3 3 3 4-5',
  doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  speed: 'M12 12l3-2m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  shield:
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  headset: 'M18 8a6 6 0 00-12 0v5a2 2 0 002 2h1v-7a3 3 0 016 0v7h1a2 2 0 002-2V8z',
  pin: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
}

function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.499-5.688-1.447l-6.305 1.651zm6.59-4.819c1.52.901 3.275 1.375 5.066 1.376h.001c5.393 0 9.784-4.391 9.786-9.784a9.73 9.73 0 0 0-2.853-6.927 9.75 9.75 0 0 0-6.915-2.853c-5.393 0-9.784 4.392-9.787 9.784-.001 1.888.543 3.73 1.571 5.334l-1.033 3.77 3.864-1.011z" />
    </svg>
  )
}

export default function ContatoPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '#'

  const inputCls =
    'w-full rounded-lg p-3 text-[var(--on-surface)] bg-[#081426] border border-[#1f2d42] focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] focus:outline-none transition-all placeholder:text-[#4a5d7c]'

  return (
    <main className="w-full bg-[var(--primary-container)] text-[var(--on-background)]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-[var(--primary-container)]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a192f] via-transparent to-[#0a192f]" />
          <Image src={IMG.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="max-w-content mx-auto px-4 md:px-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
            <div className="max-w-2xl">
              <span className="text-[var(--secondary)] font-mono text-xs tracking-widest uppercase block mb-4">
                Tecnologia Aplicada à Defesa de Trânsito
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.05]">
                Proteja seu direito de dirigir com inteligência.
              </h1>
              <p className="font-body text-lg text-[#74829d] mb-8 max-w-xl leading-relaxed">
                O Legal Drive utiliza análise de dados e jurisprudência avançada para anular multas injustas e recuperar
                CNHs suspensas. Soluções rápidas, técnicas e definitivas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contato"
                  className="bg-[var(--secondary)] text-[var(--on-secondary)] px-8 py-4 font-mono text-sm uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  Iniciar Análise do Caso <Icon d={P.analytics} className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Card Consulta Rápida */}
            <div className="hidden lg:block">
              <div className="bg-[#0d1e38] p-8 rounded-xl border border-[#1f2d42]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <h3 className="font-display text-2xl font-semibold text-[var(--primary)] mb-6 text-center">Consulta Rápida</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Seu Nome" className={inputCls} />
                  <input type="tel" placeholder="WhatsApp" className={inputCls} />
                  <select className={inputCls} defaultValue="CNH Suspensa">
                    <option>CNH Suspensa</option>
                    <option>Lei Seca</option>
                    <option>Multas Indevidas</option>
                  </select>
                  <button type="submit" className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] py-4 font-mono text-sm rounded-lg uppercase font-bold hover:brightness-110 transition-all">
                    Consultar Agora
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOLUÇÕES ============ */}
      <section id="servicos" className="py-24 bg-[#040b15]">
        <div className="max-w-content mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <h2 className="font-display text-[32px] font-bold text-[var(--on-background)] mb-4">Nossas Soluções</h2>
            <div className="w-20 h-1 bg-[var(--secondary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: P.doc, title: 'Defesa de CNH', text: 'Estratégias técnicas para reverter processos de suspensão e cassação do direito de dirigir.' },
              { icon: P.speed, title: 'Multas de Radar', text: 'Análise de conformidade técnica de radares e sinalização para anulação de infrações.' },
              { icon: P.shield, title: 'Lei Seca', text: 'Assessoria jurídica especializada para infrações do Art. 165 e 165-A do CTB.' },
            ].map((s) => (
              <div key={s.title} className="bg-[#081426] p-8 border border-[#1f2d42] hover:border-[var(--secondary)] transition-colors group rounded-lg">
                <span className="text-[var(--secondary)] mb-4 block group-hover:scale-110 transition-transform w-fit">
                  <Icon d={s.icon} className="w-10 h-10" />
                </span>
                <h3 className="font-display text-2xl font-semibold text-[var(--primary)] mb-3">{s.title}</h3>
                <p className="text-[var(--on-surface-variant)]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ESPECIALISTA ============ */}
      <section id="sobre" className="py-24 bg-[var(--primary-container)]">
        <div className="max-w-content mx-auto px-4 md:px-16">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 border-l-4 border-t-4 border-[var(--secondary)] opacity-30" />
              <div className="relative aspect-square w-full overflow-hidden rounded-lg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <Image src={IMG.specialist} alt="Erika Chagas" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover grayscale-[30%]" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[var(--secondary)] p-6 rounded-lg text-[var(--on-secondary)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <p className="font-display text-xl font-bold mb-1">Erika Chagas</p>
                <p className="font-mono text-[11px] uppercase tracking-widest opacity-80">Founder &amp; CEO Legal Drive</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-[32px] font-bold text-[var(--on-background)] mb-6 uppercase leading-tight">
                A Autoridade por trás da Tecnologia
              </h2>
              <div className="space-y-6 text-[var(--on-surface-variant)] font-body text-lg leading-relaxed">
                <p>
                  Combinamos a vasta experiência jurídica de Erika Chagas com as ferramentas de monitoramento de dados
                  mais modernas do país.
                </p>
                <p>
                  No Legal Drive, não tratamos apenas de papéis; tratamos da sua liberdade de locomoção. Nossas vitórias
                  são baseadas em falhas formais que só especialistas de alto nível conseguem identificar.
                </p>
              </div>
              <div className="mt-12 flex gap-12 items-center">
                <div>
                  <p className="text-3xl font-display font-bold text-[var(--secondary)]">15k+</p>
                  <p className="font-mono text-[11px] uppercase text-[#4a5d7c]">Casos Resolvidos</p>
                </div>
                <div className="w-px h-12 bg-[#1f2d42]" />
                <div>
                  <p className="text-3xl font-display font-bold text-[var(--secondary)]">92%</p>
                  <p className="font-mono text-[11px] uppercase text-[#4a5d7c]">Taxa de Sucesso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CASES (BENTO) ============ */}
      <section id="cases" className="py-24 bg-[#040b15]">
        <div className="max-w-content mx-auto px-4 md:px-16">
          <div className="mb-16">
            <h2 className="font-display text-[32px] font-bold text-[var(--on-background)]">Vereditos Recentes</h2>
            <div className="w-24 h-1 bg-[var(--secondary)] mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Vitória Crítica */}
            <div className="md:col-span-2 bg-[#0d1e38] p-8 rounded-xl border border-[#1f2d42] relative overflow-hidden group">
              <div className="relative z-10">
                <span className="bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[11px] px-3 py-1 rounded uppercase mb-4 inline-block">Vitória Crítica</span>
                <h3 className="font-display text-2xl font-semibold text-[var(--primary)] mb-4">Suspensão de CNH Anulada</h3>
                <p className="text-[var(--on-surface-variant)] mb-6">
                  Identificamos erro de notificação em processo administrativo do DETRAN-SP, devolvendo o direito de
                  dirigir a um motorista profissional.
                </p>
                <p className="font-mono text-xs text-[var(--secondary)]">— Caso #9824 • São Paulo</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 text-[var(--secondary)]">
                <Icon d={P.check} className="w-[150px] h-[150px]" />
              </div>
            </div>

            {/* Bafômetro (tertiary) */}
            <div className="bg-[var(--tertiary-container)] text-[var(--on-tertiary)] p-8 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[var(--secondary)] font-mono text-[11px] uppercase mb-4 block">Lei Seca</span>
                <h3 className="font-display text-2xl font-semibold text-[var(--on-surface)] mb-4">Bafômetro Irregular</h3>
                <p className="text-[var(--on-tertiary-container)] italic">
                  &ldquo;Anulação por falta de aferição obrigatória do Inmetro no equipamento.&rdquo;
                </p>
              </div>
              <p className="font-mono text-xs text-[var(--secondary)] mt-6">Vitória Legal Drive</p>
            </div>

            {/* Frotas */}
            <div className="bg-[#081426] p-8 rounded-xl border border-[#1f2d42]">
              <span className="text-[var(--secondary)] font-mono text-[11px] uppercase mb-4 block">Frotas</span>
              <h3 className="font-display text-2xl font-semibold text-[var(--primary)] mb-4">Gestão de Pontos</h3>
              <p className="text-[var(--on-surface-variant)]">Redução de 40% nos custos com multas para transportadora logística.</p>
            </div>

            {/* Monitoramento */}
            <div className="md:col-span-2 bg-[var(--primary-container)] p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center border border-[#1f2d42]">
              <div className="md:w-1/3 w-full">
                <div className="relative w-full h-32 overflow-hidden rounded-lg">
                  <Image src={IMG.monitoring} alt="Monitoramento ativo" fill sizes="(max-width:768px) 100vw, 20vw" className="object-cover opacity-80" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-display text-2xl font-semibold text-[var(--secondary)] mb-2">Monitoramento Ativo</h3>
                <p className="text-[#74829d] text-sm">
                  Nossa tecnologia varre diários oficiais diariamente para alertar clientes antes mesmo da notificação
                  chegar em casa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONVERSÃO FINAL ============ */}
      <section id="contato" className="py-24 bg-[var(--primary-container)] border-t border-[#1f2d42]">
        <div className="max-w-content mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                Recupere sua liberdade agora.
              </h2>
              <p className="font-body text-lg text-[var(--on-surface-variant)] mb-12">
                Não espere o prazo do recurso acabar. Nossa equipe técnica está pronta para analisar seu caso e traçar a
                melhor estratégia de defesa.
              </p>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <span className="text-[var(--secondary)] bg-[#081426] p-4 rounded-xl inline-flex">
                    <Icon d={P.headset} />
                  </span>
                  <div>
                    <p className="font-mono text-[var(--primary)] uppercase text-xs mb-1">Fale Conosco</p>
                    <p className="text-xl text-white">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-[var(--secondary)] bg-[#081426] p-4 rounded-xl inline-flex">
                    <Icon d={P.pin} />
                  </span>
                  <div>
                    <p className="font-mono text-[var(--primary)] uppercase text-xs mb-1">Atendimento</p>
                    <p className="text-xl text-white">Nacional (Online &amp; Presencial)</p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <Link
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-transform hover:scale-105 w-full md:w-fit"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                >
                  <WhatsAppIcon className="w-6 h-6" /> Chamar no WhatsApp
                </Link>
              </div>
            </div>

            {/* Formulário de Defesa */}
            <div className="bg-[#0d1e38] p-8 rounded-2xl border border-[#1f2d42]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              <h3 className="font-display text-2xl font-semibold text-[var(--primary)] mb-8">Formulário de Defesa</h3>
              <form className="space-y-6">
                <div>
                  <label className="block font-mono text-[11px] text-[#4a5d7c] uppercase mb-2">Nome Completo</label>
                  <input type="text" placeholder="Digite seu nome" className={`${inputCls} p-4`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[11px] text-[#4a5d7c] uppercase mb-2">WhatsApp</label>
                    <input type="tel" placeholder="(00) 00000-0000" className={`${inputCls} p-4`} />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#4a5d7c] uppercase mb-2">Urgência</label>
                    <select className={`${inputCls} p-4`} defaultValue="Baixa">
                      <option>Baixa</option>
                      <option>Média (Prazo correndo)</option>
                      <option>Alta (CNH bloqueada)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-[#4a5d7c] uppercase mb-2">O que aconteceu?</label>
                  <textarea
                    rows={4}
                    placeholder="Descreva brevemente sua multa ou situação da CNH"
                    className={`${inputCls} p-4 resize-none`}
                  />
                </div>
                <button type="submit" className="w-full bg-[var(--secondary)] text-[var(--on-secondary)] py-5 rounded-lg font-mono text-sm uppercase font-bold transition-transform hover:scale-[1.02] active:scale-100">
                  Enviar para Avaliação Técnica
                </button>
                <p className="font-mono text-[10px] text-center text-[#4a5d7c] uppercase tracking-wider">
                  Seus dados estão protegidos pela LGPD.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
