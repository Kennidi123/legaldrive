import type { Metadata } from 'next'
import Image from 'next/image'
import { getPostsByCategory } from '@/lib/payload-api'
import { lexicalToHTML, getPostCoverImage, getAuthorAvatar } from '@/lib/lexical'
import { buildMetadata } from '@/lib/seo'
import VideoEmbed from '@/components/VideoEmbed'
import ArticleLayout, { type RelatedItem } from '@/components/ArticleLayout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Fiscalização e Radar',
  description:
    'Análise técnica sobre radares, fiscalização eletrônica e a Resolução 798 do CONTRAN. Saiba como evitar e contestar multas indevidas.',
  slug: 'radar',
})

const IMG = {
  cover:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsSXrgevMcR1CmIcKcrNa2a3b3uRqTQa67bV77bZIL3GzDen5w8DEgqtSzUwf9X4Q1rhXUxX_LyJiJGihe4xa2M66rWo75yQL4NoRhGheiFRstihIWOAOYljJtquPakU0TbbBjIZXvPk6j6hJ6d0ugy49rN5-4iP4L6769nL4BkLl1OIQUqFWTOE7IKx0NykmIB3A2yWHpMVMJ3mzK9axA1-WYSM6cXk3O463aiBkTLiEzL0Yy6TEe_VwIVo6trxcqNSpmBOsqNw',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVv7GbbfABmEGwmDn3DA0G6i886Id_XrB65xVahJWNaVJkupGKPAaXQhXj9YUREtj8rPmYBDxUgNlZgd8sHFA9jzFABicqeFHhttpD-_cUbjxezwftsf_TQiD9P37cCIaXlqM5FloXuluNi4YmV7kt6438VPHxF-P90_EWjH0BoqTIW0Bkupv0wsDFnYg25wdiuXkc_GiqC2plZflrX9McINsZD71-bm8LfQrFUVxGSzkuyxXkNd9uEkznq7FE73pDzpZKUB9p7Q',
  video:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCXYBq1UV9zJ0cshW1VUgB4Clle-JYtzWJ8eb-XoyZI4845R_8avS3lUs3PFhrwGfavdR19TFv3rcEdo1qGiwKwuRShJ21WCjDZ227t0z1-YPC8_AlSWUhN0nfFiJ_ixJ_iy_0VZPpZa0Npo_OqWuZEuVwLT1F7L6X6YIaQvfEp71HnWXnbsI0jEae5Hhsbx9-seFx4gZbnMuijJcpcUjCGeYn_BqvsEUM9ObVz88t5BjK2-J-ZRJ0WZ4AAWxB382X72iApIhYypw',
  rel1:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6c2vloeTdAy3Uy-S8ovx2dFMGhqikE3pgzfJ-IfdxIcJFOrt1AKHSve8cqJ4KDRlGVIUmBkOK3GLl9uj59GjzI5N26s6IxioLZUShGmvheIxNzYFUhfdlHh4W6KXCWF1dbm0qvElfJt4bbFx2aiRh6GxN-sGA6A8dZazEDaqU0efyDsFVW__kIIq0M2GUQ5l2ePY4Cs-aRffri5Q-bBjLY1mBZCx0ix-CQbNAJ5ELo7RDG-MpVsVdce_pZFM3SWnyjifyEpEuEw',
  rel2:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZKxEZBb0KuYPGK9DqO8PZ7NB9sKjexgwGvsswiF45gVcyaC2K4DnsBSL6hDd4ot7gPXHNtgTG58PEcC1hA9ikAvVFQdoOr1eXE1lghFkO6Uq6BMLBtf6HvItrpLMI_1vF8FgcOI6SS1ogGfjnoAJqh31OB0Ue2hkKUh52fs5pd1LtiqEnmQtSbWs2HRtYYbb5z9LDnoIf1QeeHyUMdmeOVEtOKEvQMPwJoBebuvTTCqkvrZTKBUujsY6HfsojPhgckk0ja4QAA',
}

const fbRelated: RelatedItem[] = [
  { id: 'r1', label: 'Leis', title: 'Suspensão da CNH: O guia definitivo', href: '#', img: IMG.rel1 },
  { id: 'r2', label: 'Casos Reais', title: 'Anulação de multa por bafômetro', href: '#', img: IMG.rel2 },
]

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

/* Corpo estático (espelha o mockup quando não há backend) */
function FallbackBody() {
  return (
    <div className="article-prose max-w-none">
      <p>
        O cenário do trânsito brasileiro está em constante evolução, e as atualizações nas normas de fiscalização
        eletrônica são um dos pontos que mais geram dúvidas e insegurança nos motoristas. Em 2024, novas diretrizes
        entraram em vigor, alterando não apenas como os radares são operados, mas também os critérios para a validade das
        autuações.
      </p>
      <h2>A Transparência como Regra de Ouro</h2>
      <p>
        Diferente de anos anteriores, onde a &ldquo;indústria da multa&rdquo; era frequentemente citada por radares
        ocultos ou mal sinalizados, a nova legislação prioriza o caráter educativo. Agora, todos os radares fixos devem
        estar visíveis e devidamente sinalizados com placas que indiquem a velocidade máxima permitida de forma clara.
      </p>
      <blockquote className="my-12 p-8 border-l-4 border-[var(--secondary)] italic rounded-r-xl" style={{ background: '#112240' }}>
        <p className="font-display text-2xl text-[var(--on-surface)] leading-relaxed not-italic font-semibold">
          &ldquo;O objetivo do radar na plataforma Legal Drive é sempre a segurança e a conformidade legal. Se a
          fiscalização foge às normas de visibilidade, o condutor tem o direito de contestar.&rdquo;
        </p>
        <cite className="block mt-4 font-mono text-xs text-[var(--secondary)] not-italic">— Equipe Jurídica Legal Drive</cite>
      </blockquote>
      <h2>Assista à Nossa Análise Completa</h2>
      <div className="my-8 aspect-video w-full rounded-xl relative overflow-hidden border border-[var(--on-primary-fixed-variant)] flex items-center justify-center bg-[var(--primary-container)] group">
        <Image src={IMG.video} alt="Análise em vídeo" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--on-secondary)] shadow-2xl">
            <svg className="w-10 h-10 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <p className="font-mono text-xs text-[var(--on-surface)] bg-[var(--primary-container)]/80 backdrop-blur px-4 py-1 rounded">
            Entenda a Resolução 798 em 5 minutos
          </p>
        </div>
      </div>
      <h3>Tipos de Radares e suas Limitações</h3>
      <p>
        É fundamental distinguir entre radares fixos, móveis, estáticos e portáteis. Cada um possui um protocolo de
        aferição anual obrigatório pelo INMETRO. Na Legal Drive, monitoramos essas aferições para garantir defesas
        técnicas sólidas.
      </p>
      <ul className="list-none space-y-4">
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Radares Fixos:</strong> Devem ter visibilidade garantida e sinalização prévia por placas R-19.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Aferição do INMETRO:</strong> Deve ser realizada rigorosamente a cada 12 meses.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[var(--secondary)] font-bold text-xl leading-none">•</span>
          <span><strong className="text-[var(--on-surface)]">Tolerância:</strong> O erro máximo permitido segue a tabela oficial de velocidade medida vs. velocidade considerada.</span>
        </li>
      </ul>
    </div>
  )
}

export default async function RadarPage() {
  const postsResult = await getPostsByCategory('radar', 6)
  const docs = (postsResult?.docs || []) as any[]
  const main = docs[0] || null

  const author = main && typeof main.author === 'object' ? main.author : null
  const html = main ? lexicalToHTML(main.content) : ''
  const youtubeId: string | null = main?.youtubeId ?? null

  const related: RelatedItem[] =
    docs.slice(1, 3).length > 0
      ? docs.slice(1, 3).map((d) => {
          const c = typeof d.category === 'object' ? d.category : { name: 'Radar', slug: 'radar' }
          return { id: d.id, label: c.name, title: d.title, href: `/${c.slug}/${d.slug}`, img: getPostCoverImage(d) }
        })
      : fbRelated

  const tags = Array.isArray(main?.tags) && main.tags.length > 0
    ? main.tags.filter((t: any) => typeof t === 'object').map((t: any) => `#${t.name}`)
    : ['#LegalDrive', '#Multas', '#Radar2024']

  return (
    <ArticleLayout
      label="Fiscalização e Radar"
      title={main?.title ?? 'Novas Regras de Radares em 2024: O que você precisa saber para evitar multas indevidas'}
      cover={(main ? getPostCoverImage(main) : null) || IMG.cover}
      caption="A fiscalização eletrônica passou por mudanças significativas na resolução 798 do CONTRAN."
      authorName={author?.name ?? 'Redação Legal Drive'}
      authorRole={author?.role ?? 'Especialistas em Trânsito'}
      avatar={getAuthorAvatar(author) ?? IMG.avatar}
      dateStr={main?.publishedAt ? formatDate(main.publishedAt) : '24 de Outubro, 2024'}
      readingTime={main?.readingTime ?? 8}
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
