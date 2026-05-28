'use client'

import Image from 'next/image'
import { useState } from 'react'

interface VideoEmbedProps {
  youtubeId: string
  title: string
  description?: string | null
  thumbnail?: string | null
}

export default function VideoEmbed({ youtubeId, title, description, thumbnail }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  const thumbSrc = thumbnail || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

  if (playing) {
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setPlaying(true)}
        className="group relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--surface-container-high)] block"
        aria-label={`Reproduzir: ${title}`}
      >
        <Image
          src={thumbSrc}
          alt={title}
          fill
          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300 group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
            <svg className="w-7 h-7 ml-1 text-[var(--on-secondary)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {description && (
        <p className="font-mono text-xs text-[var(--on-surface-variant)] uppercase tracking-wider">
          {description}
        </p>
      )}
    </div>
  )
}
