import { ArrowRight, Calendar } from 'lucide-react'

const posts = [
  {
    title: 'Getting Started with Claude Code',
    date: '2024-12-15',
    excerpt: 'A comprehensive guide to using Claude Code for your development workflow.',
    url: 'https://github.com/luongnv89/claude-howto',
  },
  {
    title: 'Building RAG Systems for Documentation',
    date: '2024-11-20',
    excerpt: 'How to create effective retrieval-augmented generation systems for code documentation.',
    url: 'https://github.com/luongnv89/doc-bases',
  },
  {
    title: 'LLMs in Security Testing and Monitoring',
    date: '2024-10-10',
    excerpt: 'Exploring the intersection of AI and cybersecurity in modern applications.',
    url: '/2025-ares/',
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

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(({ title, date, excerpt, url }) => (
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
      </div>
    </section>
  )
}
