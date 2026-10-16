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
    title: 'Security',
    description:
      'Security R&D at Montimage since 2014: deep packet inspection, LLMs for security, MCP servers and cybersecurity digital twins.',
    tags: [
      'DPI',
      'MMT',
      'LLMs for security',
      'MCP servers',
      'Digital twins',
      'Phishing defense',
    ],
    related: { name: 'mitre-mcp', url: 'https://github.com/Montimage/mitre-mcp' },
  },
]

const strong = 'font-medium text-[var(--text-primary)]'

const highlights = [
  {
    eyebrow: 'Method',
    heading: (
      <>
        Intention-Driven Development, run by <em className="italic">agents</em>.
      </>
    ),
    body: (
      <>
        Every piece of work starts as an intention, captured as a structured, agent-ready GitHub
        issue. <span className={strong}>IDD</span> turns it into a work order; my skill set
        triages, resolves, reviews and self-checks it, and ships a tested PR. Chain that together
        and it runs for days without me in the loop — what friends call my software factory. Most
        of the apps below were built this way.
      </>
    ),
    links: [
      { label: 'IDD toolkit', url: 'https://luongnv.com/idd' },
      { label: 'My skill set', url: 'https://github.com/luongnv89/skills' },
    ],
    footnote: 'issue → analysis → resolve → review → self-check → PR',
  },
  {
    eyebrow: 'Tooling',
    heading: (
      <>
        One skill manager for <em className="italic">every</em> agent.
      </>
    ),
    body: (
      <>
        Skills are how agents learn the way a team works. <span className={strong}>asm</span>{' '}
        installs, audits and organizes them across 21 coding agents, from a catalog of 6,000+
        skills, with security scanning before anything lands. It is also how the skill set behind
        IDD reaches every agent I run.
      </>
    ),
    links: [
      { label: 'asm', url: 'https://luongnv.com/asm' },
      { label: 'GitHub', url: 'https://github.com/luongnv89/agent-skill-manager' },
    ],
    footnote: 'Claude Code · Codex · Cursor · +18 more agents',
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
          lede="Three threads, one loop: agents that do real engineering work, the skills that teach them how a team works, and the security research that keeps it all honest."
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

        {/* Highlights: how the three threads combine in practice */}
        {highlights.map(({ eyebrow, heading, body, links, footnote }) => (
          <div key={eyebrow} className="card mt-5 grid gap-6 p-6 md:grid-cols-12 md:p-8">
            <div className="md:col-span-5">
              <p className="eyebrow">{eyebrow}</p>
              <h3 className="display mt-3 text-3xl leading-tight md:text-4xl">{heading}</h3>
            </div>
            <div className="md:col-span-7">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {body}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {links.map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link text-sm"
                  >
                    {label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
              <p className="mt-5 font-mono text-xs leading-6 text-[var(--text-muted)]">
                {footnote}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-[var(--border)] pt-6">
          <span className="eyebrow">Toolbox</span>
          <span className="font-mono text-sm text-[var(--text-secondary)]">
            Python · C/C++ · TypeScript · Swift · LangGraph · MCP · Docker · Kubernetes · CI/CD · Linux
          </span>
        </div>
      </div>
    </section>
  )
}
