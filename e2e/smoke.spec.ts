import { expect, test, type Page } from '@playwright/test';

// A post that contains both a Mermaid diagram and regular code blocks.
const DIAGRAM_POST = 'blog/hibernate-vs-jpa-complete-guide/';

// Fails the test on uncaught page errors and on any failed same-origin request
// (e.g. an asset URL that ignores the deploy base path).
function trackFailures(page: Page, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const failures: string[] = [];
  page.on('pageerror', (e) => failures.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === origin) {
      failures.push(`${r.status()} ${r.url()}`);
    }
  });
  return failures;
}

test('home page loads without errors or broken assets', async ({ page, baseURL }) => {
  const failures = trackFailures(page, baseURL!);
  await page.goto('./', { waitUntil: 'networkidle' });
  await expect(page.locator('#main-content')).toBeVisible();
  expect(failures).toEqual([]);
});

test('blog post renders Mermaid diagrams and code toolbars', async ({ page, baseURL }) => {
  const failures = trackFailures(page, baseURL!);
  await page.goto(DIAGRAM_POST, { waitUntil: 'networkidle' });

  await expect(page.locator('.mermaid svg').first()).toBeVisible();
  await expect(page.locator('pre[data-language="mermaid"]')).toHaveCount(0);

  const codeBlocks = await page.locator('.blog-content pre').count();
  expect(codeBlocks).toBeGreaterThan(0);
  await expect(page.locator('.code-toolbar')).toHaveCount(codeBlocks);
  await expect(page.locator('.code-lang', { hasText: /^mermaid$/ })).toHaveCount(0);
  expect(failures).toEqual([]);
});

test('code toolbars and diagrams survive view-transition navigation', async ({ page }) => {
  await page.goto('blog/', { waitUntil: 'networkidle' });
  await page.locator(`a[href$="${DIAGRAM_POST.replace(/\/$/, '')}"]`).first().click();
  await page.waitForURL(`**/${DIAGRAM_POST.replace(/\/$/, '')}**`);

  await expect(page.locator('.mermaid svg').first()).toBeVisible();
  await expect(page.locator('.code-toolbar').first()).toBeVisible();
});

test('search finds blog posts', async ({ page, baseURL }) => {
  await page.goto('./', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Search articles and projects' }).click();
  await page.getByRole('searchbox', { name: 'Search query' }).fill('kotlin');

  const firstResult = page.locator('.search-result').first();
  await expect(firstResult).toBeVisible();
  const href = await firstResult.getAttribute('href');
  // Result links must include the deploy base path.
  expect(new URL(href!, page.url()).pathname.startsWith(new URL(baseURL!).pathname)).toBe(true);
  await firstResult.click();
  await expect(page.locator('.blog-content, main[data-pagefind-body]').first()).toBeVisible();
});

test('PWA manifest icons resolve', async ({ page, request }) => {
  await page.goto('./');
  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifestURL = new URL(manifestHref!, page.url());
  const manifest = await (await request.get(manifestURL.href)).json();

  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    const res = await request.get(new URL(icon.src, manifestURL).href);
    expect(res.status(), icon.src).toBe(200);
  }
});

test('mobile menu opens, animates in, and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('./', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(menu).toBeVisible();

  await menu.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
});
