import { Play } from 'lucide-react'
import { formatAdded, monogram, playUrl, type Game } from '@/lib/games'

/**
 * Screenshot-led card matching the Products treatment. Games live as static
 * files under `public/games/`, so the link is a plain anchor — a router <Link>
 * would swallow it and never reach the real HTML file.
 */
export function GameCard({ game }: { game: Game }) {
  return (
    <a
      href={playUrl(game)}
      aria-label={`Play ${game.title}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_18px_40px_-22px_var(--accent-glow)] focus-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
        {game.thumb ? (
          <img
            src={game.thumb}
            alt={`${game.title} gameplay screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          /* Fallback tile: scanlines over a dot grid, so a game without a
             screenshot still reads as an arcade cabinet rather than a gap. */
          <div
            className="flex h-full w-full items-center justify-center bg-[var(--bg-secondary)] transition-transform duration-300 group-hover:scale-[1.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '100% 4px, 14px 14px',
            }}
            aria-hidden="true"
          >
            <span className="font-mono text-4xl font-medium tracking-[0.12em] text-accent drop-shadow-sm sm:text-5xl">
              {monogram(game.title)}
            </span>
          </div>
        )}

        {/* Hover affordance — makes "this is playable" unmissable. The scrim is an
            inline `color-mix` rather than a `bg-[var(--…)]/70` utility: Tailwind v3
            silently emits nothing for an alpha modifier on an arbitrary var() color,
            which left the "Play" pill unreadable over the screenshot. `color-mix`
            re-reads --bg-primary per theme, so light and dark both dim correctly. */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)' }}
        >
          <span className="flex items-center gap-2 rounded-full border-2 border-[var(--accent)] px-4 py-2 text-sm font-semibold text-accent">
            <Play size={16} aria-hidden="true" />
            Play
          </span>
        </span>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{game.title}</h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {game.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-[var(--text-muted)] opacity-50" aria-hidden="true">
                  ·
                </span>
              )}
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {tag}
              </span>
            </span>
          ))}
        </div>

        <p className="mt-3 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">
          {game.blurb}
        </p>

        {game.controls && (
          <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">{game.controls}</p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="text-xs text-[var(--text-muted)]">{formatAdded(game.addedAt)}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Play
            <Play
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  )
}
