'use strict';
/*
 * bin/lib/engine-loader.js — load a form's HTML scoring engine headless.
 *
 * Shared by bin/test-engines and bin/test-personas. Loads the pure engine
 * modules of forms/<slug>/front-end-with-html/js/ and returns the engine
 * namespace plus its discovered grader / flags / factory function names.
 *
 * Two load paths, matching the front-ends' history:
 *
 *  - ES modules (the fleet-wide state since the 2026-07 conversion): the js/
 *    dir is copied to a temp dir with a `{"type": "module"}` package.json
 *    (front-end .js files are ESM but Node treats bare .js as CommonJS), each
 *    engine module is dynamically import()ed with real ESM semantics — no
 *    source rewriting — and every module's exports are merged into one
 *    namespace object. UI/plumbing modules (NON_ENGINE) are copied so
 *    relative imports resolve, but never imported themselves.
 *
 *  - Classic scripts (pre-conversion fallback): run in a Node vm sandbox with
 *    a stub DOM, in dependency order (types -> rules -> flags -> grader),
 *    retry-until-stable; the published window.<Namespace> is the engine.
 *
 * loadEngine() is async (dynamic import demands it) — callers await it.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

// UI / data / plumbing modules that are not part of the pure engine and that
// touch the DOM or browser globals — never loaded or imported here.
const NON_ENGINE = new Set([
  'form-app.js', 'dashboard-app.js', 'dashboard-types.js', 'api.js',
  'data.js', 'sample-data.js', 'a11y.js', 'form-validator.js',
  'linkage.js', 'dashboard.js', 'wizard.js', 'app.js', 'main.js', 'ui.js',
  // Header-control UI helpers (vendored fleet-wide): DOM-driven, and as
  // classic scripts each declares a top-level STORAGE_KEY, which collides
  // in the shared vm scope.
  'theme-select.js', 'locale-select.js', 'text-size-picker.js',
  'share-picker.js', 'date-time-picker.js', 'table-export.js',
]);
const ESM_RE = /^\s*(export|import)\s/m;

function loadRank(f) {
  if (/type/.test(f)) return 0;
  if (/rule/.test(f)) return 1;
  if (/flag/.test(f)) return 2;
  if (/grad|calc|score|maturity/.test(f)) return 4;
  return 3;
}

function makeSandbox() {
  const noop = () => {};
  const el = new Proxy({}, { get: () => noop });
  const doc = {
    addEventListener: noop, getElementById: () => null,
    querySelector: () => null, querySelectorAll: () => [],
    createElement: () => el, body: el, documentElement: el,
  };
  const sandbox = {
    window: {}, document: doc, console: { log: noop, warn: noop, error: noop },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    navigator: { language: 'en-GB' }, location: { href: '' },
    setTimeout: noop, structuredClone: (x) => JSON.parse(JSON.stringify(x)),
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function findNamespace(win) {
  let best = null, bestName = null, bestCount = -1;
  for (const k of Object.keys(win)) {
    const v = win[k];
    if (v && typeof v === 'object') {
      const n = Object.values(v).filter((x) => typeof x === 'function').length;
      if (n > bestCount) { best = v; bestName = k; bestCount = n; }
    }
  }
  return { ns: best, name: bestName };
}

function pick(fns, re, avoid) {
  return fns.find((n) => re.test(n) && !(avoid && avoid.test(n)));
}

// Discover the grader / default-state factory / flags entry points on a
// namespace object. Shared by both load paths.
function discover(ns) {
  const fns = Object.keys(ns).filter((k) => typeof ns[k] === 'function');
  const perItem = /timepoint|domain|item|sign|section|criterion|question|category|row|dimension|subscale|response|answer|single|^sum/i;
  const grader =
    pick(fns, /^calculate.*grade$/i, perItem) ||
    pick(fns, /^(grade|assess|evaluate|calculate)(Assessment|Form|Record|Overall|Composite|Total|Maturity)/i, perItem) ||
    pick(fns, /grade|maturity|score|evaluate|classify|validity|validation|status|appropriate|stage|stratif|risk|complet|readiness/i,
      new RegExp(`${perItem.source}|label|class$|band$|points$|helper|^is[A-Z]`, 'i'));
  const factory =
    pick(fns, /^(createDefault|createEmpty|empty|default)/i) ||
    pick(fns, /(Assessment|Checklist|State|Data|Form)$/i);
  const flags = pick(fns, /flag|detect/i);
  return { fns, grader, factory, flags };
}

// Stub browser globals onto the real globalThis for the duration of the ESM
// imports (module top-level code may touch them; the vm path stubs them via
// its sandbox). Returns a restore function.
function installBrowserStubs() {
  const stub = makeSandbox();
  const names = ['window', 'document', 'localStorage', 'navigator', 'location', 'self'];
  const saved = {};
  for (const n of names) {
    saved[n] = Object.getOwnPropertyDescriptor(globalThis, n);
    if (!(n in globalThis)) {
      Object.defineProperty(globalThis, n, { value: stub[n], configurable: true });
    }
  }
  return () => {
    for (const n of names) {
      if (saved[n]) Object.defineProperty(globalThis, n, saved[n]);
      else delete globalThis[n];
    }
  };
}

// ESM path: copy js/ beside a type:module package.json, import each engine
// module for real, merge the exports.
async function loadEsm(jsDir, files) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-loader-'));
  const restore = installBrowserStubs();
  try {
    fs.cpSync(jsDir, tmp, { recursive: true });
    fs.writeFileSync(path.join(tmp, 'package.json'), '{ "type": "module" }\n');
    const ns = {};
    let loaded = 0;
    for (const f of files) {
      let mod;
      try {
        mod = await import(pathToFileURL(path.join(tmp, f)).href);
      } catch (e) {
        return { error: `${f}: ${String(e.message || e).split('\n')[0]}` };
      }
      for (const k of Object.keys(mod)) {
        if (k !== 'default') ns[k] = mod[k];
      }
      loaded++;
    }
    return { ns, name: 'esm', loaded, esm: true };
  } finally {
    restore();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// Classic path: shared vm sandbox, dependency order, retry-until-stable.
function loadClassic(jsDir, files) {
  const sandbox = makeSandbox();
  const remaining = new Set(files);
  let lastErr = {}, progress = true, loaded = 0;
  while (progress && remaining.size) {
    progress = false;
    for (const f of [...remaining]) {
      const src = fs.readFileSync(path.join(jsDir, f), 'utf8');
      try {
        vm.runInContext(src, sandbox, { filename: f });
        remaining.delete(f); loaded++; progress = true;
      } catch (e) { lastErr[f] = String(e.message || e).split('\n')[0]; }
    }
  }
  if (remaining.size) {
    const f = [...remaining][0];
    return { error: `${f}: ${lastErr[f] || 'unknown'}` };
  }
  const { ns, name } = findNamespace(sandbox.window);
  if (!ns) return { error: 'no namespace' };
  return { ns, name: `window.${name}`, loaded, esm: false };
}

/** Load one form's engine.
 *  Returns { ns, name, fns, grader, factory, flags, esm, loaded, error }. */
async function loadEngine(repoRoot, slug) {
  const jsDir = path.join(repoRoot, 'forms', slug, 'front-end-with-html', 'js');
  let files;
  try {
    files = fs.readdirSync(jsDir)
      .filter((f) => f.endsWith('.js') && !NON_ENGINE.has(f))
      .sort((a, b) => loadRank(a) - loadRank(b) || a.localeCompare(b));
  } catch {
    return { error: 'no js/ dir' };
  }
  const esm = files.some((f) =>
    ESM_RE.test(fs.readFileSync(path.join(jsDir, f), 'utf8')));
  const base = esm ? await loadEsm(jsDir, files) : loadClassic(jsDir, files);
  if (base.error) return { esm, error: base.error };
  return { ...base, ...discover(base.ns) };
}

module.exports = { loadEngine };
