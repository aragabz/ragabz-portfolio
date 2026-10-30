// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { base, site } from './site.config.mjs';

// Markdown/MDX links like `[x](/blog/slug)` are written root-relative; prefix
// them with the deploy base so they keep working on GitHub Pages project sites.
function rehypeBaseLinks() {
  const prefix = base.endsWith('/') ? base : base + '/';
  /** @param {any} node hast node */
  const walk = (node) => {
    const href = node.properties?.href;
    if (node.tagName === 'a' && typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
      node.properties.href = prefix + href.slice(1);
    }
    node.children?.forEach(walk);
  };
  return walk;
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Bundle analyzer (run build to generate stats.html)
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      // Minify
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
        },
      },
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Only React gets its own chunk; everything else (e.g. mermaid) keeps
            // Vite's default splitting so lazy imports stay lazy.
            if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
              return 'react-vendor';
            }
          },
        },
      },
    },
  },
  markdown: {
    rehypePlugins: [rehypeBaseLinks],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  // Image optimization settings
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: [],
    remotePatterns: [],
  },
  // Build performance
  build: {
    inlineStylesheets: 'auto',
  },
});
