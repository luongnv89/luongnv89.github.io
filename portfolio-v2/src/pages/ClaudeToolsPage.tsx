import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Github, ExternalLink, Terminal, BookOpen, BarChart3, ChevronLeft, ChevronRight, X } from 'lucide-react'
import toolsData from '@/data/claude-tools.json'
import { Footer } from '@/components/layout/Footer'

interface ClaudeTool {
  id: string
  name: string
  description: string
  screenshots: string[]
  githubUrl?: string
  websiteUrl?: string
  appStoreUrl?: string
  tags: string[]
  showGithub: boolean
}

const iconMap: Record<string, typeof Terminal> = {
  'claude-howto': BookOpen,
  'claude-statusline': Terminal,
  'custats': BarChart3,
}

function ImageModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  name,
}: {
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  name: string
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                   flex items-center justify-center text-white transition-colors"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${name} screenshot ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                         bg-black/50 hover:bg-black/70 flex items-center justify-center
                         text-white transition-colors"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                         bg-black/50 hover:bg-black/70 flex items-center justify-center
                         text-white transition-colors"
              aria-label="Next screenshot"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === currentIndex ? 'bg-accent' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ScreenshotCarousel({
  screenshots,
  name,
  onImageClick,
}: {
  screenshots: string[]
  name: string
  onImageClick: (index: number) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (screenshots.length === 0) return null

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onImageClick(currentIndex)
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
      <img
        src={screenshots[currentIndex]}
        alt={`${name} screenshot ${currentIndex + 1}`}
        className="w-full h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
        onClick={handleImageClick}
      />

      {screenshots.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                       bg-black/50 hover:bg-black/70 flex items-center justify-center
                       text-white transition-colors"
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                       bg-black/50 hover:bg-black/70 flex items-center justify-center
                       text-white transition-colors"
            aria-label="Next screenshot"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-accent' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ClaudeToolCard({ tool, onOpenModal }: { tool: ClaudeTool; onOpenModal: (screenshots: string[], index: number, name: string) => void }) {
  const Icon = iconMap[tool.id] || Terminal
  const linkUrl = tool.websiteUrl || tool.githubUrl || '#'
  const hasScreenshots = tool.screenshots.length > 0

  const handleImageClick = (index: number) => {
    onOpenModal(tool.screenshots, index, tool.name)
  }

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="mb-4">
        {hasScreenshots ? (
          <ScreenshotCarousel
            screenshots={tool.screenshots}
            name={tool.name}
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)]
                          flex items-center justify-center overflow-hidden">
            <Icon size={64} className="text-black opacity-80" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between mb-2">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-semibold text-lg text-[var(--text-primary)] hover:text-accent transition-colors"
        >
          {tool.name}
          <ExternalLink className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <p className="text-sm text-[var(--text-secondary)] flex-1 mb-4">
        {tool.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="badge text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      {(tool.showGithub || tool.appStoreUrl || tool.websiteUrl) && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-3 flex-wrap">
          {tool.appStoreUrl && (
            <a
              href={tool.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>App Store</span>
            </a>
          )}
          {tool.websiteUrl && (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-accent transition-colors"
            >
              <ExternalLink size={16} />
              <span>Website</span>
            </a>
          )}
          {tool.showGithub && tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-accent transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function ClaudeToolsPage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    screenshots: string[]
    currentIndex: number
    name: string
  }>({
    isOpen: false,
    screenshots: [],
    currentIndex: 0,
    name: '',
  })

  const openModal = (screenshots: string[], index: number, name: string) => {
    setModalState({ isOpen: true, screenshots, currentIndex: index, name })
  }

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const goToPrev = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.screenshots.length - 1 : prev.currentIndex - 1,
    }))
  }

  const goToNext = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === prev.screenshots.length - 1 ? 0 : prev.currentIndex + 1,
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container-custom py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            For Claude Users
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            Tools and resources I've built to enhance your Claude experience.
            Whether you're using Claude Code, the API, or the web interface, these projects
            help you work smarter and get more out of Claude.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsData.tools.map((tool) => (
            <ClaudeToolCard
              key={tool.id}
              tool={tool as ClaudeTool}
              onOpenModal={openModal}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            More tools coming soon! Have a suggestion?{' '}
            <a
              href="https://github.com/luongnv89"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Let me know on GitHub
            </a>
          </p>
        </div>
      </div>

      {modalState.isOpen && (
        <ImageModal
          images={modalState.screenshots}
          currentIndex={modalState.currentIndex}
          onClose={closeModal}
          onPrev={goToPrev}
          onNext={goToNext}
          name={modalState.name}
        />
      )}

      <Footer />
    </div>
  )
}
