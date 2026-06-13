#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BUILDSPACE = join(ROOT, '..')
const DEST = join(ROOT, 'public/images/projects')
const PORTFOLIO = join(ROOT, 'src/data/portfolio.json')
const PROJECTS = join(ROOT, 'src/data/projects.json')

/** portfolio name -> local repo folder under buildspace */
const REPO_DIRS = {
  'claude-howto': 'claude-howto',
  'agent-skill-manager': 'asm',
  skills: 'skills',
  'cc-context-stats': 'context-stats',
  'music-cli': 'music-cli',
  ccl: 'ccl',
  'sleek-ui': 'sleek-ui',
  idd: 'idd',
  'voice-cast': 'voicecast',
  'vscode-markdown-preview': 'vscode-markdown-preview',
  'repo-insights': 'repo-insights',
  'doc-bases': 'doc-bases',
  'bluetooth-diagnostic': 'bluetooth-diagnostic',
  'vscode-theme-neon-green': 'vscode-theme-neon-green',
  'video-to-gif': 'video-to-gif',
  mdoctor: 'mdoctor',
  'git-auto-switch': 'git-auto-switch',
  'slide-speech': 'slide-speech',
  inbash: 'inbash',
  'llm-cli': 'llm-cli',
}

const CANDIDATES = [
  'assets/logo/logo-icon.svg',
  'assets/logo/logo-mark.svg',
  'assets/logo/logo-full.svg',
  'logo-icon.svg',
  'logo.svg',
  'resources/logos/claude-howto-logo.svg',
  'icon.svg',
]

function findLogo(repoDir) {
  for (const rel of CANDIDATES) {
    const p = join(repoDir, rel)
    if (existsSync(p)) return p
  }
  return null
}

const portfolio = JSON.parse(readFileSync(PORTFOLIO, 'utf8'))
const results = []

for (const project of portfolio.projects) {
  const folder = REPO_DIRS[project.name]
  const logoPath = `/images/projects/${project.name}.svg`

  if (!folder) {
    results.push({ name: project.name, status: 'no repo mapping' })
    continue
  }

  const repoDir = join(BUILDSPACE, folder)
  const src = findLogo(repoDir)

  if (!src) {
    results.push({ name: project.name, status: 'no logo in repo', repoDir })
    project.logo = logoPath
    continue
  }

  const destFile = join(DEST, `${project.name}.svg`)
  copyFileSync(src, destFile)
  project.logo = logoPath
  results.push({ name: project.name, status: 'copied', from: src })
}

writeFileSync(PORTFOLIO, `${JSON.stringify(portfolio, null, 2)}\n`)

if (existsSync(PROJECTS)) {
  const projectsFile = JSON.parse(readFileSync(PROJECTS, 'utf8'))
  for (const project of projectsFile.projects) {
    const folder = REPO_DIRS[project.name]
    if (!folder) continue
    const repoDir = join(BUILDSPACE, folder)
    const src = findLogo(repoDir)
    if (src) {
      const destFile = join(DEST, `${project.name}.svg`)
      if (!existsSync(destFile)) copyFileSync(src, destFile)
      project.icon = `/images/projects/${project.name}.svg`
    }
  }
  writeFileSync(PROJECTS, `${JSON.stringify(projectsFile, null, 2)}\n`)
  console.log('✓ updated src/data/projects.json icons')
}

for (const r of results) {
  if (r.status === 'copied') console.log(`✓ ${r.name}`)
  else console.log(`⚠ ${r.name}: ${r.status}${r.repoDir ? ` (${r.repoDir})` : ''}`)
}