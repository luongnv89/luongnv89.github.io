// WebMCP — expose site tools to AI agents via navigator.modelContext.registerTool
// Spec: https://webmachinelearning.github.io/webmcp/
// Scanner checks that the page calls navigator.modelContext.registerTool

(function () {
  const tools = [
    {
      name: 'search_site',
      description: 'Search the portfolio site for projects, games, and articles',
      inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Search query' } }, required: ['query'] },
      execute: async ({ query }) => {
        const q = String(query || '').toLowerCase()
        // client-side search: scan visible sections
        const results = []
        document.querySelectorAll('h2, h3, p, a').forEach((el) => {
          const t = (el.textContent || '').toLowerCase()
          if (t.includes(q) && results.length < 5) results.push(t.slice(0, 120))
        })
        return { query, results: results.length ? results : ['No matches on this page. Try https://luongnv.com/sitemap.xml'] }
      },
    },
    {
      name: 'open_game',
      description: 'Open a browser game by slug',
      inputSchema: {
        type: 'object',
        properties: { slug: { type: 'string', description: 'Game slug e.g. magic-webcam, flappy-bird' } },
        required: ['slug'],
      },
      execute: async ({ slug }) => {
        const url = `https://luongnv.com/games/${slug}/`
        window.open(url, '_blank')
        return { opened: url }
      },
    },
    {
      name: 'get_contact',
      description: 'Get contact and social links',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({
        website: 'https://luongnv.com',
        github: 'https://github.com/luongnv89',
        linkedin: 'https://linkedin.com/in/luongnv89',
        email: 'via https://luongnv.com/#contact',
      }),
    },
    {
      name: 'list_projects',
      description: 'List open-source projects and products',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        const projects = Array.from(document.querySelectorAll('#oss h3')).map((h) => h.textContent?.trim()).filter(Boolean)
        return { projects: projects.length ? projects : ['claude-howto', 'agent-skill-manager', 'sleek-ui'] }
      },
    },
  ]

  function register() {
    const mc = navigator.modelContext
    if (!mc || typeof mc.registerTool !== 'function') return
    const controller = new AbortController()
    for (const t of tools) {
      try {
        mc.registerTool(t, { signal: controller.signal })
      } catch (e) {
        console.warn('[webmcp] register failed', t.name, e)
      }
    }
    // Unregister on page hide
    window.addEventListener('pagehide', () => controller.abort(), { once: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register)
  } else {
    register()
  }
  // Retry once after 1s for late-injecting agents
  setTimeout(register, 1000)
})()
