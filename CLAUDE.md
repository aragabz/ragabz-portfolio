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
yarn test           # vitest (unit/component tests, jsdom)
yarn test:ui        # vitest with UI
yarn test:coverage  # vitest with v8 coverage
yarn test:e2e       # playwright e2e tests
```

Run a single vitest file/test: `yarn test src/path/to/file.test.ts` or `yarn test -t "test name"`.

There are currently no test files in the repo (`src/**/*.{test,spec}.*` is empty, and there's no Playwright `tests/` dir) even though vitest/Playwright/RTL are fully configured — add specs under `src/` next to the code they cover (vitest is configured with jsdom + React Testing Library via `src/test/setup.ts`).

Search only works after a full `yarn build`: `pagefind --site dist` generates `dist/pagefind/*` post-build, and `Search.tsx` loads `/pagefind/pagefind.js` at runtime. It will warn and no-op in `yarn dev`/before a build.

## Architecture

### Base path / GitHub Pages deployment

`astro.config.mjs` computes `base` dynamically from `GITHUB_REPOSITORY`/`GITHUB_REPOSITORY_OWNER` env vars set by Actions: if the repo is a project page (not `<owner>.github.io`) built under CI, `base` becomes `/<repo>/`; otherwise (local dev, or a user/org site) it's `/`. Because of this, **internal links and asset URLs cannot be hardcoded** — every page/layout that builds an href reads `import.meta.env.BASE_URL` and normalizes it to end with `/`, e.g.:

```js
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
```

Follow this pattern (see `BaseLayout.astro`, `blog/[slug].astro`) for any new internal link, `<img>` src, or canonical/OG URL. `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`.

### Layouts

- `src/layouts/BaseLayout.astro` is the real layout used by every page (SEO meta/OG tags, canonical URL, dark/light theme bootstrap via `data-theme` + `localStorage`, `ClientRouter` view transitions, and the Mermaid diagram rendering pipeline below). Pass `title`/`description`/`image`/`type`/`keywords` props per-page.
- `src/layouts/Layout.astro` is an unused Astro-starter leftover — don't build on it.

### Content collections (`src/content.config.ts`)

Two collections, both using the `glob` loader (not the legacy `content()` loader):
- `projects` — YAML files in `src/content/projects/*.yaml` (title, tech, category enum, featured, order, etc.)
- `blog` — MDX/MD files in `src/content/blog/*.{md,mdx}` (title, date, excerpt, tags, `draft` boolean)

Always fetch blog posts through `src/utils/blog.ts#getVisibleBlogPosts()` rather than calling `getCollection('blog')` directly — it hides `draft: true` posts outside `import.meta.env.DEV`, so draft filtering stays consistent between the blog index, RSS feed, and related-posts logic.

### Blog rendering & Mermaid diagrams

`src/pages/blog/[slug].astro` renders MDX via `render(post)` and builds a nested table-of-contents from the returned `headings`. Mermaid is **not** wired through `rehype-mermaid`/remark at build time — instead `BaseLayout.astro` loads a static `public/mermaid/mermaid.min.js` script and, client-side, walks the rendered HTML for `pre[data-language="mermaid"]` blocks, swaps each for a `div.mermaid`, and calls `mermaid.run()`. A `MutationObserver` re-applies this after Astro view-transition navigations. If Mermaid diagrams stop rendering after a content or layout change, check this client-side transform in `BaseLayout.astro`, not the markdown pipeline.

### React islands

Interactive pieces live in `src/components/react/*.tsx` and are mounted into `.astro` components with Astro's client directives (e.g. `client:load`). Astro components (`.astro`) handle everything static/SEO; reach for a React component only when you need client-side interactivity (filters, search, forms, theme toggle, etc.), consistent with the existing split.

### Styling

Tailwind CSS 4 is configured via the `@theme` directive directly in `src/styles/global.css` (not `tailwind.config.ts`, which is minimal). Design tokens are CSS custom properties (`--color-brand-*`, `--color-accent`, `--color-text*`, `--color-border`, etc.) — reference them with `var(--color-*)` in inline styles or Tailwind arbitrary values rather than adding new hardcoded colors, and rather than reintroducing Tailwind 3-style color utility classes.

### Build config notes (`astro.config.mjs`)

- `output: 'static'`; Sharp is the image service.
- Vite build: Terser minification with `drop_console: true`, manual chunk splitting (`react-vendor` vs `vendor`), and `rollup-plugin-visualizer` emits `stats.html` at the repo root on every build for bundle inspection.
- PWA via `@vite-pwa/astro` (manifest + Workbox runtime caching for Google Fonts).
