import { MapPin, Code2, Shield, Brain, BookOpen, Hammer, Share2, Users } from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

// Kept fresh by the daily stats cron that rewrites portfolio.json
const claudeHowtoStarsK = Math.floor(
  (portfolioData.projects.find((p) => p.name === 'claude-howto')?.stars ?? 39000) / 1000
)

const highlights = [
  { icon: Code2, label: 'Software Engineer', description: 'Building robust, scalable systems for over a decade' },
  { icon: Brain, label: 'AI & LLM', description: 'Crafting intelligent applications powered by large language models' },
  { icon: Shield, label: 'Cybersecurity', description: 'Securing networks and systems through deep packet inspection and beyond' },
]

const pillars = [
  { icon: BookOpen, label: 'Learn', description: 'Staying curious — constantly exploring new technologies and ideas' },
  { icon: Hammer, label: 'Build', description: 'Turning ideas into real tools and open-source projects' },
  { icon: Share2, label: 'Share', description: 'Writing, speaking, and open-sourcing to give back to the community' },
  { icon: Users, label: 'Connect', description: 'Collaborating with engineers and researchers around the world' },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-custom">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle max-w-2xl">
          Software engineer first — driven by curiosity, building with purpose.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              I'm a Software Engineer based in <span className="text-accent inline-flex items-center gap-1"><MapPin size={14} /> Paris, France</span>.
              By day I'm a research engineer at <span className="text-accent font-medium">Montimage</span>,
              hardening networks through deep packet inspection and European cybersecurity research.
              At my core, I'm an engineer who loves solving hard problems.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              My moat is the combination of <span className="text-accent font-medium">AI</span> and <span className="text-accent font-medium">Cybersecurity</span>:
              a decade of network-security engineering paired with AI developer tooling that people
              actually use — <span className="text-accent font-medium">claude-howto</span>, my visual guide
              to Claude Code, has grown past <span className="text-accent font-medium">{claudeHowtoStarsK},000 GitHub stars</span>,
              and tools like asm, Milo, and TextWiz are in developers' hands every day.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              But engineering is only half the story. I believe in a cycle of
              {' '}<span className="text-accent font-medium">learning</span> new things,
              {' '}<span className="text-accent font-medium">building</span> real tools,
              {' '}<span className="text-accent font-medium">sharing</span> knowledge openly, and
              {' '}<span className="text-accent font-medium">connecting</span> with others who care about the craft.
              That's what keeps me going.
            </p>
          </div>

          {/* Focus Areas */}
          <div className="space-y-6">
            <div className="space-y-3">
              {highlights.map(({ icon: Icon, label, description }) => (
                <div
                  key={label}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-4 gap-3">
              {pillars.map(({ icon: Icon, label, description }) => (
                <div
                  key={label}
                  className="card p-3 flex flex-col items-center text-center gap-2"
                  title={description}
                >
                  <Icon size={18} className="text-accent" />
                  <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
