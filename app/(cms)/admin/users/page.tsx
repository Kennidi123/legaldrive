import Link from 'next/link'
import { apiGet } from '../actions'
import DeleteUserButton from './DeleteUserButton'

export const dynamic = 'force-dynamic'

interface SiteUserRow {
  id: number
  name: string
  email: string
  whatsapp?: string | null
  created_at: string
  comment_count?: number
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}

export default async function UsersAdminPage() {
  const data = await apiGet('/api/site-users')
  const users: SiteUserRow[] = data?.docs || []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
          <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-1">Usuários</h1>
          <p className="font-sans text-sm text-[var(--outline)] mt-1">Leitores cadastrados que podem comentar. A senha nunca é exibida.</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-[var(--secondary)] leading-none">{users.length}</p>
          <p className="font-mono text-[9px] tracking-widest uppercase text-[var(--outline)] mt-1">Cadastrados</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] p-12 text-center">
          <p className="font-mono text-xs text-[var(--outline)] uppercase tracking-widest">Nenhum usuário cadastrado ainda</p>
        </div>
      ) : (
        <div className="bg-[var(--surface-container-high)] rounded-2xl border border-[var(--outline-variant)] overflow-hidden">
          {/* Cabeçalho (desktop) */}
          <div className="hidden md:grid grid-cols-[1.4fr_1.8fr_1.2fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-[var(--outline-variant)] bg-[var(--surface-container)]">
            {['Nome', 'E-mail', 'WhatsApp', 'Cadastro', ''].map((h, i) => (
              <span key={i} className="font-mono text-[9px] tracking-widest uppercase text-[var(--outline)]">{h}</span>
            ))}
          </div>
          <ul className="divide-y divide-[var(--outline-variant)]">
            {users.map((u) => (
              <li key={u.id} className="grid grid-cols-1 md:grid-cols-[1.4fr_1.8fr_1.2fr_0.8fr_auto] gap-1 md:gap-4 px-5 py-4 md:items-center">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-[var(--secondary)] text-[var(--on-secondary)] flex items-center justify-center font-mono text-[11px] font-bold uppercase flex-none">
                    {(u.name || 'U').charAt(0)}
                  </span>
                  <span className="font-display text-sm font-bold text-[var(--on-surface)] truncate">{u.name}</span>
                </div>
                <a href={`mailto:${u.email}`} className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors truncate">{u.email}</a>
                <span className="text-sm text-[var(--on-surface-variant)]">{u.whatsapp || '—'}</span>
                <span className="font-mono text-[11px] text-[var(--outline)]">{formatDate(u.created_at)}</span>
                <div className="md:text-right mt-2 md:mt-0">
                  <DeleteUserButton id={u.id} name={u.name} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
