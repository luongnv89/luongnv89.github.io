# Portfolio Design Specification

**Author**: Luong Nguyen (@luongnv89)
**Stack**: React (Vite + Bun), Tailwind CSS, shadcn/ui, lucide-icons
**Theme**: Clean, professional, 3D depth with neon green highlights

---

## 1. Section Layout

| Section | Purpose | Key Elements |
|---------|---------|--------------|
| **Hero** | First impression, identity | Avatar, name, tagline, social links, GitHub stats badge |
| **About** | Professional summary | Bio text, location, experience years, tech focus areas |
| **Projects** | Showcase work | Pinned repos grid (6 cards), language badges, star counts |
| **Skills** | Technical expertise | Categorized skill tags (AI/ML, Security, Backend, Tools) |
| **Blog** | Thought leadership | Article cards with date, title, excerpt (optional section) |
| **Contact** | Call-to-action | Email link, social links, availability status |
| **Footer** | Closing | Copyright, quick links, theme credit |

---

## 2. Color System

### Base Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--bg-primary` | `#ffffff` | `#0a0a0a` | Page background |
| `--bg-secondary` | `#f9fafb` | `#111111` | Card backgrounds, sections |
| `--bg-tertiary` | `#f3f4f6` | `#1a1a1a` | Hover states, code blocks |
| `--text-primary` | `#111111` | `#fafafa` | Headings, body text |
| `--text-secondary` | `#6b7280` | `#a1a1a1` | Muted text, labels |
| `--text-muted` | `#9ca3af` | `#737373` | Placeholders, captions |
| `--border` | `#e5e7eb` | `#262626` | Card borders, dividers |
| `--border-hover` | `#d1d5db` | `#404040` | Hover border state |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#00ff41` | Highlights (text, borders, icons) |
| `--accent-hover` | `#00cc33` | Hover state for accent |
| `--accent-glow` | `rgba(0,255,65,0.15)` | Subtle glow/shadow |

### Status Colors (Text Only)

| Token | Value | Usage |
|-------|-------|-------|
| `--danger` | `#ef4444` | Error text only |
| `--warning` | `#f59e0b` | Warning text only |
| `--info` | `#3b82f6` | Info text only |

---

## 3. Component Library

### Layout Components

| Component | Description | Key Classes |
|-----------|-------------|-------------|
| `Container` | Max-width wrapper | `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` |
| `Section` | Full-width section | `py-16 md:py-24` |
| `Grid` | Responsive grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |

### UI Components

| Component | Description | Key Classes |
|-----------|-------------|-------------|
| `Card` | Elevated container | `bg-secondary rounded-xl border border-border shadow-sm hover:border-accent transition-colors` |
| `Button` | Primary action | `px-4 py-2 rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-black transition-all` |
| `Badge` | Skill/language tag | `px-3 py-1 text-sm rounded-full border border-border text-secondary` |
| `IconButton` | Social link | `w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors` |
| `Divider` | Section separator | `h-px bg-border my-8` |

### Section Components

| Component | Description | Props |
|-----------|-------------|-------|
| `Hero` | Landing section | `name`, `tagline`, `avatar`, `socials` |
| `AboutSection` | Bio + highlights | `bio`, `highlights[]` |
| `ProjectCard` | Repo showcase | `name`, `description`, `language`, `stars`, `url` |
| `SkillGroup` | Category + tags | `title`, `skills[]` |
| `BlogCard` | Article preview | `title`, `date`, `excerpt`, `url` |
| `ContactSection` | CTA + links | `email`, `socials`, `status` |
| `Footer` | Site footer | `year`, `links[]` |

---

## 4. Visual Depth System

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
--shadow-accent: 0 0 20px rgba(0,255,65,0.15);
```

### 3D Effects

| Effect | Application | CSS |
|--------|-------------|-----|
| Card lift | Hover on cards | `transform: translateY(-2px)` |
| Border glow | Focus/active states | `box-shadow: 0 0 0 2px var(--accent-glow)` |
| Inset border | Depth on sections | `border-l-2 border-accent` |

---

## 5. Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | `text-4xl md:text-5xl` | `font-bold` | `leading-tight` |
| H2 | `text-2xl md:text-3xl` | `font-semibold` | `leading-snug` |
| H3 | `text-xl` | `font-semibold` | `leading-normal` |
| Body | `text-base` | `font-normal` | `leading-relaxed` |
| Small | `text-sm` | `font-normal` | `leading-normal` |
| Code | `text-sm font-mono` | `font-medium` | `leading-normal` |

---

## 6. Spacing System

Using Tailwind's default scale:
- Section padding: `py-16 md:py-24`
- Component gaps: `gap-4`, `gap-6`, `gap-8`
- Content margins: `mb-4`, `mb-6`, `mb-8`

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `sm` | 640px | 2-column grids |
| `md` | 768px | Navigation visible, larger text |
| `lg` | 1024px | 3-column grids |
| `xl` | 1280px | Max container width |

---

## 8. Accessibility

### Contrast Ratios (WCAG AA)

| Pair | Light Mode | Dark Mode |
|------|-----------|-----------|
| Text on bg-primary | 15:1 (#111 on #fff) | 15:1 (#fafafa on #0a0a0a) |
| Text-secondary on bg | 4.6:1 | 4.8:1 |
| Accent on bg | 2.8:1 (decorative only) | 8:1 |

### Focus States

```css
.focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Motion

- Respect `prefers-reduced-motion`
- All animations < 300ms
- No autoplaying animations

---

## 9. Dark Mode Implementation

Toggle with `class="dark"` on `<html>`:

```css
/* Tailwind config */
darkMode: 'class'

/* Usage */
<div class="bg-white dark:bg-[#0a0a0a]">
```

Persist preference in `localStorage`:
```js
const theme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
```

---

## 10. File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── Footer.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── ProjectCard.tsx
│   ├── Skills.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── utils.ts         # cn() helper
│   └── github.ts        # GitHub API fetch
├── data/
│   └── projects.json    # Pinned projects data
├── hooks/
│   └── useTheme.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

---

## 11. GitHub Data Schema

### Pinned Projects (Static)

```json
{
  "projects": [
    {
      "name": "claude-howto",
      "description": "Complete collection of examples for Claude Code",
      "language": "Python",
      "stars": 666,
      "url": "https://github.com/luongnv89/claude-howto"
    }
  ]
}
```

### GitHub Stats (API Fetch)

```ts
interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
}
```

Endpoint: `https://api.github.com/users/luongnv89`

---

## 12. Component Snippets

### ThemeToggle

```tsx
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 w-10 h-10 rounded-full border border-border
                 flex items-center justify-center hover:border-accent
                 hover:text-accent transition-colors z-50"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

### ProjectCard

```tsx
export function ProjectCard({ name, description, language, stars, url }: Project) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 rounded-xl border border-border bg-secondary
                 hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <Folder className="w-5 h-5 text-accent" />
        <div className="flex items-center gap-1 text-sm text-muted">
          <Star className="w-4 h-4" />
          <span>{stars}</span>
        </div>
      </div>
      <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="text-sm text-secondary mt-2 line-clamp-2">{description}</p>
      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-accent" />
          {language}
        </span>
      </div>
    </a>
  );
}
```

### Hero Section

```tsx
export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20">
      <img
        src="/avatar.png"
        alt="Luong Nguyen"
        className="w-32 h-32 rounded-full border-2 border-border
                   grayscale hover:grayscale-0 transition-all duration-300"
      />
      <h1 className="mt-6 text-4xl md:text-5xl font-bold">
        @luongnv89
      </h1>
      <p className="mt-4 text-lg text-secondary max-w-md text-center">
        Software Engineer with 10+ years building secure, scalable systems
        and AI-powered applications.
      </p>
      <div className="flex gap-4 mt-8">
        {socials.map(({ icon: Icon, url, label }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-border
                       flex items-center justify-center
                       hover:border-accent hover:text-accent transition-colors"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}
```
