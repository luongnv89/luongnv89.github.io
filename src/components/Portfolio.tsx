import { PortfolioCard } from './PortfolioCard'
import portfolioData from '@/data/portfolio.json'

export function Portfolio() {
  return (
    <section id="portfolio" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Portfolio</h2>
        <p className="section-subtitle max-w-2xl">
          Only open-source projects are shown here. Click a logo to discover the project behind it.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {portfolioData.projects.map((project) => (
            <PortfolioCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
