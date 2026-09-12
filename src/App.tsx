import { useEffect } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { ScrollToTop } from './components/ScrollToTop'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Focus } from './components/Focus'
import { Products } from './components/Products'
import { Portfolio } from './components/Portfolio'
import { Games } from './components/Games'
import { GamesPage } from './components/GamesPage'
import { NotFound } from './components/NotFound'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
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
        <Focus />
        <Products />
        <Portfolio />
        <Games />
        <Blog />
        <Contact />
      </main>
      <Footer className="relative z-10" />
    </>
  )
}

function App() {
  const pathname = usePathname()
  const page = pathname === '/'
    ? <HomePage />
    : pathname === '/games'
      ? <GamesPage />
      : <NotFound />

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      <AmbientBackground />
      <Nav />
      <ScrollToTop />
      {page}
    </div>
  )
}

export default App
