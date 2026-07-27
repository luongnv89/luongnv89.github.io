import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { GameCard } from './GameCard'
import { Footer } from './layout/Footer'
import { getGames } from '@/lib/games'

/** Below this count the whole catalog fits on one screen — a filter would be noise. */
const FILTER_THRESHOLD = 7

const ALL = 'All'

export function GamesPage() {
  const games = useMemo(() => getGames(), [])
  const [activeTag, setActiveTag] = useState(ALL)

  useEffect(() => {
    window.scrollTo(0, 0)
    const previousTitle = document.title
    document.title = 'Games | Luong Nguyen'
    return () => {
      document.title = previousTitle
    }
  }, [])

  const tags = useMemo(() => {
    const unique = [...new Set(games.flatMap((game) => game.tags))].sort()
    return [ALL, ...unique]
  }, [games])

  const showFilter = games.length >= FILTER_THRESHOLD && tags.length > 2
  const visible = activeTag === ALL ? games : games.filter((g) => g.tags.includes(activeTag))

  return (
    <>
      <main className="relative z-10 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container-custom">
          {/* `-my-3 py-3` lifts the hit area from ~20px to 44px without moving
              anything: with nav links hidden below 768px this is the primary
              in-page way back on mobile. */}
          <Link
            to="/"
            className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-accent focus-ring rounded-md"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">
            Games
          </h1>
          <p className="section-subtitle mt-3 mb-0 max-w-2xl">
            Games that run in the browser. Nothing to install — click one and play. Free to share.
          </p>

          {showFilter && (
            <div
              className="mt-8 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter games by category"
            >
              {tags.map((tag) => {
                const isActive = tag === activeTag
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    aria-pressed={isActive}
                    className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm transition-colors focus-ring ${
                      isActive
                        ? 'border-[var(--accent)] text-accent'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* GameCard is --bg-primary, same as the page, so on its own the grid is
            delineated only by a 1.10:1 border. The homepage gives that card a
            --bg-secondary section (Products, Games); this band is the same
            one-step separation. It wraps only the grid rather than <main> so the
            matrix canvas still shows through behind the page header. */}
        <section className="mt-10 bg-[var(--bg-secondary)] py-10 md:py-12">
          <div className="container-custom">
            {/* The page h1 is "Games" and the cards are h3 — without this the
                heading outline skips a level. */}
            <h2 className="sr-only">All games</h2>

            {/* Filtering swaps the grid silently; this is the only feedback a
                screen-reader user gets. Kept outside the branch below so
                switching between grid and empty state doesn't remount it — a
                remounted live region never announces. */}
            <p aria-live="polite" className="sr-only">
              {`${visible.length} ${visible.length === 1 ? 'game' : 'games'}${
                activeTag === ALL ? '' : ` tagged "${activeTag}"`
              }`}
            </p>

            {visible.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-10 text-center">
                <p className="text-[var(--text-primary)]">
                  {games.length === 0
                    ? 'No games published yet — check back soon.'
                    : `No games tagged "${activeTag}".`}
                </p>
                {games.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(ALL)}
                    className="btn-secondary mt-4 focus-ring"
                  >
                    Show all games
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer className="relative z-10" />
    </>
  )
}
