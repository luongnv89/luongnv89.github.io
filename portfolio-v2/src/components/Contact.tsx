import { Mail, Github, Linkedin, Twitter, MapPin } from 'lucide-react'

const socials = [
  { icon: Github, url: 'https://github.com/luongnv89', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/luongnv89', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/luongnv89', label: 'Twitter' },
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
            <span className="text-[var(--text-muted)]">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for opportunities
            </span>
          </div>

          <a
            href="mailto:luongnv89@gmail.com"
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            <Mail size={18} />
            Say Hello
          </a>

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
