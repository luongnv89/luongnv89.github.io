import { Mail, Github, Linkedin, Twitter, MapPin, FileText, Download } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'

// Bluesky icon component (not in lucide-react)
function BlueskyIcon({ size = 20 }: { size?: number }) {
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

function SubstackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 5h16v2H4z" />
      <path d="M4 9h16v2H4z" />
      <path d="M4 13h10v2H4z" />
      <path d="M13.5 13h6.5l-3.25 4z" />
    </svg>
  )
}

const socials = [
  { icon: Github, url: 'https://github.com/luongnv89', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/luongnv89', label: 'Twitter' },
  { icon: SubstackIcon, url: 'https://luongnv89.substack.com/', label: 'Substack' },
  { icon: BlueskyIcon, url: 'https://bsky.app/profile/luongnv89.bsky.social', label: 'Bluesky' },
]

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            index="06"
            label="Contact"
            title="Let's build something secure and useful."
            lede="Consulting, collaboration on AI agent tooling or network security, or just a hello — my inbox is open."
            align="center"
            className="mb-8"
          />

          <a
            href="mailto:luongnv89@gmail.com"
            className="font-mono text-lg md:text-xl text-[var(--text-primary)] underline decoration-[var(--border-hover)] underline-offset-8 hover:decoration-[var(--accent)]"
          >
            luongnv89@gmail.com
          </a>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="mailto:luongnv89@gmail.com" className="btn-primary">
              <Mail size={16} />
              Say hello
            </a>
            <a
              href="/cv/cv.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <FileText size={16} />
              View CV
            </a>
            <a href="/cv/Luong_NGUYEN_CV.pdf" download className="btn-secondary">
              <Download size={16} />
              Download PDF
            </a>
          </div>

          <p className="mt-8 flex justify-center items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
            <MapPin size={14} />
            Paris, France · CET
          </p>

          <div className="mt-6 flex justify-center gap-3">
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
        </div>
      </div>
    </section>
  )
}
