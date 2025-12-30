# luongnv.com

Personal portfolio website for **Luong Nguyen** - Senior AI & Cybersecurity Engineer.

**Live site:** [https://luongnv.com](https://luongnv.com)

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** GitHub Pages + GitHub Actions

## Features

- Dark/Light mode with system preference detection
- Matrix rain background animation (pause by hovering avatar)
- Live GitHub stats fetching
- Responsive design (mobile, tablet, desktop)
- SEO optimized with Schema.org structured data
- Smooth scroll navigation

## Project Structure

```
.
├── portfolio-v2/          # React source code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities
│   │   ├── data/          # Static data (projects)
│   │   └── styles/        # Global CSS
│   ├── public/            # Static assets
│   └── package.json
├── .github/workflows/     # GitHub Actions CI/CD
├── 2025-ares/             # LLM Security presentation
├── img/                   # Shared images
└── CNAME                  # Custom domain config
```

## Development

```bash
cd portfolio-v2
npm install
npm run dev     # Start dev server at localhost:5173
npm run build   # Build for production
```

## Deployment

Push to `master` branch triggers automatic deployment via GitHub Actions.

The workflow:
1. Builds the React app
2. Copies legacy assets (presentations, images)
3. Deploys to GitHub Pages

## Contact

- **GitHub:** [@luongnv89](https://github.com/luongnv89)
- **LinkedIn:** [luongnv89](https://linkedin.com/in/luongnv89)
- **Twitter:** [@luongnv89](https://twitter.com/luongnv89)
- **Bluesky:** [@luongnv89.bsky.social](https://bsky.app/profile/luongnv89.bsky.social)
- **Medium:** [@luongnv89](https://medium.com/@luongnv89)

## License

MIT
