import { Github, Linkedin, Twitter, Star, Users, FolderGit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchGitHubStats, type GitHubStats } from '@/lib/github'

const socials = [
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/luongnv89', label: 'Twitter' },
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
                   grayscale hover:grayscale-0 hover:border-accent transition-all duration-300"
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
