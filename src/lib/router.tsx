import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

/** Current client-side path, kept in sync with browser back/forward navigation. */
export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/')
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
