import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Smoke + accessibility check for one built SvelteKit front-end.
 *
 * Driven by env because each app must be built and previewed by the wrapper
 * (bin/test-e2e --svelte) before this runs:
 *   BASE_URL — the preview server origin (e.g. http://127.0.0.1:4173)
 *   SLUG     — the form slug; the welcome route is /<slug>/
 *
 * Asserts the route renders server-side + hydrates with no uncaught error and
 * no serious/critical accessibility violations. Deep wizard interaction is
 * covered by the HTML harness (identical scoring engine, shared fixtures).
 */
const BASE_URL = process.env.BASE_URL;
const SLUG = process.env.SLUG;

test.skip(!BASE_URL || !SLUG, 'BASE_URL and SLUG must be set by bin/test-e2e --svelte');

test(`${SLUG ?? 'svelte'} welcome route smoke + a11y`, async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto(`${BASE_URL}/${SLUG}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toBeVisible();

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const blocking = axe.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    blocking,
    `a11y violations:\n${blocking.map((v) => `  ${v.id}: ${v.help}`).join('\n')}`,
  ).toHaveLength(0);

  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});
