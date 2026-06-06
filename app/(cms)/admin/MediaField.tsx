'use client'

import ImageUpload from './ImageUpload'
import type { MediaValue } from './content-utils'

const inp =
  'w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors placeholder:text-[var(--outline)]'

const OPTIONS: { value: MediaValue['tipo']; label: string }[] = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'image', label: '🖼️ Imagem' },
  { value: 'video', label: '🎬 Vídeo' },
]

export default function MediaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: MediaValue
  onChange: (v: MediaValue) => void
}) {
  return (
    <div className="bg-[var(--surface-container-low)] border border-dashed border-[var(--outline-variant)] rounded-lg p-4 space-y-3">
      <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">{label}</p>

      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const active = value.tipo === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...value, tipo: opt.value })}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-colors ${
                active
                  ? 'bg-[var(--secondary)] text-[var(--on-secondary)] border-[var(--secondary)]'
                  : 'border-[var(--outline-variant)] text-[var(--outline)] hover:text-[var(--secondary)]'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {value.tipo === 'image' && (
        <div className="space-y-3">
          <ImageUpload label="Imagem" value={value.imageUrl} onChange={(url) => onChange({ ...value, imageUrl: url })} />
          <input
            value={value.caption}
            onChange={(e) => onChange({ ...value, caption: e.target.value })}
            placeholder="Legenda da imagem (opcional)"
            className={inp}
          />
        </div>
      )}

      {value.tipo === 'video' && (
        <input
          value={value.video}
          onChange={(e) => onChange({ ...value, video: e.target.value })}
          placeholder="Link ou ID do YouTube (youtube.com/watch?v=... ou youtu.be/...)"
          className={inp}
        />
      )}
    </div>
  )
}
