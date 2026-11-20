---
name: Ahmed Ragab Portfolio
description: A light, hand-made portfolio and engineering publication. Warm paper, ink type, one lime highlighter and dark code cards.
colors:
  paper: "#F7F7F4"
  ink: "#121212"
  body: "#3A3A36"
  muted: "#5F5F5A"
  hairline: "#DCDCD6"
  card: "#FFFFFF"
  sunken: "#EBEBE5"
  lime: "#C8F169"
  status-dot: "#5FA800"
  dark: "#121212"
  dark-text: "#EDEDEA"
  dark-secondary: "#C9C9C3"
  dark-muted: "#A8A8A2"
  dark-rule: "#2E2E2B"
  code-keyword: "#FF9E64"
  code-string: "#C8F169"
  code-type: "#7DCFFF"
  code-comment: "#8B8B85"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  article-body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.75
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  card: "22px"
  block: "28px"
  full: "999px"
spacing:
  gutter: "32px"
  gutter-small: "20px"
  section: "clamp(72px, 7vw, 88px)"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.full}"
    height: "48px"
  button-outline:
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.ink}"
    rounded: "{rounded.full}"
    height: "48px"
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: "48px"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
  dark-card:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.card}"
---

# Design System: Ahmed Ragab Portfolio

## Overview

The site should feel hand-made: warm paper, heavy grotesque headlines, a lime highlighter used the way you'd mark a line in a notebook, and dark cards wherever code or a project is the subject. It is light-only. There is one theme and no toggle.

Structure comes from type size, hairlines and a few solid blocks of colour. There are no gradients, no blur or glass, no decorative shadows and no emoji icons.

## Colors

- **Paper** `#F7F7F4`: the page.
- **Ink** `#121212`: headings, primary buttons, outlines, focus rings.
- **Body** `#3A3A36`: paragraph text. **Muted** `#5F5F5A`: metadata and labels (still above 4.5:1 on paper, card and lime).
- **Hairline** `#DCDCD6`: dividers and card borders. **Card** `#FFFFFF`: raised surfaces. **Sunken** `#EBEBE5`: inline code, table headers.
- **Lime** `#C8F169`: the one accent.
- **Dark** `#121212` with **Dark text** `#EDEDEA`, **Dark secondary** `#C9C9C3` and **Dark muted** `#A8A8A2`: code cards, project cards, the RSS block.
- **Status dot** `#5FA800`: the small dot in the hero status line only.
- **Code syntax on dark**: keywords `#FF9E64`, strings `#C8F169`, types `#7DCFFF`, comments `#8B8B85`. The Shiki theme in `shiki-theme.mjs` uses exactly these.

All of them are CSS custom properties in the `@theme` block of `src/styles/global.css`.

### Rules

**Lime is a background, never a text colour on light.** It sits behind ink text: the hero highlight, the lead post card, callouts, the contact block, "maintained" pills, buttons on dark cards. On a dark surface lime may be used for text (code strings) and as the focus ring.

**One accent.** If a screen needs a second colour to make a point, the layout is wrong.

**Tokens only.** Components use `var(--color-*)`. The older semantic names (`--color-bg`, `--color-text`, `--color-accent`, ...) remain as aliases for pre-redesign components and should not be used in new code.

## Typography

- **Bricolage Grotesque 700** for h1 to h3: letter-spacing -0.03em, line-height about 1 (up to 1.15 for small headings). Big and tight; the blog index title runs up to 10rem.
- **Geist 400/500** for body: 17px, line-height 1.6. Article prose is 18px at 1.75 in a 720px column.
- **Geist Mono 400/500** for labels, dates, reading times, tags, chips and code. Small labels are 12px uppercase with 0.08em tracking (`.mono-caps`).

All three are self-hosted through `@fontsource-variable`. Don't add a fourth family.

## Layout

- Container `.wrap`: 1200px max, 32px side padding (20px below 480px so code and large headings fit a 360px screen).
- Section spacing: 72 to 88px (`--spacing-section`).
- Grids collapse to one column: the hero at 900px, cards and the proud grid at 800 to 900px, list rows at 700px.
- The header is not fixed. Its nav wraps under the wordmark on small screens; there is no menu button.
- Lists read as rows separated by hairlines under a 2px ink top rule (blog index, "Things I'm proud of", experience, uses). Cards are reserved for things you click into.

## Shape

Cards 22px. Large blocks (contact, RSS) 28px. Buttons, chips, inputs in pill form and inline code are fully round. Form fields and small panels use 14 to 16px.

## Components

- **Buttons** (`.btn`): 48px pills. Primary is ink with light text; outline is a 1.5px ink border that fills on hover. On dark surfaces use `.btn-lime` and `.btn-outline-light`.
- **Chips** (`.chip`): mono, 12px, hairline border. `.chip-lime` for status, `.chip-on-lime` for tags on a lime card. Filter chips on the blog index are real buttons with `aria-pressed`, 44px tall, ink-filled when pressed.
- **Wordmark**: `aragabz` in Geist Mono 700 with a blinking underscore, which stops under reduced motion.
- **Code card** (hero): dark card, three ARIA tabs, line numbers, the four syntax colours.
- **Post cards** (home): the latest post is a lime card spanning two rows; the next two are white cards.
- **Project cards**: dark, with category and year, a lime "maintained" pill, a mono stack line and lime/outline buttons.
- **Article**: mono meta line, big title, standfirst. The "On this page" card lists h2 sections, sits beside the article on desktop and above it on mobile, and is not sticky. Code blocks are dark cards with a header bar (language and copy). Blockquotes and callouts are lime boxes with a mono label ("HEADS UP" by default). The article ends with share buttons, an author card, series or previous/next navigation, and related posts.
- **Level badge and series navigation** keep their behaviour from before the redesign, drawn with ink outlines and mono labels; the "next part" card is lime.

## Accessibility

- Text contrast is at least 4.5:1 everywhere, including muted text on lime.
- Interactive targets are at least 44px.
- Focus is a 2.5px ink outline with a 3px offset; inside `.on-dark` it is lime.
- `prefers-reduced-motion` stops the cursor blink, smooth scrolling and transitions.
- A skip-to-content link is the first focusable element on every page.

## Do / Don't

- **Do** separate with hairlines and whitespace before reaching for a card.
- **Do** keep lime to a few deliberate blocks per screen.
- **Don't** add gradients, glass, blur, drop shadows or emoji icons.
- **Don't** use lime as text on a light surface.
- **Don't** reintroduce a dark theme or a theme toggle without redesigning for it.
