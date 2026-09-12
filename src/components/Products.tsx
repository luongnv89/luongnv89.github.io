import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'
import { cn } from '@/lib/utils'

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
    <section id="products" className="section">
      <div className="container-custom">
        <SectionHeader
          index="03"
          label="Products"
          title="Apps I've shipped"
          lede="Designed, built and shipped end to end — click through to try them."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} — visit website`}
              className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,.7)] focus-ring',
                i === 0 && 'lg:col-span-2 lg:flex-row'
              )}
            >
              {/* Live screenshot */}
              <div
                className={cn(
                  'relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]',
                  i === 0 && 'lg:aspect-auto lg:w-[58%] lg:shrink-0 lg:border-b-0 lg:border-r'
                )}
              >
                <img
                  src={product.screenshot}
                  alt={`${product.name} — ${product.tagline} by Luong Nguyen, available at ${product.url.replace(/^https?:\/\//, '')}`}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
                    i === 0 ? 'object-left-top' : 'object-top'
                  )}
                />
              </div>

              <div className={cn('flex flex-grow flex-col p-5', i === 0 && 'lg:min-w-0 lg:justify-center lg:p-8')}>
                {/* Header: logo tile + name + tagline */}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
                    <img
                      src={product.logo}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
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
                <p className={cn('mt-3 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]', i === 0 && 'lg:flex-grow-0 lg:mt-5 lg:text-base')}>
                  {product.description}
                </p>

                {/* Footer: domain + arrow */}
                <div className={cn('mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3', i === 0 && 'lg:mt-8')}>
                  <span className="truncate font-mono text-xs text-[var(--text-muted)]">
                    {product.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-[var(--text-muted)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)]"
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
