// Utilitários compartilhados pelos formulários do CMS (novo post / editar post).

export interface MediaValue {
  tipo: 'none' | 'image' | 'video'
  imageUrl: string
  caption: string
  video: string
}

export const emptyMedia: MediaValue = { tipo: 'none', imageUrl: '', caption: '', video: '' }

/** Converte o texto simples do textarea em um documento lexical (1 parágrafo). */
export function textToLexical(text: string) {
  return {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

/** Extrai o texto puro de um documento lexical (para reabrir no textarea). */
export function lexicalToText(content: any): string {
  try {
    const children = content?.root?.children || []
    return children
      .map((node: any) => (node.children || []).map((c: any) => c.text || '').join(''))
      .join('\n\n')
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
