import { useState } from 'react'
import { Star, ExternalLink, RotateCcw, GitFork, Info } from 'lucide-react'

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

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  const [flipped, setFlipped] = useState(false)
  const title = project.displayName ?? project.name
  const primaryLink = project.showLink === false ? undefined : (project.landingPage ?? project.url)

  return (
    <div className="perspective-card relative">
      {!flipped && (
        <button
          onClick={() => setFlipped(true)}
          className="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-accent hover:bg-[var(--bg-tertiary)] transition-colors focus-ring"
          aria-label={`Show details for ${title}`}
        >
          <Info size={14} />
        </button>
      )}
      <div className={`flip-card-inner ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front — logo, name, description; whole card links to the project */}
        <a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={primaryLink ? `${title} — visit project` : title}
          className="flip-card-face rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center gap-2 p-4 text-center hover:border-[var(--accent)] transition-colors duration-200 focus-ring"
        >
          <div
            className="relative w-16 h-16 flex items-center justify-center"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
            }}
          >
            <img
              src={project.logo}
              alt=""
              loading="lazy"
              className="w-14 h-14 object-contain relative z-10 drop-shadow-md"
            />
          </div>

          <span className="text-sm font-medium text-[var(--text-primary)]">
            {title}
          </span>

          <p className="text-xs text-[var(--text-muted)] leading-snug line-clamp-2 px-1">
            {project.description}
          </p>

          {(project.stars > 0 || (project.forks !== undefined && project.forks > 0)) && (
            <div className="flex items-center gap-4 text-xs">
              {project.stars > 0 && (
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <Star size={13} className="text-accent" />
                  {project.stars}
                </span>
              )}
              {project.forks !== undefined && project.forks > 0 && (
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <GitFork size={13} className="text-accent" />
                  {project.forks}
                </span>
              )}
            </div>
          )}
        </a>

        {/* Back — full details */}
        <div className="flip-card-face flip-card-back rounded-xl border border-[var(--accent)] bg-[var(--bg-secondary)] p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              {title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-4">
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
              <div className="flex items-center gap-3">
                {project.showLink === false ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                    Private repo
                  </span>
                ) : (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline min-h-[24px]"
                  >
                    <ExternalLink size={12} />
                    GitHub
                  </a>
                )}
                {project.landingPage && (
                  <a
                    href={project.landingPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-accent hover:underline min-h-[24px]"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-accent focus-ring"
                aria-label={`Hide details for ${title}`}
              >
                <RotateCcw size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
