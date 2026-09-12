import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { AppLink } from '@/lib/router'
import { Footer } from './layout/Footer'

/**
 * Catch-all view. GitHub Pages sends unknown URLs through `public/404.html`,
 * which redirects to `/?redirect=<path>`; `index.html` then restores `<path>`
 * before the app runs. Without this route the router matches nothing and
 * the visitor gets a blank page under the nav — most likely from a typo'd or
 * stale `/games/<slug>/` link.
 */
export function NotFound() {
  return (
    <>
      <main className="relative z-10 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container-custom">
          <p className="eyebrow">404</p>

          <h1 className="display mt-3 text-4xl md:text-5xl text-[var(--text-primary)]">
            Page not found
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
            That link doesn&apos;t point anywhere on this site. It may be mistyped, or the page may
            have moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AppLink
              to="/"
              className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-ring rounded-md"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to home
            </AppLink>
            <AppLink
              to="/games"
              className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-ring rounded-md"
            >
              <Gamepad2 size={16} aria-hidden="true" />
              Browse games
            </AppLink>
          </div>
        </div>
      </main>
      <Footer className="relative z-10" />
    </>
  )
}
