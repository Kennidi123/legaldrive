import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 40) + '...',
    PAYLOAD_SECRET_set: !!process.env.PAYLOAD_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  }

  // Teste 1: importar pg
  try {
    const { Pool } = await import('pg')
    results.pg_import = 'ok'

    // Teste 2: conectar ao banco
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    try {
      const r = await pool.query('SELECT NOW() as now, current_database() as db')
      results.db_connection = 'ok'
      results.db_time = r.rows[0].now
      results.db_name = r.rows[0].db

      // Teste 3: listar tabelas
      const tables = await pool.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
      )
      results.tables = tables.rows.map((r: { table_name: string }) => r.table_name)
    } catch (dbErr) {
      results.db_connection = 'error'
      results.db_error = String(dbErr)
    } finally {
      await pool.end()
    }
  } catch (pgErr) {
    results.pg_import = 'error'
    results.pg_error = String(pgErr)
  }

  // Teste 4: importar payload
  try {
    await import('payload')
    results.payload_import = 'ok'
  } catch (pErr) {
    results.payload_import = 'error'
    results.payload_error = String(pErr)
  }

  // Teste 5: importar @payloadcms/db-postgres
  try {
    await import('@payloadcms/db-postgres')
    results.payload_db_postgres_import = 'ok'
  } catch (pErr) {
    results.payload_db_postgres_import = 'error'
    results.payload_db_postgres_error = String(pErr)
  }

  return NextResponse.json(results, { status: 200 })
}
