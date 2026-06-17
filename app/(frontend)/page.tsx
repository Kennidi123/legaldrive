import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getLatestPosts, getMainFeatured, getVideos, getPostsByCategory } from '@/lib/payload-api'
import { getPostCoverImage } from '@/lib/lexical'
import { buildMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import VideoEmbed from '@/components/VideoEmbed'
import CoverImage from '@/components/CoverImage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({})

/* ============================================================
   Tipos e normalização de dados
   ============================================================ */
type Story = {
  id: string | number
  title: string
  href: string
  excerpt: string
  coverImage: string | null
  category: string
  date?: string | null
}

function normalize(doc: any): Story {
  const cat = typeof doc.category === 'object' && doc.category ? doc.category : null
  const catSlug = cat?.slug || 'multas'
  return {
    id: doc.id,
    title: doc.title,
    href: `/${catSlug}/${doc.slug}`,
    excerpt: doc.excerpt || '',
    coverImage: getPostCoverImage(doc),
    category: cat?.name || 'Notícias',
    date: doc.publishedAt ?? null,
  }
}

/** Retorna a lista real se houver itens, caso contrário o conteúdo de fallback. */
function pick<T>(real: T[], fallback: T[]): T[] {
  return real.length > 0 ? real : fallback
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

/* ============================================================
   Conteúdo de fallback (espelha o mockup quando não há dados)
   ============================================================ */
const IMG = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU0a8xlTS22gOseU7TVeISBji86ez3Tvli3Ymf6mrPPp0KHRqcTCSalYq9D06bkrAiLPl41TwLjunTpWsTkNYa9YZAhyhLWvyv30G8H6wiEPfrXGZ5LFHPsMzC14os2DWuVpdjeeAnTaiL-gPnw0pOJGdosmIyEKEkNOnf9X_WR3tSybIOiHjNi0z0yaU66w-JH4_pBqUyyp-sRrXtWzC_Yk5dCV0E3YSVyAsTxcwxFjJbT4nhvzjDjgeu-GRJsoCx8RnKnv65uw',
  side1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjBOT_RdZwjlJ8RWOZYY9DP0jV4-PHY3VmIKVUoA_gMxOjtf0CiHZV3BVd5m3omUs-tbqs7k6oKFxT_lwxsVMUjbMW7xMLCRsIIJ3Pe3oera2TrMnJcV4fBf-Tpbq53xKwBoUKn67wC-9JYPhoLMZey6JKP3PfnyBdob_oo3qL_tBtPTcueWEOHRrc0_ljqroH_OPNaPWJ34MLNGoHLMn0qlinqF58L8xjLSm6SQPKS218sq7u68Ph1cdTUUOvc5EU2ueGcIqY7Q',
  side2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyfI1wTPaCS29LktZY_h1NOsIrvXjlgw4hKb353U3oOveT1w3DX1y_khODTnIH8Cqjx6spq5CTympy18qOvghsYIbh0VkSDbUQKiMwNHKZXcjxU-Zc4xkUos-m_sEkCIdYGKsM-x7NCiYE78putuRC_1B9YELf0eOyfaUJZBDSy1g8vBjMwieVI0Rccl1a8j0NBvTzhErKUUuX8EHbxms5I6GshHVErvuBVweq8GBIRq9UVaxaNpkW6XqNUmwjqruXZKE-koJHNA',
  news1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrvFowZzdQ1NHK8nct835n47x6WGI79iiBkVdH6gcxHp6ecXiIzU23yL8Fvtzl0QMWXuxCR9MBEh2LpNl0PvhfWOOiqANSSbDWPKu3K4GI8Hv1Jg554KwPOqrPsM8rn_uTemLDwu4KD7dF6HFNyFK1svYLB2ZJKh7LphHxKOsbFH7O0uC95cueUNww3nkNv-xQkPMC5aEnBGyNhSa6u0trCJ8lFd1HQTaf-MYtYvDrPwLm2e_CvpKcyzAkIgOb2K_Ts_5ZW0Tyw',
  news2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzC-kNCCbcrcR1tcF6Wr6qp_ox9VrIFcHdfGHsuDHdWPThW2ZRHTGVeoTKCyNogDIh5qHlqxRoggiNiyz7GGs3VyBn4Isnh_fuq5pehQMIzaKdZsqUedadpVh-fZrNKgKNHGng_hGQ0diU2ZVFES8HTK6sYqTmjRie78GPezvy4HX6Ru0dHluZKWp0D1TslTcHBYuuGHW-uWrxiU9Z5K2WvP_pgHIQC0-mH22aSYsu7DYw8gbAAbiyAXgXlgYuQXTaxJ_jCMlYA',
  video: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV5-WScRiGZaD8fqrZkmcSAtSYZacUsiv552fjGczkKn3-21SibUPBtHZybQ_TKiejGNMI8SdY-6T_lw4Qvb6PpQRrvnME2FGNDl2dnjGsPlalL5ivp0Y6OOuIrA8lFC9-FM32mU5l2_8PfysgDyWOMo3uOtlixwE2MzXBFhi28rNJsjRlXqdFZMTIRUHpW_EZmMVYh_V7iZ6M2JWHo2h9oHIwA4EN0VEn7GQ7ER5JYffiYbRAAkXpGvcaiApr-6CGx48SeI13Aw',
  tech1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc-e5iwgTsXzm_OgpST6XTsgMoBGGlQUEp6w-5jeLSURgIEnrYwa6I-6XQ8OORdM4iKRS6ZFMipuugOYIRxo6IBiq5a86lYoRLPM46qaFiy3WM_pT6x7tkAE513TRapqJlTVwz9vc-NcC7sJqt1nu0irQ1pAo1_YFJPF4227nIIu1qFBoYWgYqWCm6a6QDOVLEjIe934HRPDaH1-piOshT1Nb6OeiYBhmnXdUAf8KHCUHjaeT9MxeQIve5x9Ir_mEkfOVYBGYxRA',
  tech2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHaffRjnEcn6gMeGcDXfgSjkHXR-1V333uxt8xFxB55_E8C6cy857eH95XSkWsC-SnluKuRiH9p2RUDC8t-K19VQV1Pr3bd-AgI3G5Nfngx09lecU4ofgcynynyNq3WIywjPXEzbLTvsItOYJLIjGhAcZVirIhsUGCFV4Mnc8ZX7sYosWxsx9lFI2616rk7IKqBqMJEiZEv_JZX-9fiwN5jd-lWbnxIvj0YsOzIoijUStq5VaLNa8fiILz-_hoFnM037FxVwcO7w',
  premium: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6q6gd3U2_hSTqlYzaKcmgn31zIF7AxNIF_80L9MrsAE-_vTFqvW-SPGbyzMxPbk1tv8E8WcEShrdnre-Ip5POCr4p5NktgT1IcyCUGZbEz6NgmxnzXx9DBnmODdCZ5-3BOB4PFeELlHOCjozTgnj-5rTMWJNQ4ZP5nX_3xkuIhJ8w9tDRV18YodqFC22KynEFigcrHVEJQT4yUEe-rNMVQlL6q0e30Rlr3f3AMidswNhx3mh1TPAGjjL8pNPuDK6PT9TIwTAj2g',
}

const fbHero: Story = {
  id: 'fb-hero',
  title: 'Novas Regras de Suspensão da CNH: O que o condutor precisa saber para não perder o direito de dirigir.',
  href: '#',
  excerpt:
    'A análise técnica sobre as recentes mudanças no Código de Trânsito Brasileiro que impactam diretamente a pontuação e os processos administrativos de suspensão. Entenda os prazos de defesa e as novas instâncias recursais.',
  coverImage: IMG.hero,
  category: 'Legislação 2024',
}

const fbSide: Story[] = [
  { id: 'fb-s1', title: 'Radares Ocultos: A legalidade das multas em trechos sem sinalização visível.', href: '#', excerpt: '', coverImage: IMG.side1, category: 'Radar' },
  { id: 'fb-s2', title: 'IPVA para Carros Elétricos: Quais estados já aplicam a isenção total?', href: '#', excerpt: '', coverImage: IMG.side2, category: 'Mobilidade Elétrica' },
]

const fbRecent: Story[] = [
  { id: 'fb-n1', title: 'Como recorrer de multa por bafômetro mesmo após a recusa do teste.', href: '#', excerpt: 'Entenda os argumentos jurídicos e as falhas procedimentais que podem anular o auto de infração em casos de recusa.', coverImage: IMG.news1, category: 'Multas & CNH' },
  { id: 'fb-n2', title: 'Blitz do Bafômetro: Seus direitos e deveres durante a abordagem policial.', href: '#', excerpt: 'Um guia prático sobre como se comportar e o que a legislação permite durante uma fiscalização de trânsito urbana.', coverImage: IMG.news2, category: 'Fiscalização' },
]

const fbTech: Story[] = [
  { id: 'fb-t1', title: 'A Inteligência Artificial no monitoramento de vias urbanas.', href: '#', excerpt: 'Como algoritmos estão sendo usados para prever engarrafamentos e identificar infrações complexas.', coverImage: IMG.tech1, category: 'Tecnologia' },
  { id: 'fb-t2', title: 'Cidades Inteligentes: O futuro das multas eletrônicas.', href: '#', excerpt: 'A integração de sensores IoT na malha rodoviária e o impacto jurídico na privacidade do cidadão.', coverImage: IMG.tech2, category: 'Tecnologia' },
]

const fbCivica: Story[] = [
  { id: 'fb-c1', title: 'Educação & Respeito no Trânsito', href: '#', excerpt: 'Dicas práticas para uma convivência mais segura entre pedestres e motoristas.', coverImage: null, category: 'Cidadania' },
  { id: 'fb-c2', title: 'Seus Direitos como Condutor', href: '#', excerpt: 'O que fazer quando você se sente injustiçado por uma autoridade de trânsito.', coverImage: null, category: 'Cidadania' },
  { id: 'fb-c3', title: 'Ação Comunitária por um Trânsito Melhor', href: '#', excerpt: 'Como solicitar melhorias na sinalização do seu bairro de forma legal.', coverImage: null, category: 'Cidadania' },
]

const fbMaisLidas: Story[] = [
  { id: 'fb-r1', title: 'A verdade sobre a multa de 40 pontos.', href: '#', excerpt: '', coverImage: null, category: 'CNH' },
  { id: 'fb-r2', title: 'Como cancelar multas de bafômetro.', href: '#', excerpt: '', coverImage: null, category: 'Jurídico' },
  { id: 'fb-r3', title: 'Novos radares de velocidade média.', href: '#', excerpt: '', coverImage: null, category: 'Fiscalização' },
]

const fbListMultas: Story[] = [
  { id: 'fb-lm1', title: 'Como consultar multas pelo RENAVAM em 2024.', href: '#', excerpt: '', coverImage: null, category: 'Multas' },
  { id: 'fb-lm2', title: 'Prazo para renovação da CNH vencida na pandemia.', href: '#', excerpt: '', coverImage: null, category: 'CNH' },
  { id: 'fb-lm3', title: 'Transferência de pontos: O que mudou com o aplicativo SNE.', href: '#', excerpt: '', coverImage: null, category: 'CNH' },
]

const fbListLeis: Story[] = [
  { id: 'fb-ll1', title: 'Lei da Cadeirinha: Novas exigências para transporte infantil.', href: '#', excerpt: '', coverImage: null, category: 'Legislação' },
  { id: 'fb-ll2', title: 'Insulfilm: Regras de transparência e multas por irregularidade.', href: '#', excerpt: '', coverImage: null, category: 'Legislação' },
  { id: 'fb-ll3', title: 'Exame Toxicológico: Quem precisa fazer e quais as punições.', href: '#', excerpt: '', coverImage: null, category: 'Legislação' },
]

/* ============================================================
   Ícones (inline, estilo do projeto)
   ============================================================ */
function Icon({ d, className = 'w-5 h-5', fill = false }: { d: string; className?: string; fill?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
const P = {
  gavel: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  chip: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 7h10v10H7V7z',
  trending: 'M3 17l6-6 4 4 8-8m0 0h-5m5 0v5',
  review: 'M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  arrow: 'M14 5l7 7m0 0l-7 7m7-7H3',
  heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  balance: 'M12 3v18m0-18l7 4m-7-4L5 7m0 0l-3 7a3 3 0 006 0L5 7zm14 0l-3 7a3 3 0 006 0l-3-7zM4 21h16',
  groups: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2.5-1.34M5 14a3 3 0 11.5-5.66',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
}

/* ============================================================
   Página inicial (HOME) — layout editorial
   ============================================================ */
export default async function HomePage() {
  const [mainDoc, postsResult, videosResult, techResult, civicaResult] = await Promise.all([
    getMainFeatured(),
    getLatestPosts(16),
    getVideos(4),
    getPostsByCategory('mobilidade-eletrica', 4),
    getPostsByCategory('direitos-do-motorista', 3),
  ])

  const principal = mainDoc ? normalize(mainDoc) : null
  const real = (postsResult?.docs || []).map(normalize)
  const videos = (videosResult?.docs || []) as any[]
  // Notícias reais da categoria Tecnologia (slug: mobilidade-eletrica)
  const techDocs = (techResult?.docs || []).map(normalize)
  // Notícias reais da categoria Cidadania (slug: direitos-do-motorista)
  const civicaDocs = (civicaResult?.docs || []).map(normalize)
  const civica = pick(civicaDocs.slice(0, 3), fbCivica)

  // Hero = Destaque Principal (featureLevel = principal); demais = notícias recentes (todas as categorias)
  const heroMain = principal ?? real[0] ?? fbHero
  const rest = real.filter((p) => p.id !== heroMain.id)
  const heroSide = pick(rest.slice(0, 2), fbSide)
  // Notícias Recentes: a partir da 3ª; se houver poucos posts, mostra os que existirem.
  const recent = pick(rest.slice(2, 8).length ? rest.slice(2, 8) : rest, fbRecent)
  const tech = pick(techDocs.slice(0, 2), fbTech)
  const maisLidas = pick(rest.slice(0, 3), fbMaisLidas)
  const listMultas = pick(rest.slice(0, 3), fbListMultas)
  const listLeis = pick(rest.slice(3, 6), fbListLeis)

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '#'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      <main className="bg-[var(--primary-container)] text-[var(--primary-fixed)]">
      <div className="max-w-content mx-auto px-4 md:px-16 py-16">
        {/* ============ HERO BENTO ============ */}
        <section className="reveal grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-16">
          {/* Matéria principal */}
          <article className="lg:col-span-8 group">
            <Link href={heroMain.href} className="media-zoom block relative aspect-video overflow-hidden rounded-xl mb-4">
              {heroMain.coverImage ? (
                <CoverImage src={heroMain.coverImage} alt={heroMain.title} priority sizes="(max-width:1024px) 100vw, 66vw" className="transform group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-[var(--tertiary-container)]" />
              )}
              <span className="pulse-badge absolute top-4 left-4 bg-[var(--secondary)] text-[var(--on-secondary)] px-3 py-1 font-mono text-[11px] tracking-widest uppercase rounded-lg z-10">
                Destaque
              </span>
            </Link>
            <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-2 block">{heroMain.category}</span>
            <Link href={heroMain.href}>
              <h2 className="font-display text-2xl md:text-[32px] leading-tight font-bold mb-4 group-hover:text-[var(--secondary)] transition-colors">
                {heroMain.title}
              </h2>
            </Link>
            <p className="text-[var(--primary)] text-lg leading-relaxed line-clamp-3">{heroMain.excerpt}</p>
          </article>

          {/* Matérias laterais */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {heroSide.map((s, i) => (
              <article key={s.id} className="group">
                <Link href={s.href} className="media-zoom block relative aspect-[16/10] overflow-hidden rounded-xl mb-2">
                  {s.coverImage ? (
                    <CoverImage src={s.coverImage} alt={s.title} sizes="(max-width:1024px) 100vw, 33vw" className="transform group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[var(--tertiary-container)]" />
                  )}
                </Link>
                <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-1 block">{s.category}</span>
                <Link href={s.href}>
                  <h3 className="font-display text-xl leading-snug font-semibold group-hover:text-[var(--secondary)] transition-colors">{s.title}</h3>
                </Link>
                {i === 0 && <div className="h-px bg-[var(--on-primary-fixed-variant)] mt-5" />}
              </article>
            ))}
          </div>
        </section>

        {/* ============ CONTEÚDO + SIDEBAR ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* ----- Coluna principal ----- */}
          <div className="lg:col-span-8">
            {/* Notícias Recentes */}
            <section className="reveal mb-16">
              <div className="flex items-center justify-between border-b-2 border-[var(--primary)] pb-2 mb-8">
                <h2 className="font-display text-[32px] font-bold">Notícias Recentes</h2>
                <Link href="#" className="group text-[var(--secondary)] font-mono text-sm hover:underline flex items-center gap-1">
                  Ver todas <Icon d={P.arrow} className="w-4 h-4 arrow-nudge" />
                </Link>
              </div>
              <div className="space-y-8">
                {recent.map((n, i) => (
                  <div key={n.id}>
                    <article className="flex flex-col md:flex-row gap-6 group">
                      <Link href={n.href} className="media-zoom md:w-1/3 relative aspect-[4/3] overflow-hidden rounded-xl flex-none">
                        {n.coverImage ? (
                          <CoverImage src={n.coverImage} alt={n.title} sizes="(max-width:768px) 100vw, 33vw" className="transform group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full bg-[var(--tertiary-container)]" />
                        )}
                      </Link>
                      <div className="md:w-2/3">
                        <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-2 block">{n.category}</span>
                        <Link href={n.href}>
                          <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-[var(--secondary)] transition-colors">{n.title}</h3>
                        </Link>
                        <p className="text-[var(--primary)] text-base line-clamp-2">{n.excerpt}</p>
                        {n.date && (
                          <div className="mt-4 flex items-center text-[var(--primary-fixed-dim)] font-mono text-[11px] gap-4">
                            <span className="flex items-center gap-1"><Icon d={P.clock} className="w-4 h-4" /> {formatDate(n.date)}</span>
                          </div>
                        )}
                      </div>
                    </article>
                    {i < recent.length - 1 && <div className="h-px bg-[var(--on-primary-fixed-variant)] mt-8" />}
                  </div>
                ))}
              </div>
            </section>

            {/* Vídeos em Destaque */}
            <section className="reveal mb-16 bg-[var(--tertiary-container)] p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-8 border-l-4 border-[var(--secondary)] pl-4">
                <h2 className="font-display text-[32px] font-bold">Vídeos em Destaque</h2>
              </div>

              {videos.length > 0 ? (
                <>
                  <div className="mb-6">
                    <VideoEmbed youtubeId={videos[0].youtubeId} title={videos[0].title} />
                    <h3 className="font-display text-2xl font-semibold mt-4">{videos[0].title}</h3>
                  </div>
                  {videos.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {videos.slice(1, 4).map((v) => (
                        <div key={v.id} className="space-y-2">
                          <VideoEmbed youtubeId={v.youtubeId} title={v.title} thumbnail={v.thumbnail} />
                          <p className="font-mono text-sm line-clamp-2">{v.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Placeholder visual (sem vídeos cadastrados) */}
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6 group">
                    <Image src={IMG.video} alt="Vídeo em destaque" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-[var(--secondary)] rounded-full flex items-center justify-center shadow-lg">
                        <Icon d="M8 5v14l11-7z" className="w-10 h-10 ml-1 text-[var(--on-secondary)]" fill />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-display text-2xl font-semibold text-white">Documentário: O Futuro da Mobilidade e o Direito de Ir e Vir</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['5 Mitos sobre Multas de Radar', 'Casos Reais: Vitória no TJ-SP', 'Regras para Patinetes Elétricos'].map((t, i) => (
                      <div key={i} className={`space-y-2 ${i === 2 ? 'hidden md:block' : ''}`}>
                        <div className="relative aspect-video bg-[var(--surface-container)] rounded-xl overflow-hidden flex items-center justify-center">
                          <Icon d="M8 5v14l11-7z" className="w-8 h-8 text-white/80" fill />
                        </div>
                        <p className="font-mono text-sm line-clamp-2">{t}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Novas Tecnologias */}
            <section className="reveal mb-16">
              <div className="flex items-center justify-between border-b-2 border-[var(--primary)] pb-2 mb-8">
                <h2 className="font-display text-[32px] font-bold">Novas Tecnologias</h2>
                <span className="text-[var(--secondary)]"><Icon d={P.chip} /></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {tech.map((t) => (
                  <article key={t.id} className="group">
                    <Link href={t.href} className="media-zoom block relative aspect-video rounded-xl overflow-hidden mb-4">
                      {t.coverImage ? (
                        <CoverImage src={t.coverImage} alt={t.title} sizes="(max-width:768px) 100vw, 50vw" className="group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-[var(--tertiary-container)]" />
                      )}
                    </Link>
                    <Link href={t.href}>
                      <h3 className="font-display text-2xl font-semibold group-hover:text-[var(--secondary)] transition-colors">{t.title}</h3>
                    </Link>
                    <p className="text-[var(--primary)] text-base mt-2 line-clamp-2">{t.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Listas: Multas & CNH / Legislação */}
            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-16">
              {[
                { title: 'Multas & CNH', items: listMultas },
                { title: 'Legislação', items: listLeis },
              ].map((col) => (
                <section key={col.title}>
                  <div className="border-l-4 border-[var(--secondary)] pl-4 mb-4">
                    <h2 className="font-display text-2xl font-semibold">{col.title}</h2>
                  </div>
                  <ul className="space-y-4">
                    {col.items.map((item) => (
                      <li key={item.id} className="group flex gap-4 items-start">
                        <span className="w-2 h-2 rounded-full bg-[var(--secondary)] mt-2 flex-none" />
                        <Link href={item.href} className="text-base text-[var(--primary-fixed)] group-hover:text-[var(--secondary)] transition-colors">{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {/* Cidadania no Trânsito — notícias reais da categoria */}
            <section className="reveal mt-16 pt-16 border-t border-[var(--on-primary-fixed-variant)]">
              <h2 className="font-display text-[32px] font-bold mb-8">Cidadania no Trânsito</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {civica.map((c) => (
                  <article key={c.id} className="group">
                    <Link href={c.href} className="block relative aspect-video rounded-xl overflow-hidden mb-4 bg-[var(--tertiary-container)] border border-[var(--on-primary-fixed-variant)]">
                      {c.coverImage ? (
                        <CoverImage src={c.coverImage} alt={c.title} sizes="(max-width:768px) 100vw, 33vw" className="group-hover:scale-105 transition-transform" />
                      ) : null}
                    </Link>
                    <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-1 block">{c.category}</span>
                    <Link href={c.href}>
                      <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-[var(--secondary)] transition-colors line-clamp-2">{c.title}</h3>
                    </Link>
                    <p className="text-[var(--primary)] text-sm mt-2 line-clamp-2">{c.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* ----- Sidebar ----- */}
          <aside className="reveal lg:col-span-4 space-y-16">
            {/* Mais Lidas */}
            <div className="bg-[var(--tertiary-container)] p-8 rounded-xl border-l border-[var(--on-primary-fixed-variant)]">
              <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-[var(--secondary)]"><Icon d={P.trending} /></span> Mais Lidas
              </h3>
              <div className="space-y-6">
                {maisLidas.map((m, i) => (
                  <Link key={m.id} href={m.href} className="flex gap-4 group">
                    <span className="text-[var(--secondary)] font-display text-[32px] font-bold opacity-30 group-hover:opacity-100 transition-opacity leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="font-mono text-sm mb-1 group-hover:text-[var(--secondary)] transition-colors">{m.title}</h4>
                      <span className="text-[var(--primary-fixed-dim)] font-mono text-[11px] uppercase">{m.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Comunidade WhatsApp */}
            <Link
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine hover-lift block rounded-2xl p-8 text-center shadow-lg transition-all group"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.77 11.77 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Comunidade Legal Drive</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">Entre no nosso grupo do WhatsApp e receba alertas sobre leis, multas e seus direitos em primeira mão.</p>
              <span className="inline-flex items-center justify-center gap-2 bg-white text-[#128C7E] px-6 py-3 rounded-full font-mono text-xs font-bold tracking-widest uppercase group-hover:scale-105 transition-transform">
                Entrar na Comunidade
              </span>
            </Link>

            {/* Newsletter */}
            <div className="border border-[var(--on-primary-fixed-variant)] p-8 rounded-xl">
              <h3 className="font-display text-2xl font-semibold mb-2">Newsletter</h3>
              <p className="text-[var(--primary)] text-base mb-4">Assine e receba a curadoria semanal de trânsito direto no seu e-mail.</p>
              <form action="/contato" method="GET" className="space-y-3">
                <input name="email" type="email" required placeholder="Seu melhor e-mail" className="w-full border-b border-[var(--on-primary-fixed-variant)] focus:border-[var(--secondary)] bg-transparent py-2 transition-colors placeholder:text-[var(--primary-fixed-dim)] focus:outline-none" />
                <button type="submit" className="btn-shine w-full bg-[var(--secondary)] text-[var(--on-secondary)] py-2 font-mono uppercase tracking-widest text-[11px] rounded-xl hover:brightness-110 transition-all">Assinar Agora</button>
              </form>
            </div>
          </aside>
        </div>

        {/* ============ ALERTA CTB (fim da página) ============ */}
        <section className="reveal mt-16 bg-[var(--tertiary-container)] border border-[var(--on-primary-fixed-variant)] rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[var(--error)]"><Icon d={P.gavel} /></span>
            <h2 className="font-display text-2xl font-semibold">Mudanças Legislativas: Alerta CTB</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--on-primary-fixed-variant)]">
            {[
              { tag: 'Vigente Agora', text: 'Novas regras para o uso de viseiras em capacetes de motociclistas.' },
              { tag: 'Em Votação', text: 'Alteração nos prazos de renovação para motoristas profissionais.' },
              { tag: 'Jurisprudência', text: 'Decisão do STF sobre a validade da prova de recusa ao bafômetro.' },
            ].map((item, i) => (
              <div key={i} className="md:px-4 first:md:pl-0 last:md:pr-0 pt-4 md:pt-0 first:pt-0">
                <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--secondary)] block mb-1">{item.tag}</span>
                <p className="font-mono text-xs leading-relaxed text-[var(--primary-fixed)] hover:text-[var(--secondary)] transition-colors cursor-pointer">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      </main>
    </>
  )
}
