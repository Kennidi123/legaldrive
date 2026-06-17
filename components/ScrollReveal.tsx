'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Revela suavemente todos os elementos com a classe `.reveal` conforme entram
 * na viewport (usando IntersectionObserver). Montado uma vez no layout; re-escaneia
 * a cada navegação (o App Router mantém o layout, então dependemos do pathname).
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in-view)'))
    if (els.length === 0) return

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in-view'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
