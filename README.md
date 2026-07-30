# Portfolio Website - Modern Stack

A modern, minimalist Software Engineer portfolio built with the latest versions of Astro, React, and Tailwind CSS.

## 🚀 Features

- **Static Site Generation** with Astro 7 for optimal performance
- **React 19** for interactive components (Project Filter, Contact Form)
- **Tailwind CSS 4** with CSS variables and @theme configuration
- **MDX Support** for blog posts and case studies
- **TypeScript** throughout for type safety
- **SEO Optimized** with meta tags, Open Graph, and structured data
- **Responsive Design** with mobile-first approach
- **Smooth Animations** using CSS animations
- **Content Collections** for organized project and blog management

## 🛠️ Tech Stack

- **Framework**: Astro 7.1.3
- **UI Library**: React 19.2.8
- **Styling**: Tailwind CSS 4.3.3
- **Content**: MDX for blog posts
- **Language**: TypeScript
- **Package Manager**: Yarn 4.x
- **Node**: >= 22.0.0
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

```bash
# Install dependencies with yarn
yarn install
```

## 🏃 Running Locally

**Important**: This project uses **Yarn only** and requires **Node.js 22+**.

### Development Server

Start the development server with hot-reload:

```bash
yarn dev
```

The site will be available at `http://localhost:4321`

### Background Mode (Recommended)

For a cleaner terminal experience, run the dev server in background mode:

```bash
yarn dev -- --background

# Check server status
yarn astro dev status

# View logs
yarn astro dev logs

# Stop the server
yarn astro dev stop
```

### Production Build

Build the site for production:

```bash
yarn build
```

The optimized output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
yarn preview
```

This serves the `dist/` directory at `http://localhost:4321`

## 🎨 Design System

### Colors (CSS Variables)

Colors are defined in `src/styles/global.css` using the `@theme` directive:

```css
@theme {
  --color-brand-black: #0a0a0a;
  --color-brand-gray-dark: #666666;
  --color-brand-gray-light: #e5e5e5;
  --color-brand-white: #fafafa;
  --color-brand-orange: #ff5d01;
}
```

Use them in components:
```html
<div style="color: var(--color-brand-black)">Text</div>
<div style="background-color: var(--color-brand-orange)">Background</div>
```

### Typography
- Font: Inter
- Line Height: 1.7
- Heading Letter Spacing: -0.02em

### Spacing
- Section Padding: 120px vertical
- Container Max Width: 1100px

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Astro site:

1. **Via GitHub Integration** (Automatic deployments):
   - Push your code to GitHub
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Set the **Root Directory** to `portfolio-new` (if in a monorepo)
   - Vercel will auto-detect Astro and configure everything
   - Every push to `main` will trigger a new deployment

2. **Via CLI**:
   ```bash
   npm install -g vercel
   vercel
   ```

### Deploy to Netlify

1. **Via GitHub Integration**:
   - Push your code to GitHub
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Set **Base directory** to `portfolio-new` (if applicable)
   - Build settings:
     - Build command: `yarn build`
     - Publish directory: `dist`

2. **Via CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Deploy to Other Platforms

This is a static site that can be deployed anywhere that serves static files:

- **GitHub Pages**: Use the `gh-pages` branch or GitHub Actions
- **Cloudflare Pages**: Connect your repo, build command: `yarn build`
- **AWS S3 + CloudFront**: Upload the `dist/` directory
- **Any static host**: Upload the contents of `dist/` after running `yarn build`

### Build Requirements

- **Node.js**: 22.0.0 or higher (required for React 19)
- **Package Manager**: Yarn 4.x
- **Build Command**: `yarn build`
- **Output Directory**: `dist`

### Post-Deployment

1. Update the `site` URL in `astro.config.mjs` with your domain
2. Test all pages and features
3. Run Lighthouse audits for performance optimization
4. Set up analytics if needed

## 📝 Content Management

### Adding Projects

Create a new YAML file in `src/content/projects/`:

```yaml
title: "Project Name"
description: "Project description"
tech: ["React", "Node.js", "PostgreSQL"]
github: "https://github.com/username/repo"
live: "https://example.com"
category: "Full-Stack"
featured: true
image: "/images/projects/project.jpg"
order: 10
```

### Adding Blog Posts

Create a new MDX file in `src/content/blog/`:

```mdx
---
title: "Post Title"
date: 2024-01-01
excerpt: "Brief description"
tags: ["React", "TypeScript"]
readingTime: 5
---

Content here with **markdown** formatting!
```

## 🔄 Migrating from Tailwind 3 to 4

If you're upgrading an existing project:

1. **Custom colors**: Use CSS variables instead of utility classes
   - ❌ `text-brand-black` 
   - ✅ `style="color: var(--color-brand-black)"`

2. **@theme directive**: Define design tokens in CSS
   ```css
   @theme {
     --color-custom: #ff0000;
   }
   ```

3. **Configuration**: Minimal `tailwind.config.ts` - most config moves to CSS

## 🗂️ Project Structure

```
portfolio-new/
├── src/
│   ├── components/        # Astro & React components
│   ├── content/          # Blog posts & projects (MDX/YAML)
│   ├── layouts/          # Page layouts
│   ├── pages/            # Routes & pages
│   └── styles/           # Global CSS with @theme
├── public/               # Static assets
├── dist/                 # Build output (generated)
└── .yarn/                # Yarn 4 PnP cache
```

## 🧹 Package Manager

This project uses **Yarn 4 with node-modules linker** (not PnP):
- Configuration: `.yarnrc.yml`
- Lock file: `yarn.lock`
- **Do not** mix with npm - remove `package-lock.json` if present

## 🐛 Troubleshooting

### Build fails with "Cannot apply unknown utility class"
- Check for old Tailwind 3 custom color utilities
- Replace with CSS variables: `style="color: var(--color-brand-*)"`

### Dev server won't start
- Ensure Node.js >= 22: `node --version`
- Clean install: `rm -rf node_modules && yarn install`

### Styles not applying
- Check that `src/styles/global.css` is imported in your layout
- Verify `@theme` block is at the top of global.css

---

Built with ❤️ using Astro 7 + React 19 + Tailwind 4
