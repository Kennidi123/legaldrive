import Link from 'next/link'
import { apiGet } from '../actions'
import VideoAdmin from './VideoAdmin'

export const dynamic = 'force-dynamic'

export default async function VideosAdminPage() {
  const data = await apiGet('/api/videos?limit=100&sort=-publishedAt')
  const videos = data?.docs || []

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)] hover:text-[var(--secondary)] transition-colors">← Dashboard</Link>
        <h1 className="font-display text-3xl font-bold text-[var(--on-surface)] mt-1">Vídeos em Destaque</h1>
        <p className="font-sans text-sm text-[var(--outline)] mt-1">Adicione links de vídeos do YouTube que aparecem na home do site.</p>
      </div>

      <VideoAdmin videos={videos} />
    </div>
  )
}
