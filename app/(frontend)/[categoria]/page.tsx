import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/payload-api'
import { getPostCoverImage } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'
import NewsCard from '@/components/NewsCard'

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

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params

  const category =
    (await getCategoryBySlug(categoria)) || { name: slugToName(categoria), slug: categoria, description: null }

  const postsResult = await getPostsByCategory(categoria, 30)
  const real = (postsResult?.docs || []).map((d: any) => normalize(d, category.name, categoria))

  const list = real.length > 0 ? real : fallbackList(category.name)
  // Destaque = post mais recente marcado como destaque/principal; senão o mais recente.
  const featured = list.find((p) => p.featureLevel === 'principal' || p.featureLevel === 'destaque') ?? list[0]
  const cards = list.filter((p) => p.id !== featured?.id)

  return (
    <main className="bg-[var(--primary-container)] text-[var(--on-surface)]">
      <div className="max-w-content mx-auto px-4 md:px-16 py-12 md:py-16">
        {/* Cabeçalho da categoria */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[var(--secondary)] font-mono text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-[var(--secondary)]" />
            {category.name}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--on-surface)] mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-body text-lg text-[var(--primary)] max-w-3xl leading-relaxed">{category.description}</p>
          )}
          <hr className="mt-10 border-[var(--on-primary-fixed-variant)]" />
        </header>

        {featured && (
          /* ===== Notícia em Destaque ===== */
          <section className="mb-16 group">
            <Link href={featured.href} className="block relative aspect-[21/9] overflow-hidden rounded-xl mb-6 border border-[var(--on-primary-fixed-variant)] bg-[var(--tertiary-container)]">
              {featured.coverImage ? (
                <Image src={featured.coverImage} alt={featured.title} fill priority sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : null}
              <span className="absolute top-4 left-4 bg-[var(--secondary)] text-[var(--on-secondary)] px-4 py-1 font-mono text-[11px] tracking-widest uppercase rounded-full shadow-lg">
                Destaque
              </span>
            </Link>
            <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-2 block">{featured.category}</span>
            <Link href={featured.href}>
              <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight max-w-4xl group-hover:text-[var(--secondary)] transition-colors">
                {featured.title}
              </h2>
            </Link>
            <p className="text-[var(--primary)] text-lg leading-relaxed mt-4 max-w-3xl">{featured.excerpt}</p>
          </section>
        )}

        {/* ===== Lista de cards ===== */}
        {cards.length > 0 ? (
          <section>
            <div className="flex items-center gap-3 mb-8 border-l-4 border-[var(--secondary)] pl-4">
              <h2 className="font-display text-[32px] font-bold">Mais Notícias</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-12">
              {cards.map((c) => (
                <NewsCard key={c.id} title={c.title} href={c.href} excerpt={c.excerpt} coverImage={c.coverImage} category={c.category} />
              ))}
            </div>
          </section>
        ) : (
          !featured && (
            <div className="text-center py-24">
              <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] mb-3">
                Nenhum artigo publicado nesta categoria
              </p>
            </div>
          )
        )}
      </div>
    </main>
  )
}
