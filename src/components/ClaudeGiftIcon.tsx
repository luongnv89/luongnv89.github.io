import { useState } from 'react'
import { useScrollSectionVisibility } from '@/hooks/useScrollSectionVisibility'

function ClaudeIcon({ size = 33, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      overflow="visible"
      width={size}
      height={size}
      viewBox="0 0 100 101"
      fill="none"
      className={className}
      role="presentation"
    >
      <path d="M96.0000 40.0000 L99.5002 42.0000 L99.5002 43.5000 L98.5000 47.0000 L56.0000 57.0000 L52.0040 47.0708 L96.0000 40.0000 M96.0000 40.0000 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(330deg) scaleY(1.08245) rotate(-330deg)' }} />
      <path d="M80.1032 10.5903 L84.9968 11.6171 L86.2958 13.2179 L87.5346 17.0540 L87.0213 19.5007 L58.5000 58.5000 L49.0000 49.0000 L75.3008 14.4873 L80.1032 10.5903 M80.1032 10.5903 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(300deg) scaleY(1.05779) rotate(-300deg)' }} />
      <path d="M55.5002 4.5000 L58.5005 2.5000 L61.0002 3.5000 L63.5002 7.0000 L56.6511 48.1620 L52.0005 45.0000 L50.0005 39.5000 L53.5003 8.5000 L55.5002 4.5000 M55.5002 4.5000 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(270deg) scaleY(0.985) rotate(-270deg)' }} />
      <path d="M23.4253 5.1588 L26.5075 1.2217 L28.5175 0.7632 L32.5063 1.3458 L34.4748 2.8868 L48.8202 34.6902 L54.0089 49.8008 L47.9378 53.1760 L24.8009 11.1886 L23.4253 5.1588 M23.4253 5.1588 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(240deg) scaleY(0.925) rotate(-240deg)' }} />
      <path d="M8.4990 27.0019 L7.4999 23.0001 L10.5003 19.5001 L14.0003 20.0001 L15.0003 20.0001 L36.0000 35.5000 L42.5000 40.5000 L51.5000 47.5000 L46.5000 56.0000 L42.0002 52.5000 L39.0001 49.5000 L10.0000 29.0001 L8.4990 27.0019 M8.4990 27.0019 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(210deg) scaleY(1.09) rotate(-210deg)' }} />
      <path d="M2.5003 53.0000 L0.2370 50.5000 L0.2373 48.2759 L2.5003 47.5000 L28.0000 49.0000 L53.0000 51.0000 L52.1885 55.9782 L4.5000 53.5000 L2.5003 53.0000 M2.5003 53.0000 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(180deg) scaleY(1.045) rotate(-180deg)' }} />
      <path d="M17.5002 79.0264 L12.5005 79.0264 L10.5124 76.7369 L10.5124 74.0000 L19.0005 68.0000 L53.5082 46.0337 L57.0005 52.0000 L17.5002 79.0264 M17.5002 79.0264 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(150deg) scaleY(1.06) rotate(-150deg)' }} />
      <path d="M27.0004 92.9999 L25.0003 93.4999 L22.0003 91.9999 L22.5004 89.4999 L52.0003 50.5000 L56.0004 55.9999 L34.0003 85.0000 L27.0004 92.9999 M27.0004 92.9999 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(120deg) scaleY(0.94) rotate(-120deg)' }} />
      <path d="M51.9998 98.0000 L50.5002 100.0000 L47.5002 101.0000 L45.0001 99.0000 L43.5000 96.0000 L51.0003 55.4999 L55.5001 55.9999 L51.9998 98.0000 M51.9998 98.0000 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(90deg) scaleY(0.975879) rotate(-90deg)' }} />
      <path d="M77.5007 86.9997 L77.5007 90.9997 L77.0006 92.4997 L75.0004 93.4997 L71.5006 93.0339 L47.4669 57.2642 L56.9998 50.0002 L64.9994 64.5004 L65.7507 69.7497 L77.5007 86.9997 M77.5007 86.9997 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(60deg) scaleY(1.14755) rotate(-60deg)' }} />
      <path d="M89.0008 80.9991 L89.5008 83.4991 L88.0008 85.4991 L86.5007 84.9991 L78.0007 78.9991 L65.0007 67.4991 L55.0007 60.4991 L58.0000 51.0000 L62.9999 54.0001 L66.0007 59.4991 L89.0008 80.9991 M89.0008 80.9991 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(30deg) scaleY(1.16921) rotate(-30deg)' }} />
      <path d="M82.5003 55.5000 L95.0003 56.5000 L98.0003 58.5000 L100.0000 61.5000 L100.0000 63.6587 L94.5003 66.0000 L66.5005 59.0000 L55.0003 58.5000 L58.0000 48.0000 L66.0005 54.0000 L82.5003 55.5000 M82.5003 55.5000 " fill="currentColor" style={{ transformOrigin: '50px 50px', transform: 'rotate(0deg) scaleY(1.20912) rotate(0deg)' }} />
    </svg>
  )
}

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
      <ClaudeIcon
        size={36}
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
