import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPostsByCategory } from '@/lib/payload-api'
import { getPostCoverImage } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'CNH & Direitos do Motorista',
  description:
    'Inteligência jurídica aplicada ao direito de dirigir. Análise sobre suspensão, cassação e as atualizações mais críticas do Código de Trânsito Brasileiro.',
  slug: 'cnh',
})

/* ============================================================
   Tipos / normalização
   ============================================================ */
type Story = {
  id: string | number
  title: string
  href: string
  excerpt: string
  coverImage: string | null
  category: string
}

function normalize(doc: any): Story {
  const cat = typeof doc.category === 'object' && doc.category ? doc.category : null
  const catSlug = cat?.slug || 'cnh'
  return {
    id: doc.id,
    title: doc.title,
    href: `/${catSlug}/${doc.slug}`,
    excerpt: doc.excerpt || '',
    coverImage: getPostCoverImage(doc),
    category: cat?.name || 'CNH',
  }
}

/* ============================================================
   Conteúdo de fallback (espelha o mockup sem backend)
   ============================================================ */
const fbFeatured: Story = {
  id: 'fb-feat',
  title: 'Como evitar a suspensão da CNH em 2024: Guia Definitivo',
  href: '#',
  excerpt:
    'Entenda as novas margens de pontuação e quais infrações levam à suspensão direta, independentemente da soma de pontos no prontuário do condutor.',
  coverImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGmnsQtBaOEtcrjZZtnJ7mp5SozTcJ6e9ipYy2dejuRV0pPqcqH5VAtJ2WBDfGjRvxvi6y1N3NxBwT658PSPIYD35uXj7mnOYAYgxfYDl-Vlbt9D29gJ5OpYWx-Y3Lv2Gxpv4lPc7ApD7f9I8F54wUUTocxw4b3VUbOJMq45kT3Ng3b7piqsij5epqBwNlVFspSW1o7n1c8M-kFSkyCQG58a4pHMnhB5nqtnSJlxa4bvbvVOMa_6_EArCzxHbJPTsTz6xVzlBQ',
  category: 'Suspensão de CNH',
}

const fbGrid: Story[] = [
  {
    id: 'fb-g1',
    title: 'Novas regras para o Exame Toxicológico',
    href: '#',
    excerpt: 'Os prazos mudaram e a fiscalização está mais rigorosa para categorias C, D e E.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjv_3W2IJ-h1FWUx64SJhwnwGHpmWygjeOIAakv7qNltPFBAUQ1YuihQ2M_XxrAhowZhA5mMaj3pNXXzG9DRZoRo6rWnl34uX_g1TEtbVjwhFRfOEuHSJOlNjYSTyTxJZapIn90wwpyof_fxNXyxFSyAU0VWKfgSnKC_FyCDsghN0MbxvZ3kc8HTimMgLS3sY5sPvzQiln0LWi-hXp9WSGjo4Vb-c6GNV9WFyoWqs0acLyk0alq8-qQ4vqdaj0WDz3PT0WSNi1Q',
    category: 'Legislação',
  },
  {
    id: 'fb-g2',
    title: 'Cassação: Quando o recurso é a única saída',
    href: '#',
    excerpt: 'A estratégia jurídica correta para reverter a perda do direito de dirigir.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5srrvXeDZKv5HUU0-vs3Sy_tS_6PF8hOkXwds_IKWAx4vXAu-wDZ4J6LxvSwWw0SQaUmygJCN0SRADpBdBWI2nhkjsmo8pXgx47yTrT7dm1mupwfE8rObpNR6jY5CBXPYgHKpAXyN13rkjc6bnDepZc4nZCGqMTrNr86xE3uAWiJaCjyt9xSxyzm1kQ6rXfe6tbnyV--dE2fr0O4RwqLkG46LXAq_hAma9WLb87SoPvdnsLfAv6S-Fo3RQXXmnTuIR9djuMnR9w',
    category: 'Defesa Administrativa',
  },
  {
    id: 'fb-g3',
    title: 'O que muda para os novos condutores',
    href: '#',
    excerpt: 'Projetos de lei visam alterar o processo de formação de condutores no Brasil.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9BG-EOAHtCoRFsAeIrPWuY6rErfuEa2CnkJE3bhWXJgsC9E_DXtEUbTy6dU5LBn1pAy3dvjhlgoW3rIDMGPPDw4wIsh2Ff2mz3-l3y1rKd2DyroI7txucJmG2cBWkaYG5lzFC9ZwTGM05iecOi2DMuEs_05MhQJGTJTY903c8xQBIkajkH53qb-aONMApTSlwPgda3pLmvDJhm9Kes5p5EWj1Wjr1hgjY4l2ivBnzyR_-LqMo33NSR_Q35ZWAgiJ0PMVebWoEUQ',
    category: 'Habilitação',
  },
  {
    id: 'fb-g4',
    title: 'CNH Digital: Facilidades e Riscos',
    href: '#',
    excerpt: 'A tecnologia a favor do motorista e o que diz a lei sobre a obrigatoriedade.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCssAST1ChlOQEH2VZ-MmZ5hZdbAXiyVMxyakgBt0w7qo4JwXc-RseBfwtzQdx1uVyR8bXuQFrIU9VNVsMiPFTU7oWJRpPyq5GcGaCRc1lPVdMirXqsX6mZ0QWac794S99HIaQWKBIYmDEuKlll3rkUORShFkalVBpuxSN92OX_grfkhRhB_zBY9moX2qUcxbMTie4eVr0odcsuUU-M6DmMut1QaPxViAWRApLsqQCxqCn4LsfoqIDM9wdhJeIfIWZiRPp2P5Bkmg',
    category: 'Tecnologia',
  },
]

/* ============================================================
   Ícones inline
   ============================================================ */
function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
const P = {
  search: 'M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z',
  arrowLeft: 'M10 19l-7-7m0 0l7-7m-7 7h18',
  arrowRight: 'M14 5l7 7m0 0l-7 7m7-7H3',
  forum: 'M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  support: 'M18 8a6 6 0 00-12 0v5a2 2 0 002 2h1v-7a3 3 0 016 0v7h1a2 2 0 002-2V8zM9 20h6',
}

const sidebarCategorias = [
  { name: 'Multas', href: '/multas', count: '124', active: false },
  { name: 'CNH & Direitos', href: '/cnh', count: '86', active: true },
  { name: 'Radar e Fiscalização', href: '/radar', count: '45', active: false },
  { name: 'Mobilidade Elétrica', href: '/mobilidade-eletrica', count: '12', active: false },
  { name: 'Casos Reais', href: '/casos-reais', count: '33', active: false },
]

/* ============================================================
   Página
   ============================================================ */
export default async function CnhPage() {
  const postsResult = await getPostsByCategory('cnh', 12)
  const real = (postsResult?.docs || []).map(normalize)

  const usingReal = real.length > 0
  const featured = usingReal ? real[0] : fbFeatured
  const grid = usingReal ? real.slice(1, 5) : fbGrid

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '/contato'

  return (
    <main className="bg-[var(--primary-container)] text-[var(--on-surface)]">
      <div className="max-w-content mx-auto px-4 md:px-16 py-12 md:py-16">
        {/* ============ CABEÇALHO DA CATEGORIA ============ */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[var(--secondary)] font-mono text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-[var(--secondary)]" />
            Especialidade Jurídica
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--on-surface)] mb-6">
            CNH &amp; Direitos do Motorista
          </h1>
          <p className="font-body text-lg text-[var(--primary)] max-w-3xl leading-relaxed">
            Inteligência jurídica aplicada ao direito de dirigir. Análise profunda sobre processos de suspensão,
            cassação e as atualizações mais críticas do Código de Trânsito Brasileiro.
          </p>
          <hr className="mt-12 border-[var(--on-primary-fixed-variant)]" />
        </header>

        {/* ============ GRID 8 / 4 ============ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* ----- Conteúdo (8) ----- */}
          <div className="md:col-span-8 space-y-16">
            {/* Card destaque */}
            <article className="group">
              <Link href={featured.href} className="block relative aspect-video overflow-hidden mb-6 rounded-xl border border-[var(--on-primary-fixed-variant)]">
                {featured.coverImage ? (
                  <Image src={featured.coverImage} alt={featured.title} fill priority sizes="(max-width:768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-[var(--tertiary-container)]" />
                )}
                <span className="absolute top-4 left-4 bg-[var(--secondary)] text-[var(--on-secondary)] px-4 py-1 font-mono text-xs tracking-widest uppercase rounded-full shadow-lg">
                  Destaque
                </span>
              </Link>
              <div className="space-y-3">
                <span className="text-[var(--secondary)] font-mono text-xs uppercase tracking-widest">{featured.category}</span>
                <Link href={featured.href}>
                  <h2 className="font-display text-2xl md:text-[32px] leading-tight font-bold text-[var(--on-surface)] group-hover:text-[var(--secondary)] transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="font-body text-base text-[var(--on-surface-variant)]">{featured.excerpt}</p>
              </div>
            </article>

            {/* Grade de artigos */}
            {grid.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-16">
                {grid.map((a) => (
                  <article key={a.id} className="group">
                    <Link href={a.href} className="block relative aspect-square overflow-hidden mb-4 rounded-xl border border-[var(--on-primary-fixed-variant)]">
                      {a.coverImage ? (
                        <Image src={a.coverImage} alt={a.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-[var(--tertiary-container)]" />
                      )}
                    </Link>
                    <span className="text-[var(--secondary)] font-mono text-xs uppercase tracking-widest">{a.category}</span>
                    <Link href={a.href}>
                      <h3 className="font-display text-2xl font-semibold text-[var(--on-surface)] mt-3 group-hover:text-[var(--secondary)] transition-colors">
                        {a.title}
                      </h3>
                    </Link>
                    <p className="font-body text-base text-[var(--on-surface-variant)] mt-2">{a.excerpt}</p>
                  </article>
                ))}
              </div>
            )}

            {/* Paginação */}
            <div className="flex items-center justify-between pt-12 border-t border-[var(--on-primary-fixed-variant)]">
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[var(--outline)]">
                <Icon d={P.arrowLeft} className="w-4 h-4" /> Anterior
              </span>
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs tracking-widest text-[var(--secondary)] border-b-2 border-[var(--secondary)] px-2">1</span>
                <span className="font-mono text-xs tracking-widest text-[var(--primary)] hover:text-[var(--secondary)] transition-colors px-2 cursor-pointer">2</span>
                <span className="font-mono text-xs tracking-widest text-[var(--primary)] hover:text-[var(--secondary)] transition-colors px-2 cursor-pointer">3</span>
              </div>
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[var(--primary)] hover:text-[var(--secondary)] transition-colors cursor-pointer">
                Próxima <Icon d={P.arrowRight} className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* ----- Sidebar (4) ----- */}
          <aside className="md:col-span-4 space-y-12">
            {/* Pesquisar arquivo */}
            <div className="p-6 bg-[var(--tertiary-container)] rounded-xl border border-[var(--on-primary-fixed-variant)]">
              <h4 className="font-mono text-xs text-[var(--on-surface)] uppercase mb-4 tracking-widest">Pesquisar Arquivo</h4>
              <form action="/cnh" className="relative">
                <input
                  name="q"
                  type="text"
                  placeholder="Ex: Multa de velocidade"
                  className="w-full bg-transparent border-b border-[var(--on-primary-fixed-variant)] focus:border-[var(--secondary)] transition-colors py-2 pr-10 focus:outline-none text-[var(--on-surface)] placeholder:text-[var(--primary-fixed-dim)]"
                />
                <span className="absolute right-1 top-2 text-[var(--primary)]">
                  <Icon d={P.search} />
                </span>
              </form>
            </div>

            {/* Categorias */}
            <div className="px-2">
              <h4 className="font-mono text-xs text-[var(--on-surface)] uppercase mb-6 tracking-widest">Categorias</h4>
              <ul className="space-y-5">
                {sidebarCategorias.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className={`flex justify-between items-center group ${c.active ? 'border-l-2 border-[var(--secondary)] pl-4' : ''}`}
                    >
                      <span className={`font-body ${c.active ? 'text-[var(--on-surface)] font-semibold' : 'text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors'}`}>
                        {c.name}
                      </span>
                      <span className={`font-mono text-xs ${c.active ? 'text-[var(--secondary)]' : 'text-[var(--outline)]'}`}>{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA WhatsApp */}
            <div className="bg-[var(--secondary)] text-[var(--on-secondary)] p-8 rounded-xl relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <h4 className="font-display text-2xl font-semibold mb-3">Dúvidas sobre sua CNH?</h4>
                <p className="font-body opacity-90 mb-8">Fale agora com um especialista em Direito de Trânsito da Legal Drive.</p>
                <Link
                  href={whatsapp}
                  className="inline-flex items-center gap-3 bg-[var(--primary-container)] text-[var(--secondary)] px-8 py-4 font-mono text-xs tracking-widest uppercase rounded-full hover:bg-[var(--on-surface)] hover:text-[var(--primary-container)] transition-all w-full justify-center shadow-lg border border-[var(--primary-container)]"
                >
                  <Icon d={P.forum} /> Consultar Especialista
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--primary-container)] opacity-10 rounded-full blur-3xl" />
            </div>

            {/* Newsletter */}
            <div className="border border-[var(--on-primary-fixed-variant)] p-8 rounded-xl bg-[var(--tertiary-container)]">
              <h4 className="font-mono text-xs text-[var(--on-surface)] uppercase mb-4 tracking-widest">Legal Insights</h4>
              <p className="font-mono text-[11px] text-[var(--on-surface-variant)] mb-6 uppercase tracking-wider">
                Assine nossa curadoria semanal de legislação.
              </p>
              <form action="/contato" method="GET">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-transparent border-b border-[var(--on-primary-fixed-variant)] py-2 mb-6 focus:border-[var(--secondary)] focus:outline-none text-[var(--on-surface)] placeholder:text-[var(--primary-fixed-dim)]"
                />
                <button
                  type="submit"
                  className="w-full bg-[var(--on-surface)] text-[var(--primary-container)] font-mono text-xs py-3 rounded-full hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all uppercase tracking-widest"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* ============ FAB Suporte ============ */}
      <Link
        href={whatsapp}
        className="fixed bottom-8 right-8 bg-[var(--secondary)] text-[var(--on-secondary)] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 group border-2 border-[var(--secondary)]"
        aria-label="Suporte Legal"
      >
        <Icon d={P.support} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-mono text-xs uppercase tracking-widest">
          Suporte Legal
        </span>
      </Link>
    </main>
  )
}
