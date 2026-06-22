import Image from 'next/image'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import WhatsAppBanner from '@/components/WhatsAppBanner'

export const metadata = buildMetadata({
  title: 'Sobre a Legal Drive — Especialistas em Direito de Trânsito',
  description: 'Conheça a Legal Drive, plataforma de inteligência jurídica especializada em Direito de Trânsito. Tecnologia e expertise a serviço do motorista brasileiro.',
  slug: 'sobre',
})

const stats = [
  { value: '15k+', label: 'Casos Resolvidos' },
  { value: '92%', label: 'Taxa de Sucesso' },
  { value: '10+', label: 'Anos de Experiência' },
  { value: '24h', label: 'Resposta Garantida' },
]

const services = [
  {
    title: 'Defesa de CNH',
    desc: 'Estratégias técnicas para reverter processos de suspensão e cassação do direito de dirigir.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Anulação de Multas',
    desc: 'Análise de conformidade técnica de radares e sinalização para anulação de infrações.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Bafômetro',
    desc: 'Assessoria jurídica especializada para infrações do Art. 165 e 165-A do CTB.',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  },
  {
    title: 'Gestão de Frotas',
    desc: 'Redução de custos com multas e gestão inteligente de pontos para empresas de transporte.',
    icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  },
]

export default function SobrePage() {
  return (
    <main>
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-4">
              Sobre a Legal Drive
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-6 leading-tight">
              A Autoridade por trás da Tecnologia
            </h1>
            <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed mb-6">
              Combinamos a vasta experiência jurídica com as ferramentas de monitoramento de dados mais modernas do país.
            </p>
            <p className="text-[var(--on-surface-variant)] text-base leading-relaxed mb-8">
              No Legal Drive, não tratamos apenas de papéis; tratamos da sua liberdade de locomoção. Nossas vitórias são baseadas em falhas formais que só especialistas de alto nível conseguem identificar.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-xs font-bold tracking-widest uppercase px-8 py-4 rounded hover:brightness-110 transition-all"
            >
              Falar com Especialista
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-[var(--secondary)] opacity-40" />
            <Image
              src="/erikachagas.jpg"
              alt="Erika Chagas — Founder & CEO Legal Drive"
              width={600}
              height={600}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-[var(--secondary)] p-5 rounded-lg">
              <p className="font-display text-lg font-bold text-[var(--on-secondary)]">Erika Chagas</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--on-secondary)] opacity-80">
                Founder & CEO Legal Drive
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold text-[var(--secondary)] mb-1">{stat.value}</p>
                <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-24">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-3">
            Soluções
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--on-surface)]">
            O que fazemos
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div key={svc.title} className="card-base p-8 group">
              <svg className="w-8 h-8 text-[var(--secondary)] mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={svc.icon} />
              </svg>
              <h3 className="font-display text-xl font-bold text-[var(--primary)] mb-3">{svc.title}</h3>
              <p className="text-[var(--on-surface-variant)] text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <WhatsAppBanner />
    </main>
  )
}
