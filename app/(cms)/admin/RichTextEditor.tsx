'use client'

import { useEffect, useRef } from 'react'

/**
 * Editor visual (WYSIWYG) do CMS. Produz HTML, convertido para lexical ao salvar
 * (htmlToLexical em content-utils). Mantém a formatação aplicada: negrito, itálico,
 * sublinhado, tachado, subtítulo, listas, citação, link, além de TAMANHO da fonte
 * e ESPAÇAMENTO entre linhas aplicados a uma seleção (viram `style` inline,
 * preservados no lexical).
 *
 * É "não controlado": semeia o HTML inicial uma vez e emite onChange via onInput
 * (evita o cursor pular a cada tecla, problema clássico de contentEditable).
 */

const SIZES: { label: string; value: string }[] = [
  { label: 'Tamanho', value: '' },
  { label: 'Pequeno', value: '1rem' },
  { label: 'Normal', value: '1.22rem' },
  { label: 'Médio', value: '1.5rem' },
  { label: 'Grande', value: '1.9rem' },
  { label: 'Enorme', value: '2.4rem' },
]

const SPACINGS: { label: string; value: string }[] = [
  { label: 'Espaçamento', value: '' },
  { label: 'Simples', value: '1.4' },
  { label: 'Normal', value: '1.75' },
  { label: 'Médio', value: '2' },
  { label: 'Grande', value: '2.5' },
]

const COLORS: { label: string; value: string }[] = [
  { label: 'Cor', value: '' },
  { label: 'Padrão (preto)', value: '#14181b' },
  { label: 'Navy (marca)', value: '#0a192f' },
  { label: 'Laranja (marca)', value: '#e07b00' },
  { label: 'Vermelho', value: '#c0392b' },
  { label: 'Verde', value: '#1e7e34' },
  { label: 'Azul', value: '#1d4ed8' },
  { label: 'Cinza', value: '#6b7280' },
]

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
  const savedRange = useRef<Range | null>(null)

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

  // Guarda a seleção atual (para restaurar ao clicar num <select>, que rouba o foco).
  function saveSelection() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    if (ref.current && ref.current.contains(range.commonAncestorContainer)) {
      savedRange.current = range.cloneRange()
    }
  }

  function restoreSelection(): Range | null {
    const sel = window.getSelection()
    if (!sel || !savedRange.current) return null
    sel.removeAllRanges()
    sel.addRange(savedRange.current)
    return savedRange.current
  }

  function run(cmd: string, value?: string) {
    ref.current?.focus()
    restoreSelection()
    try {
      document.execCommand(cmd, false, value)
    } catch {
      /* ignore */
    }
    saveSelection()
    emit()
  }

  function addLink() {
    const url = window.prompt('Cole o link (https://...)')
    if (url) run('createLink', url)
  }

  // Aplica um estilo inline (tamanho/espaçamento) a CADA trecho de texto da
  // seleção, sem cruzar limites de bloco (envolve cada nó de texto num <span>).
  function applyInlineStyle(prop: string, value: string) {
    if (!ref.current || !value) return
    ref.current.focus()
    const range = restoreSelection()
    if (!range || range.collapsed) return

    const editor = ref.current
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    while (walker.nextNode()) {
      const n = walker.currentNode as Text
      if (range.intersectsNode(n) && (n.textContent || '').length) textNodes.push(n)
    }

    textNodes.forEach((textNode) => {
      let start = 0
      let end = textNode.length
      if (textNode === range.startContainer) start = range.startOffset
      if (textNode === range.endContainer) end = range.endOffset
      if (start >= end) return
      const r = document.createRange()
      r.setStart(textNode, start)
      r.setEnd(textNode, end)
      const span = document.createElement('span')
      span.style.setProperty(prop, value)
      try {
        span.appendChild(r.extractContents())
        r.insertNode(span)
      } catch {
        /* ignore trechos problemáticos */
      }
    })

    savedRange.current = null
    emit()
  }

  const btn =
    'px-2.5 py-1.5 rounded-md font-mono text-[11px] font-bold text-[var(--on-surface-variant)] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-colors leading-none'
  const sel =
    'px-1.5 py-1.5 rounded-md font-mono text-[10px] font-bold text-[var(--on-surface-variant)] bg-[var(--surface-container-low)] border border-[var(--outline-variant)] focus:outline-none focus:border-[var(--secondary)] cursor-pointer'
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
        {/* Tamanho da fonte (aplica à seleção) */}
        <select
          title="Tamanho da fonte (selecione um trecho)"
          value=""
          onMouseDown={saveSelection}
          onChange={(e) => {
            applyInlineStyle('font-size', e.target.value)
            e.target.value = ''
          }}
          className={sel}
        >
          {SIZES.map((s) => (
            <option key={s.label} value={s.value} disabled={s.value === ''}>
              {s.label}
            </option>
          ))}
        </select>
        {/* Espaçamento entre linhas (aplica à seleção) */}
        <select
          title="Espaçamento entre linhas (selecione um trecho)"
          value=""
          onMouseDown={saveSelection}
          onChange={(e) => {
            applyInlineStyle('line-height', e.target.value)
            e.target.value = ''
          }}
          className={sel}
        >
          {SPACINGS.map((s) => (
            <option key={s.label} value={s.value} disabled={s.value === ''}>
              {s.label}
            </option>
          ))}
        </select>
        {sep}
        {/* Cor do texto — predefinida (aplica à seleção) */}
        <select
          title="Cor do texto (selecione um trecho)"
          value=""
          onMouseDown={saveSelection}
          onChange={(e) => {
            applyInlineStyle('color', e.target.value)
            e.target.value = ''
          }}
          className={sel}
        >
          {COLORS.map((c) => (
            <option key={c.label} value={c.value} disabled={c.value === ''}>
              {c.label}
            </option>
          ))}
        </select>
        {/* Cor do texto — personalizada */}
        <label
          title="Cor personalizada (selecione um trecho)"
          onMouseDown={saveSelection}
          className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-[var(--surface-container-low)] border border-[var(--outline-variant)] cursor-pointer"
        >
          <span className="font-mono text-[10px] font-bold text-[var(--on-surface-variant)] leading-none">A</span>
          <input
            type="color"
            aria-label="Cor personalizada do texto"
            defaultValue="#e07b00"
            onMouseDown={saveSelection}
            onChange={(e) => applyInlineStyle('color', e.target.value)}
            className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
          />
        </label>
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
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="rte article-prose-editor w-full px-4 py-3 text-base text-[var(--on-surface)] leading-relaxed focus:outline-none"
      />
    </div>
  )
}
