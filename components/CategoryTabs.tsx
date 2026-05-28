'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Category {
  name: string
  slug: string
}

interface CategoryTabsProps {
  categories: Category[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-[var(--outline-variant)]">
      <Link
        href="/"
        className={`flex-none font-mono text-xs tracking-widest uppercase px-4 py-3 border-b-2 transition-all whitespace-nowrap
          ${pathname === '/'
            ? 'border-[var(--secondary)] text-[var(--secondary)] bg-[var(--surface-container-high)]'
            : 'border-transparent text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
          }`}
      >
        Todos
      </Link>
      {categories.map((cat) => {
        const active = pathname === `/${cat.slug}`
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={`flex-none font-mono text-xs tracking-widest uppercase px-4 py-3 border-b-2 transition-all whitespace-nowrap
              ${active
                ? 'border-[var(--secondary)] text-[var(--secondary)] bg-[var(--surface-container-high)]'
                : 'border-transparent text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
              }`}
          >
            {cat.name}
          </Link>
        )
      })}
    </div>
  )
}
