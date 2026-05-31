import { getVideos } from '@/lib/payload-api'
import { buildMetadata } from '@/lib/seo'
import VideoEmbed from '@/components/VideoEmbed'
import WhatsAppBanner from '@/components/WhatsAppBanner'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Vídeos — Análises e Documentários',
  description: 'Análises técnicas, documentários e explicações jurídicas sobre Direito de Trânsito no canal Legal Drive.',
  slug: 'videos',
})

export default async function VideosPage() {
  const result = await getVideos(50)
  const videos = result?.docs || []

  return (
    <main>
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-16">
          <div className="flex items-center gap-2 text-[var(--secondary)] mb-4">
            <span className="font-mono text-xs tracking-widest uppercase">Legal Drive</span>
            <span className="h-px w-8 bg-[var(--secondary)]" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-4">
            Vídeos & Documentários
          </h1>
          <p className="text-[var(--primary)] text-lg max-w-2xl leading-relaxed">
            Análises técnicas, entrevistas com especialistas e documentários sobre Direito de Trânsito e Mobilidade Urbana.
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 py-16">
        {videos.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--outline)] mb-3">
              Nenhum vídeo cadastrado ainda
            </p>
            <p className="text-[var(--on-surface-variant)] text-sm">
              Acesse <Link href="/admin" className="text-[var(--secondary)] hover:underline">/admin → Vídeos</Link> para adicionar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {videos.map((video: any, i: number) => (
              <article key={video.id} className={`space-y-4 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <VideoEmbed
                  youtubeId={video.youtubeId}
                  title={video.title}
                  thumbnail={video.thumbnail}
                />
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--on-surface)] leading-snug">
                    {video.title}
                  </h2>
                  {video.description && (
                    <p className="text-[var(--on-surface-variant)] text-sm mt-2 leading-relaxed">{video.description}</p>
                  )}
                  {video.publishedAt && (
                    <span className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider block mt-2">
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(video.publishedAt))}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <WhatsAppBanner />
    </main>
  )
}
