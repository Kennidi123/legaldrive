import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  return generatePageMetadata({ config, params, searchParams })
}

export default async function Page({ params, searchParams }: Args) {
  // Testa inicialização do Payload para capturar o erro real (Server Component — sem sanitização)
  try {
    const { getPayload: _getPayload } = await import('payload')
    await _getPayload({ config })
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    const stack = err instanceof Error ? (err.stack || '') : ''
    return (
      <div style={{ padding: '40px', fontFamily: 'monospace', background: '#0d1117', color: '#f0f6fc', minHeight: '100vh' }}>
        <h2 style={{ color: '#ff7b72', marginBottom: '12px' }}>⚠ Payload — Erro de Inicialização (debug)</h2>
        <pre style={{ background: '#161b22', padding: '16px', color: '#ff7b72', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '12px', fontSize: '13px' }}>
          {message}
        </pre>
        <pre style={{ background: '#0d1117', padding: '16px', color: '#8b949e', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '11px', border: '1px solid #21262d' }}>
          {stack}
        </pre>
        <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '16px' }}>
          DATABASE_URL configurada: {process.env.DATABASE_URL ? 'SIM (primeiros 30 chars: ' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NÃO'}
        </p>
      </div>
    )
  }

  return RootPage({ config, params, searchParams, importMap })
}
