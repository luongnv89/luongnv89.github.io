import { MapPin, Briefcase, Code2, Shield, Brain } from 'lucide-react'

const highlights = [
  { icon: Briefcase, label: '10+ Years Experience' },
  { icon: Code2, label: 'Backend & Systems' },
  { icon: Shield, label: 'Cybersecurity' },
  { icon: Brain, label: 'AI/LLM Applications' },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-custom">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle max-w-2xl">
          Building the future, one line of code at a time.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              I'm a Senior Software Engineer based in <span className="text-accent inline-flex items-center gap-1"><MapPin size={14} /> Paris, France</span>.
              With over a decade of experience, I specialize in designing and delivering
              secure, scalable backend systems and AI-powered applications.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              My work spans from deep packet inspection and network security tools
              to modern LLM integrations and developer tooling. I'm passionate about
              open-source and building tools that make developers' lives easier.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              When I'm not coding, I'm exploring new technologies, contributing to
              the community, or spending time with my family.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="card p-6 flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center">
                  <Icon size={20} className="text-accent" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
