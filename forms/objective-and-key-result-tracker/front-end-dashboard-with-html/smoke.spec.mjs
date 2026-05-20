import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tiny static file server — browsers block fetch() and ES-module imports over file://.
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
  await new Promise((r) => server.listen(0, r));
  baseUrl = `http://localhost:${server.address().port}`;
});

test.afterAll(() => server?.close());

test('initial render shows 5 rows', async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page.locator('#grid tbody tr')).toHaveCount(5);
});

test('filter by RAG=red narrows to one row', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('#f-rag').selectOption('red');
  await expect(page.locator('#grid tbody tr')).toHaveCount(1);
  await expect(page.locator('#grid tbody tr td').first()).toContainText('Reduce p99 latency');
});

test('filter by level=team narrows to two rows', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('#f-level').selectOption('team');
  await expect(page.locator('#grid tbody tr')).toHaveCount(2);
});

test('clicking a row expands a detail panel with KRs and flags', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('#grid tbody tr', { hasText: 'Reduce customer churn' }).click();
  await expect(page.locator('tr.detail')).toHaveCount(1);
  await expect(page.locator('tr.detail')).toContainText('Lift NPS from 32 to 50');
  await expect(page.locator('tr.detail')).toContainText('pace-collapse');
});

test('sort by progress_percent toggles direction', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('th[data-sort="progress"]').click();
  const firstAsc = await page.locator('#grid tbody tr td').nth(5).innerText();
  await page.locator('th[data-sort="progress"]').click();
  const firstDesc = await page.locator('#grid tbody tr td').nth(5).innerText();
  expect(firstAsc).not.toEqual(firstDesc);
});
