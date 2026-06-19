import Link from 'next/link'
import CoverImage from '@/components/CoverImage'
import type { Metadata } from 'next'
import { searchPosts, getLatestPosts } from '@/lib/payload-api'
import { getPostCoverImage, getPostSquareCover } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'
import ArticleSidebar, { type RelatedItem } from '@/components/ArticleSidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Busca',
  description: 'Pesquise notícias e análises de trânsito no Legal Drive.',
  slug: 'busca',
})

interface Props {
  searchParams: Promise<{ q?: string }>
}

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
  const catSlug = cat?.slug || 'multas'
  return {
    id: doc.id,
    title: doc.title,
    href: `/${catSlug}/${doc.slug}`,
    excerpt: doc.excerpt || '',
    coverImage: getPostCoverImage(doc),
    category: cat?.name || 'Notícias',
  }
}

const FB_RELATED: RelatedItem[] = [
  {
    id: 'fr1',
    label: 'Leis',
    title: 'Suspensão da CNH: O guia definitivo',
    href: '#',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjv_3W2IJ-h1FWUx64SJhwnwGHpmWygjeOIAakv7qNltPFBAUQ1YuihQ2M_XxrAhowZhA5mMaj3pNXXzG9DRZoRo6rWnl34uX_g1TEtbVjwhFRfOEuHSJOlNjYSTyTxJZapIn90wwpyof_fxNXyxFSyAU0VWKfgSnKC_FyCDsghN0MbxvZ3kc8HTimMgLS3sY5sPvzQiln0LWi-hXp9WSGjo4Vb-c6GNV9WFyoWqs0acLyk0alq8-qQ4vqdaj0WDz3PT0WSNi1Q',
  },
  {
    id: 'fr2',
    label: 'Casos Reais',
    title: 'Anulação de multa por bafômetro',
    href: '#',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5srrvXeDZKv5HUU0-vs3Sy_tS_6PF8hOkXwds_IKWAx4vXAu-wDZ4J6LxvSwWw0SQaUmygJCN0SRADpBdBWI2nhkjsmo8pXgx47yTrT7dm1mupwfE8rObpNR6jY5CBXPYgHKpAXyN13rkjc6bnDepZc4nZCGqMTrNr86xE3uAWiJaCjyt9xSxyzm1kQ6rXfe6tbnyV--dE2fr0O4RwqLkG46LXAq_hAma9WLb87SoPvdnsLfAv6S-Fo3RQXXmnTuIR9djuMnR9w',
  },
]

export default async function BuscaPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = (q || '').trim()

  const [resultsRes, latestRes] = await Promise.all([
    query ? searchPosts(query, 24) : Promise.resolve(null),
    getLatestPosts(8),
  ])

  const results = (resultsRes?.docs || []).map(normalize)
  const resultIds = new Set(results.map((r) => r.id))

  const relatedReal: RelatedItem[] = (latestRes?.docs || [])
    .map((d: any) => {
      const c = typeof d.category === 'object' && d.category ? d.category : { name: 'Notícias', slug: 'multas' }
      return { id: d.id, label: c.name, title: d.title, href: `/${c.slug}/${d.slug}`, img: getPostSquareCover(d) }
    })
    .filter((r: RelatedItem) => !resultIds.has(r.id))
    .slice(0, 3)
  const related = relatedReal.length > 0 ? relatedReal : FB_RELATED

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '/contato'

  return (
    <main className="bg-[var(--primary-container)] text-[var(--on-surface)]">
      <div className="max-w-content mx-auto px-4 md:px-16 py-12 md:py-16">
        {/* Cabeçalho */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[var(--secondary)]" />
            <span className="text-[var(--secondary)] font-mono text-xs uppercase tracking-widest">Busca</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--on-surface)]">
            {query ? <>Resultados para <span className="text-[var(--secondary)]">“{query}”</span></> : 'Buscar notícias'}
          </h1>
          {query && (
            <p className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-widest mt-3">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </p>
          )}

          {/* Campo de busca (refinar) */}
          <form action="/busca" method="GET" className="relative mt-6 max-w-xl">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--on-surface-variant)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </span>
            <input
              name="q"
              type="text"
              defaultValue={query}
              placeholder="Buscar leis, multas, CNH..."
              className="w-full rounded-xl bg-[var(--tertiary-container)] border border-[var(--on-primary-fixed-variant)] pl-12 pr-4 py-3 text-sm text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
            />
          </form>

          <hr className="mt-8 border-[var(--on-primary-fixed-variant)]" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Resultados */}
          <div className="lg:col-span-8">
            {!query ? (
              <p className="text-[var(--on-surface-variant)] text-base py-10">
                Digite um termo no campo acima para pesquisar notícias e análises.
              </p>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-10">
                {results.map((c) => (
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
            ) : (
              <div className="py-10">
                <p className="font-display text-xl font-semibold text-[var(--on-surface)] mb-2">
                  Nenhum resultado para “{query}”.
                </p>
                <p className="text-[var(--on-surface-variant)] text-base">
                  Tente outro termo ou veja as notícias relacionadas ao lado.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: relacionadas + CTA + newsletter */}
          <ArticleSidebar related={related} whatsapp={whatsapp} />
        </div>
      </div>
    </main>
  )
}
