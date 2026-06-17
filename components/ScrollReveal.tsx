'use client'

import { useEffect } from 'react'

/**
 * Revela suavemente os elementos com a classe `.reveal` conforme entram na
 * viewport (IntersectionObserver). Montado uma vez no layout.
 *
 * Usa um MutationObserver para também captar elementos que chegam DEPOIS — em
 * navegação no cliente ou em páginas `force-dynamic` cujo conteúdo é transmitido
 * (stream) após a montagem. Sem isso, seções poderiam ficar invisíveis (tela branca).
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    )

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.in-view)')
        .forEach((el) => io.observe(el))
    }

    scan()
    // Capta conteúdo adicionado depois (navegação cliente / streaming dinâmico)
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
