import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { normalizePathname } from './lib/router'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// scripts/prerender.mjs stamps the path it rendered. A 404.html redirect lands
// on the homepage markup with a different path, so render fresh instead.
if (root.dataset.prerendered === normalizePathname(window.location.pathname)) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
