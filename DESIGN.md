---
name: Ahmed Ragab Portfolio
description: A personal portfolio and engineering publication, quiet and precise, with one warm signal color.
colors:
  signal-orange: "#ff5d01"
  signal-orange-deep: "#c2410c"
  signal-orange-night: "#ff6b35"
  signal-orange-night-deep: "#ff8a5c"
  paper: "#ffffff"
  paper-subtle: "#f9fafb"
  paper-sunken: "#f3f4f6"
  ink: "#111827"
  ink-secondary: "#4b5563"
  ink-tertiary: "#6b7280"
  rule: "#e5e7eb"
  rule-strong: "#d1d5db"
  night: "#0f172a"
  night-raised: "#1e293b"
  night-sunken: "#334155"
  chalk: "#f1f5f9"
  chalk-secondary: "#cbd5e1"
  chalk-tertiary: "#94a3b8"
  night-rule-strong: "#475569"
  code-surface: "#24292e"
  code-toolbar: "#1f2428"
  code-rule: "#343a40"
  code-hover: "#30363d"
  code-text: "#c9d1d9"
  code-muted: "#8b949e"
typography:
  display:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  article-body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.8
  article-h1:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  article-h1-compact:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  article-h2:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  article-h2-compact:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  article-h3:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  article-h3-compact:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  small:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "clamp(4rem, 8vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange-deep}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  chip-filter:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  chip-filter-active:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
  tag:
    backgroundColor: "{colors.paper-sunken}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  level-badge:
    textColor: "{colors.signal-orange-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.paper-subtle}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  code-block:
    backgroundColor: "{colors.code-surface}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
---

# Design System: Ahmed Ragab Portfolio

## Overview

**Creative North Star: "The Engineer's Notebook"**

The site reads like a well-kept engineering notebook: clean pages, careful handwriting, and one orange pen used only for what matters. Content and code lead. The interface stays out of the way through generous whitespace, neutral paper-and-ink surfaces, and a single typeface doing all the work through weight and size. The mood is quiet and precise, but not cold: the orange keeps it warm and human, bold headlines give it technical confidence, and the long-form articles are set with the care of an editorial publication.

There are two equal themes. Light mode is white paper and near-black ink; dark mode is deep slate night with chalk-colored text. Both carry the same single accent, tuned brighter for dark backgrounds. The one atmospheric flourish is the soft aurora glow behind the home hero, drawn entirely from the theme tokens so it changes with the theme and stays decorative.

Density follows the reader. Marketing sections on the home page breathe with large section padding and centered headlines. Articles sit in a 720px reading column with a sticky table of contents beside them. Lists such as the blog index are compact rows separated by hairlines, made for scanning.

**Key Characteristics:**
- One accent color, used sparingly, for action, state and wayfinding.
- Neutral paper and ink surfaces with hairline borders; flat at rest.
- A single typeface (Inter) with a clear weight and size ladder.
- Long-form reading is a first-class surface, not an afterthought.
- Light and dark themes are equally finished, switched with tokens and no JavaScript color logic.

## Colors

A neutral paper-and-ink palette with one warm signal color that carries every call to action, active state and accent mark.

### Primary
- **Signal Orange** (`signal-orange`): primary buttons, active filter pills, the logo wordmark, required-field markers, focus outlines, text selection, and the small accent marks in articles (h2 underline, h3 rule). In dark mode it shifts to **Signal Orange, Night** (`signal-orange-night`) so it holds its brightness against slate.
- **Signal Orange, Deep** (`signal-orange-deep`): the accent when it must be read as text: article links, inline code, level badges, h4 article headings, hover state of primary buttons and title links. In dark mode it becomes **Signal Orange, Night Deep** (`signal-orange-night-deep`), which is lighter, not darker, to keep contrast on slate.

### Neutral
- **Paper** (`paper`) and **Night** (`night`): the page background in light and dark themes.
- **Paper, Subtle** (`paper-subtle`) and **Night, Raised** (`night-raised`): cards, inputs, inactive filter pills, search results, alternate section bands.
- **Paper, Sunken** (`paper-sunken`) and **Night, Sunken** (`night-sunken`): tags, inline code background, hover fill on subtle surfaces.
- **Ink** (`ink`) and **Chalk** (`chalk`): headings and body text.
- **Ink, Secondary** (`ink-secondary`) and **Chalk, Secondary** (`chalk-secondary`): excerpts, supporting copy, filter labels.
- **Ink, Tertiary** (`ink-tertiary`) and **Chalk, Tertiary** (`chalk-tertiary`): metadata such as dates and reading time.
- **Rule** (`rule`) and **Rule, Strong** (`rule-strong`), with **Night, Sunken** and **Night Rule, Strong** (`night-rule-strong`) in dark mode: hairline dividers, card and input borders, secondary-button outlines.
- **Code Surface** (`code-surface`) and **Code Toolbar** (`code-toolbar`): fenced code blocks stay dark in both themes. **Code Rule** (`code-rule`), **Code Hover** (`code-hover`), **Code Text** (`code-text`) and **Code Muted** (`code-muted`) are the toolbar divider, button hover, button text and language label; Code Muted is also the floor for syntax comments, which the github-dark theme sets too dim.

In code, every color is a CSS custom property on `:root` and `[data-theme="dark"]` in `src/styles/global.css` (`--color-bg`, `--color-text`, `--color-accent`, `--color-accent-strong`, `--color-border`, and so on). Components reference those variables, never the hex values.

### Named Rules
**The One Signal Rule.** Signal Orange is the only chromatic color in the interface. It marks the action, the active state or the thing to notice, and never fills large areas. If two orange things compete on one screen, one of them is wrong.

**The Deep-for-Text Rule.** Orange that is read as text (links, badges, inline code, small labels) uses Signal Orange, Deep, never the bright Signal Orange, which fails contrast on white at small sizes.

**The Token-Only Rule.** New UI uses the semantic variables (`--color-bg*`, `--color-text*`, `--color-border*`, `--color-accent*`). The legacy `--color-brand-*` aliases still exist for older components; don't extend their use.

## Typography

**Display Font:** Inter Variable (self-hosted, with Inter and system-ui fallbacks)
**Body Font:** Inter Variable
**Label/Mono Font:** the platform monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas) for code only

**Character:** One family carries the whole system. Hierarchy comes from weight (400 / 500 / 600 / 700) and size, with a slight negative tracking on every heading for a compact, engineered look.

### Hierarchy
- **Display** (700, 6rem on desktop and 3.75rem on mobile, line-height 1, tracking -0.02em): the name in the home hero only.
- **Headline** (700, 3rem on desktop and 2.25rem on mobile): home section titles ("Featured Projects", "Latest Articles") and page titles. Article h2s use 1.875rem with the same weight.
- **Title** (600, 1.25rem, line-height 1.4): list-row titles in the blog index and home articles, card titles, article h3 at 1.5rem.
- **Body** (400, 1rem, line-height 1.7): interface copy and supporting text.
- **Article Body** (400, 1.125rem, line-height 1.8): long-form prose, in a column no wider than 720px (roughly 70 characters).
- **Article headings** (700, fluid between the compact and full sizes: h1 1.75 to 2.25rem, h2 1.5 to 1.875rem, h3 1.3125 to 1.5rem, h4 1.125 to 1.25rem): sections inside an article. The h2 carries a short solid Signal Orange underline; h3 and h4 rely on size alone.
- **Small** (400, 0.9375rem, line-height 1.6): callout bodies, tables, series and related-article lists, and diagram labels.
- **Label** (600, 0.75rem): level badges, tags, filter counts. Metadata such as dates, the table of contents and share buttons use 0.875rem regular.
- **Mono** (400, 0.875rem, line-height 1.6): code blocks; inline code is 0.85em.

### Named Rules
**The One Family Rule.** Don't introduce a second typeface. Contrast comes from Inter's weight and size, and code gets the system monospace.

**The Reading Column Rule.** Long-form text never runs wider than 720px, and article body stays at 1.125rem with line-height 1.8.

## Layout

- **Containers:** the main container is 1100px wide (`--max-width-container`) with 24px side padding. Articles use a 5xl wrapper (64rem) split into a 720px reading column and a 240px sticky table of contents on large screens. The blog list on the home page is capped at 860px.
- **Section rhythm:** home sections are separated by fluid vertical padding of `clamp(4rem, 8vw, 6rem)` (`--spacing-section`). Section headers are centered with 64px below them.
- **Spacing scale:** Tailwind's 4px base. The most common steps are 8px for gaps inside a component, 16px between related elements, 24px for page gutters and grid gaps, and 48px before a list or grid starts.
- **Lists over grids for reading:** article lists are rows on a two-column grid (a 9rem metadata column and a flexible content column) separated by hairlines, collapsing to a single column on mobile.
- **Responsive:** mobile first, with the main shift at the `md` breakpoint (768px): navigation collapses into a menu, headline sizes step down, and the table of contents drops out below `lg` (1024px).
- **Fixed navigation:** a 73px top bar with a blurred translucent background stays fixed; anchors use an 80px scroll offset.

## Elevation & Depth

The system is flat at rest. Structure comes from tonal backgrounds (Paper, Paper Subtle, Paper Sunken) and 1px hairline borders, not from shadows. Shadows appear only as a response to intent, or to set a few special objects apart.

### Shadow Vocabulary
- **Hover lift** (`translateY(-2px)` plus `box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1)`, 0.3 opacity in dark mode): cards respond to hover.
- **Code block** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)`): fenced code reads as a separate dark object on the page.
- **Portrait ring** (a page-colored gap, then a 2px Signal Orange ring, then a soft drop shadow): the About portrait only.
- **Modal backdrop** (50% black with a 2px blur): the search dialog.

### Named Rules
**The Flat-By-Default Rule.** Surfaces carry no shadow at rest. A shadow means "this responds to you" or "this is a different kind of object", never decoration.

## Shapes

Gently rounded and consistent. Interactive controls and inputs use 8px corners, larger containers (cards, code blocks, callouts) use 12px, and inline code uses 6px. Pills are fully rounded: filter chips, tags, level badges, social icon buttons and the portrait frame. Borders are 1px hairlines, except form inputs, which use a 2px border so they read as editable. The one accent mark in articles is a short 3px rounded underline under each h2.

## Components

### Buttons
Refined and restrained: one solid orange primary, everything else quiet.
- **Shape:** gently rounded (8px).
- **Primary:** Signal Orange fill with white text, 16px by 32px padding, medium weight. Used once per view for the main action ("Get in Touch", "Send Message").
- **Hover / Focus:** the fill deepens to Signal Orange, Deep. Keyboard focus shows a 2px Signal Orange outline with a 2px offset.
- **Secondary:** transparent with a 1px strong-rule border and ink text; the border darkens to ink on hover ("View Work").

### Chips
- **Filter pills:** fully rounded, subtle paper fill, 1px rule border and secondary ink text, with a small count. The active pill fills with Signal Orange and white text. Options with no results are disabled and dimmed unless active.
- **Tags:** fully rounded, sunken paper fill, rule border, 0.75rem secondary text. Up to three show per post, then "+N more".
- **Level badge:** a pill with a light orange tint (8% of the accent), a 35% accent border and Signal Orange, Deep text, plus five small dots filled up to the post's level (junior through principal).

### Cards / Containers
- **Corner style:** 12px.
- **Background:** Paper Subtle with a 1px rule border.
- **Shadow strategy:** none at rest; the hover lift from Elevation & Depth on interactive cards.
- **Images:** a 16:9 frame that scales up 5% on hover inside the card.
- **Callouts in articles:** 12px corners, a 1px border all round and a small line icon beside the label. Note is neutral (Paper Subtle). Tip is faintly tinted with Signal Orange. Warning is tinted more strongly, with a Signal Orange border and label. No thick side stripe.

### Inputs / Fields
- **Style:** Paper Subtle fill, 2px rule border, 8px corners, 12px by 16px padding, 1rem text. Labels are medium weight above the field, and required fields are marked with an orange asterisk.
- **Focus:** the border darkens to ink and a 2px Signal Orange outline appears with a 2px offset.
- **Status messages:** a 10% orange-tinted panel with a 1px orange border.

### Navigation
- **Top bar:** fixed, translucent page color with backdrop blur and a bottom hairline. Logo wordmark in Signal Orange, bold. Links are medium weight in ink and turn Signal Orange, Deep on hover. Search and theme toggle sit at the right.
- **Mobile:** links collapse into a menu button below 768px.

### Article List Row (signature)
The blog index and home "Latest Articles" are rows, not cards. Each row has date and reading time in a narrow left column, then a title that turns Signal Orange, Deep on hover, a two-line excerpt, and a line of level badge and tags. The whole row is clickable through a stretched link, and rows are separated by hairlines.

### Article Navigation (signature)
- **Table of contents:** a sticky column (6rem below the top) with its own scroll, numbered entries, and only the current section's subsections expanded; the active entry is Signal Orange, Deep with a 1px rule. On screens below 1024px it becomes a collapsible "On this page" panel above the article.
- **Series outline:** a collapsible panel with the series name, "Part N of M", and a numbered list of parts showing each part's level and a check mark for parts the reader has finished.
- **Series end:** "Part N of M in Series", a segmented progress bar (finished parts in a muted orange, the current part in Signal Orange), and previous/next cards; the next card is the primary, tinted Paper Subtle and showing the next part's level when it changes.
- **Diagrams:** Mermaid diagrams are themed from the color tokens (surfaces, ink, rules) at render time and redrawn when the theme changes; no color filters.

### Code Block (signature)
Dark in both themes. 12px corners, a 1px rule border, the code-block shadow, and a toolbar strip showing the language and a copy button. 0.875rem monospace with line-height 1.6.

## Do's and Don'ts

### Do:
- **Do** reference colors through the semantic CSS variables (`var(--color-text)`, `var(--color-accent)`), so both themes work with no extra code.
- **Do** keep Signal Orange for the one action, active state or accent mark on a screen.
- **Do** use Signal Orange, Deep for orange text, links and badges.
- **Do** separate list items with 1px hairlines and keep rows flat.
- **Do** keep article prose in the 720px column at 1.125rem with line-height 1.8.
- **Do** give every interactive element a visible 2px Signal Orange focus outline.
- **Do** check every new surface in both light and dark themes.

### Don't:
- **Don't** add a second accent color or a second typeface.
- **Don't** put shadows on surfaces at rest; use tone and hairlines.
- **Don't** fill large areas with Signal Orange or use it for body text.
- **Don't** hardcode hex values in components; the only exceptions are the dark code-block surfaces.
- **Don't** extend the legacy `--color-brand-*` variables in new UI.
- **Don't** let the hero aurora's animation depend on JavaScript to render; it must look right with CSS alone.
