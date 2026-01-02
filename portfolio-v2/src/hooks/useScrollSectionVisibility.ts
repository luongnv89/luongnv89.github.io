import { useState, useEffect, useMemo } from 'react'

export function useScrollSectionVisibility(
  sectionId: string,
  options?: IntersectionObserverInit
): boolean {
  const [isVisible, setIsVisible] = useState(false)

  const observerOptions = useMemo(
    () => ({
      threshold: 0.1,
      ...options,
    }),
    [options?.threshold, options?.root, options?.rootMargin]
  )

  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return

    if (!('IntersectionObserver' in window)) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, observerOptions)

    observer.observe(section)
    return () => observer.disconnect()
  }, [sectionId, observerOptions])

  return isVisible
}
