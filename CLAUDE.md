# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ahmed Ragab's personal portfolio: a static site built with Astro 7, React 19 (islands), and Tailwind CSS 4. Content (blog posts, projects) lives in Astro content collections. Deployed to GitHub Pages via GitHub Actions.

## Commands

This project uses **Yarn 4** (node-modules linker, not PnP) and requires **Node.js >= 22**. Do not use npm.

```bash
yarn dev            # dev server at http://localhost:4321
yarn build          # astro build && pagefind --site dist
yarn preview        # serve the dist/ build locally
yarn check          # astro check (type-checks .astro/.ts/.tsx; needs TypeScript 6.x, see package.json)
yarn test           # vitest (unit/component tests, jsdom)
yarn test:ui        # vitest with UI
yarn test:coverage  # vitest with v8 coverage
yarn test:e2e       # playwright smoke tests in e2e/ against the production build (run `yarn build` first)
```

Run a single vitest file/test: `yarn test src/path/to/file.test.ts` or `yarn test -t "test name"`.

There are no vitest unit tests yet even though vitest/RTL are configured — add specs under `src/` next to the code they cover (jsdom + React Testing Library via `src/test/setup.ts`). Playwright smoke tests live in `e2e/` and run in CI after the build; `playwright.config.ts` serves `dist/` with `yarn preview` under the same `base` as the build (shared via `site.config.mjs`), so they catch asset URLs that ignore the base path. Note: Astro 7 auto-backgrounds `astro preview` when it detects an AI agent environment (e.g. `CLAUDECODE`/`AI_AGENT` env vars), which breaks Playwright's `webServer`; when running e2e as an agent, unset those vars (`env -u AI_AGENT -u CLAUDECODE yarn test:e2e`) and `yarn astro preview stop` any leftover daemon.

Search only works after a full `yarn build`: `pagefind --site dist` generates `dist/pagefind/*` post-build, and `Search.tsx` (mounted in `Navbar.astro`) dynamically imports `${base}pagefind/pagefind.js` the first time search opens; in `yarn dev` it shows an "unavailable" message. Only elements marked `data-pagefind-body` (blog post content, project pages) are indexed — add that attribute to any new page type that should be searchable.

## Architecture

### Base path / GitHub Pages deployment

`site.config.mjs` (imported by `astro.config.mjs` and `playwright.config.ts`) computes `base` dynamically from `GITHUB_REPOSITORY`/`GITHUB_REPOSITORY_OWNER` env vars set by Actions: if the repo is a project page (not `<owner>.github.io`) built under CI, `base` becomes `/<repo>/`; otherwise (local dev, or a user/org site) it's `/`. Because of this, **internal links and asset URLs cannot be hardcoded** — every page/layout that builds an href reads `import.meta.env.BASE_URL` and normalizes it to end with `/`, e.g.:

```js
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
```

Follow this pattern (see `BaseLayout.astro`, `blog/[slug].astro`) for any new internal link, `<img>` src, or canonical/OG URL. `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`.

### Layouts

- `src/layouts/BaseLayout.astro` is the real layout used by every page (SEO meta/OG tags, canonical URL, dark/light theme bootstrap via `data-theme` + `localStorage`, `ClientRouter` view transitions, and the Mermaid diagram rendering pipeline below). Pass `title`/`description`/`image`/`type`/`keywords` props per-page.

### Content collections (`src/content.config.ts`)

Two collections, both using the `glob` loader (not the legacy `content()` loader):
- `projects` — YAML files in `src/content/projects/*.yaml` (title, tech, category enum, featured, order, etc.)
- `blog` — MDX/MD files in `src/content/blog/*.{md,mdx}` (title, date, excerpt, tags, `draft` boolean)

Always fetch blog posts through `src/utils/blog.ts#getVisibleBlogPosts()` rather than calling `getCollection('blog')` directly — it hides `draft: true` posts outside `import.meta.env.DEV`, so draft filtering stays consistent between the blog index, RSS feed, and related-posts logic.

### Blog rendering & Mermaid diagrams

`src/pages/blog/[slug].astro` renders MDX via `render(post)` and builds a nested table-of-contents from the returned `headings`. Mermaid is **not** wired through `rehype-mermaid`/remark at build time — instead a bundled `<script>` in `BaseLayout.astro` runs on every `astro:page-load` (initial load and each view-transition navigation), finds `.blog-content pre[data-language="mermaid"]` blocks, and only if any exist dynamically `import('mermaid')`, swaps each block for a `div.mermaid`, and calls `mermaid.run()`. Keep it a lazy import (and keep `manualChunks` in `astro.config.mjs` from pulling mermaid into an eagerly-loaded chunk) — the library is several MB. If diagrams stop rendering, check this client-side transform in `BaseLayout.astro`, not the markdown pipeline.

### React islands

Interactive pieces live in `src/components/react/*.tsx` and are mounted into `.astro` components with Astro's client directives (e.g. `client:load`). Astro components (`.astro`) handle everything static/SEO; reach for a React component only when you need client-side interactivity (filters, search, forms, theme toggle, etc.), consistent with the existing split.

### Home hero 3D network

`src/components/HeroNetwork.astro` renders a decorative three.js node network behind the hero (`src/scripts/hero-network.ts`). three.js (~130 KB gzip) is dynamically imported on `requestIdleCallback`, so it never blocks the hero text; keep it a lazy import and keep three.js out of any other page. The scene reads colours from the CSS theme tokens (and re-reads them when `data-theme` changes), renders a single static frame under `prefers-reduced-motion`, pauses when off-screen or the tab is hidden, is skipped under Save-Data or without WebGL (the CSS glow on `.hero-network` is the fallback), and disposes itself plus its GL context on `astro:before-swap`.

### Styling

Tailwind CSS 4 is configured via the `@theme` directive directly in `src/styles/global.css` (not `tailwind.config.ts`, which is minimal). Design tokens are CSS custom properties (`--color-brand-*`, `--color-accent`, `--color-text*`, `--color-border`, etc.) — reference them with `var(--color-*)` in inline styles or Tailwind arbitrary values rather than adding new hardcoded colors, and rather than reintroducing Tailwind 3-style color utility classes.

### Build config notes (`astro.config.mjs`)

- `output: 'static'`; Sharp is the image service.
- Vite build: Terser minification with `drop_console: true`, manual chunk splitting (only React into `react-vendor`; everything else uses Vite defaults), and `rollup-plugin-visualizer` emits `stats.html` at the repo root on every build for bundle inspection (gitignored).
- No service worker, on purpose: the site only ships a static `public/manifest.webmanifest` (install metadata + `public/icons/`), linked from `BaseLayout.astro`. Its URLs are relative so they work under any `base`.
- Inter is self-hosted via `@fontsource-variable/inter` (imported in `BaseLayout.astro`); don't reintroduce Google Fonts.
