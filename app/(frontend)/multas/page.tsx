import type { Metadata } from 'next'
import Image from 'next/image'
import { getPostsByCategory } from '@/lib/payload-api'
import { lexicalToHTML, getPostCoverImage, getAuthorAvatar } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'
import VideoEmbed from '@/components/VideoEmbed'
import ArticleLayout, { type RelatedItem } from '@/components/ArticleLayout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Multas e Infrações',
  description:
    'Como recorrer de multas de trânsito: prazos, teses de defesa e as falhas que podem anular autuações indevidas.',
  slug: 'multas',
})

const IMG = {
  cover:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCU0a8xlTS22gOseU7TVeISBji86ez3Tvli3Ymf6mrPPp0KHRqcTCSalYq9D06bkrAiLPl41TwLjunTpWsTkNYa9YZAhyhLWvyv30G8H6wiEPfrXGZ5LFHPsMzC14os2DWuVpdjeeAnTaiL-gPnw0pOJGdosmIyEKEkNOnf9X_WR3tSybIOiHjNi0z0yaU66w-JH4_pBqUyyp-sRrXtWzC_Yk5dCV0E3YSVyAsTxcwxFjJbT4nhvzjDjgeu-GRJsoCx8RnKnv65uw',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVv7GbbfABmEGwmDn3DA0G6i886Id_XrB65xVahJWNaVJkupGKPAaXQhXj9YUREtj8rPmYBDxUgNlZgd8sHFA9jzFABicqeFHhttpD-_cUbjxezwftsf_TQiD9P37cCIaXlqM5FloXuluNi4YmV7kt6438VPHxF-P90_EWjH0BoqTIW0Bkupv0wsDFnYg25wdiuXkc_GiqC2plZflrX9McINsZD71-bm8LfQrFUVxGSzkuyxXkNd9uEkznq7FE73pDzpZKUB9p7Q',
  video:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCV5-WScRiGZaD8fqrZkmcSAtSYZacUsiv552fjGczkKn3-21SibUPBtHZybQ_TKiejGNMI8SdY-6T_lw4Qvb6PpQRrvnME2FGNDl2dnjGsPlalL5ivp0Y6OOuIrA8lFC9-FM32mU5l2_8PfysgDyWOMo3uOtlixwE2MzXBFhi28rNJsjRlXqdFZMTIRUHpW_EZmMVYh_V7iZ6M2JWHo2h9oHIwA4EN0VEn7GQ7ER5JYffiYbRAAkXpGvcaiApr-6CGx48SeI13Aw',
  rel1:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrvFowZzdQ1NHK8nct835n47x6WGI79iiBkVdH6gcxHp6ecXiIzU23yL8Fvtzl0QMWXuxCR9MBEh2LpNl0PvhfWOOiqANSSbDWPKu3K4GI8Hv1Jg554KwPOqrPsM8rn_uTemLDwu4KD7dF6HFNyFK1svYLB2ZJKh7LphHxKOsbFH7O0uC95cueUNww3nkNv-xQkPMC5aEnBGyNhSa6u0trCJ8lFd1HQTaf-MYtYvDrPwLm2e_CvpKcyzAkIgOb2K_Ts_5ZW0Tyw',
  rel2:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzC-kNCCbcrcR1tcF6Wr6qp_ox9VrIFcHdfGHsuDHdWPThW2ZRHTGVeoTKCyNogDIh5qHlqxRoggiNiyz7GGs3VyBn4Isnh_fuq5pehQMIzaKdZsqUedadpVh-fZrNKgKNHGng_hGQ0diU2ZVFES8HTK6sYqTmjRie78GPezvy4HX6Ru0dHluZKWp0D1TslTcHBYuuGHW-uWrxiU9Z5K2WvP_pgHIQC0-mH22aSYsu7DYw8gbAAbiyAXgXlgYuQXTaxJ_jCMlYA',
}

const fbRelated: RelatedItem[] = [
  { id: 'r1', label: 'CNH', title: 'Suspensão da CNH: O guia definitivo', href: '#', img: IMG.rel1 },
  { id: 'r2', label: 'Lei Seca', title: 'Anulação de multa por bafômetro', href: '#', img: IMG.rel2 },
]

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

/* Corpo estático (espelha o layout quando não há backend) */
function FallbackBody() {
  return (
    <div className="article-prose max-w-none">
      <p>
        Receber uma multa nem sempre significa que ela é devida. Grande parte das autuações aplicadas no Brasil contém
        vícios formais que, quando identificados, levam ao cancelamento da penalidade. Conhecer o processo de defesa é o
        primeiro passo para proteger seus pontos e o seu direito de dirigir.
      </p>
      <h2>Defesa Prévia x Recurso: entenda as etapas</h2>
      <p>
        O motorista tem três oportunidades de contestar uma infração: a defesa prévia (após a notificação de autuação),
        o recurso à JARI e, por fim, o recurso ao CETRAN. Cada fase tem prazo próprio e exige fundamentação técnica
        específica — perder um prazo pode encerrar a discussão administrativa.
      </p>
      <blockquote className="my-12 p-8 border-l-4 border-[var(--secondary)] italic rounded-r-xl" style={{ background: '#112240' }}>
        <p className="font-display text-2xl text-[var(--on-surface)] leading-relaxed not-italic font-semibold">
          &ldquo;Uma defesa bem fundamentada não depende de sorte: depende de identificar a falha formal que a
          Administração cometeu ao lavrar o auto de infração.&rdquo;
        </p>
        <cite className="block mt-4 font-mono text-xs text-[var(--secondary)] not-italic">— Equipe Jurídica Legal Drive</cite>
      </blockquote>
      <h2>Assista: Como montar seu recurso</h2>
      <div className="my-8 aspect-video w-full rounded-xl relative overflow-hidden border border-[var(--on-primary-fixed-variant)] flex items-center justify-center bg-[var(--primary-container)] group">
        <Image src={IMG.video} alt="Como recorrer de multas" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--on-secondary)] shadow-2xl">
            <svg className="w-10 h-10 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <p className="font-mono text-xs text-[var(--on-surface)] bg-[var(--primary-container)]/80 backdrop-blur px-4 py-1 rounded">
            Passo a passo do recurso em 5 minutos
          </p>
        </div>
      </div>
      <h3>Principais teses de defesa</h3>
      <p>
        A maioria das anulações ocorre por questões processuais, e não pelo mérito da infração. Estes são os pontos que
        mais geram resultado em recursos administrativos:
      </p>
      <ul className="list-none space-y-4">
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Vício na notificação:</strong> descumprimento do prazo de 30 dias para a notificação da autuação ou da penalidade.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Sinalização irregular:</strong> ausência ou inadequação da sinalização que torna a fiscalização questionável.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Falta de aferição:</strong> equipamento sem aferição válida do INMETRO no momento da medição.</span>
        </li>
      </ul>
    </div>
  )
}

export default async function MultasPage() {
  const postsResult = await getPostsByCategory('multas', 6)
  const docs = (postsResult?.docs || []) as any[]
  const main = docs[0] || null

  const author = main && typeof main.author === 'object' ? main.author : null
  const html = main ? lexicalToHTML(main.content) : ''
  const youtubeId: string | null = main?.youtubeId ?? null

  const related: RelatedItem[] =
    docs.slice(1, 3).length > 0
      ? docs.slice(1, 3).map((d) => {
          const c = typeof d.category === 'object' ? d.category : { name: 'Multas', slug: 'multas' }
          return { id: d.id, label: c.name, title: d.title, href: `/${c.slug}/${d.slug}`, img: getPostCoverImage(d) }
        })
      : fbRelated

  const tags = Array.isArray(main?.tags) && main.tags.length > 0
    ? main.tags.filter((t: any) => typeof t === 'object').map((t: any) => `#${t.name}`)
    : ['#LegalDrive', '#Multas', '#Recursos']

  return (
    <ArticleLayout
      label="Multas e Infrações"
      title={main?.title ?? 'Como recorrer de uma multa de trânsito: o guia completo para anular autuações indevidas'}
      cover={(main ? getPostCoverImage(main) : null) || IMG.cover}
      caption="Conhecer o processo de defesa é o primeiro passo para reverter penalidades aplicadas de forma irregular."
      authorName={author?.name ?? 'Redação Legal Drive'}
      authorRole={author?.role ?? 'Especialistas em Trânsito'}
      avatar={getAuthorAvatar(author) ?? IMG.avatar}
      dateStr={main?.publishedAt ? formatDate(main.publishedAt) : '24 de Outubro, 2024'}
      readingTime={main?.readingTime ?? 7}
      tags={tags}
      related={related}
      whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '/contato'}
    >
      {html ? (
        <>
          <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          {youtubeId && (
            <div className="my-8">
              <VideoEmbed youtubeId={youtubeId} title={main.title} />
            </div>
          )}
        </>
      ) : (
        <FallbackBody />
      )}
    </ArticleLayout>
  )
}
