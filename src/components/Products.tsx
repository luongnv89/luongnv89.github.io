import { ArrowUpRight } from 'lucide-react'

interface Product {
  name: string
  tagline: string
  description: string
  url: string
  logo: string
  screenshot: string
}

const products: Product[] = [
  {
    name: 'Milo',
    tagline: 'iOS · Voice AI',
    description: 'Hands-free AI for Siri & CarPlay — "Hey Siri, ask MILO…" routes your voice to GPT, Claude, Gemini, or 200+ models.',
    url: 'https://askmilo.pro',
    logo: '/images/projects/milo.svg',
    screenshot: '/images/projects/screenshots/milo.jpg',
  },
  {
    name: 'TextWiz',
    tagline: 'macOS · Writing',
    description: 'Local-first macOS app that runs AI "wizards" on selected text via a global hotkey (⌘⇧Space). On-device by default, no servers.',
    url: 'https://www.textwiz.pro',
    logo: '/images/projects/textwiz.svg',
    screenshot: '/images/projects/screenshots/textwiz.jpg',
  },
  {
    name: 'custats',
    tagline: 'macOS · iOS · Analytics',
    description: 'Claude + Codex usage tracking in your menu bar — monitor token spend, sessions, and rate limits before they bite.',
    url: 'https://custats.info',
    logo: '/images/projects/custats.svg',
    screenshot: '/images/projects/screenshots/custats.jpg',
  },
  {
    name: 'devstats',
    tagline: 'Web · Analytics',
    description: 'GitHub stats dashboard with contribution graphs, language breakdowns, leaderboards, and shareable profile cards.',
    url: 'https://devstats.info',
    logo: '/images/projects/devstats.svg',
    screenshot: '/images/projects/screenshots/devstats.jpg',
  },
  {
    name: 'music',
    tagline: 'Web · CLI',
    description: 'A terminal-native music player with radio streaming and playlists — plus its web player and docs.',
    url: 'https://music-cli.luongnv.com',
    logo: '/images/projects/music-cli.svg',
    screenshot: '/images/projects/screenshots/music-cli.jpg',
  },
]

export function Products() {
  return (
    <section id="products" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Products</h2>
        <p className="section-subtitle max-w-2xl">
          Apps and services I've designed, built, and shipped — click through to try them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} — visit website`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_18px_40px_-22px_var(--accent-glow)] focus-ring"
            >
              {/* Live screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
                <img
                  src={product.screenshot}
                  alt={`${product.name} website screenshot`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-grow flex-col p-5">
                {/* Header: logo tile + name + tagline */}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <img
                      src={product.logo}
                      alt=""
                      loading="lazy"
                      className="h-7 w-7 rounded-md object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-[var(--text-primary)]">
                      {product.name}
                    </h3>
                    <span className="inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {product.tagline}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">
                  {product.description}
                </p>

                {/* Footer: domain + arrow */}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="truncate font-mono text-sm font-medium text-accent">
                    {product.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-[var(--text-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
