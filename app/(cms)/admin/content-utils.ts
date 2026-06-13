// Utilitários compartilhados pelos formulários do CMS (novo post / editar post).

/** Uma imagem dentro de um bloco de mídia (galeria). */
export interface MediaImage {
  url: string
  caption: string
}

export interface MediaValue {
  tipo: 'none' | 'image' | 'video'
  /** Galeria — permite mais de uma imagem por bloco intercalado. */
  images: MediaImage[]
  /** Legado: 1ª imagem (mantido por compatibilidade com posts antigos). */
  imageUrl: string
  caption: string
  video: string
}

export const emptyMedia: MediaValue = { tipo: 'none', images: [], imageUrl: '', caption: '', video: '' }

/** Converte uma linha de texto em nós lexical, interpretando **negrito**. */
function inlineNodes(line: string) {
  const nodes: any[] = []
  // Divide mantendo os trechos **...** como grupos.
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  for (const part of parts) {
    if (!part) continue
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) {
      nodes.push({ type: 'text', text: bold[1], format: 1, version: 1 })
    } else {
      nodes.push({ type: 'text', text: part, format: 0, version: 1 })
    }
  }
  return nodes
}

/** Converte o texto do textarea em lexical, preservando a separação de parágrafos
 *  (cada linha vira um parágrafo). Convenções de formatação:
 *  - linha começando com `## ` → subtítulo (negrito, maior)
 *  - `**texto**` em qualquer lugar → negrito */
export function textToLexical(text: string) {
  const lines = (text || '').split('\n')
  const children = lines.map((line) => {
    const sub = line.match(/^##\s+(.*)$/)
    if (sub) {
      return {
        type: 'heading',
        tag: 'h3',
        children: inlineNodes(sub[1]),
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
      }
    }
    return {
      type: 'paragraph',
      children: line ? inlineNodes(line) : [],
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
    }
  })
  if (children.length === 0) {
    children.push({ type: 'paragraph', children: [], version: 1, direction: 'ltr', format: '', indent: 0 } as any)
  }
  return {
    root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 },
  }
}

/** Reconstrói uma linha de texto a partir dos nós, restaurando os marcadores
 *  (`**` para negrito). */
function nodeToLine(node: any): string {
  return (node.children || [])
    .map((c: any) => {
      const t = c.text || ''
      return (c.format || 0) & 1 ? `**${t}**` : t
    })
    .join('')
}

/** Extrai o texto puro de um documento lexical (para reabrir no textarea),
 *  restaurando `## ` para subtítulos e `**` para negrito. */
export function lexicalToText(content: any): string {
  try {
    const children = content?.root?.children || []
    return children
      .map((node: any) => (node.type === 'heading' ? `## ${nodeToLine(node)}` : nodeToLine(node)))
      .join('\n')
  } catch {
    return ''
  }
}

/** Normaliza o grupo de mídia para enviar ao backend (sem campos irrelevantes). */
export function cleanMedia(m: MediaValue): MediaValue {
  if (m.tipo === 'image') {
    const images = (m.images || []).filter((i) => i.url?.trim())
    return {
      tipo: 'image',
      images,
      imageUrl: images[0]?.url || '', // mantém a 1ª no campo legado
      caption: images[0]?.caption || '',
      video: '',
    }
  }
  if (m.tipo === 'video') return { tipo: 'video', images: [], imageUrl: '', caption: '', video: m.video }
  return { tipo: 'none', images: [], imageUrl: '', caption: '', video: '' }
}

/** Lê o grupo de mídia de um post carregado do backend. */
export function mediaFromPost(m: any): MediaValue {
  if (!m || typeof m !== 'object') return { ...emptyMedia, images: [] }
  let images: MediaImage[] = []
  if (Array.isArray(m.images)) {
    images = m.images
      .map((i: any) => ({ url: i?.url || '', caption: i?.caption || '' }))
      .filter((i: MediaImage) => i.url)
  } else if (m.imageUrl) {
    images = [{ url: m.imageUrl, caption: m.caption || '' }]
  }
  return {
    tipo: (m.tipo as MediaValue['tipo']) || 'none',
    images,
    imageUrl: m.imageUrl || '',
    caption: m.caption || '',
    video: m.video || '',
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Conversão HTML (do editor visual) → Lexical (formato salvo no banco).
// O RichTextEditor produz HTML (negrito, itálico, sublinhado, listas, links...).
// Aqui convertemos para os nós lexical que o renderizador (lib/lexical.ts) já
// entende, preservando a formatação exatamente como o editor escreveu.
// ───────────────────────────────────────────────────────────────────────────

// Bitmask de formatação (igual ao serializer em lib/lexical.ts).
const FMT = { bold: 1, italic: 2, strike: 4, underline: 8, code: 16 }

const BLOCK_TAGS = new Set(['p', 'div', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'])

function txtNode(text: string, format: number) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function block(type: string, children: any[], extra: Record<string, unknown> = {}) {
  return { type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra }
}

/** Soma ao bitmask a formatação indicada por uma tag ou estilo inline. */
function formatOf(el: HTMLElement, base: number): number {
  let f = base
  const tag = el.tagName.toLowerCase()
  if (tag === 'b' || tag === 'strong') f |= FMT.bold
  if (tag === 'i' || tag === 'em') f |= FMT.italic
  if (tag === 'u' || tag === 'ins') f |= FMT.underline
  if (tag === 's' || tag === 'strike' || tag === 'del') f |= FMT.strike
  if (tag === 'code') f |= FMT.code
  const st = el.style
  const fw = st.fontWeight
  if (fw === 'bold' || fw === 'bolder' || (/^\d+$/.test(fw) && parseInt(fw, 10) >= 600)) f |= FMT.bold
  if (st.fontStyle === 'italic') f |= FMT.italic
  const td = `${st.textDecoration || ''} ${(st as any).textDecorationLine || ''}`
  if (td.includes('underline')) f |= FMT.underline
  if (td.includes('line-through')) f |= FMT.strike
  return f
}

/** Coleta os nós inline (texto/links/quebras) de um elemento. */
function parseInline(node: Node, format: number, out: any[]) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const text = (child.textContent || '').replace(/ /g, ' ')
      if (text) out.push(txtNode(text, format))
      return
    }
    if (child.nodeType !== 1) return
    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') {
      out.push({ type: 'linebreak', version: 1 })
      return
    }
    if (tag === 'a') {
      const inner: any[] = []
      parseInline(el, format, inner)
      out.push(
        block('link', inner, {
          fields: { url: el.getAttribute('href') || '#', newTab: true, linkType: 'custom' },
        }),
      )
      return
    }
    parseInline(el, formatOf(el, format), out)
  })
}

function hasBlockChildren(el: HTMLElement): boolean {
  return Array.from(el.children).some((c) => BLOCK_TAGS.has(c.tagName.toLowerCase()))
}

/** Converte um elemento de bloco e empilha o(s) nó(s) resultante(s). */
function parseBlock(el: HTMLElement, out: any[]) {
  const tag = el.tagName.toLowerCase()

  if (tag === 'ul' || tag === 'ol') {
    const items: any[] = []
    el.querySelectorAll(':scope > li').forEach((li) => {
      const inner: any[] = []
      parseInline(li, 0, inner)
      items.push(block('listitem', inner, { value: items.length + 1 }))
    })
    if (items.length) out.push(block('list', items, { listType: tag === 'ol' ? 'number' : 'bullet', tag, start: 1 }))
    return
  }
  if (/^h[1-6]$/.test(tag)) {
    const inner: any[] = []
    parseInline(el, 0, inner)
    out.push(block('heading', inner, { tag: tag === 'h1' || tag === 'h2' ? 'h2' : 'h3' }))
    return
  }
  if (tag === 'blockquote') {
    const inner: any[] = []
    parseInline(el, 0, inner)
    out.push(block('quote', inner))
    return
  }
  // Contêiner (div/p) com blocos aninhados → desce recursivamente.
  if ((tag === 'div' || tag === 'p') && hasBlockChildren(el)) {
    el.childNodes.forEach((n) => {
      if (n.nodeType === 1) parseBlock(n as HTMLElement, out)
      else if (n.nodeType === 3 && (n.textContent || '').trim()) {
        out.push(block('paragraph', [txtNode(n.textContent || '', 0)]))
      }
    })
    return
  }
  // Padrão: parágrafo.
  const inner: any[] = []
  parseInline(el, 0, inner)
  out.push(block('paragraph', inner))
}

/** Converte o HTML do editor visual em um documento lexical. */
export function htmlToLexical(html: string) {
  const children: any[] = []
  if (typeof document !== 'undefined') {
    const container = document.createElement('div')
    container.innerHTML = html || ''
    container.childNodes.forEach((node) => {
      if (node.nodeType === 1) parseBlock(node as HTMLElement, children)
      else if (node.nodeType === 3 && (node.textContent || '').trim()) {
        children.push(block('paragraph', [txtNode(node.textContent || '', 0)]))
      }
    })
  }
  if (children.length === 0) children.push(block('paragraph', []))
  return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}

/** Verifica se o HTML do editor tem algum conteúdo real (texto ou mídia inline). */
export function htmlHasContent(html: string): boolean {
  if (!html) return false
  const stripped = html
    .replace(/<br\s*\/?>(?=)/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/ /g, '')
    .trim()
  return stripped.length > 0
}
