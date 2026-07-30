import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // Tailwind 4 uses CSS @theme instead of theme config
  plugins: [],
} satisfies Config;
