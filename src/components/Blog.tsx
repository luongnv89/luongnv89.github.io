import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'

const posts = [
  {
    title: 'How I Use DeepSeek V4 Flash and GLM 5.3 Flash for Free (Every Day)',
    date: '2026-09-09',
    excerpt: 'A step-by-step setup — free Cline account, 9router, and your favourite harness — that gives you 15M tokens per model per day of GLM 5.3 Flash, DeepSeek V4 Flash and Longcat 2.0, wired into Claude Code, Codex or Pi.',
    url: 'https://medium.com/@luongnv89/how-i-use-deepseek-v4-flash-and-glm-5-3-flash-for-free-everyday-3ebd9c60331a',
    extraLinks: [
      { label: 'Substack', url: 'https://luongnv89.substack.com/p/how-i-use-deepseek-v4-flash-and-glm' },
      { label: 'X', url: 'https://x.com/luongnv89/status/2097437792007758032' },
    ],
  },
  {
    title: 'How to Run Claude Code & Codex with Local Models via llama.cpp, Ollama, LM Studio, and vLLM (2026)',
    date: '2026-04-15',
    excerpt: 'A 2026 hands-on guide to running Claude Code and Codex against local models served by llama.cpp, Ollama, LM Studio, and vLLM — with setup steps, trade-offs, and when to pick each runtime.',
    url: 'https://medium.com/@luongnv89/how-to-run-claude-code-codex-with-local-models-via-llamacpp-ollama-lmstudio-and-vllm-2026-7d00ba7e63a4',
    extraLinks: [
      { label: 'X', url: 'https://x.com/luongnv89/status/2044429396505669844' },
      { label: 'Substack', url: 'https://luongnv89.substack.com/p/how-to-run-claude-code-codex-with' },
    ],
  },
  {
    title: "How I Debugged Claude Code's 9% Cache Spike in One Prompt",
    date: '2026-04-02',
    excerpt: 'One prompt consumed 9% of my session budget. By combining real-time usage tracking and per-interaction cache metrics, I traced the root cause to a 350K token cache recreation after a 13-hour idle gap — and asked Anthropic a hard question about their cache TTL design.',
    url: 'https://x.com/luongnv89/status/2039682376708637046?s=20',
  },
  {
    title: 'How to Use gstack to Build a MVP Step by Step',
    date: '2026-03-29',
    excerpt: 'A practical walkthrough of using gstack to go from idea to working MVP — covering the full workflow from planning to shipping with AI-powered skills.',
    url: 'https://x.com/luongnv89/status/2038386097563001284?s=20',
    extraLinks: [
      { label: 'Medium', url: 'https://medium.com/@luongnv89/how-to-use-gstack-to-build-a-mvp-step-by-step-ceedb6d53f8c' },
      { label: 'Substack', url: 'https://luongnv89.substack.com/p/how-to-use-gstack-to-build-a-mvp?r=h7mbt' },
    ],
  },
  {
    title: "gstack Is Not a Dev Tool. It's Garry Tan's Brain on AI",
    date: '2026-03-18',
    excerpt: 'Why gstack is more than a developer tool — it encodes Garry Tan\'s startup philosophy into an AI-powered workflow.',
    url: 'https://x.com/luongnv89/status/2034387319289950323',
    extraLinks: [
      { label: 'Medium', url: 'https://medium.com/@luongnv89/gstack-is-not-a-dev-tool-its-garry-tan-s-brain-on-ai-b813e09b32c7' },
      { label: 'Substack', url: 'https://open.substack.com/pub/luongnv89/p/gstack-is-not-a-dev-tool-its-garry' },
    ],
  },
  {
    title: 'Compatibility Debt Is Killing Perfectly Good Devices',
    date: '2026-02-18',
    excerpt: 'How one Vite compatibility tweak revived an iPad mini 2, and why intentional legacy support still matters for real users.',
    url: 'https://x.com/luongnv89/status/2024141687384060382?s=20',
  },
  {
    title: 'Run Claude Code with Local & Cloud Models in 5 Minutes (Ollama, LM Studio, llama.cpp, OpenRouter)',
    date: '2026-01-31',
    excerpt: 'An updated, practical guide to run Claude Code with local and cloud models using Ollama, LM Studio, llama.cpp, and OpenRouter.',
    url: 'https://medium.com/@luongnv89/run-claude-code-on-local-cloud-models-in-5-minutes-ollama-openrouter-llama-cpp-6dfeaee03cda',
  },
  {
    title: 'Closing the Gap Between MVP and Production with feature-dev (an official plugin from Anthropic)',
    date: '2025-12-28',
    excerpt: 'How feature-dev helps bridge MVP to production with tests, CI/CD, linting, and docs in a structured workflow.',
    url: 'https://medium.com/@luongnv89/closing-the-gap-between-mvp-and-production-with-feature-dev-an-official-plugin-from-anthropic-444e2f00a0ad',
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
    <section id="blog" className="section">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SectionHeader
            index="05"
            label="Writing"
            title="Latest writing"
            lede="Notes on AI agents, security and the craft of shipping software."
            className="mb-0"
          />
          <a
            className="btn-link mt-8 text-sm"
            href="https://medium.com/@luongnv89"
            target="_blank"
            rel="noopener noreferrer"
          >
            All articles on Medium
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="lg:col-span-8">
          <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {posts.slice(0, 6).map((post) => (
              <li key={post.title} className="py-5 grid sm:grid-cols-[7rem_1fr] gap-x-6 gap-y-2">
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-[var(--text-muted)] pt-1"
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg font-medium leading-snug text-[var(--text-primary)] hover:underline decoration-[var(--border-hover)] underline-offset-4 focus-ring"
                  >
                    {post.title}
                  </a>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {post.excerpt}
                  </p>
                  {post.extraLinks && (
                    <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
                      Also on:{' '}
                      {post.extraLinks.map((link, i) => (
                        <span key={link.label}>
                          {i > 0 && ' · '}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline decoration-[var(--border-hover)] underline-offset-2"
                          >
                            {link.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
