type LexicalNode = {
  type: string
  text?: string
  format?: number
  style?: string
  tag?: string
  listType?: string
  fields?: { url?: string; newTab?: boolean }
  children?: LexicalNode[]
  version?: number
}

type LexicalRoot = {
  root: { children: LexicalNode[] }
}

function serializeNodes(nodes: LexicalNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        let text = (node.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // Preserva quebras de linha digitadas (posts antigos guardavam o texto
        // inteiro com '\n' em um único parágrafo).
        text = text.replace(/\n/g, '<br />')
        const fmt = node.format || 0
        if (fmt & 1) text = `<strong>${text}</strong>`
        if (fmt & 2) text = `<em>${text}</em>`
        if (fmt & 8) text = `<u>${text}</u>`
        if (fmt & 4) text = `<s>${text}</s>`
        if (fmt & 16) text = `<code>${text}</code>`
        // Estilos inline (tamanho da fonte, espaçamento, cor) definidos no editor.
        if (node.style) {
          const safe = node.style.replace(/"/g, '&quot;')
          text = `<span style="${safe}">${text}</span>`
        }
        return text
      }
      if (node.type === 'linebreak') return '<br />'
      if (node.type === 'paragraph') {
        const inner = serializeNodes(node.children || [])
        return inner ? `<p>${inner}</p>` : ''
      }
      if (node.type === 'heading') {
        const tag = node.tag || 'h2'
        return `<${tag}>${serializeNodes(node.children || [])}</${tag}>`
      }
      if (node.type === 'quote') {
        return `<blockquote>${serializeNodes(node.children || [])}</blockquote>`
      }
      if (node.type === 'list') {
        const tag = node.listType === 'number' ? 'ol' : 'ul'
        return `<${tag}>${serializeNodes(node.children || [])}</${tag}>`
      }
      if (node.type === 'listitem') {
        return `<li>${serializeNodes(node.children || [])}</li>`
      }
      if (node.type === 'link') {
        const url = node.fields?.url || '#'
        const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `<a href="${url}"${target}>${serializeNodes(node.children || [])}</a>`
      }
      if (node.type === 'horizontalrule') return '<hr />'
      if (node.type === 'code') {
        return `<pre><code>${serializeNodes(node.children || [])}</code></pre>`
      }
      if (node.children) return serializeNodes(node.children)
      return ''
    })
    .join('')
}

export function lexicalToHTML(content: LexicalRoot | null | undefined): string {
  if (!content?.root?.children) return ''
  return serializeNodes(content.root.children)
}

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || '').replace(/\/$/, '')

// Corrige URLs que ficaram com o host interno do container (localhost:3001)
function normalizeImageUrl(url?: string | null): string | null {
  if (!url) return null
  if (BACKEND) {
    return url.replace(/^https?:\/\/localhost:3001/, BACKEND)
  }
  return url
}

export function getPostCoverImage(post: {
  coverImage?: { url?: string } | null | number
  coverImageUrl?: string | null
}): string | null {
  if (post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url) {
    return normalizeImageUrl(post.coverImage.url)
  }
  return normalizeImageUrl(post.coverImageUrl)
}

/**
 * Imagem quadrada da notícia, usada nos formatos menores (miniaturas).
 * Se não houver imagem quadrada dedicada, cai de volta para a capa landscape.
 */
export function getPostSquareCover(post: {
  coverImageSquareUrl?: string | null
  coverImage?: { url?: string } | null | number
  coverImageUrl?: string | null
}): string | null {
  if (post.coverImageSquareUrl) return normalizeImageUrl(post.coverImageSquareUrl)
  return getPostCoverImage(post)
}

/**
 * Imagem MÉDIA da notícia, usada nos cards das listas de notícias.
 * Se não houver imagem média dedicada, cai de volta para a capa.
 */
export function getPostMediumCover(post: {
  coverImageMediumUrl?: string | null
  coverImage?: { url?: string } | null | number
  coverImageUrl?: string | null
}): string | null {
  if (post.coverImageMediumUrl) return normalizeImageUrl(post.coverImageMediumUrl)
  return getPostCoverImage(post)
}

/** Normaliza uma URL de mídia (corrige host interno do container). */
export function normalizeMediaUrl(url?: string | null): string | null {
  return normalizeImageUrl(url ?? null)
}

export function getAuthorAvatar(author: {
  avatar?: { url?: string } | null | number
  avatarUrl?: string | null
} | null | undefined): string | null {
  if (!author) return null
  if (author.avatar && typeof author.avatar === 'object' && author.avatar.url) {
    return normalizeImageUrl(author.avatar.url)
  }
  return normalizeImageUrl(author.avatarUrl)
}
