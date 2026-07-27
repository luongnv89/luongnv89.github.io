import gamesData from '@/data/games.json'

export interface Game {
  /** Folder name under `public/games/` — the play URL is `/games/<slug>/`. */
  slug: string
  title: string
  blurb: string
  tags: string[]
  /** ISO date (YYYY-MM-DD) the game was published. Drives "most recent" ordering. */
  addedAt: string
  /** Optional 16:10 screenshot. Without it the card renders a monogram tile. */
  thumb?: string
  /** Optional one-line control hint shown on the card. */
  controls?: string
}

/**
 * Single source of truth for game ordering — newest first, so the home section
 * and the catalog page can never disagree about what "3 most recent" means.
 */
export function getGames(): Game[] {
  return [...(gamesData.games as Game[])].sort((a, b) => b.addedAt.localeCompare(a.addedAt))
}

/** Static file path, not a router path — always link with a plain `<a>`. */
export function playUrl(game: Game): string {
  return `/games/${game.slug}/`
}

export function formatAdded(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  return Number.isNaN(date.getTime())
    ? isoDate
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/** Up to two initials, e.g. "Neon Snake" → "NS", "Snake" → "SN". */
export function monogram(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return title.slice(0, 2).toUpperCase()
}
