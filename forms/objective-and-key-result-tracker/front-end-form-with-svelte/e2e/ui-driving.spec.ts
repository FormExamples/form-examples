import { test, expect } from '@playwright/test';

test('fixture 01 driven through the UI shows GREEN', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const step1 = page.locator('[data-step="1"]');
  await step1.locator('label', { hasText: 'Reporter name' }).locator('input').fill('Alice');
  await step1.locator('label', { hasText: /^Level\s/ }).locator('select').selectOption('team');
  await step1.locator('label', { hasText: /^Cycle\s/ }).locator('select').selectOption('quarterly');
  await step1.locator('label', { hasText: 'Cycle start date' }).locator('input').fill('2026-04-01');
  await step1.locator('label', { hasText: 'Cycle end date' }).locator('input').fill('2026-06-30');

  await page.locator('[data-step="3"]').locator('label', { hasText: 'DRI' }).locator('input').fill('Alice');

  const kr1 = page.locator('[data-step="5"] fieldset').first();
  await kr1.locator('label', { hasText: 'Title' }).locator('input').fill('Lift NPS to 50');
  await kr1.locator('label', { hasText: 'Type' }).locator('select').selectOption('numeric');
  await kr1.locator('label', { hasText: 'Start' }).locator('input').fill('32');
  await kr1.locator('label', { hasText: 'Current' }).locator('input').fill('46');
  await kr1.locator('label', { hasText: 'Target' }).locator('input').fill('50');

  const step10 = page.locator('[data-step="10"]');
  await step10.locator('label', { hasText: 'Progress percent' }).locator('input').fill('80');
  await step10.locator('label', { hasText: 'Confidence decile' }).locator('input').fill('8');
  await step10.locator('label', { hasText: 'Stretch tier' }).locator('select').selectOption('1');
  await step10.locator('label', { hasText: 'Alignment grade' }).locator('input').fill('5');
  await step10.locator('label', { hasText: 'Impact tier' }).locator('input').fill('4');
  await step10.locator('label', { hasText: 'SMART quality' }).locator('input').fill('5');
  await step10.locator('label', { hasText: 'Pace deviation' }).locator('input').fill('0');

  await page.getByTestId('btn-compute').click();
  await expect(page.getByTestId('result')).toContainText('GREEN');
});
