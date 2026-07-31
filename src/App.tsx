import { useEffect, useState } from 'react'
import { MatrixBackground } from './components/MatrixBackground'
import { ScrollToTop } from './components/ScrollToTop'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Products } from './components/Products'
import { Portfolio } from './components/Portfolio'
import { Games } from './components/Games'
import { GamesPage } from './components/GamesPage'
import { NotFound } from './components/NotFound'
import { Skills } from './components/Skills'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { MatrixPauseContext } from './hooks/useMatrixPause'
import { usePathname } from './lib/router'

/**
 * A cold load of `/#oss` — e.g. following a nav link from /games, or the
 * 404.html redirect — reaches the browser before React has rendered the target
 * section, so the browser's own hash scroll finds nothing. Re-run it on mount.
 */
function useHashScrollOnMount() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash === '#home' || !/^#[\w-]+$/.test(hash)) return
    const target = document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [])
}

function HomePage() {
  useHashScrollOnMount()

  return (
    <>
      <main className="relative z-10">
        <Hero />
        <About />
        <Products />
        <Portfolio />
        <Games />
        <Skills />
        <Blog />
        <Contact />
      </main>
      <Footer className="relative z-10" />
    </>
  )
}

function App() {
  const [isPaused, setIsPaused] = useState(false)
  const pathname = usePathname()
  const page = pathname === '/'
    ? <HomePage />
    : pathname === '/games'
      ? <GamesPage />
      : <NotFound />

  return (
    <MatrixPauseContext.Provider value={{ isPaused, setIsPaused }}>
      <div className="min-h-screen bg-[var(--bg-primary)] relative">
        <MatrixBackground />
        <Nav />
        <ScrollToTop />
        {page}
      </div>
    </MatrixPauseContext.Provider>
  )
}

export default App
