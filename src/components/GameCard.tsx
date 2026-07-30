import { useState } from 'react'
import { Play } from 'lucide-react'
import { formatAdded, monogram, playUrl, type Game } from '@/lib/games'
import { trackGameCardClick, type GameSurface } from '@/lib/analytics'

/**
 * Stand-in for a missing or broken screenshot: scanlines over a dot grid, so a
 * game without a usable thumbnail still reads as an arcade cabinet rather than
 * a gap. The pattern is a low-alpha mix of `--text-muted` rather than a border
 * token: on `--bg-secondary`, `--border` lands at 1.04:1 in light theme and
 * `--border-hover` only reaches 1.24:1, both of which are imperceptible on most
 * displays. Mixing the muted text token down to 45% gives a texture that reads
 * in both themes while staying well short of a harsh stripe.
 */
const TILE_PATTERN = 'color-mix(in srgb, var(--text-muted) 45%, transparent)'

function MonogramTile({ title }: { title: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[var(--bg-secondary)] transition-transform duration-300 group-hover:scale-[1.03]"
      style={{
        backgroundImage:
          `repeating-linear-gradient(0deg, ${TILE_PATTERN} 0px, ${TILE_PATTERN} 1px, transparent 1px, transparent 4px), radial-gradient(circle, ${TILE_PATTERN} 1px, transparent 1px)`,
        backgroundSize: '100% 4px, 14px 14px',
      }}
      aria-hidden="true"
    >
      <span className="font-mono text-4xl font-medium tracking-[0.12em] text-accent drop-shadow-sm sm:text-5xl">
        {monogram(title)}
      </span>
    </div>
  )
}

/**
 * Screenshot-led card matching the Products treatment. Games live as static
 * files under `public/games/`, so the link is a plain anchor — a router <Link>
 * would swallow it and never reach the real HTML file.
 */
export function GameCard({ game, surface }: { game: Game; surface: GameSurface }) {
  // A thumb listed in games.json can still 404 or fail to decode. Without this
  // flag the frame renders the browser's broken-image glyph plus alt text, so
  // "no thumb" and "thumb broke" have to land on the same fallback tile.
  const [thumbFailed, setThumbFailed] = useState(false)
  const showThumb = Boolean(game.thumb) && !thumbFailed

  return (
    <a
      href={playUrl(game)}
      aria-label={`Play ${game.title}`}
      // The game page fires `game_open` on arrival; this says which listing
      // sent them. gtag uses sendBeacon, so the navigation is not delayed and
      // the link needs no preventDefault.
      onClick={() => trackGameCardClick(game.slug, surface)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_18px_40px_-22px_var(--accent-glow)] focus-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
        {showThumb ? (
          <img
            src={game.thumb}
            alt={`${game.title} gameplay screenshot`}
            loading="lazy"
            onError={() => setThumbFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <MonogramTile title={game.title} />
        )}

        {/* Hover affordance — makes "this is playable" unmissable. The scrim is an
            inline `color-mix` rather than a `bg-[var(--…)]/70` utility: Tailwind v3
            silently emits nothing for an alpha modifier on an arbitrary var() color,
            which left the "Play" pill unreadable over the screenshot. `color-mix`
            re-reads --bg-primary per theme, so light and dark both dim correctly.

            The pill is filled opaque rather than dimming the screenshot further:
            over a 70% scrim the label sat at p5 3.87:1 in light theme, and pushing
            the scrim to 85% only reaches p5 4.89:1 (worst pixel 4.31:1, still under
            AA) while flattening the screenshot to a ~208–246 tonal range, which
            defeats the point of revealing it on hover. An opaque fill pins the
            label at 6.06:1 light / 14.50:1 dark whatever screenshot sits behind it. */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)' }}
        >
          <span
            className="flex items-center gap-2 rounded-full border-2 border-[var(--accent)] px-4 py-2 text-sm font-semibold text-accent"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
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
