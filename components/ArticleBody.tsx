/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react'
import { lexicalToHTML, normalizeMediaUrl } from '@/lib/lexical'
import VideoEmbed from './VideoEmbed'

interface MediaImage {
  url?: string | null
  caption?: string | null
}

interface MediaGroup {
  tipo?: 'none' | 'image' | 'video' | null
  images?: MediaImage[] | null
  imageUrl?: string | null
  caption?: string | null
  video?: string | null
}

interface Section {
  content?: unknown
  media?: MediaGroup | null
}

interface PostBody {
  title: string
  content?: unknown
  contentMeio?: unknown
  contentFinal?: unknown
  mediaInicial?: MediaGroup | null
  mediaMeio?: MediaGroup | null
  mediaFinal?: MediaGroup | null
  /** Corpo dinâmico (novo formato). Quando presente, tem prioridade sobre o legado. */
  sections?: Section[] | null
}

/** Renderiza a mídia (imagem ou vídeo) que fica entre os blocos de texto. */
function MediaBlock({ media, title }: { media?: MediaGroup | null; title: string }) {
  if (!media || !media.tipo || media.tipo === 'none') return null

  if (media.tipo === 'video' && media.video) {
    return (
      <div className="my-10">
        <VideoEmbed youtubeId={media.video} title={title} />
      </div>
    )
  }

  if (media.tipo === 'image') {
    // Galeria (array `images`) com fallback para a imagem única legada.
    const list = Array.isArray(media.images) && media.images.length > 0
      ? media.images
      : media.imageUrl
        ? [{ url: media.imageUrl, caption: media.caption }]
        : []

    const imgs: { url: string; caption?: string | null }[] = []
    for (const i of list) {
      const url = normalizeMediaUrl(i.url)
      if (url) imgs.push({ url, caption: i.caption })
    }

    if (imgs.length === 0) return null

    // 1 imagem → pequena e centralizada (desktop). Várias → grade.
    if (imgs.length === 1) {
      const img = imgs[0]
      return (
        <figure className="my-10 mx-auto md:max-w-sm">
          <div
            className="relative w-full aspect-video overflow-hidden rounded-xl bg-[var(--tertiary-container)]"
            style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.35)' }}
          >
            <img src={img.url} alt={img.caption || title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          {img.caption && (
            <figcaption className="mt-3 font-mono text-[11px] text-[var(--on-surface-variant)] italic text-center">
              {img.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    return (
      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {imgs.map((img, i) => (
          <figure key={i}>
            <div
              className="relative w-full aspect-video overflow-hidden rounded-xl bg-[var(--tertiary-container)]"
              style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.35)' }}
            >
              <img src={img.url} alt={img.caption || title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            {img.caption && (
              <figcaption className="mt-2 font-mono text-[11px] text-[var(--on-surface-variant)] italic text-center">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }

  return null
}

/**
 * Corpo da notícia em até 3 partes (Início → Meio → Final),
 * com um bloco de mídia opcional entre cada parte.
 * Partes vazias simplesmente não são renderizadas (compatível com posts antigos
 * que só têm o `content`).
 */
export default function ArticleBody({ post }: { post: PostBody }) {
  // Formato novo: corpo em seções dinâmicas (texto + mídia).
  const sections = Array.isArray(post.sections) ? post.sections : []
  if (sections.length > 0) {
    return (
      <div className="article-body">
        {sections.map((s, i) => {
          const html = lexicalToHTML(s.content as any)
          return (
            <Fragment key={i}>
              {html && <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />}
              <MediaBlock media={s.media} title={post.title} />
            </Fragment>
          )
        })}
      </div>
    )
  }

  // Formato legado: até 3 partes (Início → Meio → Final).
  const intro = lexicalToHTML(post.content as any)
  const meio = lexicalToHTML(post.contentMeio as any)
  const final = lexicalToHTML(post.contentFinal as any)

  return (
    <div className="article-body">
      {intro && <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: intro }} />}
      <MediaBlock media={post.mediaInicial} title={post.title} />

      {meio && <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: meio }} />}
      <MediaBlock media={post.mediaMeio} title={post.title} />

      {final && <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: final }} />}
      <MediaBlock media={post.mediaFinal} title={post.title} />
    </div>
  )
}
