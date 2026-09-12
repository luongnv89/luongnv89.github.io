/**
 * Static ambient backdrop — pure CSS, no canvas or JS animation. Three stacked
 * layers: a top glow keyed to the accent token, a dot grid that fades out down
 * the page, and an SVG-noise grain. The .grain class carries the per-theme
 * opacity (see globals.css) so the noise stays subtle in both themes.
 */
const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function AmbientBackground() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      {/* Top glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(60% 45% at 50% 0%, var(--accent-glow), transparent 70%)',
        }}
      />
      {/* Dot grid, masked to fade out down the page */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.55) 50%, rgba(0,0,0,.2) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.55) 50%, rgba(0,0,0,.2) 100%)',
        }}
      />
      {/* Film grain */}
      <div
        className="grain absolute inset-0"
        style={{ backgroundImage: GRAIN_SVG, mixBlendMode: 'overlay' }}
      />
    </div>
  )
}
