import Image from 'next/image'

interface CoverImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Classes extras (ex.: zoom no hover). */
  className?: string
}

/**
 * Capa da notícia. Preenche a caixa (`object-cover`). Para os formatos menores,
 * use a imagem quadrada dedicada (campo `coverImageSquareUrl`) em vez de espremer
 * a capa landscape.
 */
export default function CoverImage({ src, alt, sizes, priority, className = '' }: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  )
}
