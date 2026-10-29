// @ts-check
// Deployment URL settings, shared by astro.config.mjs and playwright.config.ts.

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserSite = !!owner && repo === `${owner}.github.io`;

// Default to root path for local development and use repository path in GitHub Actions.
export const base = process.env.GITHUB_ACTIONS === 'true' && repo && !isUserSite ? `/${repo}` : '/';
// Fall back to the real Pages host so local builds emit correct canonical/sitemap/RSS URLs.
export const site = `https://${owner ?? 'aragabz'}.github.io`;
