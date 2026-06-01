import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': FRONTEND,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    // Autentica via JWT do Payload (header Authorization: JWT <token>)
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: corsHeaders })
    }

    const { filename, mimetype, dataBase64 } = await req.json()
    if (!mimetype || !dataBase64) {
      return NextResponse.json({ error: 'Imagem inválida' }, { status: 400, headers: corsHeaders })
    }
    if (!mimetype.startsWith('image/')) {
      return NextResponse.json({ error: 'Arquivo deve ser uma imagem' }, { status: 400, headers: corsHeaders })
    }

    const buffer = Buffer.from(dataBase64, 'base64')
    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande (máx 8MB)' }, { status: 400, headers: corsHeaders })
    }

    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    await pool.query(`CREATE TABLE IF NOT EXISTS uploaded_images (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      mimetype TEXT NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    const result = await pool.query(
      'INSERT INTO uploaded_images (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id',
      [filename || 'image', mimetype, buffer]
    )
    await pool.end()

    const id = result.rows[0].id
    const url = `${req.nextUrl.origin}/api/image/${id}`
    return NextResponse.json({ url, id }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
