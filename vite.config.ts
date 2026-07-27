import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

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
