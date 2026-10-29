// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import AstroPWA from '@vite-pwa/astro';
import { base, site } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ahmed Ragab - Portfolio',
        short_name: 'Ahmed Ragab',
        description: 'Ahmed Ragab, Software Engineering Technical Lead: projects, experience, and articles on Kotlin, Android, KMP, and Spring Boot.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        // Relative to the manifest URL, so they resolve correctly under any `base`.
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        // JS is cached on first use instead of precached, so visitors don't
        // download lazily-loaded chunks (e.g. mermaid, several MB) up front.
        globPatterns: ['**/*.{css,html,svg,png,jpg,jpeg,webp,woff,woff2}'],
        runtimeCaching: [
          {
            // Hashed filenames are immutable, so cache-first is safe.
            urlPattern: /\/_astro\/.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'astro-js-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
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
