/* eslint-disable @next/next/no-img-element */
import { lexicalToHTML, normalizeMediaUrl } from '@/lib/lexical'
import VideoEmbed from './VideoEmbed'

interface MediaGroup {
  tipo?: 'none' | 'image' | 'video' | null
  imageUrl?: string | null
  caption?: string | null
  video?: string | null
}

interface PostBody {
  title: string
  content?: unknown
  contentMeio?: unknown
  contentFinal?: unknown
  mediaInicial?: MediaGroup | null
  mediaMeio?: MediaGroup | null
  mediaFinal?: MediaGroup | null
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
    const url = normalizeMediaUrl(media.imageUrl)
    if (!url) return null
    return (
      <figure className="my-10">
        <div
          className="relative w-full aspect-video overflow-hidden rounded-xl bg-[var(--tertiary-container)]"
          style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.35)' }}
        >
          <img
            src={url}
            alt={media.caption || title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {media.caption && (
          <figcaption className="mt-3 font-mono text-[11px] text-[var(--on-surface-variant)] italic text-center">
            {media.caption}
          </figcaption>
        )}
      </figure>
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
