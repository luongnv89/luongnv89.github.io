import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { GameCard } from './GameCard'
import { getGames } from '@/lib/games'

const HOME_PREVIEW_COUNT = 3

export function Games() {
  const games = getGames()
  if (games.length === 0) return null

  const recent = games.slice(0, HOME_PREVIEW_COUNT)

  return (
    <section id="games" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title mb-2">Games</h2>
        <p className="section-subtitle mb-8 max-w-2xl">
          Games I built for fun — they run in the browser, nothing to install. Free to play and share.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/games" className="btn-primary inline-flex items-center gap-2 focus-ring">
            {games.length > HOME_PREVIEW_COUNT ? `View all ${games.length} games` : 'View all games'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
