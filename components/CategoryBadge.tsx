import Link from 'next/link'

interface CategoryBadgeProps {
  name: string
  slug: string
  variant?: 'default' | 'accent'
  className?: string
}

export default function CategoryBadge({ name, slug, variant = 'default', className = '' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/${slug}`}
      className={`
        inline-block font-mono text-[11px] font-medium tracking-widest uppercase
        px-2.5 py-1 rounded
        transition-colors duration-150
        ${variant === 'accent'
          ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
          : 'text-[var(--secondary)] hover:text-[var(--on-surface)]'
        }
        ${className}
      `}
    >
      {name}
    </Link>
  )
}
