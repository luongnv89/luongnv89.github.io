import { ArrowRight } from 'lucide-react'
import { AppLink } from '@/lib/router'
import { GameCard } from './GameCard'
import { getGames } from '@/lib/games'

/**
 * The grid is 3-wide at `lg`, so 6 fills exactly two rows with no ragged tail.
 * The catalog is larger; the "View all N games" link below adapts to the rest.
 */
const HOME_PREVIEW_COUNT = 6

export function Games() {
  const games = getGames()
  if (games.length === 0) return null

  const recent = games.slice(0, HOME_PREVIEW_COUNT)

  return (
    <section id="games" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Games</h2>
        <p className="section-subtitle max-w-2xl">
          Games I built for fun — they run in the browser, nothing to install. Free to play and share.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((game) => (
            <GameCard key={game.slug} game={game} surface="home" />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <AppLink to="/games" className="btn-primary inline-flex items-center gap-2 focus-ring">
            {games.length > HOME_PREVIEW_COUNT ? `View all ${games.length} games` : 'View all games'}
            <ArrowRight size={16} aria-hidden="true" />
          </AppLink>
        </div>
      </div>
    </section>
  )
}
