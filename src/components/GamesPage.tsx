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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-accent focus-ring rounded-md"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">
            Games
          </h1>
          <p className="section-subtitle mt-3 mb-0 max-w-2xl">
            Small browser games, each a single HTML file. Nothing to install — click one and play.
            Free to share.
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
                    className={`rounded-full border px-3 py-1 text-sm transition-colors focus-ring ${
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

          {visible.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center">
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
      </main>
      <Footer className="relative z-10" />
    </>
  )
}
