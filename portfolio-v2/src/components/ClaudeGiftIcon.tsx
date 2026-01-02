import { useState } from 'react'
import { Gift } from 'lucide-react'
import { useScrollSectionVisibility } from '@/hooks/useScrollSectionVisibility'

export function ClaudeGiftIcon() {
  const [showTooltip, setShowTooltip] = useState(false)
  const isProjectsVisible = useScrollSectionVisibility('projects')

  const handleClick = () => {
    window.open('/claude-tools', '_blank')
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      className={`fixed top-6 right-20 w-[72px] h-[72px] rounded-full border-2
                  bg-[var(--bg-secondary)] flex items-center justify-center
                  hover:border-accent hover:shadow-accent transition-all duration-300 z-50
                  ${isProjectsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
      aria-label="For Claude Users - Discover tools to enhance your Claude experience"
    >
      <Gift
        size={33}
        className={`text-accent ${isProjectsVisible ? 'animate-gift-bounce' : ''}`}
      />

      {showTooltip && (
        <div
          className="absolute top-full mt-2 right-0 px-3 py-2 rounded-lg text-sm
                     bg-[var(--bg-tertiary)] border border-[var(--border)]
                     text-[var(--text-primary)] whitespace-nowrap shadow-lg"
          role="tooltip"
        >
          Using Claude? Check out my tools for you!
          <div className="absolute -top-1.5 right-4 w-3 h-3 rotate-45
                          bg-[var(--bg-tertiary)] border-l border-t border-[var(--border)]" />
        </div>
      )}
    </button>
  )
}
