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

// Tiny static file server so the page (loaded over http://) can do ES-module
// imports — browsers block module imports over the file:// scheme.
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

test.describe('engine.js — every fixture', () => {
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
