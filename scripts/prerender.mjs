#!/usr/bin/env node
/**
 * Prerender the SPA routes into static HTML after `vite build`.
 *
 * GitHub Pages serves files only, so without this the homepage ships an empty
 * #root (AI crawlers do not run JavaScript) and /games/ has no file at all —
 * it fell through to 404.html and answered crawlers with HTTP 404.
 *
 * Writes dist/index.html (route `/`) and dist/games/index.html (route `/games`),
 * each with `data-prerendered` so src/main.tsx knows it may hydrate.
 */
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const SITE = 'https://luongnv.com'

const vite = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  resolve: { alias: { '@': resolve(root, 'src') } },
  define: {
    __COMMIT_HASH__: JSON.stringify(execSync('git rev-parse --short HEAD').toString().trim()),
    __COMMIT_DATE__: JSON.stringify(execSync('git log -1 --format=%cI').toString().trim()),
  },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'warn',
})

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')

  const inject = (html, pathname) => {
    const out = html.replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered="${pathname}">${render(pathname)}</div>`
    )
    if (out === html) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
    return out
  }

  writeFileSync(resolve(dist, 'index.html'), inject(template, '/'))
  console.log('[prerender] /  -> dist/index.html')

  const { games } = JSON.parse(readFileSync(resolve(root, 'src/data/games.json'), 'utf-8'))
  const url = `${SITE}/games/`
  const title = 'Games | Luong Nguyen'
  const desc = `${games.length} free browser games by Luong Nguyen: nothing to install, click one and play. Three.js and canvas games from Elemental Tetris 3D to Neon Snake.`
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

  let gamesHtml = template
    // The homepage's ProfilePage/WebSite JSON-LD describes `/`, not this page.
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*"/g, `$1${esc(title)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, `$1${esc(desc)}"`)
    .replace(/(<meta (?:name|property)="(?:og:url|twitter:url)" content=")[^"]*"/g, `$1${url}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name: title,
    description: desc,
    isPartOf: { '@id': `${SITE}/#website` },
    author: { '@id': `${SITE}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: games.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/games/${g.slug}/`,
        name: g.title,
      })),
    },
  }
  gamesHtml = gamesHtml.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(collection)}</script>\n</head>`
  )
  writeFileSync(resolve(dist, 'games/index.html'), inject(gamesHtml, '/games'))
  console.log('[prerender] /games -> dist/games/index.html')
} finally {
  await vite.close()
}
