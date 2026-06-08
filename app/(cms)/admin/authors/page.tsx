import Link from 'next/link'
import { apiGet } from '../actions'
import AuthorAdmin from './AuthorAdmin'

export const dynamic = 'force-dynamic'

export default async function AuthorsAdminPage() {
  const data = await apiGet('/api/authors?limit=100&sort=name')
  const authors = data?.docs || []

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
        <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-1">Autores</h1>
        <p className="font-sans text-sm text-[var(--outline)] mt-1">Crie, edite ou exclua os autores das notícias.</p>
      </div>

      <AuthorAdmin authors={authors} />
    </div>
  )
}
