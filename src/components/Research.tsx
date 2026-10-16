import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'

interface Highlight {
  title: string
  description: string
  links?: Array<{ label: string; url: string }>
}

interface Publication {
  venue: string
  year: number
  title: string
  links?: Array<{ label: string; url: string }>
}

const highlights: Highlight[] = [
  {
    title: 'LLMs for security',
    description:
      'A fine-tuning pipeline for small security models: synthetic data, LLM-as-judge filtering, Unsloth/LoRA, and local deployment with Ollama.',
  },
  {
    title: 'MCP servers',
    description:
      'Open-source servers on PyPI and the official MCP Registry that give AI assistants MITRE ATT&CK knowledge and threat-intelligence checks.',
    links: [
      { label: 'mitre-mcp', url: 'https://github.com/Montimage/mitre-mcp' },
      { label: 'sec-mcp', url: 'https://github.com/Montimage/sec-mcp' },
    ],
  },
  {
    title: 'Deep packet inspection',
    description:
      "Lead developer of MMT-DPI, Montimage's C packet-inspection engine (~80% of commits since 2015), including its 2026 hardening overhaul.",
    links: [{ label: 'mmt-dpi', url: 'https://github.com/Montimage/mmt-dpi' }],
  },
  {
    title: 'Phishing defense',
    description:
      'A gamified awareness-training platform in 5 languages, an LLM-based email analysis service, and the GEIGER cyber range (900+ users).',
  },
  {
    title: 'Digital twins',
    description:
      'COGNIMAN industrial pilot software, the secSIM cybersecurity twin platform, and the TaS IoT test and simulation platform.',
    links: [{ label: 'tas', url: 'https://github.com/Montimage/tas' }],
  },
  {
    title: 'Community',
    description:
      "Organizing Committee for IEEE CloudCom 2026 and IFIP ICTSS 2026 in Paris; built both conferences' registration and payment platforms.",
  },
]

const publications: Publication[] = [
  {
    venue: 'ICTSS',
    year: 2026,
    title: 'SecSIM: A Digital Twin Management System for Simulation-Driven Cybersecurity Assessment',
  },
  {
    venue: 'ARES',
    year: 2025,
    title: 'LLMs in Security Testing and Monitoring: An Initial Study',
    links: [
      { label: 'DOI', url: 'https://doi.org/10.1007/978-3-032-00644-8_9' },
      { label: 'Slides', url: '/2025-ares/' },
    ],
  },
  {
    venue: 'IFIP IoT',
    year: 2024,
    title: 'SINDIT: A Framework for Knowledge Graph-Based Digital Twins in Smart Manufacturing',
  },
  {
    venue: 'QUATIC',
    year: 2022,
    title: 'Digital Twin for IoT Environments: A Testing and Simulation Tool',
  },
  {
    venue: 'Book chapter',
    year: 2021,
    title: 'Validation, Verification and Root-Cause Analysis — DevOps for Trustworthy Smart IoT Systems',
  },
  {
    venue: 'IEEE TIFS',
    year: 2019,
    title: 'Reliable Detection of Interest Flooding Attack in Real Deployment of Named Data Networking',
  },
  {
    venue: 'IEEE WF-IoT',
    year: 2014,
    title: 'DPWSim: A Simulation Toolkit for IoT Applications Using Devices Profile for Web Services',
    links: [{ label: 'IEEE', url: 'https://ieeexplore.ieee.org/document/6803226' }],
  },
]

const euProjects = [
  'COGNIMAN',
  'SECASSURED',
  'AIAgent4Cyber',
  'NERO',
  'CyberSuite',
  'INTACT',
  'GEIGER',
  'PUZZLE',
  'ENACT',
]

const inlineLinkClass =
  'inline-flex items-center gap-1 hover:text-[var(--text-primary)] hover:underline decoration-[var(--border-hover)] underline-offset-2'

function InlineLinks({ links }: { links: Array<{ label: string; url: string }> }) {
  return (
    <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
      {links.map((link, i) => (
        <span key={link.label}>
          {i > 0 && ' · '}
          <a
            href={link.url}
            target={link.url.startsWith('/') ? undefined : '_blank'}
            rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
            className={inlineLinkClass}
          >
            {link.label}
            <ArrowUpRight size={12} />
          </a>
        </span>
      ))}
    </p>
  )
}

export function Research() {
  return (
    <section id="research" className="section">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SectionHeader
            index="03"
            label="Research"
            title="Security R&D at Montimage"
            lede="Senior Software Engineer since 2014, leading development on European research projects in cybersecurity, digital twins and applied AI."
            className="mb-0"
          />
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <p className="eyebrow">EU projects</p>
            <p className="mt-3 font-mono text-sm leading-7 text-[var(--text-secondary)]">
              {euProjects.join(' · ')}
            </p>
            <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
              H2020 · Horizon Europe · Digital Europe
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="grid sm:grid-cols-2 gap-x-8 border-t border-[var(--border)]">
            {highlights.map(({ title, description, links }) => (
              <div key={title} className="border-b border-[var(--border)] py-5">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {description}
                </p>
                {links && <InlineLinks links={links} />}
              </div>
            ))}
          </div>

          <h3 className="eyebrow mt-12">Selected publications</h3>
          <ol className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {publications.map(({ venue, year, title, links }) => (
              <li key={title} className="py-4 grid sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-1">
                <span className="font-mono text-xs text-[var(--text-muted)] pt-1">
                  {venue} {year}
                </span>
                <div>
                  <p className="text-sm md:text-base leading-snug text-[var(--text-primary)]">
                    {title}
                  </p>
                  {links && <InlineLinks links={links} />}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
