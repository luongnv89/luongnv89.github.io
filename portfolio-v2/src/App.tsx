import { ThemeToggle } from './components/ThemeToggle'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Footer } from './components/layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <ThemeToggle />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
