'use client'

import { useEffect, useRef } from 'react'

/**
 * Editor visual (WYSIWYG) do CMS. Produz HTML, que é convertido para lexical
 * na hora de salvar (htmlToLexical em content-utils). Mantém a formatação que
 * o editor aplicar: negrito, itálico, sublinhado, subtítulo, listas, link, citação.
 *
 * É "não controlado": semeia o HTML inicial uma vez e emite onChange via onInput
 * (evita o cursor pular a cada tecla, problema clássico de contentEditable).
 */
export default function RichTextEditor({
  initialHTML,
  onChange,
  placeholder,
  minHeight = 180,
}: {
  initialHTML: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const seeded = useRef(false)

  // Semeia o conteúdo carregado (edição) uma única vez.
  useEffect(() => {
    if (!seeded.current && ref.current && initialHTML) {
      ref.current.innerHTML = initialHTML
      seeded.current = true
    }
  }, [initialHTML])

  // Usa tags semânticas (<b>, <i>...) em vez de spans com style.
  useEffect(() => {
    try {
      document.execCommand('styleWithCSS', false, 'false')
    } catch {
      /* ignore */
    }
  }, [])

  const emit = () => onChange(ref.current?.innerHTML || '')

  function run(cmd: string, value?: string) {
    ref.current?.focus()
    try {
      document.execCommand(cmd, false, value)
    } catch {
      /* ignore */
    }
    emit()
  }

  function addLink() {
    const url = window.prompt('Cole o link (https://...)')
    if (url) run('createLink', url)
  }

  const btn =
    'px-2.5 py-1.5 rounded-md font-mono text-[11px] font-bold text-[var(--on-surface-variant)] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-colors leading-none'
  const sep = <span className="w-px self-stretch bg-[var(--outline-variant)] mx-0.5" />

  // onMouseDown preventDefault: mantém a seleção do texto ao clicar no botão.
  const md = (e: React.MouseEvent) => e.preventDefault()

  return (
    <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] overflow-hidden focus-within:border-[var(--secondary)] transition-colors">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
        <button type="button" title="Negrito" onMouseDown={md} onClick={() => run('bold')} className={`${btn} font-extrabold`}>
          B
        </button>
        <button type="button" title="Itálico" onMouseDown={md} onClick={() => run('italic')} className={`${btn} italic`}>
          I
        </button>
        <button type="button" title="Sublinhado" onMouseDown={md} onClick={() => run('underline')} className={`${btn} underline`}>
          U
        </button>
        <button type="button" title="Tachado" onMouseDown={md} onClick={() => run('strikeThrough')} className={`${btn} line-through`}>
          S
        </button>
        {sep}
        <button type="button" title="Subtítulo" onMouseDown={md} onClick={() => run('formatBlock', 'H3')} className={btn}>
          Subtítulo
        </button>
        <button type="button" title="Texto normal" onMouseDown={md} onClick={() => run('formatBlock', 'P')} className={btn}>
          Texto
        </button>
        {sep}
        <button type="button" title="Lista" onMouseDown={md} onClick={() => run('insertUnorderedList')} className={btn}>
          • Lista
        </button>
        <button type="button" title="Lista numerada" onMouseDown={md} onClick={() => run('insertOrderedList')} className={btn}>
          1. Lista
        </button>
        {sep}
        <button type="button" title="Citação" onMouseDown={md} onClick={() => run('formatBlock', 'BLOCKQUOTE')} className={btn}>
          ❝ Citação
        </button>
        <button type="button" title="Link" onMouseDown={md} onClick={addLink} className={btn}>
          🔗 Link
        </button>
        {sep}
        <button type="button" title="Limpar formatação" onMouseDown={md} onClick={() => run('removeFormat')} className={btn}>
          ✕ Limpar
        </button>
      </div>

      {/* Área editável */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="rte article-prose-editor w-full px-4 py-3 text-sm text-[var(--on-surface)] leading-relaxed focus:outline-none"
      />
    </div>
  )
}
