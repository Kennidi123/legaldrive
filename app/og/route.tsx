import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
// Imagem padrão e estável — pode ser cacheada agressivamente pelos crawlers.
export const dynamic = 'force-static'

const BG = '#0a192f'
const NAVY = '#112240'
const ACCENT = '#ffb86b'
const TEXT = '#e6f1ff'
const MUTED = '#8da2c0'

/**
 * Imagem Open Graph padrão (1200x630) usada no compartilhamento de páginas
 * sem capa própria (home, categorias, institucionais e notícias sem imagem).
 * Servida em /og.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${BG} 0%, ${NAVY} 100%)`,
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Topo: selo da editoria */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: ACCENT }} />
          <span
            style={{
              color: ACCENT,
              fontSize: 24,
              letterSpacing: 6,
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Portal Jurídico de Trânsito
          </span>
        </div>

        {/* Centro: título + subtítulo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ color: TEXT, fontSize: 92, fontWeight: 800, lineHeight: 1 }}>
            Legal Drive
          </span>
          <span style={{ color: MUTED, fontSize: 36, fontWeight: 400, maxWidth: 900, lineHeight: 1.3 }}>
            Inteligência em Direito de Trânsito: multas, CNH, radares e legislação para o motorista brasileiro.
          </span>
        </div>

        {/* Base: linha de acento + domínio */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 120, height: 6, background: ACCENT, borderRadius: 9999 }} />
          <span style={{ color: MUTED, fontSize: 26, letterSpacing: 2 }}>legaldrive.com.br</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
