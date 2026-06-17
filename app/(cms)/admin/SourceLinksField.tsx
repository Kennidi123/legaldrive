'use client'

import type { SourceLink } from '@/lib/sources'

const inp =
  'w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] text-[var(--on-surface)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all placeholder:text-[var(--outline)]'
const lbl = 'font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5'

interface SourceLinksFieldProps {
  value: SourceLink[]
  onChange: (next: SourceLink[]) => void
}

/**
 * Editor de múltiplas fontes (links externos) de uma notícia. Cada linha tem a
 * URL (obrigatória) e um rótulo opcional (ex.: "G1", "Portal do Trânsito").
 */
export default function SourceLinksField({ value, onChange }: SourceLinksFieldProps) {
  const rows = value.length ? value : [{ url: '', label: '' }]

  const update = (i: number, patch: Partial<SourceLink>) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    onChange(next)
  }

  const addRow = () => onChange([...rows, { url: '', label: '' }])

  const removeRow = (i: number) => {
    const next = rows.filter((_, idx) => idx !== i)
    onChange(next)
  }

  return (
    <div>
      <label className={lbl}>
        Fontes <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(links externos — pode adicionar vários)</span>
      </label>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)]/40 p-3">
            <div className="flex items-start gap-2">
              <span className="font-mono text-[11px] text-[var(--outline)] pt-3 w-5 flex-none text-center">{i + 1}</span>
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={row.url}
                  onChange={e => update(i, { url: e.target.value })}
                  placeholder="https://g1.globo.com/..."
                  className={inp}
                />
                <input
                  type="text"
                  value={row.label || ''}
                  onChange={e => update(i, { label: e.target.value })}
                  placeholder="Nome da fonte (opcional). Ex.: G1, Portal do Trânsito"
                  className={inp}
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Remover fonte"
                className="mt-1.5 w-9 h-9 flex-none flex items-center justify-center rounded-lg border border-[var(--outline-variant)] text-[var(--outline)] hover:text-[var(--error)] hover:border-[var(--error)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)] hover:brightness-110 transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Adicionar fonte
      </button>
    </div>
  )
}
