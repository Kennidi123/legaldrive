export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
          <h2>Página não encontrada</h2>
          <p style={{ color: '#64748b' }}>A rota solicitada não existe no painel.</p>
        </div>
      </body>
    </html>
  )
}
