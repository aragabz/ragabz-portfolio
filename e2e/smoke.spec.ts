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
  // The index is paginated, so narrow it down to the post before clicking through.
  await page.getByLabel('Search posts').fill('hibernate jpa');
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

test('every route loads under the base path', async ({ page, baseURL }) => {
  const routes = ['./', 'blog/', 'about/', 'now/', 'uses/', 'contact/', 'projects/android-template/', 'projects/react-native-template/'];
  for (const route of routes) {
    const failures = trackFailures(page, baseURL!);
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page.locator('#main-content'), route).toBeVisible();
    await expect(page.locator('h1'), route).toHaveCount(1);
    expect(failures, route).toEqual([]);
    page.removeAllListeners();
  }
});

test('internal links on the home page stay under the base path', async ({ page, baseURL, request }) => {
  await page.goto('./', { waitUntil: 'networkidle' });
  const basePath = new URL(baseURL!).pathname;
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of new Set(hrefs)) {
    expect(href.startsWith(basePath), href).toBe(true);
    // resume.pdf is supplied by the site owner and may not be in the repo yet.
    if (href.endsWith('resume.pdf')) continue;
    const res = await request.get(new URL(href, page.url()).href);
    expect(res.status(), href).toBe(200);
  }
});

test('RSS feed is served', async ({ request, baseURL }) => {
  const res = await request.get(new URL('rss.xml', baseURL!).href);
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('<rss');
});

test('hero code card tabs switch language with click and arrow keys', async ({ page }) => {
  await page.goto('./', { waitUntil: 'networkidle' });
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await expect(page.getByRole('tabpanel')).toContainText('data class Engineer');

  await page.getByRole('tab', { name: 'Me.swift' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('struct Engineer');

  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'me.ts' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'me.ts' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('type Engineer');
});

test('blog index filters by search and topic, and shows the empty state', async ({ page }) => {
  await page.goto('blog/', { waitUntil: 'networkidle' });
  const rows = page.locator('[data-post]:visible');
  const count = page.locator('[data-post-count]');
  const all = await page.locator('[data-post]').count();
  await expect(count).toContainText(`${all} posts`);

  const rust = page.getByRole('button', { name: 'Systems Programming' });
  await rust.click();
  await expect(rust).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'all posts' })).toHaveAttribute('aria-pressed', 'false');
  await expect(count).toContainText(`of ${all} posts`);

  await page.getByRole('button', { name: 'all posts' }).click();
  await expect(count).toContainText(`${all} posts`);
  await expect(count).not.toContainText(' of ' + all);

  await page.getByLabel('Search posts').fill('zzzz-no-such-post');
  await expect(rows).toHaveCount(0);
  await expect(page.getByText("No posts match that yet. Maybe it's the next one.")).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeHidden();
});

test('blog index paginates, keeps the page in the URL and resets it on filter', async ({ page }) => {
  await page.goto('blog/', { waitUntil: 'networkidle' });
  const rows = page.locator('[data-post]:visible');
  const pager = page.getByRole('navigation', { name: 'Pagination' });
  await expect(rows).toHaveCount(10);
  await expect(pager.getByRole('button', { name: /Newer posts/ })).toBeDisabled();
  const firstTitle = await rows.first().locator('h2').textContent();

  await pager.getByRole('button', { name: /Older posts/ }).click();
  await expect(page).toHaveURL(/[?&]page=2$/);
  await expect(pager.getByRole('button', { name: /^Page 2 of/ })).toHaveAttribute('aria-current', 'page');
  await expect(rows.first().locator('h2')).not.toHaveText(firstTitle!);

  // A deep link lands on the same page.
  await page.reload({ waitUntil: 'networkidle' });
  await expect(pager.getByRole('button', { name: /^Page 2 of/ })).toHaveAttribute('aria-current', 'page');
  await expect(rows.first().locator('h2')).not.toHaveText(firstTitle!);

  // Filtering starts again from page one and drops the param.
  await page.getByLabel('Search posts').fill('kotlin');
  await expect(page).not.toHaveURL(/page=/);
  expect(await rows.count()).toBeLessThanOrEqual(10);
});

test('nav wraps on a 360px screen without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ['./', 'blog/', 'blog/hibernate-vs-jpa-complete-guide/', 'contact/']) {
    await page.goto(route, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
  await page.goto('./');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Writing' }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
});
