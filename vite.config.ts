import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

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

export default defineConfig({
  plugins: [
    react(),
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
