import Image from 'next/image'

interface CoverImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Classes extras (ex.: zoom no hover). */
  className?: string
  /**
   * `cover` (padrão): preenche a caixa (pode cortar) — bom para cards.
   * `contain`: mostra a imagem INTEIRA (não corta) sobre um fundo desfocado da
   * própria imagem — bom para a capa grande da notícia.
   */
  fit?: 'cover' | 'contain'
}

export default function CoverImage({ src, alt, sizes, priority, className = '', fit = 'cover' }: CoverImageProps) {
  if (fit === 'contain') {
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
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-contain ${className}`} />
      </>
    )
  }

  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />
}
