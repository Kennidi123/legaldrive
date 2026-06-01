import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numId = Number(id)
    if (!Number.isInteger(numId)) {
      return new NextResponse('Not found', { status: 404 })
    }

    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const result = await pool.query('SELECT mimetype, data FROM uploaded_images WHERE id = $1', [numId])
    await pool.end()

    if (!result.rows[0]) {
      return new NextResponse('Not found', { status: 404 })
    }

    const { mimetype, data } = result.rows[0]
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mimetype,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
