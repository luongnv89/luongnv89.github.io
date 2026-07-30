/**
 * Thin wrapper over the gtag.js tag installed in index.html.
 *
 * `window.gtag` is genuinely absent in three ordinary cases — the dev server
 * (index.html loads the tag, but the request is blocked offline), a visitor
 * with a content blocker, and the moment before the async loader resolves — so
 * every call site would otherwise need the same optional-chaining guard. Doing
 * it once here keeps analytics from ever being able to break a click handler.
 *
 * Events fired here use gtag's default transport, which is sendBeacon: the
 * request survives the navigation the click is about to cause, so a card link
 * does not need to be delayed or intercepted to be measured.
 */

type GtagFn = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>,
) => void

declare global {
  interface Window {
    gtag?: GtagFn
  }
}

/** Send a GA4 event. No-ops when the tag is not present. */
export function track(eventName: string, params?: Record<string, unknown>): void {
  window.gtag?.('event', eventName, params)
}

/**
 * Where a game card was clicked. The standalone game pages already fire
 * `game_open` with the same `game_slug` (injected at build time by the
 * games-analytics plugin in vite.config.ts), so this is the half that says
 * how the player got there rather than that they arrived.
 */
export type GameSurface = 'home' | 'games'

export function trackGameCardClick(slug: string, surface: GameSurface): void {
  track('game_card_click', { game_slug: slug, surface })
}
