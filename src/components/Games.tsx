import { ArrowRight, Gamepad2 } from 'lucide-react'
import { AppLink } from '@/lib/router'
import { getGames, monogram } from '@/lib/games'

export function Games() {
  const games = getGames()
  if (games.length === 0) return null

  const thumbs = games.slice(0, 3)

  return (
    <section id="games" className="section-slim">
      <div className="container-custom">
        <AppLink
          to="/games"
          className="group card flex flex-col gap-4 p-5 sm:flex-row sm:items-center focus-ring hover:border-[var(--border-hover)]"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-lg border border-[var(--border)] flex items-center justify-center">
              <Gamepad2 size={18} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">Games</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {games.length} browser games I built for fun — nothing to install.
              </p>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-4">
            <div className="flex -space-x-2">
              {thumbs.map((game) =>
                game.thumb ? (
                  <img
                    key={game.slug}
                    src={game.thumb}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 rounded-md border border-[var(--border)] object-cover"
                  />
                ) : (
                  <span
                    key={game.slug}
                    aria-hidden
                    className="h-9 w-9 rounded-md border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center font-mono text-[10px] text-[var(--text-muted)]"
                  >
                    {monogram(game.title)}
                  </span>
                )
              )}
            </div>
            <span className="btn-link text-sm">
              Play
              <ArrowRight size={16} />
            </span>
          </div>
        </AppLink>
      </div>
    </section>
  )
}
