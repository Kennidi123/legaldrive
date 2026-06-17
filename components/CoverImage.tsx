import Image from 'next/image'

interface CoverImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Classes extras aplicadas à imagem nítida (ex.: zoom no hover). */
  className?: string
}

/**
 * Capa que NUNCA corta a imagem: mostra a foto inteira (`object-contain`) sobre
 * um fundo desfocado da própria imagem, que preenche a caixa. Evita o corte do
 * `object-cover` em capas com texto/elementos nas bordas, sem deixar faixas feias.
 *
 * O container pai deve ter `position: relative` e `overflow-hidden` + uma proporção
 * (aspect-*). As duas imagens usam `fill`; a nítida fica por cima por vir depois no DOM.
 */
export default function CoverImage({ src, alt, sizes, priority, className = '' }: CoverImageProps) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="object-cover scale-110 blur-2xl opacity-50 select-none pointer-events-none"
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-contain ${className}`}
      />
    </>
  )
}
