import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

/** Path rendered by scripts/prerender.mjs; the browser always reads window.location. */
let prerenderPathname = '/'

export function setPrerenderPathname(pathname: string) {
  prerenderPathname = pathname
}

/** `/games/` and `/games` are the same route: GitHub Pages serves the folder URL. */
export function normalizePathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
}

function getPathname() {
  return normalizePathname(window.location.pathname)
}

/** Current client-side path, kept in sync with browser back/forward navigation. */
export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () =>
    typeof window === 'undefined' ? prerenderPathname : getPathname()
  )
}

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

/**
 * Same-origin navigation without a router dependency. The real href remains on
 * the anchor, so links still work without JavaScript and keep native semantics.
 */
export function AppLink({ to, onClick, target, ...props }: AppLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== '_self')
    ) {
      return
    }

    event.preventDefault()
    window.history.pushState(null, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return <a {...props} href={to} target={target} onClick={handleClick} />
}
