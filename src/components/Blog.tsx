import { ArrowRight, Calendar } from 'lucide-react'

const posts = [
  {
    title: 'Run Claude Code on Local/Cloud Models in 5 Minutes',
    date: '2026-02-17',
    excerpt: 'Quick guide to running Claude Code with Ollama, OpenRouter, and Llama.cpp — local and cloud model setups.',
    url: 'https://medium.com/@luongnv89/run-claude-code-on-local-cloud-models-in-5-minutes-ollama-openrouter-llama-cpp-6dfeaee03cda',
  },
  {
    title: '4 Essential Slash Commands I Use in Every Project',
    date: '2025-12-26',
    excerpt: 'Building on the Discovering Claude Code Slash Commands article, focusing on practical workflow commands.',
    url: 'https://medium.com/@luongnv89/4-essential-slash-commands-i-use-in-every-project-2330d87f801f',
  },
  {
    title: 'Claude Code: Memory — Teaching Claude Your Project\'s DNA',
    date: '2025-11-24',
    excerpt: 'Part 2 of the series on discovering and learning Claude Code, exploring how to teach Claude your project context.',
    url: 'https://medium.com/@luongnv89/claude-code-memory-teaching-claude-your-projects-dna-45c4beca6121',
  },
  {
    title: 'Zero-Downtime Development: Run 2 Claude Code Instances in Parallel',
    date: '2025-11-20',
    excerpt: 'How to run two Claude Code instances in parallel to navigate complex architecture decisions.',
    url: 'https://medium.com/@luongnv89/zero-downtime-development-running-claude-code-max-and-minimax-m2-in-parallel-9fa2828ff3ca',
  },
  {
    title: 'Setting Up Claude Code Locally with Open-Source Models',
    date: '2025-11-20',
    excerpt: 'A step-by-step guide for Mac users to set up Claude Code locally with powerful open-source models.',
    url: 'https://medium.com/@luongnv89/setting-up-claude-code-locally-with-a-powerful-open-source-model-a-step-by-step-guide-for-mac-84cf9ab7302f',
  },
  {
    title: 'Discovering Claude Code: Slash Commands',
    date: '2025-11-08',
    excerpt: 'Part 1 of the series exploring powerful features for AI-assisted development with Claude Code.',
    url: 'https://medium.com/@luongnv89/discovering-claude-code-slash-commands-cdc17f0dfb29',
  },
  {
    title: 'Demystifying Network Traffic on macOS with MMT',
    date: '2025-05-02',
    excerpt: 'A Docker-based approach to analyzing network traffic using MMT deep packet inspection tools.',
    url: 'https://medium.com/@luongnv89/demystifying-your-network-traffic-on-macos-a-docker-based-approach-with-mmt-e9d595034c36',
  },
]

export function Blog() {
  return (
    <section id="blog" className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <h2 className="section-title">Latest Writing</h2>
        <p className="section-subtitle max-w-2xl">
          Thoughts on AI, security, and software engineering.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map(({ title, date, excerpt, url }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card p-6 flex flex-col focus-ring"
            >
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                <Calendar size={14} />
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>

              <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                {title}
              </h3>

              <p className="text-sm text-[var(--text-secondary)] mt-2 flex-1">
                {excerpt}
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://medium.com/@luongnv89"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Articles on Medium
          </a>
        </div>
      </div>
    </section>
  )
}
