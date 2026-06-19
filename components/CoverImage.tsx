import Image from 'next/image'

interface CoverImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Classes extras aplicadas à imagem nítida (ex.: zoom no hover). */
  className?: string
  /**
   * `contain` (padrão): imagem inteira sobre fundo desfocado — para capas landscape
   * em caixas de proporção diferente. `cover`: preenche a caixa — use quando a
   * proporção da imagem já casa com a da caixa (ex.: imagem quadrada em caixa 1:1).
   */
  fit?: 'contain' | 'cover'
}

/**
 * Capa que NUNCA corta a imagem: mostra a foto inteira (`object-contain`) sobre
 * um fundo desfocado da própria imagem, que preenche a caixa. Evita o corte do
 * `object-cover` em capas com texto/elementos nas bordas, sem deixar faixas feias.
 *
 * O container pai deve ter `position: relative` e `overflow-hidden` + uma proporção
 * (aspect-*). As duas imagens usam `fill`; a nítida fica por cima por vir depois no DOM.
 */
export default function CoverImage({ src, alt, sizes, priority, className = '', fit = 'contain' }: CoverImageProps) {
  return (
    <>
      {/* Fundo desfocado só faz sentido no modo "contain" (preenche as faixas vazias) */}
      {fit === 'contain' && (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="object-cover scale-110 blur-2xl opacity-50 select-none pointer-events-none"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
      />
      {/* Moldura dourada por cima (contorno em gradiente, segue os cantos) */}
      <span className="cover-frame absolute inset-0" aria-hidden />
    </>
  )
}
