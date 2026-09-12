import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AppLink } from '@/lib/router'
import { ThemeToggle } from '../ThemeToggle'

/**
 * Root-relative hashes (`/#about`, not `#about`) so these still land on the
 * homepage section when the nav is rendered on a non-home route like /games.
 */
const links = [
  { label: 'About', href: '/#about' },
  { label: 'Products', href: '/#products' },
  { label: 'Open Source', href: '/#oss' },
  { label: 'Writing', href: '/#blog' },
  { label: 'Games', href: '/games', route: true },
  { label: 'Contact', href: '/#contact' },
]

const linkClass =
  'text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded-md'

const mobileLinkClass =
  'py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded-md'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on route or hash change (link clicks close it via
  // onClick; this covers back/forward and in-page hash navigation).
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('popstate', close)
    window.addEventListener('hashchange', close)
    return () => {
      window.removeEventListener('popstate', close)
      window.removeEventListener('hashchange', close)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled || menuOpen
          ? 'border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md'
          : ''
      }`}
    >
      <nav className="container-custom flex h-16 items-center justify-between" aria-label="Main">
        <a href="/#home" className="flex items-center gap-2 focus-ring rounded-md">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
          <span className="font-medium text-[var(--text-primary)]">Luong Nguyen</span>
          <span className="hidden sm:inline font-mono text-xs text-[var(--text-muted)]">
            @luongnv89
          </span>
        </a>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 mr-2">
            {links.map(({ label, href, route }) =>
              route ? (
                <AppLink key={label} to={href} className={linkClass}>
                  {label}
                </AppLink>
              ) : (
                <a key={label} href={href} className={linkClass}>
                  {label}
                </a>
              )
            )}
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="icon-btn md:hidden focus-ring"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-b border-[var(--border)] bg-[var(--bg-primary)] shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]"
        >
          <nav className="container-custom flex flex-col py-3" aria-label="Mobile">
            {links.map(({ label, href, route }) =>
              route ? (
                <AppLink
                  key={label}
                  to={href}
                  className={mobileLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </AppLink>
              ) : (
                <a
                  key={label}
                  href={href}
                  className={mobileLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
