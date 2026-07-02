import { ThemeToggle } from '../ThemeToggle'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Open Source', href: '#oss' },
  { label: 'Writing', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <nav className="container-custom flex h-14 items-center justify-between" aria-label="Main">
        <a href="#home" className="flex items-baseline gap-2 focus-ring rounded-md">
          <span className="font-semibold text-[var(--text-primary)]">Luong Nguyen</span>
          <span className="hidden sm:inline font-mono text-xs text-accent">@luongnv89</span>
        </a>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 mr-2">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors focus-ring rounded-md"
              >
                {label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
