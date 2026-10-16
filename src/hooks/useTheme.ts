import { useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

// Default to dark mode
const readTheme = (): Theme => (localStorage.getItem('theme') as Theme | null) ?? 'dark'

function writeTheme(theme: Theme) {
  localStorage.setItem('theme', theme)
  listeners.forEach((onChange) => onChange())
}

export function useTheme() {
  // The server snapshot matches the prerendered HTML (dark), so hydration never
  // mismatches; React then re-renders with the saved theme before paint.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark' as Theme)

  useEffect(() => {
    const root = document.documentElement

    // Add transitioning class for smooth animation
    root.classList.add('transitioning')

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Remove transitioning class after animation
    const timeout = setTimeout(() => {
      root.classList.remove('transitioning')
    }, 300)

    return () => clearTimeout(timeout)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        writeTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    writeTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
