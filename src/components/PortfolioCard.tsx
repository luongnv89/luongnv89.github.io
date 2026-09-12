import { ArrowUpRight } from 'lucide-react'
import { formatCount } from '@/lib/utils'

interface PortfolioProject {
  name: string
  displayName?: string
  description: string
  language: string
  stars: number
  forks?: number
  url: string
  landingPage?: string
  logo: string
  showLink?: boolean
}

const languageColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Shell: '#89E051',
  C: '#555555',
  Go: '#00ADD8',
  HTML: '#E34C26',
  Swift: '#F05138',
  Svelte: '#FF3E00',
  Dart: '#00B4AB',
  Markdown: '#083FA1',
}

/**
 * One row in the open-source list. Private repos (showLink === false) render
 * as a plain div — no link target exists for them.
 */
export function PortfolioRow({ project }: { project: PortfolioProject }) {
  const title = project.displayName ?? project.name
  const isPrivate = project.showLink === false

  const meta = (
    <span className="hidden sm:flex items-center gap-4 font-mono text-xs text-[var(--text-muted)] tabular-nums">
      <span className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: languageColors[project.language] || '#888' }}
        />
        {project.language}
      </span>
      {project.stars > 0 && <span>★ {formatCount(project.stars)}</span>}
      {isPrivate ? <span>private</span> : <ArrowUpRight size={14} />}
    </span>
  )

  const body = (
    <>
      <img
        src={project.logo}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        className="h-7 w-7 shrink-0 rounded-md object-contain"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-[var(--text-primary)] group-hover:underline decoration-[var(--border-hover)] underline-offset-4">
          {title}
        </span>
        <span className="block truncate text-xs text-[var(--text-muted)]">
          {project.description}
        </span>
      </span>
      {meta}
    </>
  )

  if (isPrivate) {
    return <div className="flex items-center gap-4 px-4 py-3.5">{body}</div>
  }

  return (
    <a
      href={project.landingPage ?? project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--bg-tertiary)] transition-colors focus-ring"
    >
      {body}
    </a>
  )
}
