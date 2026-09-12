import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode
  lede?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  index,
  label,
  title,
  lede,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-14', align === 'center' && 'text-center', className)}>
      <p className="eyebrow">
        <span className="text-accent">{index}</span>
        <span className="mx-2 opacity-50">/</span>
        {label}
      </p>
      <h2 className="display mt-3 text-4xl md:text-5xl leading-[1.05] text-[var(--text-primary)]">
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--text-secondary)]',
            align === 'center' && 'mx-auto'
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
