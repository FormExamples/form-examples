import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { formSlugs, htmlDir } from '../lib/forms.js';
import { serveDir } from '../lib/server.js';

/**
 * Generic smoke + accessibility sweep over every form's HTML front-end.
 *
 * The forms are single-page continuous wizards that share a Lily structure:
 * a <form>, a primary action button (button[data-variant="primary"]), and a
 * report region. Without per-form field knowledge we can still assert the
 * high-signal invariants that break most often:
 *   1. the page loads with no uncaught JavaScript error;
 *   2. it has no serious/critical accessibility violations (axe-core);
 *   3. the primary action is present and firing it throws no error
 *      (catches the "submit does nothing" class of bug).
 */
for (const slug of formSlugs()) {
  test.describe(slug, () => {
    test(`${slug} HTML front-end smoke + a11y`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(String(e)));

      const server = await serveDir(htmlDir(slug));
      try {
        await page.goto(`${server.url}/index.html`, { waitUntil: 'networkidle' });

        // 1. Structure rendered. Most forms use a <form>, but a few
        // document/checklist styles legitimately do not — so require a
        // rendered body with meaningful content rather than a specific tag.
        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('main, form, [role="main"]').first()).toBeVisible();

        // 2. Accessibility: no serious/critical violations.
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        const blocking = axe.violations.filter(
          (v) => v.impact === 'serious' || v.impact === 'critical',
        );
        expect(
          blocking,
          `a11y violations:\n${blocking.map((v) => `  ${v.id}: ${v.help}`).join('\n')}`,
        ).toHaveLength(0);

        // 3. Primary action: if a visible, enabled one exists, firing it must
        // not throw. Multi-step and document forms may hide/disable it until a
        // later step, which is valid — so this whole check is best-effort.
        const primary = page.locator('button[data-variant="primary"]').first();
        if ((await primary.count()) > 0 && (await primary.isVisible()) && (await primary.isEnabled())) {
          const pathBefore = new URL(page.url()).pathname;
          await primary.click({ trial: false }).catch(() => {});
          await page.waitForTimeout(200);
          // Single-page-wizard invariant: firing the primary action must render
          // the result in-page, never navigate to a separate document. A submit
          // that redirects to a non-existent report page (a 404) is the bug
          // class this catches — the report must appear on index.html itself.
          expect(
            new URL(page.url()).pathname,
            'primary action must not navigate away from the single-page wizard',
          ).toBe(pathBefore);
        }

        // 4. Print stylesheet hides interactive chrome. Emulate print media
        // and confirm a primary/action button is not displayed (the report is
        // what should print, not the wizard controls).
        await page.emulateMedia({ media: 'print' });
        const anyButton = page.locator('button').first();
        if (await anyButton.count() > 0) {
          const display = await anyButton.evaluate((el) => getComputedStyle(el).display);
          expect(display, 'buttons should be display:none under @media print').toBe('none');
        }
        await page.emulateMedia({ media: 'screen' });

        // No uncaught errors at any point.
        expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
      } finally {
        await server.stop();
      }
    });
  });
}
