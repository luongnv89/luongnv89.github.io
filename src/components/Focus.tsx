import { ArrowUpRight, Bot, Layers, ShieldCheck } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'

const areas = [
  {
    icon: Bot,
    title: 'AI Agents',
    description:
      'Agentic workflows for real engineering work: Claude Code, Codex, spec-driven development and multi-agent orchestration.',
    tags: [
      'Claude Code',
      'Codex',
      'LangGraph',
      'Prompt engineering',
      'Spec-driven dev',
      'Multi-agent fleets',
    ],
    related: { name: 'claude-howto', url: 'https://luongnv.com/claude-howto' },
  },
  {
    icon: Layers,
    title: 'Agent Skills',
    description:
      "Skills are how agents learn a team's way of working. I build the tooling to author, audit and distribute them across agents.",
    tags: [
      'asm',
      'Skill authoring',
      'Skill evals',
      'Security scanning',
      'Claude Code',
      'Codex',
      'Cursor',
    ],
    related: { name: 'asm', url: 'https://luongnv.com/asm' },
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity',
    description:
      '15+ years of network-security engineering at Montimage: deep packet inspection, monitoring and EU research projects.',
    tags: [
      'DPI',
      'MMT',
      'Threat detection',
      'Traffic analysis',
      'Security monitoring',
      '5G / IoT security',
    ],
    related: {
      name: 'MMT on macOS',
      url: 'https://medium.com/@luongnv89/demystifying-your-network-traffic-on-macos-a-docker-based-approach-with-mmt-e9d595034c36',
    },
  },
]

export function Focus() {
  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <SectionHeader
          index="02"
          label="Focus"
          title="What I work on"
          lede="Three threads, one loop: agents that do real engineering work, the skills that teach them how a team works, and the network security that keeps it all honest."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {areas.map(({ icon: Icon, title, description, tags, related }) => (
            <article key={title} className="card p-6 flex flex-col">
              <div className="h-10 w-10 rounded-lg border border-[var(--border)] flex items-center justify-center">
                <Icon size={18} className="text-accent" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {description}
              </p>
              <p className="mt-5 font-mono text-xs text-[var(--text-muted)] leading-6">
                {tags.join(' · ')}
              </p>
              <div className="mt-auto pt-5">
                <a
                  href={related.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link text-sm"
                >
                  Related: {related.name}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Method: how the three threads combine in practice */}
        <div className="card mt-5 grid gap-6 p-6 md:grid-cols-12 md:p-8">
          <div className="md:col-span-5">
            <p className="eyebrow">Method</p>
            <h3 className="display mt-3 text-3xl leading-tight md:text-4xl">
              Intention-Driven Development, run by <em className="italic">agents</em>.
            </h3>
          </div>
          <div className="md:col-span-7">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              Every piece of work starts as an intention, captured as a structured, agent-ready GitHub issue.{' '}
              <span className="font-medium text-[var(--text-primary)]">IDD</span> turns it into a
              work order; my skill set triages, resolves, reviews and self-checks it, and ships a
              tested PR. Chain that together and it runs for days without me in the loop — what
              friends call my software factory. Most of the apps below were built this way.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="https://luongnv.com/idd"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link text-sm"
              >
                IDD toolkit
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://github.com/luongnv89/skills"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link text-sm"
              >
                My skill set
                <ArrowUpRight size={14} />
              </a>
            </div>
            <p className="mt-5 font-mono text-xs leading-6 text-[var(--text-muted)]">
              issue → analysis → resolve → review → self-check → PR
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-[var(--border)] pt-6">
          <span className="eyebrow">Toolbox</span>
          <span className="font-mono text-sm text-[var(--text-secondary)]">
            Python · TypeScript · Shell · Node.js · Docker · CI/CD · GitHub Actions · Linux
          </span>
        </div>
      </div>
    </section>
  )
}
