import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { setPrerenderPathname } from './lib/router'

/** Static HTML for one route, used by scripts/prerender.mjs at build time. */
export function render(pathname: string) {
  setPrerenderPathname(pathname)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
