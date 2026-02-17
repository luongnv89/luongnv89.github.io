import { Star, ExternalLink } from 'lucide-react'

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

function getInitials(name: string): string {
  return name
    .split(/[-_]/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, language, stars, url, icon } = project
  const langColor = languageColors[language] || '#666'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card flex flex-col h-full focus-ring overflow-hidden"
    >
      {/* Hero zone — logo showcase */}
      <div className="relative h-32 flex items-center justify-center bg-[var(--bg-tertiary)] overflow-hidden">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--text-muted) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 80%, ${icon ? 'var(--accent-glow)' : langColor + '22'}, transparent 70%)`,
          }}
        />

        {icon ? (
          <img
            src={icon}
            alt={`${name} logo`}
            className="relative w-16 h-16 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: langColor + '18',
              color: langColor,
              border: `1.5px solid ${langColor}44`,
            }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors leading-snug">
            {name}
          </h3>
          <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {language}
          </span>
          {stars > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Star className="w-3.5 h-3.5" />
              {stars}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
