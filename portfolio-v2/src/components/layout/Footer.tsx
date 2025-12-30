const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`py-8 border-t border-[var(--border)] ${className}`}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>&copy; {currentYear} Luong Nguyen</span>
            <span className="text-[var(--text-muted)] opacity-50">•</span>
            <span className="font-mono text-xs">v1.0.0-{__COMMIT_HASH__}</span>
          </div>

          <nav className="flex items-center gap-6">
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
