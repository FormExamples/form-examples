import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, '../test-fixtures/scoring');

const fixtures = fs.readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, body: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8')) }));

// Tiny static file server rooted at this consolidated front-end directory so
// the pages (loaded over http://) can do ES-module imports and fetch() —
// browsers block both over the file:// scheme.
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mjs': 'application/javascript', '.json': 'application/json' };
let server, baseUrl;

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!filePath.startsWith(__dirname)) { res.writeHead(403).end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404).end(); return; }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => { await new Promise((r) => server.close(r)); });

test.describe('engine.js — every fixture (index.html)', () => {
  for (const { file, body } of fixtures) {
    test(`${file}: ${body.name}`, async ({ page }) => {
      await page.goto(`${baseUrl}/index.html`);
      await page.waitForFunction(() => typeof window.gradeObjective === 'function');
      const result = await page.evaluate((input) => window.gradeObjective(input), body.input);
      expect(result.computedCompositeRag).toBe(body.expected.computedCompositeRag);
      const got = result.flags.map((f) => f.flagCode).sort();
      const want = body.expected.expectedFlags.map((f) => f.flagCode).sort();
      expect(got).toEqual(want);
    });
  }
});

test.describe('dashboard.html', () => {
  test('initial render shows 5 rows', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard.html`);
    await expect(page.locator('#grid tbody tr')).toHaveCount(5);
  });

  test('filter by RAG=red narrows to one row', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard.html`);
    await page.locator('#f-rag').selectOption('red');
    await expect(page.locator('#grid tbody tr')).toHaveCount(1);
    await expect(page.locator('#grid tbody tr td').first()).toContainText('Reduce p99 latency');
  });

  test('filter by level=team narrows to two rows', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard.html`);
    await page.locator('#f-level').selectOption('team');
    await expect(page.locator('#grid tbody tr')).toHaveCount(2);
  });

  test('clicking a row expands a detail panel with KRs and flags', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard.html`);
    await page.locator('#grid tbody tr', { hasText: 'Reduce customer churn' }).click();
    await expect(page.locator('tr.detail')).toHaveCount(1);
    await expect(page.locator('tr.detail')).toContainText('Lift NPS from 32 to 50');
    await expect(page.locator('tr.detail')).toContainText('pace-collapse');
  });

  test('sort by progress_percent toggles direction', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard.html`);
    await page.locator('th[data-sort="progress"]').click();
    const firstAsc = await page.locator('#grid tbody tr td').nth(5).innerText();
    await page.locator('th[data-sort="progress"]').click();
    const firstDesc = await page.locator('#grid tbody tr td').nth(5).innerText();
    expect(firstAsc).not.toEqual(firstDesc);
  });
});
