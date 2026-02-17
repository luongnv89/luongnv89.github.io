import { ProjectCard } from './ProjectCard'
import projectsData from '@/data/projects.json'

export function Projects() {
  return (
    <section id="projects" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle max-w-2xl">
          Open-source tools and applications I've built.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/luongnv89?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Repositories
          </a>
        </div>
      </div>
    </section>
  )
}
