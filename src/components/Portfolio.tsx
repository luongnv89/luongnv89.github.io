import { Star, GitFork, ExternalLink, Github } from 'lucide-react'
import { PortfolioRow } from './PortfolioCard'
import { SectionHeader } from './ui/SectionHeader'
import { formatCount } from '@/lib/utils'
import portfolioData from '@/data/portfolio.json'

/** Repos rendered as large flagship cards with screenshots. */
const FLAGSHIP_NAMES = ['claude-howto', 'agent-skill-manager']

/** First N remaining entries are shown in the list; the rest hide behind "Show more". */
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
        <SectionHeader
          index="04"
          label="Open Source"
          title="Built in the open"
          lede="Tools I build in the open — for AI agent workflows, developer productivity, and everything in between."
        />

        {/* Flagship projects */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {flagships.map((project) => (
            <div
              key={project.name}
              className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,.7)]"
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
                  alt={`${project.displayName} — AI-powered developer tool by Luong Nguyen, open-source on GitHub`}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </a>

              <div className="flex flex-grow flex-col p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={project.logo}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
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
                      className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                    {project.landingPage && (
                      <a
                        href={project.landingPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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

        {/* Project list */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] divide-y divide-[var(--border)] overflow-hidden">
          {featuredOssProjects.map((project) => (
            <PortfolioRow key={`oss-${project.name}`} project={project} />
          ))}

          {remainingOssProjects.length > 0 && (
            <details>
              <summary className="px-4 py-3 text-sm font-medium text-[var(--text-primary)] cursor-pointer list-none flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors focus-ring">
                <span>Show {remainingOssProjects.length} more projects</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">+</span>
              </summary>
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {remainingOssProjects.map((project) => (
                  <PortfolioRow key={`oss-more-${project.name}`} project={project} />
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  )
}
