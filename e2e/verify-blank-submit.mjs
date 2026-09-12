#!/usr/bin/env node
// bin/verify-blank-submit — for every HTML wizard, loads the page fresh
// (its own default/blank state, no persona injection) and clicks
// #submit-btn immediately, asserting the wizard never crashes on a
// blank submission attempt.
//
// This is deliberately the cheapest possible answer to the open backlog
// item "example-invalid.json per form + expected validation-errors
// list": that literal ask needs a hand-curated, meaningfully-invalid
// fixture PLUS its exact expected error-message list per form — genuine
// per-form content authorship at fleet scale (350+ forms), not a
// mechanical sweep, so it is intentionally NOT attempted here (see
// tasks.md). What IS mechanical and fleet-safe is checking the one
// thing every wizard must get right regardless of its own validation
// rules: clicking Submit on a still-blank form must never throw, no
// matter what that form's own required-field rules are. A crash here is
// unconditionally a bug — the exact class that broke
// advance-statement-about-care (see bin/generate-export-samples,
// bin/verify-personas).
//
// A blank submission then either gets blocked (the common case — most
// forms have at least one required field) or renders a report (some
// legitimate all-optional calculators do this on purpose). Both are
// fine; only a page error is a hard failure.
//
// Usage:
//   node e2e/verify-blank-submit.mjs [slug...]
//
// With no slugs, runs every form with a #submit-btn. Exits non-zero if
// any form crashes on a blank submit.

import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const HERE = resolve(fileURLToPath(import.meta.url), '..');
const REPO_ROOT = resolve(HERE, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

async function serveDir(root) {
  const server = createServer((req, res) => {
    const rawPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let rel = normalize(rawPath).replace(/^(\.\.[/\\])+/, '');
    if (rel === '/' || rel === '') rel = '/index.html';
    const filePath = join(root, rel);
    if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.statusCode = 404;
      res.end('not found');
      return;
    }
    res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const addr = server.address();
  return {
    url: `http://127.0.0.1:${addr.port}`,
    stop: () => new Promise((r) => server.close(() => r())),
  };
}

function allFormSlugs() {
  const out = execSync('bin/forms-as-kebab-case', { cwd: REPO_ROOT, encoding: 'utf8' });
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

function eligibility(slug) {
  const dir = resolve(REPO_ROOT, 'forms', slug, 'front-end-with-html');
  const indexPath = join(dir, 'index.html');
  if (!existsSync(indexPath)) return { ok: false, reason: 'no-html-front-end' };
  if (!readFileSync(indexPath, 'utf8').includes('id="submit-btn"')) return { ok: false, reason: 'no-submit-btn' };
  return { ok: true, dir };
}

async function checkOne(browser, dir) {
  const server = await serveDir(dir);
  const pageErrors = [];
  const page = await browser.newPage();
  page.on('pageerror', (err) => pageErrors.push(err.message ?? String(err)));
  try {
    await page.goto(`${server.url}/index.html`, { waitUntil: 'networkidle' });
    const submitBtn = page.locator('#submit-btn');
    if ((await submitBtn.count()) === 0) return { crashed: false, note: 'no #submit-btn after load' };
    await submitBtn.click();
    await page.waitForTimeout(200);
    if (pageErrors.length > 0) {
      return { crashed: true, note: pageErrors[0] };
    }
    const report = page.locator('#report');
    let rendered = false;
    if ((await report.count()) > 0) {
      const html = (await report.innerHTML()).trim();
      rendered = html !== '' && !/^<p class="empty-message">/.test(html);
    }
    return { crashed: false, note: rendered ? 'blank submit rendered a report (0 required fields?)' : null };
  } catch (e) {
    return { crashed: true, note: `exception: ${e.message?.split('\n')[0] ?? e}` };
  } finally {
    await page.close();
    await server.stop();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const slugs = args.filter((a) => !a.startsWith('--'));
  const targets = slugs.length ? slugs : allFormSlugs();

  const browser = await chromium.launch();
  let passed = 0;
  let crashed = 0;
  const skipped = {};
  const crashes = [];
  const notes = [];
  try {
    for (const slug of targets) {
      const elig = eligibility(slug);
      if (!elig.ok) {
        skipped[elig.reason] = (skipped[elig.reason] ?? 0) + 1;
        continue;
      }
      let result;
      try {
        result = await checkOne(browser, elig.dir);
      } catch (e) {
        crashed++;
        crashes.push(`${slug}: ERROR ${e.message?.split('\n')[0] ?? e}`);
        continue;
      }
      if (result.crashed) {
        crashed++;
        crashes.push(`${slug}: ${result.note}`);
      } else {
        passed++;
        if (result.note) notes.push(`${slug}: ${result.note}`);
      }
    }
  } finally {
    await browser.close();
  }

  const totalSkip = Object.values(skipped).reduce((a, b) => a + b, 0);
  console.log(`verify-blank-submit: ${passed} form(s) passed, ${crashed} crashed, ${totalSkip} SKIP`);
  for (const [reason, count] of Object.entries(skipped).sort()) {
    console.log(`  SKIP (${reason}): ${count}`);
  }
  if (crashes.length > 0) {
    console.log('Crashes:');
    for (const c of crashes) console.log(`  ${c}`);
  }
  if (notes.length > 0) {
    console.log('Notes (blank submit rendered a report — not a failure, just worth eyeballing):');
    for (const n of notes) console.log(`  ${n}`);
  }
  process.exit(crashed > 0 ? 1 : 0);
}

main();
