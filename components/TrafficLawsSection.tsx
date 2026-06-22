type Law = {
  number: string
  date: string
  title: string
  summary: string
  href: string
  /** path do ícone SVG (24x24, stroke) */
  icon: string
}

/**
 * Leis de trânsito exibidas na página de Legislação. Para adicionar uma nova lei,
 * basta incluir um item nesta lista (número, data, título, resumo, link oficial e ícone).
 */
const LAWS: Law[] = [
  {
    number: 'Lei nº 9.503 / 1997',
    date: '23 de setembro de 1997',
    title: 'Código de Trânsito Brasileiro (CTB)',
    summary:
      'É a lei que organiza todo o trânsito nas vias do Brasil. Define as regras de circulação e conduta, a sinalização, o licenciamento de veículos e a habilitação de condutores (CNH), além das infrações, penalidades, do sistema de pontos na carteira e dos crimes de trânsito. Na prática, é a base de praticamente toda multa, defesa e recurso de trânsito.',
    href: 'https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm',
    // balança da justiça
    icon: 'M12 3v18m0-18l7 4m-7-4L5 7m0 0l-3 7a3 3 0 006 0L5 7zm14 0l-3 7a3 3 0 006 0l-3-7zM4 21h16',
  },
  {
    number: 'Lei nº 15.428 / 2026',
    date: '5 de junho de 2026',
    title: 'Renovação da CNH e exames de aptidão',
    summary:
      'Alteração mais recente do CTB (a 51ª), focada na renovação da CNH. Restabelece a obrigatoriedade do exame de aptidão física e mental para renovar a habilitação — e da avaliação psicológica para quem dirige por atividade remunerada —, encerrando a chamada "renovação automática". Os exames passam a ser feitos por peritos especializados em medicina e psicologia do trânsito. Uma regra de transição manteve válidas, até 9 de setembro de 2026, as CNHs vencidas entre 5 de junho e 8 de setembro de 2026.',
    href: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15428.htm',
    // cartão (CNH)
    icon: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 4h18M7 15h4',
  },
]

function LawIcon({ d }: { d: string }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export default function TrafficLawsSection() {
  return (
    <section className="reveal mb-12 md:mb-16">
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-2">
          Legislação Essencial
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--on-surface)]">Leis de Trânsito</h2>
        <p className="text-[var(--on-surface-variant)] text-base mt-2 max-w-2xl">
          Acesse o texto oficial das principais leis e entenda, em linguagem simples, do que cada uma trata e
          como funciona.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {LAWS.map((law) => (
          <article key={law.number} className="card-base p-6 flex flex-col gap-4 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-none rounded-xl bg-[var(--secondary-container)] text-[var(--on-secondary-container)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <LawIcon d={law.icon} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--secondary)] block">
                  {law.number}
                </span>
                <h3 className="font-display text-lg font-bold text-[var(--on-surface)] leading-snug">{law.title}</h3>
                <span className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">{law.date}</span>
              </div>
            </div>

            <p className="text-[var(--on-surface-variant)] text-sm leading-relaxed flex-1">{law.summary}</p>

            <a
              href={law.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 self-start bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
            >
              Ler lei completa
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
