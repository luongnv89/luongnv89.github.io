import { useEffect, useRef, useState } from 'react'
import { useMatrixPause } from '@/hooks/useMatrixPause'

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(true)
  const { isPaused } = useMatrixPause()

  // Watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Characters from welcome message
    const chars = 'welcome to my website @luongnv89'
    const charArray = chars.split('')

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Array to track the y position of each column
    const drops: number[] = Array(columns).fill(1)

    // Array to track the speed of each column (for depth effect)
    const speeds: number[] = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.5)

    // Array to track opacity of each column (for depth effect)
    const opacities: number[] = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.3)

    // Store current characters for each column to keep them stable when paused
    const currentChars: string[] = Array(columns).fill('').map(() =>
      charArray[Math.floor(Math.random() * charArray.length)]
    )

    const draw = () => {
      // When paused, don't update anything - keep current frame frozen
      if (isPaused) return

      // Semi-transparent background to create trail effect
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.05)' : 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Update character randomly
        if (Math.random() > 0.95) {
          currentChars[i] = charArray[Math.floor(Math.random() * charArray.length)]
        }
        const char = currentChars[i]

        // Calculate x position
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Depth-based color (brighter = closer, dimmer = further)
        const brightness = opacities[i]
        const green = Math.floor(255 * brightness)
        const glow = brightness > 0.6

        // Draw glow effect for closer characters
        if (glow && isDark) {
          ctx.shadowBlur = 10
          ctx.shadowColor = '#00ff41'
        } else {
          ctx.shadowBlur = 0
        }

        // Set color with depth-based opacity
        if (isDark) {
          ctx.fillStyle = `rgba(0, ${green}, ${Math.floor(green * 0.25)}, ${brightness})`
        } else {
          // Darker green for light mode - more visible
          ctx.fillStyle = `rgba(0, ${Math.floor(green * 0.8)}, ${Math.floor(green * 0.2)}, ${brightness})`
        }
        ctx.fillText(char, x, y)

        // Reset shadow
        ctx.shadowBlur = 0

        // Reset drop when it reaches bottom or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
          speeds[i] = Math.random() * 0.5 + 0.5
          opacities[i] = Math.random() * 0.5 + 0.3
        }

        // Move drop down based on speed
        drops[i] += speeds[i]
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDark, isPaused])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity: isDark ? 0.15 : 0.12 }}
    />
  )
}
