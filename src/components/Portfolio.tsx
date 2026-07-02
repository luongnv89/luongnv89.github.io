import { Star, GitFork, ExternalLink, Github } from 'lucide-react'
import { PortfolioCard } from './PortfolioCard'
import portfolioData from '@/data/portfolio.json'

/** Repos rendered as large flagship cards with screenshots. */
const FLAGSHIP_NAMES = ['claude-howto', 'agent-skill-manager']

/** First N remaining entries form the featured grid; the rest go in "More OSS projects". */
const FEATURED_OSS_LIMIT = 8

const flagshipMeta: Record<string, { headline: string; screenshot: string }> = {
  'claude-howto': {
    headline: 'The visual, example-driven guide to Claude Code — from basics to advanced agents, in 5 languages.',
    screenshot: '/images/projects/screenshots/claude-howto.jpg',
  },
  'agent-skill-manager': {
    headline: "One tool to manage every AI agent's skills — install, audit, and organize 4,000+ skills across Claude Code, Codex, Cursor, and more.",
    screenshot: '/images/projects/screenshots/asm.jpg',
  },
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${n}`
}

export function Portfolio() {
  const flagships = portfolioData.projects
    .filter((p) => FLAGSHIP_NAMES.includes(p.name))
    .map((p) => ({
      ...p,
      displayName: p.name === 'agent-skill-manager' ? 'asm' : p.name,
      ...flagshipMeta[p.name],
    }))

  const rest = portfolioData.projects.filter((p) => !FLAGSHIP_NAMES.includes(p.name))
  const featuredOssProjects = rest.slice(0, FEATURED_OSS_LIMIT)
  const remainingOssProjects = rest.slice(FEATURED_OSS_LIMIT)

  return (
    <section id="oss" className="section">
      <div className="container-custom">
        <h2 className="section-title">Open Source</h2>
        <p className="section-subtitle max-w-2xl mb-8">
          Tools I build in the open — for AI agent workflows, developer productivity, and everything in between.
        </p>

        {/* Flagship projects */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {flagships.map((project) => (
            <div
              key={project.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_18px_40px_-22px_var(--accent-glow)]"
            >
              <a
                href={project.landingPage ?? project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.displayName} — visit website`}
                className="relative block aspect-[16/9] overflow-hidden border-b border-[var(--border)] focus-ring"
              >
                <img
                  src={project.screenshot}
                  alt={`${project.displayName} screenshot`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </a>

              <div className="flex flex-grow flex-col p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={project.logo}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    {project.displayName}
                  </h3>
                </div>

                <p className="mt-3 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.headline}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border)] pt-4 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-accent">
                    <Star size={15} />
                    {formatCount(project.stars)} stars
                  </span>
                  {project.forks !== undefined && (
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <GitFork size={15} />
                      {formatCount(project.forks)} forks
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-4">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-accent transition-colors"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                    {project.landingPage && (
                      <a
                        href={project.landingPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-accent transition-colors"
                      >
                        <ExternalLink size={15} />
                        Website
                      </a>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredOssProjects.map((project) => (
            <PortfolioCard key={`oss-${project.name}`} project={project} />
          ))}
        </div>

        {remainingOssProjects.length > 0 && (
          <details className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/40">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--text-primary)] flex items-center justify-between">
              <span>More OSS projects</span>
              <span className="text-[var(--text-muted)]">Open to expand</span>
            </summary>
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {remainingOssProjects.map((project) => (
                  <PortfolioCard key={`oss-more-${project.name}`} project={project} />
                ))}
              </div>
            </div>
          </details>
        )}
      </div>
    </section>
  )
}
