# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site serves four audiences, all confirmed as real:

- **Hiring managers and recruiters** evaluating Ahmed Ragab for senior, lead or staff engineering roles. They skim the experience record, projects and depth signals, then decide whether to reach out.
- **Freelance and contract clients** (companies, founders) looking for someone who can own mobile and backend work end to end. They need to see relevant delivered systems and a clear way to make contact.
- **Developers learning**, who arrive through search or links to a specific article or series (backend engineering, system design interviews, production case studies, Rust, Kotlin, Android, KMP). They read long-form content, often across several parts of a series, and pick posts by topic, language and level.
- **Peers and the engineering community**: other engineers, open-source template users, and organizers who might invite him to speak or collaborate.

## Product Purpose

A personal portfolio and technical publication for Ahmed Ragab, a Software Engineering Technical Lead and full-stack engineer with 9+ years of experience across mobile applications and backend systems.

Success is **credibility first**: the writing and project record prove deep, practical expertise, and that credibility is what turns a visitor into a role inquiry, a client inquiry, a returning reader or a community connection. No single conversion outranks the others; the site should earn trust before it asks for anything.

## Positioning

A tech lead who bridges **mobile (Android, Kotlin Multiplatform, React Native) and backend/data systems end to end**: architecting modular platforms, defining API contracts between mobile and backend teams, and owning migrations and pipelines. The extensive teaching content (junior-to-principal learning paths, interview case studies) is the proof of that depth, not the headline.

## Operating Context

- Visitors arrive at the home page (hero, about, experience, skills, projects, latest articles, contact), or land directly on a blog post from search or a shared link.
- Blog readers use the blog index's search and Topic / Language / Level filters, follow series navigation between parts, and read long articles with code, Mermaid diagrams, illustrations and expandable interview questions.
- Supporting pages: About, Projects (with detail pages), Now (current work, learning, reading), Uses, Contact, RSS feed, site search (Pagefind, production builds only).

## Capabilities and Constraints

- Static site: Astro 7, React 19 islands for interactivity, Tailwind CSS 4, MDX content collections. Deployed to GitHub Pages from `main`; every internal URL must respect the dynamic base path.
- Blog posts support `level` (junior, mid, senior, staff, principal), `series` and `seriesOrder` frontmatter; topics are derived from tags and languages from code blocks.
- Content series currently published or ready: Backend Engineering: Zero to Principal (13), System Design Interview Case Studies (8), Backend in Production: Case Studies (6, composite scenarios), Rust: Zero to Principal (11), Backend Services in Rust (8), plus standalone Android, KMP, Kotlin, Spring Boot, Airflow, React Native and TypeScript posts.
- No service worker by design; light and dark themes are both supported.
- Undecided: whether the site will add newsletter/subscription beyond RSS, a downloadable CV, or a services/rates page for freelance work.

## Brand Commitments

- Name: Ahmed Ragab. Voice in the existing copy is first-person, direct and professional.
- Long-form writing voice: precise, practical, no hype or marketing language, hedged where facts are uncertain, composite scenarios labelled as such.

## Evidence on Hand

- Experience record with stated outcomes (in `src/components/Experience.astro`), e.g. a 100M+ record CockroachDB-to-PostgreSQL migration, cron-to-Airflow modernization, Android app modularization, React Native apps across food ordering, VoIP and healthcare. These are the owner's own claims; don't embellish or add numbers.
- Two open-source projects: Android Clean Architecture Template and React Native Template Ultimacode (`src/content/projects/`).
- ~70 blog posts in `src/content/blog/`, with SVG illustrations in `public/images/blog/`.
- Absent, and must not be fabricated: client testimonials, client logos, employer endorsements, talk or podcast appearances, download or star counts, readership numbers.

## Product Principles

1. **Credibility before conversion.** Show real systems and real depth first; contact and calls to action follow from trust, never replace it.
2. **The bridge is the story.** Frame work and content around connecting mobile and backend end to end, not around a single platform.
3. **Writing is proof, so it must read well.** Long-form articles are a primary product, and their readability, navigation and accuracy carry as much weight as the home page.
4. **Serve every audience without diluting any.** Recruiters, clients, learners and peers each find their path quickly; no audience is forced through another's funnel.
5. **Honest claims only.** No invented metrics, endorsements or social proof; hedge what isn't certain.
