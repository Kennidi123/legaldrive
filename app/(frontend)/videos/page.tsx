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
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL

  return (
    <main>
      {/* Cabeçalho da categoria */}
      <section className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-14 md:py-16">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] block mb-3">Legal Drive TV</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] leading-tight">
            Vídeos em Destaque
          </h1>
          <p className="text-[var(--on-surface-variant)] text-lg mt-3 max-w-2xl leading-relaxed">
            Análises técnicas, documentários e explicações sobre seus direitos no trânsito — direto da nossa equipe.
          </p>
          {youtube && (
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 mt-6 bg-[var(--secondary)] text-[var(--on-secondary)] font-mono text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
              Ver canal no YouTube
            </a>
          )}
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 md:px-16 pt-12 pb-16">
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
