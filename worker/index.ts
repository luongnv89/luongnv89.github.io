/**
 * Cloudflare Worker: Markdown Content Negotiation + Link Headers (RFC 8288)
 *
 * Serves markdown versions of pages when `Accept: text/markdown` is requested.
 * Follows the Markdown for Agents specification:
 * https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
 *
 * Also adds HTTP Link response headers for agent discovery per
 * RFC 8288 and RFC 9727 Section 3:
 * https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
 *
 * When Accept: text/markdown is present:
 *   - Fetches the .md file from GitHub Pages origin
 *   - Returns it with Content-Type: text/markdown
 *   - Includes X-Markdown-Tokens header with token count
 *
 * Otherwise:
 *   - Proxies to GitHub Pages as normal (HTML)
 */

const GITHUB_PAGES_ORIGIN = 'https://luongnv89.github.io'

/**
 * HTTP Link headers for agent discovery per RFC 8288 + RFC 9727 Section 3.
 * These point agents to machine-readable resource descriptions.
 */
const LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-card.json>; rel="describedby"; type="application/json"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi"',
  '</llms.txt>; rel="describedby"',
  '</sitemap.xml>; rel="sitemap"',
].join(', ')

/**
 * Count tokens approximately (4 chars per token is a common heuristic).
 */
function countTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Map a URL path to the corresponding .md file path on GitHub Pages.
 */
function mdPathForUrlPath(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return '/index.md'
  }
  // Strip trailing slash for consistency
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/') return '/index.md'
  return `${clean}.md`
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const accept = request.headers.get('Accept') || ''
    const isMarkdownRequest = accept.includes('text/markdown')

    if (isMarkdownRequest) {
      const targetMdPath = mdPathForUrlPath(url.pathname)
      const mdUrl = `${GITHUB_PAGES_ORIGIN}${targetMdPath}`

      try {
        const mdResponse = await fetch(mdUrl, {
          method: 'GET',
          headers: {
            Accept: 'text/markdown',
          },
        })

        if (mdResponse.ok) {
          const mdText = await mdResponse.text()
          const tokenCount = countTokens(mdText)

          return new Response(mdText, {
            status: 200,
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'X-Markdown-Tokens': String(tokenCount),
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
              'Vary': 'Accept',
              'Link': LINK_HEADERS,
            },
          })
        }
      } catch (_error) {
        // Fall through to HTML proxy below
      }
    }

    // Default: proxy to GitHub Pages (HTML) with Link headers
    const originUrl = `${GITHUB_PAGES_ORIGIN}${url.pathname}${url.search}`

    const response = await fetch(originUrl, {
      method: request.method,
      headers: {
        Accept: 'text/html',
        'Host': 'luongnv89.github.io',
      },
    })

    // Clone the response so we can add headers
    const modifiedHeaders = new Headers(response.headers)
    modifiedHeaders.set('Link', LINK_HEADERS)

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: modifiedHeaders,
    })
  },
}
