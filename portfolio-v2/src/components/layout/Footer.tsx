import { Link } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
  isRoute?: boolean
}

const links: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
  { label: 'For Claude Users', href: '/claude-tools', isRoute: true },
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>&copy; {currentYear} Luong Nguyen</span>
            <span className="text-[var(--text-muted)] opacity-50">•</span>
            <span className="font-mono text-xs">v1.1.0-{typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev'} ({lastUpdated})</span>
          </div>

          <nav className="flex items-center gap-6">
            {links.map(({ label, href, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors"
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
}
