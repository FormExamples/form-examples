#!/usr/bin/env node
// bin/verify-personas — for every eligible form, drives the real wizard
// through a headless browser for EVERY entry in examples/personas.json:
// inject that persona's state via window.__FORM_STATE__.setState() (the
// same cross-module contract js/form-export.js/js/form-import.js use),
// click the real #submit-btn, and assert the wizard actually completed —
// no page error, no validation errors surfaced, and #report rendered a
// real result instead of the empty-state placeholder.
//
// This is a UI-level smoke check, not a field-level one: bin/test-personas
// already verifies each persona's `expected` grade against the scoring
// engine at the pure-Node/module level, so re-checking individual expected
// fields here would just re-derive that result through a second, much
// slower path. What bin/test-personas CANNOT see is the wizard's own
// submit-and-render code path — recomputeDerived() / calculateX() /
// renderReport() wiring, and any DOM code the render touches (e.g. a
// crash inside a rerender() helper). That is exactly the class of bug this
// script exists to catch: advance-statement-about-care's `.btn-remove`
// mismatch (found via the sibling generate-export-samples.mjs) would also
// have been caught here, since it crashed on any state containing a
// non-empty array field.
//
// personas.json is an engine fixture, not a full wizard-submission one —
// it deliberately omits administrative fields the scoring engine never
// reads (clinician name, signature, date typed). Before clicking submit,
// this script fills any still-empty required field it can recognise (the
// dominant `[data-required]` convention, plus the two rarer required-
// radio-group conventions `[data-required-group]` and
// `[data-required-radio]`) — never touching a field the persona actually
// set. This is a best-effort fill, not a guarantee: some personas are
// themselves deliberately incomplete (`missing-*`, `incomplete-*`,
// "Blank notice...", "...dies with an almost blank record") to exercise
// the ENGINE's own incompleteness handling — for those, the wizard
// correctly blocking submission is the wizard working as designed, not a
// bug. So a validation block after the fill is logged as informational,
// not a hard failure; only two things count as a hard failure: a page
// error/exception, and a report that never rendered despite validation
// having genuinely passed (0 visible errors) — that combination has no
// legitimate explanation and is exactly the class of bug this script
// exists to catch (see advance-statement-about-care, found via the
// sibling generate-export-samples.mjs).
//
// Each persona gets its own fresh page (not just a fresh setState() call
// on a shared page): reusing one page across a form's several personas
// hid a real race — a stale async effect from the previous persona could
// overwrite #report right after the current persona's submit had
// rendered it, making a persona fail only when checked after another one
// on the same page, never in isolation. Pages are cheap (no new browser
// process); only the per-form static file server is shared/reused.
//
// Scoped to forms with: a #submit-btn + window.__FORM_STATE__ (the wizard
// shape this script can drive genetically) AND a real examples/
// personas.json with at least one persona carrying a `state`. Forms
// missing any of these are reported as SKIP, not silently omitted.
//
// Usage:
//   node e2e/verify-personas.mjs [slug...]
//
// With no slugs, runs the full eligible fleet. Exits non-zero if any
// persona hits a hard failure (page error, or a report that never
// rendered despite clean validation). Validation blocks are printed as
// informational notes, not counted as failures.

import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
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
  const appPath = join(dir, 'js', 'form-app.js');
  const personasPath = resolve(REPO_ROOT, 'forms', slug, 'examples', 'personas.json');
  if (!existsSync(indexPath)) return { ok: false, reason: 'no-html-front-end' };
  if (!readFileSync(indexPath, 'utf8').includes('id="submit-btn"')) return { ok: false, reason: 'no-submit-btn' };
  if (!existsSync(appPath) || !readFileSync(appPath, 'utf8').includes('__FORM_STATE__')) {
    return { ok: false, reason: 'no-form-state-contract' };
  }
  if (!existsSync(personasPath)) return { ok: false, reason: 'no-personas' };
  let personas;
  try {
    personas = JSON.parse(readFileSync(personasPath, 'utf8')).personas;
  } catch {
    return { ok: false, reason: 'personas-unparseable' };
  }
  personas = (personas ?? []).filter((p) => p && p.state);
  if (personas.length === 0) return { ok: false, reason: 'no-persona-state' };
  return { ok: true, dir, personas };
}

// In-page fill routine: sets a plausible value on every still-empty
// required field it recognises, then dispatches real 'input'/'change'
// events so the app's own listeners (writePath/setPath/recomputeDerived/
// etc.) update internal state exactly as a real keystroke or click would
// — a bare DOM property assignment is invisible to a form whose
// validateForm() or engine call reads internal state rather than the
// live DOM value.
const FILL_REQUIRED_FIELDS = () => {
  function fire(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  document.querySelectorAll('[data-required]').forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (tag === 'select') {
      if (!el.value) {
        const opt = Array.from(el.options).find((o) => o.value !== '');
        if (opt) {
          el.value = opt.value;
          fire(el);
        }
      }
    } else if (type === 'checkbox') {
      if (!el.checked) {
        el.checked = true;
        fire(el);
      }
    } else if (type === 'radio') {
      const form = el.closest('form') ?? document;
      if (el.name && !form.querySelector(`input[name="${el.name}"]:checked`)) {
        el.checked = true;
        fire(el);
      }
    } else if (type === 'date') {
      if (!el.value) {
        el.value = '2026-09-01';
        fire(el);
      }
    } else if (type === 'time') {
      if (!el.value) {
        el.value = '12:00';
        fire(el);
      }
    } else if (type === 'number') {
      if (!el.value || !el.value.trim()) {
        el.value = el.min || '1';
        fire(el);
      }
    } else if (!el.value || !el.value.trim()) {
      el.value = 'E2E test value';
      fire(el);
    }
  });
  // Rarer required-radio-group conventions: a wrapping element carries
  // data-required-group/data-required-radio (not the individual radio
  // inputs), and validity is "at least one radio in this group is
  // checked" rather than a single element's own value.
  document.querySelectorAll('[data-required-group], [data-required-radio]').forEach((group) => {
    const radios = group.querySelectorAll('input[type="radio"]');
    if (radios.length > 0 && !group.querySelector('input[type="radio"]:checked')) {
      radios[0].checked = true;
      fire(radios[0]);
    }
  });
};

// Drive one persona through the wizard on a fresh page and return
// { hardFailures, notes } (hardFailures empty = pass).
async function checkOnePersona(browser, serverUrl, persona) {
  const hardFailures = [];
  const notes = [];
  const pageErrors = [];
  const page = await browser.newPage();
  const onPageError = (err) => pageErrors.push(err.message ?? String(err));
  page.on('pageerror', onPageError);
  try {
    await page.goto(`${serverUrl}/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate((state) => window.__FORM_STATE__.setState(state), persona.state);
    await page.waitForTimeout(50);
    await page.evaluate(FILL_REQUIRED_FIELDS);
    await page.waitForTimeout(50);

    const submitBtn = page.locator('#submit-btn');
    if ((await submitBtn.count()) === 0) {
      hardFailures.push('no #submit-btn found after setState()');
      return { hardFailures, notes };
    }
    await submitBtn.click();
    await page.waitForTimeout(200);

    if (pageErrors.length > 0) {
      hardFailures.push(`page error on submit: ${pageErrors[0]}`);
      return { hardFailures, notes };
    }

    let validationBlocked = false;
    const errorSummary = page.locator('#error-summary');
    if ((await errorSummary.count()) > 0) {
      const hidden = await errorSummary.evaluate((el) => el.hidden);
      if (!hidden) {
        validationBlocked = true;
        const text = (await errorSummary.innerText()).trim().slice(0, 200);
        notes.push(`validation blocked submission (possibly a deliberately-incomplete persona): ${text}`);
      }
    }

    const report = page.locator('#report');
    if ((await report.count()) > 0) {
      const html = (await report.innerHTML()).trim();
      // A real report can legitimately reuse the same "empty-message"
      // class for an internal "no items in this sub-section" line (e.g.
      // "No safety flags raised.") — checking for that substring ANYWHERE
      // in the report false-positives on those. The actual unsubmitted
      // placeholder is the report's ENTIRE content, so check the start of
      // the string instead of an anywhere-substring search.
      const isPlaceholder = html === '' || /^<p class="empty-message">/.test(html);
      if (isPlaceholder && !validationBlocked) {
        hardFailures.push('report never rendered despite validation reporting no errors');
      }
    } else {
      hardFailures.push('no #report element found');
    }
  } catch (e) {
    hardFailures.push(`exception: ${e.message?.split('\n')[0] ?? e}`);
  } finally {
    page.off('pageerror', onPageError);
    await page.close();
  }
  return { hardFailures, notes };
}

async function verifyForm(browser, dir, personas) {
  const server = await serveDir(dir);
  const results = [];
  try {
    for (const persona of personas) {
      const { hardFailures, notes } = await checkOnePersona(browser, server.url, persona);
      results.push({ name: persona.name ?? '(unnamed)', hardFailures, notes });
    }
  } finally {
    await server.stop();
  }
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const slugs = args.filter((a) => !a.startsWith('--'));
  const targets = slugs.length ? slugs : allFormSlugs();

  const browser = await chromium.launch();
  let formsPassed = 0;
  let formsFailed = 0;
  let personasChecked = 0;
  let personasFailed = 0;
  let personasWithNotes = 0;
  const skipped = {};
  const failures = [];
  const noteLines = [];
  try {
    for (const slug of targets) {
      const elig = eligibility(slug);
      if (!elig.ok) {
        skipped[elig.reason] = (skipped[elig.reason] ?? 0) + 1;
        continue;
      }

      let results;
      try {
        results = await verifyForm(browser, elig.dir, elig.personas);
      } catch (e) {
        formsFailed++;
        failures.push(`${slug}: ERROR ${e.message?.split('\n')[0] ?? e}`);
        console.error(`  ERROR ${slug}: ${e.message?.split('\n')[0] ?? e}`);
        continue;
      }

      let formOk = true;
      for (const { name, hardFailures, notes } of results) {
        personasChecked++;
        if (hardFailures.length > 0) {
          formOk = false;
          personasFailed++;
          for (const p of hardFailures) failures.push(`${slug} / ${name}: ${p}`);
        }
        if (notes.length > 0) {
          personasWithNotes++;
          for (const n of notes) noteLines.push(`${slug} / ${name}: ${n}`);
        }
      }
      if (formOk) formsPassed++;
      else formsFailed++;
    }
  } finally {
    await browser.close();
  }

  const totalSkip = Object.values(skipped).reduce((a, b) => a + b, 0);
  console.log(
    `verify-personas: ${formsPassed} form(s) passed, ${formsFailed} failed, ` +
      `${personasChecked} persona(s) checked (${personasFailed} hard failure(s), ` +
      `${personasWithNotes} validation-blocked note(s)), ${totalSkip} SKIP`
  );
  for (const [reason, count] of Object.entries(skipped).sort()) {
    console.log(`  SKIP (${reason}): ${count}`);
  }
  if (failures.length > 0) {
    console.log('Hard failures:');
    for (const f of failures) console.log(`  ${f}`);
  }
  if (noteLines.length > 0) {
    console.log('Notes (validation blocked submission — not counted as failures):');
    for (const n of noteLines) console.log(`  ${n}`);
  }
  process.exit(formsFailed > 0 ? 1 : 0);
}

main();
