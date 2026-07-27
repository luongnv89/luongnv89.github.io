import { Link } from 'react-router-dom'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { Footer } from './layout/Footer'

/**
 * Catch-all view. GitHub Pages sends unknown URLs through `public/404.html`,
 * which redirects to `/?redirect=<path>`; `index.html` then restores `<path>`
 * before React Router runs. Without this route the router matches nothing and
 * the visitor gets a blank page under the nav — most likely from a typo'd or
 * stale `/games/<slug>/` link.
 */
export function NotFound() {
  return (
    <>
      <main className="relative z-10 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container-custom">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
            404
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">
            Page not found
          </h1>
          <p className="section-subtitle mt-3 mb-0 max-w-2xl">
            That link doesn&apos;t point anywhere on this site. It may be mistyped, or the page may
            have moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-accent focus-ring rounded-md"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to home
            </Link>
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-accent focus-ring rounded-md"
            >
              <Gamepad2 size={16} aria-hidden="true" />
              Browse games
            </Link>
          </div>
        </div>
      </main>
      <Footer className="relative z-10" />
    </>
  )
}
