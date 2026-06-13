'use client'

import { useState } from 'react'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

function getToken() {
  const m = document.cookie.match(/(?:^|;\s*)cms_token=([^;]*)/)
  return m ? decodeURIComponent(m[1]) : ''
}

export default function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (url: string) => void
  label: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setError('Imagem muito grande (máx 8MB)')
      return
    }
    setError('')
    setUploading(true)
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch(`${BACKEND}/api/upload-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${getToken()}` },
        body: JSON.stringify({ filename: file.name, mimetype: file.type, dataBase64 }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro no upload')
        return
      }
      onChange(data.url)
    } catch {
      setError('Erro de conexão')
    } finally {
      setUploading(false)
    }
  }

  const lbl = 'font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5'

  return (
    <div>
      {label && <label className={lbl}>{label}</label>}
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="preview"
            className="w-16 h-16 rounded-lg object-cover border border-[var(--outline-variant)] flex-none"
          />
        )}
        <label className="flex-1 cursor-pointer">
          <div className="bg-[var(--surface-container-low)] border border-dashed border-[var(--outline-variant)] rounded-lg px-4 py-3 text-center hover:border-[var(--secondary)] transition-colors">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--outline)]">
              {uploading ? '⏳ Enviando...' : value ? '↻ Trocar imagem' : '+ Enviar imagem'}
            </span>
          </div>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="font-mono text-xs text-red-400 hover:text-red-300 px-2"
            title="Remover"
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="font-mono text-[10px] text-red-400 mt-1.5 uppercase tracking-wider">{error}</p>}
    </div>
  )
}
