interface NavLink {
  label: string
  href: string
}

const links: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

const externalLinks: NavLink[] = [
  { label: 'GitHub', href: 'https://github.com/luongnv89' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luongnv89' },
  { label: 'Medium', href: 'https://medium.com/@luongnv89' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/luongnv89.bsky.social' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const lastUpdated = typeof __COMMIT_DATE__ !== 'undefined'
    ? new Date(__COMMIT_DATE__).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'dev'

  return (
    <footer className={`py-8 border-t border-[var(--border)] ${className}`}>
      <div className="container-custom">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <span>&copy; {currentYear} Luong Nguyen</span>
              <span className="text-[var(--text-muted)] opacity-50">•</span>
              <span className="font-mono text-xs">v1.1.0-{typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev'} ({lastUpdated})</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {externalLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
