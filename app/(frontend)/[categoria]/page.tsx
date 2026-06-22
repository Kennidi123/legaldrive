import Link from 'next/link'
import CoverImage from '@/components/CoverImage'
import type { Metadata } from 'next'
import { getCategories, getCategoryBySlug, getPostsByCategory, getLatestPosts } from '@/lib/payload-api'
import { getPostCoverImage, getPostSquareCover } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'
import ArticleSidebar, { type RelatedItem } from '@/components/ArticleSidebar'
import TrafficLawsSection from '@/components/TrafficLawsSection'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  try {
    const result = await getCategories()
    return (result?.docs || []).map((c: any) => ({ categoria: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  try {
    const cat = await getCategoryBySlug(categoria)
    if (!cat) return {}
    return buildMetadata({
      title: `${cat.name} — Notícias e Análises`,
      description: cat.description || `Análises e notícias sobre ${cat.name} no Brasil.`,
      slug: categoria,
    })
  } catch {
    return {}
  }
}

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

type Story = {
  id: string | number
  title: string
  href: string
  excerpt: string
  coverImage: string | null
  category: string
  featureLevel: string
}

function normalize(doc: any, fallbackCat: string, slug: string): Story {
  const cat = typeof doc.category === 'object' && doc.category ? doc.category : null
  const catSlug = cat?.slug || slug
  return {
    id: doc.id,
    title: doc.title,
    href: `/${catSlug}/${doc.slug}`,
    excerpt: doc.excerpt || '',
    coverImage: getPostCoverImage(doc),
    category: cat?.name || fallbackCat,
    featureLevel: doc.featureLevel || (doc.featured ? 'destaque' : 'normal'),
  }
}

/* Conteúdo de fallback (quando não há posts/backend) — mantém a página completa */
const FB_IMG = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGmnsQtBaOEtcrjZZtnJ7mp5SozTcJ6e9ipYy2dejuRV0pPqcqH5VAtJ2WBDfGjRvxvi6y1N3NxBwT658PSPIYD35uXj7mnOYAYgxfYDl-Vlbt9D29gJ5OpYWx-Y3Lv2Gxpv4lPc7ApD7f9I8F54wUUTocxw4b3VUbOJMq45kT3Ng3b7piqsij5epqBwNlVFspSW1o7n1c8M-kFSkyCQG58a4pHMnhB5nqtnSJlxa4bvbvVOMa_6_EArCzxHbJPTsTz6xVzlBQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjv_3W2IJ-h1FWUx64SJhwnwGHpmWygjeOIAakv7qNltPFBAUQ1YuihQ2M_XxrAhowZhA5mMaj3pNXXzG9DRZoRo6rWnl34uX_g1TEtbVjwhFRfOEuHSJOlNjYSTyTxJZapIn90wwpyof_fxNXyxFSyAU0VWKfgSnKC_FyCDsghN0MbxvZ3kc8HTimMgLS3sY5sPvzQiln0LWi-hXp9WSGjo4Vb-c6GNV9WFyoWqs0acLyk0alq8-qQ4vqdaj0WDz3PT0WSNi1Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5srrvXeDZKv5HUU0-vs3Sy_tS_6PF8hOkXwds_IKWAx4vXAu-wDZ4J6LxvSwWw0SQaUmygJCN0SRADpBdBWI2nhkjsmo8pXgx47yTrT7dm1mupwfE8rObpNR6jY5CBXPYgHKpAXyN13rkjc6bnDepZc4nZCGqMTrNr86xE3uAWiJaCjyt9xSxyzm1kQ6rXfe6tbnyV--dE2fr0O4RwqLkG46LXAq_hAma9WLb87SoPvdnsLfAv6S-Fo3RQXXmnTuIR9djuMnR9w',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrvFowZzdQ1NHK8nct835n47x6WGI79iiBkVdH6gcxHp6ecXiIzU23yL8Fvtzl0QMWXuxCR9MBEh2LpNl0PvhfWOOiqANSSbDWPKu3K4GI8Hv1Jg554KwPOqrPsM8rn_uTemLDwu4KD7dF6HFNyFK1svYLB2ZJKh7LphHxKOsbFH7O0uC95cueUNww3nkNv-xQkPMC5aEnBGyNhSa6u0trCJ8lFd1HQTaf-MYtYvDrPwLm2e_CvpKcyzAkIgOb2K_Ts_5ZW0Tyw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzC-kNCCbcrcR1tcF6Wr6qp_ox9VrIFcHdfGHsuDHdWPThW2ZRHTGVeoTKCyNogDIh5qHlqxRoggiNiyz7GGs3VyBn4Isnh_fuq5pehQMIzaKdZsqUedadpVh-fZrNKgKNHGng_hGQ0diU2ZVFES8HTK6sYqTmjRie78GPezvy4HX6Ru0dHluZKWp0D1TslTcHBYuuGHW-uWrxiU9Z5K2WvP_pgHIQC0-mH22aSYsu7DYw8gbAAbiyAXgXlgYuQXTaxJ_jCMlYA',
]

function fallbackList(catName: string): Story[] {
  const base = [
    { t: `Tudo sobre ${catName}: o que mudou em 2024`, e: 'Um panorama completo das principais atualizações, prazos e direitos que todo motorista precisa conhecer.', f: 'destaque' },
    { t: 'Como recorrer de uma autuação indevida', e: 'O passo a passo da defesa administrativa e os erros formais que mais anulam penalidades.', f: 'normal' },
    { t: 'Prazos e instâncias: o caminho do recurso', e: 'Defesa prévia, JARI e CETRAN — entenda cada etapa e não perca o prazo.', f: 'normal' },
    { t: 'Jurisprudência recente favorável ao condutor', e: 'Decisões dos tribunais que vêm consolidando teses de defesa em todo o país.', f: 'normal' },
    { t: 'Documentos essenciais para sua defesa', e: 'A lista do que reunir antes de protocolar para aumentar suas chances de êxito.', f: 'normal' },
  ]
  return base.map((b, i) => ({
    id: `fb-${i}`,
    title: b.t,
    href: '#',
    excerpt: b.e,
    coverImage: FB_IMG[i % FB_IMG.length],
    category: catName,
    featureLevel: b.f,
  }))
}

const FB_RELATED: RelatedItem[] = [
  { id: 'fr1', label: 'Leis', title: 'Suspensão da CNH: O guia definitivo', href: '#', img: FB_IMG[1] },
  { id: 'fr2', label: 'Casos Reais', title: 'Anulação de multa por bafômetro', href: '#', img: FB_IMG[2] },
]

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params

  const category =
    (await getCategoryBySlug(categoria)) || { name: slugToName(categoria), slug: categoria, description: null }

  const [postsResult, latestResult] = await Promise.all([
    getPostsByCategory(categoria, 30),
    getLatestPosts(8),
  ])

  const real = (postsResult?.docs || []).map((d: any) => normalize(d, category.name, categoria))
  const list = real.length > 0 ? real : fallbackList(category.name)
  // Hero (Destaque) = só posts marcados como Destaque/Principal (o mais recente).
  // Posts "normais" NÃO são promovidos ao topo — vão para a lista "Mais Notícias".
  const featured = list.find((p) => p.featureLevel === 'principal' || p.featureLevel === 'destaque') ?? null
  const cards = featured ? list.filter((p) => p.id !== featured.id) : list

  // Artigos relacionados (sidebar): recentes de qualquer categoria, fora os já exibidos aqui
  const relatedReal: RelatedItem[] = (latestResult?.docs || [])
    .map((d: any) => {
      const c = typeof d.category === 'object' && d.category ? d.category : { name: category.name, slug: categoria }
      return { id: d.id, label: c.name, title: d.title, href: `/${c.slug}/${d.slug}`, img: getPostSquareCover(d) }
    })
    .filter((r: RelatedItem) => r.id !== featured?.id && !cards.some((c) => c.id === r.id))
    .slice(0, 3)
  const related = relatedReal.length > 0 ? relatedReal : FB_RELATED

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '/contato'

  return (
    <main className="bg-[var(--primary-container)] text-[var(--on-surface)]">
      <div className="max-w-content mx-auto px-4 md:px-16 pt-6 pb-12 md:pb-16">
        {/* Título acessível (não exibido) — a página começa pelo destaque */}
        <h1 className="sr-only">{category.name}</h1>

        {/* Seção exclusiva de Leis de Trânsito (apenas na Legislação) */}
        {categoria === 'leis-de-transito' && <TrafficLawsSection />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* ===== Coluna principal: destaque + demais notícias ===== */}
          <div className="lg:col-span-8 space-y-14">
            {featured ? (
              <article className="group">
                <Link href={featured.href} className="block relative aspect-video overflow-hidden rounded-xl mb-6 border border-[var(--on-primary-fixed-variant)] bg-[var(--tertiary-container)]">
                  {featured.coverImage ? (
                    <CoverImage src={featured.coverImage} alt={featured.title} priority sizes="(max-width:1024px) 100vw, 66vw" className="transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </Link>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[var(--secondary)] text-[var(--on-secondary)] px-2.5 py-0.5 rounded-md font-mono text-[10px] tracking-widest uppercase">Destaque</span>
                  <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest">{featured.category}</span>
                </div>
                <Link href={featured.href}>
                  <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight group-hover:text-[var(--secondary)] transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-[var(--primary)] text-lg leading-relaxed mt-4">{featured.excerpt}</p>
              </article>
            ) : cards.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)]">
                  Nenhum artigo publicado nesta categoria
                </p>
              </div>
            ) : null}

            {/* Demais notícias (abaixo do destaque) */}
            {cards.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 border-l-4 border-[var(--secondary)] pl-4">
                  <h2 className="font-display text-2xl font-bold">Mais Notícias</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-10">
                  {cards.map((c) => (
                    <Link key={c.id} href={c.href} className="group block">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[var(--on-primary-fixed-variant)] bg-[var(--tertiary-container)]">
                        {c.coverImage ? (
                          <CoverImage src={c.coverImage} alt={c.title} sizes="(max-width:768px) 100vw, 33vw" className="transition-transform duration-500 group-hover:scale-105" />
                        ) : null}
                      </div>
                      <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-1 block">{c.category}</span>
                      <h3 className="font-display text-xl font-semibold text-[var(--on-surface)] leading-snug group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                      {c.excerpt && <p className="text-[var(--on-surface-variant)] text-sm mt-2 line-clamp-2 leading-relaxed">{c.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ===== Sidebar: relacionados + CTA + newsletter ===== */}
          <ArticleSidebar related={related} whatsapp={whatsapp} />
        </div>
      </div>
    </main>
  )
}
