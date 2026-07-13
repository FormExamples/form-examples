'use strict';
/*
 * bin/lib/engine-loader.js — load a form's HTML scoring engine headless.
 *
 * Shared by bin/test-engines and bin/test-personas. Loads the pure engine
 * modules of forms/<slug>/front-end-with-html/js/ in a Node vm sandbox with a
 * stub DOM (so only pure logic runs), in dependency order (types -> rules ->
 * flags -> grader), skipping UI and ES-module files. Returns the published
 * namespace object plus its discovered grader / flags / factory function names.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const NON_ENGINE = new Set([
  'form-app.js', 'dashboard-app.js', 'dashboard-types.js', 'api.js',
  'data.js', 'sample-data.js', 'a11y.js', 'form-validator.js',
  'linkage.js', 'dashboard.js', 'wizard.js', 'app.js', 'main.js', 'ui.js',
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

/** Load one form's engine. Returns { ns, name, fns, grader, factory, flags, esm, error }. */
function loadEngine(repoRoot, slug) {
  const jsDir = path.join(repoRoot, 'forms', slug, 'front-end-with-html', 'js');
  const sandbox = makeSandbox();
  let files;
  try {
    files = fs.readdirSync(jsDir)
      .filter((f) => f.endsWith('.js') && !NON_ENGINE.has(f))
      .sort((a, b) => loadRank(a) - loadRank(b) || a.localeCompare(b));
  } catch {
    return { error: 'no js/ dir' };
  }
  const remaining = new Set(files);
  let esm = false, lastErr = {}, progress = true;
  while (progress && remaining.size) {
    progress = false;
    for (const f of [...remaining]) {
      const src = fs.readFileSync(path.join(jsDir, f), 'utf8');
      if (ESM_RE.test(src)) { remaining.delete(f); esm = true; continue; }
      try {
        vm.runInContext(src, sandbox, { filename: f });
        remaining.delete(f); progress = true;
      } catch (e) { lastErr[f] = String(e.message || e).split('\n')[0]; }
    }
  }
  if (remaining.size) {
    const f = [...remaining][0];
    return { error: `${f}: ${lastErr[f] || 'unknown'}` };
  }
  const { ns, name } = findNamespace(sandbox.window);
  if (!ns) return { esm, error: esm ? 'ESM engine' : 'no namespace' };
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
  return { ns, name, fns, grader, factory, flags, esm };
}

module.exports = { loadEngine };
