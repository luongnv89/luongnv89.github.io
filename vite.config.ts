import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { execSync } from 'child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get git commit hash and date
const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const commitDate = execSync('git log -1 --format=%cI').toString().trim()

// Star count from portfolio.json (kept fresh by the daily stats cron),
// injected into index.html meta tags via %CLAUDE_HOWTO_STARS%
const portfolio = JSON.parse(
  readFileSync(resolve(__dirname, 'src/data/portfolio.json'), 'utf-8')
) as { projects: Array<{ name: string; stars: number }> }
const claudeHowtoStars = portfolio.projects.find((p) => p.name === 'claude-howto')?.stars ?? 39000
const claudeHowtoStarsK = `${Math.floor(claudeHowtoStars / 1000)}k`

const publicDir = resolve(__dirname, 'public')

/** Site-wide GA4 property — same one index.html loads. */
const GA_ID = 'G-FZV5YX8YPT'

/**
 * Games are static files copied verbatim from public/, so they never pass
 * through transformIndexHtml. Inject the site's analytics into each one after
 * the build instead of hand-editing the sources: several are vendored or
 * bundler-built, and an edit there would be lost on the next rebuild.
 *
 * Each game already has a distinct URL and <title>, so GA separates them in the
 * Pages report on its own; the extra `game_open` event just makes the slug easy
 * to segment on.
 */
function gamesAnalytics(slug: string, hasGtagLoader: boolean): string {
  const loader = hasGtagLoader
    ? ''
    : `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>\n`
  return `${loader}<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
  gtag('event', 'game_open', { game_slug: '${slug}' });
</script>\n`
}

export default defineConfig({
  plugins: [
    react(),
    {
      // Dev-only parity with static hosts (GitHub Pages): resolve `/foo/` to
      // `public/foo/index.html`. Without this the SPA fallback swallows the
      // standalone game pages under public/games/, so they only work in prod.
      name: 'public-dir-index',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const path = (req.url ?? '').split('?')[0]
          if (path.length > 1 && path.endsWith('/')) {
            const file = resolve(publicDir, `.${path}index.html`)
            if (file.startsWith(publicDir) && existsSync(file)) {
              req.url = `${path}index.html`
            }
          }
          next()
        })
      },
    },
    {
      name: 'inject-portfolio-stats',
      transformIndexHtml(html: string) {
        return html.replace(/%CLAUDE_HOWTO_STARS%/g, claudeHowtoStarsK)
      },
    },
    {
      // Runs on the built output, after public/ has been copied to dist/.
      name: 'inject-games-analytics',
      apply: 'build',
      closeBundle() {
        const gamesDir = resolve(__dirname, 'dist/games')
        if (!existsSync(gamesDir)) return

        for (const slug of readdirSync(gamesDir, { withFileTypes: true })) {
          if (!slug.isDirectory()) continue
          const file = resolve(gamesDir, slug.name, 'index.html')
          if (!existsSync(file)) continue

          const html = readFileSync(file, 'utf-8')
          if (html.includes(GA_ID)) continue // already tagged

          // A game may ship its own gtag.js (codex-of-duty does); reuse that
          // loader and only add our config rather than fetching it twice.
          const snippet = gamesAnalytics(
            slug.name,
            html.includes('googletagmanager.com/gtag/js')
          )

          if (html.includes('</head>')) {
            writeFileSync(file, html.replace('</head>', `${snippet}</head>`))
          } else {
            // No <head> to target — fall back to the top of <body>.
            const m = html.match(/<body[^>]*>/i)
            if (!m) {
              console.warn(`[games-analytics] skipped ${slug.name}: no <head> or <body>`)
              continue
            }
            writeFileSync(file, html.replace(m[0], `${m[0]}\n${snippet}`))
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
  base: '/',
})
