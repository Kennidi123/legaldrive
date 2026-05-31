'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#e11d48' }}>Erro no painel</h2>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{ padding: '8px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
