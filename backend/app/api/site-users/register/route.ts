import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool } from '@/lib/apiHelpers'
import { hashPassword, signToken, isValidEmail } from '@/lib/siteAuth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/** Cadastro de usuário do site: { name, email, whatsapp, password }. */
export async function POST(req: NextRequest) {
  try {
    const pool = await getPool()
    if (!pool) return NextResponse.json({ error: 'Indisponível' }, { status: 503, headers: corsHeaders })

    const body = await req.json().catch(() => ({}))
    const name = String(body.name || '').trim().slice(0, 80)
    const email = String(body.email || '').trim().toLowerCase().slice(0, 160)
    const whatsapp = String(body.whatsapp || '').trim().slice(0, 30)
    const password = String(body.password || '')

    const whatsappDigits = whatsapp.replace(/\D/g, '')

    if (name.length < 2) return NextResponse.json({ error: 'Informe seu nome.' }, { status: 400, headers: corsHeaders })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400, headers: corsHeaders })
    if (whatsappDigits.length !== 11) return NextResponse.json({ error: 'WhatsApp inválido. Use DDD + número (11 dígitos).' }, { status: 400, headers: corsHeaders })
    if (password.length < 6) return NextResponse.json({ error: 'A senha deve ter ao menos 6 caracteres.' }, { status: 400, headers: corsHeaders })

    const exists = await pool.query('SELECT id FROM site_users WHERE lower(email) = lower($1) LIMIT 1', [email])
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409, headers: corsHeaders })
    }

    const res = await pool.query(
      `INSERT INTO site_users (name, email, whatsapp, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, whatsapp, created_at`,
      [name, email, whatsapp || null, hashPassword(password)],
    )
    const user = res.rows[0]
    return NextResponse.json({ token: signToken(user.id), user }, { status: 201, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/duplicate key|unique/i.test(message)) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409, headers: corsHeaders })
    }
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
