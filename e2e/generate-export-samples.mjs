#!/usr/bin/env node
// bin/generate-export-samples — generates examples/export-sample.csv and
// examples/export-sample.tsv per form, matching that form's typical
// persona (personas.json's first entry), by actually driving the real
// wizard through a headless browser: load index.html, inject the
// persona's state via window.__FORM_STATE__.setState() (the same
// cross-module contract js/form-import.js uses), click the real
// "Download CSV"/"Download TSV" buttons injected by js/form-export.js,
// and save the real downloaded content. This guarantees fidelity to the
// actual export feature rather than reimplementing its serialisation
// logic a second time.
//
// Scoped to forms that have both js/form-export.js wired (via
// bin/form-export-import-refactor) AND a real examples/personas.json —
// the same two preconditions the e2e harness's own
// form-export-import.spec.ts already checks per form. Forms missing
// either are reported as SKIP, not silently omitted.
//
// Usage:
//   node e2e/generate-export-samples.mjs [--check] [slug...]
//
// --check reports which forms would change, and exits non-zero if any
// change is pending (CI drift detector). Default (no flags): generate
// and write. With no slugs, runs the full eligible fleet.

import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  const personasPath = resolve(REPO_ROOT, 'forms', slug, 'examples', 'personas.json');
  if (!existsSync(indexPath)) return { ok: false, reason: 'no-html-front-end' };
  if (!readFileSync(indexPath, 'utf8').includes('form-export.js')) return { ok: false, reason: 'no-form-export' };
  if (!existsSync(personasPath)) return { ok: false, reason: 'no-personas' };
  let personas;
  try {
    personas = JSON.parse(readFileSync(personasPath, 'utf8')).personas;
  } catch {
    return { ok: false, reason: 'personas-unparseable' };
  }
  if (!Array.isArray(personas) || personas.length === 0 || !personas[0].state) {
    return { ok: false, reason: 'no-persona-state' };
  }
  return { ok: true, dir, persona: personas[0] };
}

async function generateOne(browser, slug, dir, persona) {
  const server = await serveDir(dir);
  const page = await browser.newPage();
  const result = { csv: null, tsv: null };
  try {
    await page.goto(`${server.url}/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate((state) => window.__FORM_STATE__.setState(state), persona.state);
    // setState() re-renders synchronously; a short settle avoids racing the
    // export toolbar's own re-check of window.__FORM_STATE__ on some forms.
    await page.waitForTimeout(100);

    for (const [label, key] of [['Download CSV', 'csv'], ['Download TSV', 'tsv']]) {
      const btn = page.getByRole('button', { name: label });
      if ((await btn.count()) === 0) continue;
      const [download] = await Promise.all([page.waitForEvent('download'), btn.click()]);
      const stream = await download.createReadStream();
      const chunks = [];
      for await (const c of stream) chunks.push(c);
      result[key] = Buffer.concat(chunks).toString('utf8');
    }
  } finally {
    await page.close();
    await server.stop();
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const slugs = args.filter((a) => !a.startsWith('--'));
  const targets = slugs.length ? slugs : allFormSlugs();

  const browser = await chromium.launch();
  let changed = 0;
  let unchanged = 0;
  const skipped = {};
  try {
    for (const slug of targets) {
      const elig = eligibility(slug);
      if (!elig.ok) {
        skipped[elig.reason] = (skipped[elig.reason] ?? 0) + 1;
        continue;
      }

      let csv = null;
      let tsv = null;
      try {
        ({ csv, tsv } = await generateOne(browser, slug, elig.dir, elig.persona));
      } catch (e) {
        skipped['error'] = (skipped['error'] ?? 0) + 1;
        console.error(`  ERROR ${slug}: ${e.message?.split('\n')[0] ?? e}`);
        continue;
      }
      if (csv === null && tsv === null) {
        skipped['no-export-buttons-rendered'] = (skipped['no-export-buttons-rendered'] ?? 0) + 1;
        continue;
      }

      const examplesDir = resolve(REPO_ROOT, 'forms', slug, 'examples');
      const csvPath = join(examplesDir, 'export-sample.csv');
      const tsvPath = join(examplesDir, 'export-sample.tsv');
      const currentCsv = existsSync(csvPath) ? readFileSync(csvPath, 'utf8') : null;
      const currentTsv = existsSync(tsvPath) ? readFileSync(tsvPath, 'utf8') : null;
      const willChange = (csv !== null && csv !== currentCsv) || (tsv !== null && tsv !== currentTsv);

      if (!willChange) {
        unchanged++;
        continue;
      }
      changed++;
      if (!check) {
        if (csv !== null) writeFileSync(csvPath, csv);
        if (tsv !== null) writeFileSync(tsvPath, tsv);
      } else {
        console.log(`  would change: ${slug}`);
      }
    }
  } finally {
    await browser.close();
  }

  const totalSkip = Object.values(skipped).reduce((a, b) => a + b, 0);
  const verb = check ? '[CHECK] pending' : 'changed';
  console.log(`generate-export-samples: ${changed} form(s) ${verb}, ${unchanged} up to date, ${totalSkip} SKIP`);
  for (const [reason, count] of Object.entries(skipped).sort()) {
    console.log(`  SKIP (${reason}): ${count}`);
  }
  process.exit(check && changed > 0 ? 1 : 0);
}

main();
