'use client'

export default function AdminError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'monospace',
      background: '#0d1117',
      color: '#f0f6fc',
      minHeight: '100vh',
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      overflow: 'auto',
    }}>
      <h2 style={{ color: '#ff7b72', marginBottom: '16px', fontSize: '20px' }}>
        ⚠ Payload Admin — Erro de Inicialização
      </h2>
      <p style={{ color: '#8b949e', marginBottom: '12px', fontSize: '14px' }}>
        Mensagem de erro:
      </p>
      <pre style={{
        background: '#161b22',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #30363d',
        color: '#ff7b72',
        fontSize: '13px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        marginBottom: '16px',
      }}>
        {error.message || String(error)}
      </pre>
      {error.digest && (
        <p style={{ color: '#8b949e', fontSize: '12px' }}>Digest: {error.digest}</p>
      )}
      <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '24px' }}>
        Verifique as variáveis DATABASE_URL e PAYLOAD_SECRET no painel do Coolify.
      </p>
    </div>
  )
}
