'use client'

import ImageUpload from './ImageUpload'
import type { MediaValue, MediaImage } from './content-utils'

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
  const images = value.images || []

  function updateImage(i: number, patch: Partial<MediaImage>) {
    const next = images.map((img, idx) => (idx === i ? { ...img, ...patch } : img))
    onChange({ ...value, images: next })
  }
  function addImage() {
    onChange({ ...value, images: [...images, { url: '', caption: '' }] })
  }
  function removeImage(i: number) {
    onChange({ ...value, images: images.filter((_, idx) => idx !== i) })
  }

  // Ao escolher "Imagem", garante pelo menos uma janela de upload.
  function setTipo(tipo: MediaValue['tipo']) {
    if (tipo === 'image' && images.length === 0) {
      onChange({ ...value, tipo, images: [{ url: '', caption: '' }] })
    } else {
      onChange({ ...value, tipo })
    }
  }

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
              onClick={() => setTipo(opt.value)}
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
        <div className="space-y-4">
          {images.map((img, i) => (
            <div key={i} className="bg-[var(--surface-container-high)] border border-[var(--outline-variant)] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)]">Imagem {i + 1}</span>
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="font-mono text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider"
                  >
                    ✕ Remover
                  </button>
                )}
              </div>
              <ImageUpload label="" value={img.url} onChange={(url) => updateImage(i, { url })} />
              <input
                value={img.caption}
                onChange={(e) => updateImage(i, { caption: e.target.value })}
                placeholder="Legenda da imagem (opcional)"
                className={inp}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="w-full font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg border border-dashed border-[var(--outline-variant)] text-[var(--secondary)] hover:border-[var(--secondary)] transition-colors"
          >
            + Adicionar outra imagem
          </button>
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
