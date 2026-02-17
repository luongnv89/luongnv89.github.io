import { useState } from 'react'
import { Star, ExternalLink, RotateCcw } from 'lucide-react'

interface PortfolioProject {
  name: string
  description: string
  language: string
  stars: number
  url: string
  logo: string
}

const languageColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Shell: '#89E051',
  C: '#555555',
}

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="perspective-card cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped(!flipped)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${project.name} — click to ${flipped ? 'see logo' : 'see details'}`}
    >
      <div className={`flip-card-inner ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front — Logo */}
        <div className="flip-card-face rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center p-6 hover:border-[var(--accent)] transition-colors duration-200">
          <div
            className="relative w-28 h-32 flex items-center justify-center"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          >
            <img
              src={project.logo}
              alt={project.name}
              className="w-24 h-24 object-contain relative z-10 drop-shadow-md"
            />
          </div>
          <span className="mt-4 text-sm font-medium text-[var(--text-primary)]">
            {project.name}
          </span>
        </div>

        {/* Back — Details */}
        <div className="flip-card-face flip-card-back rounded-xl border border-[var(--accent)] bg-[var(--bg-secondary)] p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              {project.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: languageColors[project.language] || '#888' }}
                />
                {project.language}
              </span>
              {project.stars > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {project.stars}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <ExternalLink size={12} />
                GitHub
              </a>
              <RotateCcw size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
