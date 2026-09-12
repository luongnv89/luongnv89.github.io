import { ArrowDown, ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchGitHubStats, type GitHubStats } from '@/lib/github'
import { cn } from '@/lib/utils'
import portfolioData from '@/data/portfolio.json'

// Kept fresh by the daily stats cron that rewrites portfolio.json
const claudeHowtoStarsK = Math.floor(
  (portfolioData.projects.find((p) => p.name === 'claude-howto')?.stars ?? 39000) / 1000
)

// Bluesky icon component (not in lucide-react)
function BlueskyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
  )
}

const socials = [
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://x.com/luongnv89', label: 'X' },
  { icon: BlueskyIcon, url: 'https://bsky.app/profile/luongnv89.bsky.social', label: 'Bluesky' },
  { icon: Github, url: 'https://github.com/luongnv89', label: 'GitHub' },
]

const statCells: Array<{ key: keyof GitHubStats; label: string; accent?: boolean }> = [
  { key: 'totalStars', label: 'stars', accent: true },
  { key: 'totalForks', label: 'forks' },
  { key: 'followers', label: 'followers' },
  { key: 'publicRepos', label: 'repos' },
]

export function Hero() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGitHubStats('luongnv89')
      .then(setStats)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-24 text-center"
    >
      <span className="reveal reveal-1 relative inline-block">
        <span
          aria-hidden
          className="absolute -inset-2 rounded-full border"
          style={{ borderColor: 'var(--accent-glow)' }}
        />
        <picture>
          <source
            type="image/webp"
            srcSet="/avatar-160.webp 160w, /avatar-320.webp 320w"
            sizes="(min-width: 768px) 160px, 128px"
          />
          <img
            src="/img/cool.jpg"
            alt="Luong Nguyen"
            width={160}
            height={160}
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            className="h-32 w-32 md:h-40 md:w-40 rounded-full border border-[var(--border)] shadow-[0_30px_60px_-30px_rgba(0,0,0,.7)]"
          />
        </picture>
      </span>

      <h1 className="display reveal reveal-2 mt-8 text-5xl md:text-6xl leading-none tracking-tight">
        Luong Nguyen
      </h1>
      <p className="reveal reveal-2 mt-3 font-mono text-sm text-[var(--text-muted)]">@luongnv89</p>

      <p className="reveal reveal-3 eyebrow mt-6 flex items-center justify-center gap-3 whitespace-nowrap text-[10px] sm:text-xs">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
        </span>
        AI Agents · Agent Skills · Cybersecurity
      </p>

      <p className="reveal reveal-3 mt-4 text-lg md:text-xl font-medium text-[var(--text-primary)]">
        AI &amp; Cybersecurity Engineer at Montimage, Paris
      </p>

      <p className="reveal reveal-4 mt-3 max-w-xl text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
        I secure networks by day and build open-source tooling for AI agents — including{' '}
        <a
          href="https://luongnv.com/claude-howto"
          className="text-[var(--text-primary)] underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent)]"
        >
          claude-howto
        </a>
        , a {claudeHowtoStarsK}k-star guide to Claude Code. Learn, build, share, connect.
      </p>

      {isLoading ? (
        <div className="reveal reveal-5 mt-8 flex items-center justify-center gap-x-6">
          {statCells.map(({ label }) => (
            <span
              key={label}
              className="h-4 w-16 animate-pulse rounded bg-[var(--bg-tertiary)]"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="reveal reveal-5 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm text-[var(--text-secondary)]">
          {statCells.map(({ key, label, accent }) => (
            <span key={key}>
              <span
                className={cn(
                  'tabular-nums',
                  accent ? 'text-accent' : 'text-[var(--text-primary)]'
                )}
              >
                {stats[key].toLocaleString()}
              </span>{' '}
              <span className="text-[var(--text-muted)]">{label}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="reveal reveal-5 mt-10 flex flex-wrap justify-center gap-4">
        <a href="#products" className="btn-primary">
          See my work
          <ArrowDown size={16} />
        </a>
        <a
          href="https://luongnv.com/claude-howto"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-link"
        >
          Read the Claude Code guide
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="reveal reveal-6 mt-10 flex justify-center gap-3">
        {socials.map(({ icon: Icon, url, label }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn focus-ring"
            aria-label={label}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="group absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--border)] p-2 transition-colors group-hover:border-[var(--border-hover)]">
          <span className="h-2 w-1 rounded-full bg-[var(--accent)] animate-bounce" />
        </span>
      </a>
    </section>
  )
}
