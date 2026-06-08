// Utilitários compartilhados pelos formulários do CMS (novo post / editar post).

export interface MediaValue {
  tipo: 'none' | 'image' | 'video'
  imageUrl: string
  caption: string
  video: string
}

export const emptyMedia: MediaValue = { tipo: 'none', imageUrl: '', caption: '', video: '' }

/** Converte o texto do textarea em lexical, preservando a separação de parágrafos
 *  (cada linha digitada vira um parágrafo). */
export function textToLexical(text: string) {
  const lines = (text || '').split('\n')
  const children = lines.map((line) => ({
    type: 'paragraph',
    children: line ? [{ type: 'text', text: line, version: 1 }] : [],
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
  }))
  if (children.length === 0) {
    children.push({ type: 'paragraph', children: [], version: 1, direction: 'ltr', format: '', indent: 0 })
  }
  return {
    root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 },
  }
}

/** Extrai o texto puro de um documento lexical (para reabrir no textarea),
 *  mantendo as quebras de linha entre os parágrafos. */
export function lexicalToText(content: any): string {
  try {
    const children = content?.root?.children || []
    return children
      .map((node: any) => (node.children || []).map((c: any) => c.text || '').join(''))
      .join('\n')
  } catch {
    return ''
  }
}

/** Normaliza o grupo de mídia para enviar ao backend (sem campos irrelevantes). */
export function cleanMedia(m: MediaValue): MediaValue {
  if (m.tipo === 'image') return { tipo: 'image', imageUrl: m.imageUrl, caption: m.caption, video: '' }
  if (m.tipo === 'video') return { tipo: 'video', imageUrl: '', caption: '', video: m.video }
  return { tipo: 'none', imageUrl: '', caption: '', video: '' }
}

/** Lê o grupo de mídia de um post carregado do backend. */
export function mediaFromPost(m: any): MediaValue {
  if (!m || typeof m !== 'object') return { ...emptyMedia }
  return {
    tipo: (m.tipo as MediaValue['tipo']) || 'none',
    imageUrl: m.imageUrl || '',
    caption: m.caption || '',
    video: m.video || '',
  }
}
