---
target: src/pages/blog/[slug].astro
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:/Users/ahmed.seddik/ragab/ultimacode/ragab-portfolio-astro/src/pages/blog/[slug].astro"
target_fingerprint: "sha256:68b052af6ee4eda7d5c3c4f9e6bc5aeabdf5a793b7c13f44fb2f1efa16d9c971"
target_path: /Users/ahmed.seddik/ragab/ultimacode/ragab-portfolio-astro/src/pages/blog/[slug].astro
timestamp: 2026-11-07T17-41-53Z
slug: src-pages-blog-slug-astro
---
# Critique: blog post page (src/pages/blog/[slug].astro)

## Design Health Score: 25/40 (Acceptable)
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Progress bar and TOC highlight die after view-transition navigation (inline script, [slug].astro:674-714) |
| 2 | Match System / Real World | 3 | "Print →" arrow, "BLOG" eyebrow on standalone posts |
| 3 | User Control and Freedom | 3 | No back-to-top on 36-46k px pages, no mobile in-page nav |
| 4 | Consistency and Standards | 2 | Callout variants never apply; lavender Mermaid; summary focus ring blue; RelatedPosts legacy classes |
| 5 | Error Prevention | 3 | Mostly n/a for reading |
| 6 | Recognition Rather Than Recall | 2 | TOC active item scrolls out of view; no read state in series outline |
| 7 | Flexibility and Efficiency | 2 | No heading permalinks, no mobile TOC, no keyboard prev/next |
| 8 | Aesthetic and Minimalist Design | 3 | End zone stacks 6+ competing exits |
| 9 | Error Recovery | 2 | Failed Mermaid leaves raw source, console.warn only |
| 10 | Help and Documentation | 3 | Level meaning only in a title tooltip |

## Design Specificity Verdict
Mostly authored (reading column, numbered TOC, series levels, level badge, prerequisite callouts, custom SVGs); generic at the article end, in stock Mermaid styling and the "BLOG" eyebrow. Detector: 25 CLI findings (side-tab 2, off-ramp font sizes 18, undocumented code colors 4, radius 1); browser: accent #ff5d01 as text 3.1:1 on white, code comments 3.0:1; Mermaid-generated hits are false positives.

## Priority Issues
- [P1] Mermaid dark mode double inversion (global.css:261,265) cancels out; use theme:'base' + token themeVariables, re-render on theme toggle, center diagrams. ($impeccable colorize / polish)
- [P1] Reading progress + TOC highlight break after "Next" (inline script runs once); move to astro:page-load bundled script with cleanup. ($impeccable harden)
- [P1] TOC sticky top-10 under the 73px nav, no max-height/overflow, all ~30 entries expanded; top 6rem, max-height calc(100vh - 7rem), auto-scroll active, collapse inactive h3s. ($impeccable layout)
- [P1] Mobile: no in-page nav, figures ~6px text, nowrap tables 1.2-1.9k px wide; add mobile "On this page", tap-to-enlarge figures, wrapping tables with scroll affordance. ($impeccable adapt)
- [P2] Generic end zone: misaligned share/Print row, grid Related cards duplicating Next and mis-ordering series parts, no author presence; single end block (next part, series progress, author note, list-row related excluding siblings). ($impeccable distill, layout)

## Persona Red Flags
- Sam: no <main>/skip link, TOC after content in DOM, summary blue focus, level in title only, Mermaid no text alternative, copy not announced.
- Casey: no TOC on 46k px, wide tables, 6px figure text, wrapped share row, no back-to-top.
- Priya (series learner): Next kills progress/TOC state, no read state, repetitive outline labels, duplicate Next links, Related repeats Next.

## Minor Observations
Callout class literal bug (Callout.astro:16); accent-as-text contrast; JSON-LD dates use build time (BaseLayout.astro:173-174); off-ramp sizes 0.8125/0.6875/0.9375rem; code comment contrast; hardcoded theme-color; smooth scroll without reduced-motion guard; outline numerals hidden; TOC highlight lag.

## Questions to Consider
- What does an ending that says "someone you could hire wrote this" look like without a pitch?
- Keep Mermaid only for sequences/ERDs and redraw layer/flow diagrams as notebook SVGs?
- Should series pages behave like a course (read state, you-are-here, level gate)?
