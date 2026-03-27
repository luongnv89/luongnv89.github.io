const skillCategories = [
  {
    title: 'AI workflows & agents',
    skills: ['AI Agents', 'Agent Skills', 'AI Coding Tools', 'Prompt Engineering', 'Langchain/Langgraph', 'Spec Driven Development'],
  },
  {
    title: 'Deployment & production',
    skills: ['Docker', 'CI/CD', 'Release Automation', 'Production Deployments', 'Monitoring', 'Observability', 'Rollbacks'],
  },
  {
    title: 'Cybersecurity at Montimage',
    skills: ['DPI', 'Network Security', 'Packet Analysis', 'Threat Detection', 'Security Monitoring', 'Traffic Inspection'],
  },
  {
    title: 'CLI & developer tools',
    skills: ['Python', 'Shell', 'TypeScript', 'Node.js', 'GitHub Actions', 'Linux', 'Automation'],
  },
]

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <h2 className="section-title">Skills & Expertise</h2>
        <p className="section-subtitle max-w-2xl">
          Skills reflected by the projects I actually ship: the full DevOps cycle from AI workflows to deployment, security, and production operations.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map(({ title, skills }) => (
            <div key={title} className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
