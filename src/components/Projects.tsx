import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import projectsData from '@/data/projects.json'

const INITIAL_COUNT = 6

export function Projects() {
  const [expanded, setExpanded] = useState(false)
  const projects = projectsData.projects
  const visible = expanded ? projects : projects.slice(0, INITIAL_COUNT)
  const hasMore = projects.length > INITIAL_COUNT

  return (
    <section id="projects" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle max-w-2xl">
          Open-source tools and applications I've built.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-primary inline-flex items-center gap-2"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show More ({projects.length - INITIAL_COUNT}) <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
          <a
            href="https://github.com/luongnv89?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-accent transition-colors"
          >
            View All Repositories →
          </a>
        </div>
      </div>
    </section>
  )
}
