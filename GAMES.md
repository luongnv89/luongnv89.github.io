# Adding a game

Games are self-contained HTML files served as static assets. There is no build step for them —
Vite copies `public/` to `dist/` verbatim.

## 1. Drop the file in

```
public/games/<slug>/index.html
```

`<slug>` is the URL segment, so keep it lowercase and hyphenated. The game is then live at
`https://luongnv.com/games/<slug>/`.

The file must be self-contained (inline CSS/JS, or extra assets alongside it in the same folder).

**If the game is a bundler build, its base path must match where it is hosted.** A Vite game built
with `base: '/my-game/'` will request `/my-game/assets/...` and 404 under `/games/my-game/`. Rebuild
it against the right base rather than hand-patching the minified output:

```bash
npx vite build --base=/games/<slug>/ --outDir /tmp/<slug> --emptyOutDir
```

Then verify nothing stale survived: `grep -r '"/<slug>/' public/games/<slug>/` should find nothing.

## 2. Register it in `src/data/games.json`

```json
{
  "slug": "neon-snake",
  "title": "Neon Snake",
  "blurb": "One or two sentences. Shown on the card.",
  "tags": ["Arcade", "1 Player"],
  "addedAt": "2026-07-27",
  "thumb": "/images/games/neon-snake.jpg",
  "controls": "Arrow keys / WASD / swipe"
}
```

| Field      | Required | Notes                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------ |
| `slug`     | yes      | Must match the folder name under `public/games/`                          |
| `title`    | yes      | Display name                                                             |
| `blurb`    | yes      | Card description — keep it to ~2 lines                                    |
| `tags`     | yes      | Rendered as uppercase labels; also power the catalog filter               |
| `addedAt`  | yes      | `YYYY-MM-DD`. Sorting key — newest first, everywhere                      |
| `thumb`    | no       | 16:10 screenshot in `public/images/games/`. Omitted → monogram tile       |
| `controls` | no       | One-line control hint on the card                                          |

`getGames()` sorts by `addedAt` descending, and both the homepage section and the catalog page use
it, so they can never disagree about "most recent". The sort is stable, so games sharing the same
`addedAt` fall back to their order in this file — put the one you want featured first.

## 3. Optional: add a screenshot

Save a 16:10 image (e.g. 1200×750) to `public/images/games/<slug>.jpg` and point `thumb` at it.
Without one the card falls back to a scanline tile with the title's initials — the catalog still
looks finished.

## 4. Update SEO surfaces

- `public/sitemap.xml` — add `https://luongnv.com/games/<slug>/`
- `public/llms.txt` — add a line under `## Games`

## Analytics (automatic)

You do **not** add tracking to a game by hand. The `inject-games-analytics` plugin in
`vite.config.ts` injects the site's GA4 tag into every `dist/games/*/index.html` after each build:

- `page_view` — each game has its own URL and `<title>`, so GA separates them in the Pages report
  with no extra setup
- `game_open` with a `game_slug` parameter — register `game_slug` as a custom dimension in GA if you
  want to segment on it directly

Sources under `public/games/` are left untouched, which matters because several games are vendored
copies or bundler output — an edit there would be lost on the next rebuild. A game that ships its
own `gtag.js` (Codex of Duty does) keeps it: the plugin reuses that loader and adds only the config
call, so both properties receive data and the script is fetched once.

To verify after a build: `grep -c G-FZV5YX8YPT dist/games/<slug>/index.html`.

## Where things live

| Path                          | What                                           |
| ----------------------------- | ---------------------------------------------- |
| `public/games/<slug>/`        | The game itself (static)                       |
| `src/data/games.json`         | Catalog metadata                               |
| `src/lib/games.ts`            | Types, sort order, URL + monogram helpers      |
| `src/components/GameCard.tsx` | The card, shared by both views                 |
| `src/components/Games.tsx`    | Homepage section — 3 most recent               |
| `src/components/GamesPage.tsx`| `/games` catalog page                          |

## Gotcha

`/games/<slug>/` is a **static file path**, not a router path. Always link to it with a plain
`<a href>`. A React Router `<Link>` would intercept the click and never reach the file.
