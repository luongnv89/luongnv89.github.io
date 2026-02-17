import { Mail, Github, Linkedin, Twitter, MapPin, FileText, Download } from 'lucide-react'

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

const socials = [
  { icon: Github, url: 'https://github.com/luongnv89', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/luongnv89', label: 'Twitter' },
  { icon: BlueskyIcon, url: 'https://bsky.app/profile/luongnv89.bsky.social', label: 'Bluesky' },
]

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </p>

          <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] mb-8">
            <MapPin size={16} className="text-accent" />
            <span>Paris, France</span>
          </div>

          <a
            href="mailto:luongnv89@gmail.com"
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            <Mail size={18} />
            Say Hello
          </a>

          {/* CV Links */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <a
              href="/cv/cv.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
              aria-label="View CV"
            >
              <FileText size={18} />
              View CV
            </a>
            <a
              href="/cv/Luong_NGUYEN_CV.pdf"
              download
              className="btn-secondary inline-flex items-center gap-2"
              aria-label="Download CV as PDF"
            >
              <Download size={18} />
              Download PDF
            </a>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            {socials.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn w-12 h-12 focus-ring"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
