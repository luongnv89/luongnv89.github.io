import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MatrixBackground } from './components/MatrixBackground'
import { ScrollToTop } from './components/ScrollToTop'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Products } from './components/Products'
import { Portfolio } from './components/Portfolio'
import { Skills } from './components/Skills'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { MatrixPauseContext } from './hooks/useMatrixPause'

function HomePage() {
  return (
    <>
      <main className="relative z-10">
        <Hero />
        <About />
        <Products />
        <Portfolio />
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

  return (
    <MatrixPauseContext.Provider value={{ isPaused, setIsPaused }}>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--bg-primary)] relative">
          <MatrixBackground />
          <Nav />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MatrixPauseContext.Provider>
  )
}

export default App
