import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool } from '@/lib/apiHelpers'
import { getSiteUserId } from '@/lib/siteAuth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/**
 * Lista comentários.
 * - ?postId=N → comentários de uma notícia (uso público, no site).
 * - ?all=1    → comentários recentes de todas as notícias (uso no painel).
 * Leitura pública (os comentários já são públicos no site).
 */
export async function GET(req: NextRequest) {
  try {
    const pool = await getPool()
    if (!pool) return NextResponse.json({ docs: [] }, { headers: corsHeaders })

    const url = new URL(req.url)
    if (url.searchParams.get('all') === '1') {
      const res = await pool.query(
        `SELECT c.id, c.author_name, c.content, c.likes, c.created_at, c.post_id,
                p.title AS post_title, p.slug AS post_slug,
                u.email AS author_email
           FROM comments c
           LEFT JOIN posts p ON p.id = c.post_id
           LEFT JOIN site_users u ON u.id = c.user_id
          ORDER BY c.created_at DESC
          LIMIT 300`,
      )
      return NextResponse.json({ docs: res.rows }, { headers: corsHeaders })
    }

    const postId = Number(url.searchParams.get('postId'))
    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ docs: [] }, { headers: corsHeaders })
    }
    const res = await pool.query(
      `SELECT id, author_name, content, likes, created_at
         FROM comments WHERE post_id = $1 ORDER BY created_at DESC LIMIT 300`,
      [postId],
    )
    return NextResponse.json({ docs: res.rows }, { headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}

/**
 * Cria um comentário. EXIGE LOGIN do usuário do site (Authorization: Bearer).
 * O nome do autor vem do cadastro; o conteúdo é texto puro (escapado no front).
 */
export async function POST(req: NextRequest) {
  try {
    const uid = getSiteUserId(req)
    if (!uid) {
      return NextResponse.json({ error: 'Faça login para comentar.' }, { status: 401, headers: corsHeaders })
    }

    const pool = await getPool()
    if (!pool) return NextResponse.json({ error: 'Indisponível' }, { status: 503, headers: corsHeaders })

    const body = await req.json().catch(() => ({}))
    const postId = Number(body.postId)
    const content = String(body.content || '').trim().slice(0, 2000)

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: 'Notícia inválida' }, { status: 400, headers: corsHeaders })
    }
    if (!content) {
      return NextResponse.json({ error: 'Escreva um comentário' }, { status: 400, headers: corsHeaders })
    }

    const userRes = await pool.query('SELECT name FROM site_users WHERE id = $1 LIMIT 1', [uid])
    const authorName = String(userRes.rows[0]?.name || 'Usuário').slice(0, 80)

    const res = await pool.query(
      `INSERT INTO comments (post_id, author_name, content, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, author_name, content, likes, created_at`,
      [postId, authorName, content, uid],
    )
    return NextResponse.json({ doc: res.rows[0] }, { status: 201, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
