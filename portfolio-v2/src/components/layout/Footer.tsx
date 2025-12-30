import { Heart } from 'lucide-react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
            <span>&copy; {currentYear} Luong Nguyen. Built with</span>
            <Heart size={14} className="text-accent" />
            <span>and React.</span>
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
