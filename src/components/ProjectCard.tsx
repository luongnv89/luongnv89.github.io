import { Folder, Star, ExternalLink } from 'lucide-react'

export interface Project {
  name: string
  description: string
  language: string
  stars: number
  url: string
  icon?: string
}

interface ProjectCardProps {
  project: Project
}

const languageColors: Record<string, string> = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Rust: '#dea584',
  Go: '#00ADD8',
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, language, stars, url, icon } = project

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card p-6 flex flex-col h-full focus-ring"
    >
      <div className="flex items-start justify-between mb-3">
        {icon ? (
          <img src={icon} alt={`${name} logo`} className="w-6 h-6 rounded" />
        ) : (
          <Folder className="w-5 h-5 text-accent" />
        )}
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{stars}</span>
          </div>
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors">
        {name}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 flex-1">
        {description}
      </p>

      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: languageColors[language] || '#666' }}
          />
          {language}
        </span>
      </div>
    </a>
  )
}
