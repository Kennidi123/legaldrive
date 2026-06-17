'use client'

import { useEffect, useState } from 'react'

/**
 * Barra fina de progresso de leitura no topo da página + botão "voltar ao topo"
 * que aparece após rolar um pouco. Apenas visual, sem dependências.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const scrollTop = window.scrollY
        const height = document.documentElement.scrollHeight - window.innerHeight
        setProgress(height > 0 ? (scrollTop / height) * 100 : 0)
        setShowTop(scrollTop > 600)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden />
      <button
        type="button"
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top ${showTop ? 'visible' : ''}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}
