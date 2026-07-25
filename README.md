# mohammed-alajmi.me

Personal portfolio for **Mohammed Alajmi** ([@DevM7mdAli](https://github.com/DevM7mdAli)) — software engineer, full-stack developer, and app developer.

Live at **[mohammed-alajmi.me](https://mohammed-alajmi.me)**.

## Features

- **Bilingual** — English and Arabic, including full RTL layout, via `react-i18next`.
- **Light/dark theme** with a persisted preference (`zustand` + `localStorage`).
- **Dynamic content** — projects and work experience are fetched from Supabase rather than hardcoded, with categories and tags for filtering.
- **Animated, responsive UI** built with Tailwind CSS and Framer Motion.
- **Contact form** wired to Formspree.
- **SPA routing on GitHub Pages** — a `404.html` redirect trick restores the original path so React Router's own not-found page renders instead of silently falling back to the homepage.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (with [Material Tailwind](https://www.material-tailwind.com/))
- [React Router](https://reactrouter.com/)
- [Supabase](https://supabase.com/) — projects & experience data (Postgres + PostgREST)
- [TanStack Query](https://tanstack.com/query) — data fetching/caching
- [Zustand](https://zustand-demo.pmnd.rs/) — UI state (theme, language)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [react-i18next](https://react.i18next.com/) — localization
- [Formspree](https://formspree.io/) — contact form backend

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)
- A Supabase project (for projects/experience data)

### Install

```bash
pnpm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon/public key:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is read-only by design (enforced via Row-Level Security) — the site only ever reads `projects`, `experiences`, `project_categories`, `tags`, and `project_tags`. See [`supabase/`](./supabase) for the SQL used to seed that data; run those scripts in the Supabase SQL editor with an account that has write access.

### Run the dev server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------- |
| `pnpm dev`      | Start the Vite dev server                         |
| `pnpm build`    | Type-check-free production build to `dist/`       |
| `pnpm preview`  | Preview the production build locally              |
| `pnpm deploy`   | Build and publish `dist/` to GitHub Pages (`gh-pages`) |

## Project Structure

```
src/
├── components/       # UI sections (About, Skills, Experience, projects, ContactMe, NavBar, Footer, Error)
├── data/             # Static profile data (links, resume, etc.)
├── i18n/             # react-i18next setup + en/ar locale files
├── lib/              # Supabase client, shared types, data-fetching helpers
├── stores/           # Zustand stores (theme, language)
├── utils/            # Small shared helpers (typed Framer Motion wrappers, etc.)
├── App.tsx           # Router setup
└── main.tsx          # Entry point

public/               # Static assets, including the GitHub Pages SPA 404 redirect
supabase/              # SQL seed/migration scripts for the projects & experience data
```

## Deployment

The site is a static build deployed to GitHub Pages via `gh-pages`, served under the custom domain in `public/CNAME`:

```bash
pnpm deploy
```

Since GitHub Pages has no server-side routing, `public/404.html` implements the [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect trick, and `index.html` decodes it back into the real path before React Router mounts — so a bad URL correctly shows the app's own 404 page rather than bouncing to the homepage.
