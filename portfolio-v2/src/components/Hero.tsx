import { Github, Linkedin, Twitter, Star, Users, FolderGit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchGitHubStats, type GitHubStats } from '@/lib/github'

// Bluesky icon component (not in lucide-react)
function BlueskyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
  )
}

const socials = [
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/luongnv89', label: 'Twitter' },
  { icon: BlueskyIcon, url: 'https://bsky.app/profile/luongnv89.bsky.social', label: 'Bluesky' },
  { icon: Github, url: 'https://github.com/luongnv89', label: 'GitHub' },
]

export function Hero() {
  const [stats, setStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    fetchGitHubStats('luongnv89').then(setStats)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <img
        src="/avatar.png"
        alt="Luong Nguyen"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-[var(--border)]
                   hover:border-accent transition-all duration-300"
      />

      <h1 className="mt-6 text-4xl md:text-5xl font-bold text-center">
        <span className="text-accent">@</span>luongnv89
      </h1>

      <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-md text-center leading-relaxed">
        Software Engineer with 10+ years building secure, scalable systems
        and AI-powered applications.
      </p>

      {/* GitHub Stats */}
      {stats && (
        <div className="flex gap-6 mt-6 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-accent" />
            <span>{stats.totalStars} stars</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{stats.followers} followers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderGit2 size={16} />
            <span>{stats.publicRepos} repos</span>
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex gap-4 mt-8">
        {socials.map(({ icon: Icon, url, label }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn focus-ring"
            aria-label={label}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 group"
        aria-label="Scroll to about section"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-2 group-hover:border-accent transition-colors">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </a>
    </section>
  )
}
