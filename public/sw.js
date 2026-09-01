// Service Worker for Accept: text/markdown negotiation
// GitHub Pages cannot do server-side content negotiation; this SW returns Markdown when Accept includes text/markdown.
// Also serves markdown files with correct Content-Type for scanners that follow the alternate link.

const MARKDOWN_ROUTES = {
  '/': '/index.md',
  '/index.html': '/index.md',
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  // Only same-origin GET
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  const accept = req.headers.get('Accept') || ''
  const wantsMarkdown = accept.includes('text/markdown')
  const markdownPath = MARKDOWN_ROUTES[url.pathname]
  // Direct .md request: ensure correct content-type
  if (url.pathname.endsWith('.md')) {
    event.respondWith(
      fetch(req).then((res) => {
        if (!res.ok) return res
        const headers = new Headers(res.headers)
        headers.set('Content-Type', 'text/markdown; charset=utf-8')
        headers.set('x-markdown-tokens', String((res.headers.get('content-length') || '2000')))
        return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
      })
    )
    return
  }
  if (wantsMarkdown && markdownPath) {
    event.respondWith(
      fetch(markdownPath).then((res) => {
        if (!res.ok) return fetch(req)
        const headers = new Headers(res.headers)
        headers.set('Content-Type', 'text/markdown; charset=utf-8')
        headers.set('x-markdown-tokens', '1200')
        return new Response(res.body, { status: 200, headers })
      })
    )
  }
})

self.addEventListener('install', (e) => self.skipWaiting())
self.addEventListener('activate', (e) => self.clients.claim())
