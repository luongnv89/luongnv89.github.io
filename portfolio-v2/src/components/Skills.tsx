const skillCategories = [
  {
    title: 'AI & Machine Learning',
    skills: ['LLM Integration', 'Claude API', 'RAG Systems', 'Voice Synthesis', 'Prompt Engineering'],
  },
  {
    title: 'Cybersecurity',
    skills: ['DPI', 'Network Security', 'Packet Analysis', 'Threat Detection', 'Security Monitoring'],
  },
  {
    title: 'Backend & Systems',
    skills: ['Python', 'C/C++', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'Linux', 'GitHub Actions', 'AWS', 'CLI Development'],
  },
]

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <h2 className="section-title">Skills & Expertise</h2>
        <p className="section-subtitle max-w-2xl">
          Technologies and domains I work with.
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
