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
