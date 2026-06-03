import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  title: string
  href: string
  excerpt?: string
  coverImage?: string | null
  category: string
}

export default function NewsCard({ title, href, excerpt, coverImage, category }: NewsCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[var(--on-primary-fixed-variant)] bg-[var(--tertiary-container)]">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <span className="text-[var(--secondary)] font-mono text-[11px] uppercase tracking-widest mb-1 block">{category}</span>
      <h3 className="font-display text-xl font-semibold text-[var(--on-surface)] leading-snug group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
        {title}
      </h3>
      {excerpt && <p className="text-[var(--on-surface-variant)] text-sm mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>}
    </Link>
  )
}
