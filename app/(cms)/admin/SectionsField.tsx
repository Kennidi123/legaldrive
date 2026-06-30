'use client'

import RichTextEditor from './RichTextEditor'
import MediaField from './MediaField'
import { newSection, type SectionValue } from './content-utils'

const lbl = 'font-mono text-[10px] tracking-widest uppercase text-[var(--on-surface-variant)] block mb-1.5'

/**
 * Corpo dinâmico da notícia: lista de seções (texto + mídia), com adicionar,
 * excluir e reordenar (↑/↓). Cada seção tem id estável para o editor não perder
 * o conteúdo ao reordenar.
 */
export default function SectionsField({
  value,
  onChange,
}: {
  value: SectionValue[]
  onChange: (sections: SectionValue[]) => void
}) {
  const sections = value.length ? value : [newSection()]

  const update = (id: string, patch: Partial<SectionValue>) =>
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const add = () => onChange([...sections, newSection()])

  const remove = (id: string) => {
    const next = sections.filter((s) => s.id !== id)
    onChange(next.length ? next : [newSection()])
  }

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir
    if (j < 0 || j >= sections.length) return
    const next = [...sections]
    ;[next[index], next[j]] = [next[j], next[index]]
    onChange(next)
  }

  const ctrl =
    'w-8 h-8 flex items-center justify-center rounded-md border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] transition-colors disabled:opacity-30 disabled:pointer-events-none'

  return (
    <div className="space-y-5">
      {sections.map((s, i) => (
        <div key={s.id} className="rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--secondary)] font-bold">Seção {i + 1}</span>
            <div className="flex items-center gap-1.5">
              <button type="button" title="Mover para cima" onClick={() => move(i, -1)} disabled={i === 0} className={ctrl}>↑</button>
              <button type="button" title="Mover para baixo" onClick={() => move(i, 1)} disabled={i === sections.length - 1} className={ctrl}>↓</button>
              <button
                type="button"
                title="Excluir seção"
                onClick={() => remove(s.id)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[var(--outline-variant)] text-[var(--outline)] hover:text-[var(--error)] hover:border-[var(--error)] transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <label className={lbl}>Texto <span className="text-[var(--outline)] normal-case tracking-normal font-sans">(opcional)</span></label>
          <RichTextEditor
            initialHTML={s.content}
            placeholder="Escreva o texto desta seção..."
            minHeight={160}
            onChange={(html) => update(s.id, { content: html })}
          />

          <div className="mt-4">
            <MediaField label="🎞️ Mídia desta seção (opcional)" value={s.media} onChange={(m) => update(s.id, { media: m })} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors font-mono text-[11px] tracking-widest uppercase font-bold"
      >
        + Adicionar seção
      </button>
    </div>
  )
}
