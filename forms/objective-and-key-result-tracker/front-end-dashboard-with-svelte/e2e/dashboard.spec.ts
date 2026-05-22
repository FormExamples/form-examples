import { test, expect } from '@playwright/test';

async function ready(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
}

test('initial grid shows 5 rows', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-grid-row]')).toHaveCount(5);
});

test('filter RAG=red narrows to one row', async ({ page }) => {
  await ready(page);
  await page.getByLabel('RAG').selectOption('red');
  await expect(page.locator('[data-grid-row]')).toHaveCount(1);
  await expect(page.locator('[data-grid-row]').first()).toContainText('Reduce p99 latency');
});

test('filter level=team narrows to two rows', async ({ page }) => {
  await ready(page);
  await page.getByLabel('Level').selectOption('team');
  await expect(page.locator('[data-grid-row]')).toHaveCount(2);
});

test('filter owner=Alice narrows to one row', async ({ page }) => {
  await ready(page);
  await page.getByLabel('Owner').fill('Alice');
  await expect(page.locator('[data-grid-row]')).toHaveCount(1);
});

test('selecting a row opens detail panel with KRs and flags', async ({ page }) => {
  await ready(page);
  await page.locator('[data-grid-row]', { hasText: 'Reduce customer churn' }).click();
  const panel = page.locator('aside').nth(1);
  await expect(panel).toContainText('Key Results');
  await expect(panel).toContainText('Lift NPS from 32 to 50');
  await expect(panel).toContainText('pace-collapse');
});

test('sort by Progress toggles direction', async ({ page }) => {
  await ready(page);
  const header = page.locator('th[data-sort="progress_percent"]');
  await header.click();
  const firstAsc = await page.locator('[data-grid-row]').first().innerText();
  await header.click();
  const firstDesc = await page.locator('[data-grid-row]').first().innerText();
  expect(firstAsc).not.toEqual(firstDesc);
});
