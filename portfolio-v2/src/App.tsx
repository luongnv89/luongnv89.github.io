import { ThemeToggle } from './components/ThemeToggle'
import { MatrixBackground } from './components/MatrixBackground'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Footer } from './components/layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      <MatrixBackground />
      <ThemeToggle />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>
      <Footer className="relative z-10" />
    </div>
  )
}

export default App
