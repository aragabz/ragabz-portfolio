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

- `src/layouts/BaseLayout.astro` is the real layout used by every page (SEO meta/OG tags, canonical URL, the skip-to-content link, `Navbar` and `Footer`, `ClientRouter` view transitions, and the Mermaid diagram rendering pipeline below). The site is light-only: there is no theme toggle and no `data-theme`. Pages render only their `<main id="main-content">`; don't add `Navbar`/`Footer` to a page. Pass `title`/`description`/`image`/`type`/`keywords` props per-page.

### Content collections (`src/content.config.ts`)

Two collections, both using the `glob` loader (not the legacy `content()` loader):
- `projects` — YAML files in `src/content/projects/*.yaml` (title, tech, category enum, featured, order, etc.)
- `blog` — MDX/MD files in `src/content/blog/*.{md,mdx}` (title, date, excerpt, tags, `draft` boolean)

Always fetch blog posts through `src/utils/blog.ts#getVisibleBlogPosts()` rather than calling `getCollection('blog')` directly — it hides `draft: true` posts outside `import.meta.env.DEV`, so draft filtering stays consistent between the blog index, RSS feed, and related-posts logic.

### Blog rendering & Mermaid diagrams

`src/pages/blog/[slug].astro` renders MDX via `render(post)` and builds the non-sticky "On this page" card from the h2 entries of the returned `headings`. Mermaid is **not** wired through `rehype-mermaid`/remark at build time — instead a bundled `<script>` in `BaseLayout.astro` runs on every `astro:page-load` (initial load and each view-transition navigation), finds `.blog-content pre[data-language="mermaid"]` blocks, and only if any exist dynamically `import('mermaid')`, swaps each block for a `div.mermaid`, and calls `mermaid.run()`. Keep it a lazy import (and keep `manualChunks` in `astro.config.mjs` from pulling mermaid into an eagerly-loaded chunk) — the library is several MB. If diagrams stop rendering, check this client-side transform in `BaseLayout.astro`, not the markdown pipeline.

### React islands

Interactive pieces live in `src/components/react/*.tsx` and are mounted into `.astro` components with Astro's client directives (e.g. `client:load`). Astro components (`.astro`) handle everything static/SEO; reach for a React component only when you need client-side interactivity (currently only `Search.tsx` and `ContactForm.tsx`); anything small should be a vanilla `<script>` in the `.astro` file instead.

### Home page

`src/pages/index.astro` stacks `Hero` (with `CodeCard.astro`, the three-tab code card), `Stats`, `Blog` (the "Writing" cards), `Projects`, `Proud`, `About` and `ContactBlock`. Writing and Projects read from the content collections; the stats strip sums the posts' reading times at build time. The "Things I'm proud of" items live in `src/data/proud.ts` (an optional `post` id adds a "Read how" link, ignored if the post doesn't exist). The experience record is in `src/components/Experience.astro` and is shown on `/about`.

Small interactions (code card tabs, the blog index filter in `src/pages/blog/index.astro`) are vanilla `<script>`s that initialise on `astro:page-load` and guard against double-init with a `data-ready` attribute. React is only used for `Search.tsx` and `ContactForm.tsx`.

The blog index paginates client-side (`PAGE_SIZE` in `src/pages/blog/index.astro`, page kept in `?page=N`) so search and topic filters still cover every post. All rows are in the HTML; rows past page one are rendered `hidden` and a `<noscript>` style reveals them without JS. Don't switch to static `/blog/2` routes without moving the filter too.

### Styling

Tailwind CSS 4 is configured via the `@theme` directive directly in `src/styles/global.css` (not `tailwind.config.ts`, which is minimal). The palette lives there as `--color-paper`, `--color-ink`, `--color-body`, `--color-muted`, `--color-hairline`, `--color-card`, `--color-lime`, `--color-dark*` and `--color-code-*`; reference them with `var(--color-*)` or the generated utilities rather than hardcoding hex values. The older semantic names (`--color-bg`, `--color-text`, `--color-border`, `--color-accent`, ...) are kept as aliases for components that predate the redesign; don't use them in new code.

Rules of the design (see `DESIGN.md`): lime is a background behind ink text only, never text on a light surface; no gradients, shadows-as-decoration, blur or emoji icons; headings are Bricolage Grotesque, body is Geist, labels/metadata/code are Geist Mono. Shared primitives in `global.css`: `.wrap` (1200px container), `.section`, `.btn` + `.btn-primary`/`.btn-outline`/`.btn-lime`/`.btn-outline-light`, `.chip`, `.mono`, `.mono-caps`, `.text-link`, `.page*` and `.row-list` for the secondary pages. Put `.on-dark` on dark surfaces so focus outlines switch to lime. Interactive targets are at least 44px.

Code blocks use the custom Shiki theme in `shiki-theme.mjs` (four syntax colours matching `--color-code-*`); the header bar with the language and copy button is added client-side in `blog/[slug].astro`.

### Build config notes (`astro.config.mjs`)

- `output: 'static'`; Sharp is the image service.
- Vite build: Terser minification with `drop_console: true`, manual chunk splitting (only React into `react-vendor`; everything else uses Vite defaults), and `rollup-plugin-visualizer` emits `stats.html` at the repo root on every build for bundle inspection (gitignored).
- No service worker, on purpose: the site only ships a static `public/manifest.webmanifest` (install metadata + `public/icons/`), linked from `BaseLayout.astro`. Its URLs are relative so they work under any `base`.
- Fonts are self-hosted via `@fontsource-variable/{bricolage-grotesque,geist,geist-mono}` (imported in `BaseLayout.astro`); don't reintroduce Google Fonts.
