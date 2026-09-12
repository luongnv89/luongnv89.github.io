import { SectionHeader } from './ui/SectionHeader'
import portfolioData from '@/data/portfolio.json'

// Kept fresh by the daily stats cron that rewrites portfolio.json
const claudeHowtoStarsK = Math.floor(
  (portfolioData.projects.find((p) => p.name === 'claude-howto')?.stars ?? 39000) / 1000
)

const facts: Array<{ term: string; value: React.ReactNode }> = [
  { term: 'Location', value: 'Paris, France' },
  { term: 'Role', value: 'Research engineer, Montimage' },
  { term: 'Experience', value: '15+ years' },
  { term: 'Focus', value: 'AI agents · Agent skills · Network security' },
  {
    term: 'Writing',
    value: (
      <>
        <a
          href="https://medium.com/@luongnv89"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-[var(--border-hover)] underline-offset-4"
        >
          Medium
        </a>
        {' · '}
        <a
          href="https://luongnv89.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-[var(--border-hover)] underline-offset-4"
        >
          Substack
        </a>
      </>
    ),
  },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionHeader
            index="01"
            label="About"
            title="Engineer first, driven by curiosity."
          />

          <div className="space-y-5">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              I'm a research engineer at{' '}
              <span className="text-[var(--text-primary)] font-medium">Montimage</span> in
              Paris, France, hardening networks through deep packet inspection and European
              cybersecurity research. Fifteen-plus years in, I'm still an engineer who likes
              hard problems.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              My edge is the overlap of AI and security: network-security engineering paired
              with AI developer tooling people actually use. claude-howto, my visual guide to
              Claude Code, has passed{' '}
              <span className="text-accent font-medium">
                {claudeHowtoStarsK},000 GitHub stars
              </span>
              , and asm, Milo and TextWiz are in developers' hands every day.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Engineering is only half of it. I work in a loop of{' '}
              <span className="text-[var(--text-primary)] font-medium">
                learning, building, sharing and connecting
              </span>{' '}
              — that's what keeps me going.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <dl className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] divide-y divide-[var(--border)]">
            {facts.map(({ term, value }) => (
              <div key={term} className="flex justify-between gap-6 px-5 py-4">
                <dt className="eyebrow">{term}</dt>
                <dd className="text-sm text-right text-[var(--text-primary)]">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">
            learn → build → share → connect
          </p>
        </div>
      </div>
    </section>
  )
}
