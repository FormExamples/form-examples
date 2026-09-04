'use strict';
/*
 * bin/lib/engine-loader.js — load a form's HTML scoring engine headless.
 *
 * Shared by bin/test-engines and bin/test-personas. Loads the pure engine
 * modules of forms/<slug>/front-end-with-html/js/ and returns the engine
 * namespace plus its discovered grader / flags / factory function names.
 *
 * Discovery is by PROBING, not by name alone: the default-state factory is
 * the zero-arg export that builds the largest plain object, and the grader is
 * the plausibly-named export whose result over that state looks most like a
 * composite grading result (a plain object carrying rule/flag arrays and a
 * status-like key). Names only break ties. The earlier name-only heuristic
 * mis-picked sub-axis graders and helpers on at least six forms.
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
//
// 'form-validator.js' is deliberately NOT here: it was excluded until this
// comment (as a presumed generic DOM validator), but the only 4 forms in the
// fleet using that filename (code-of-conduct-notice, consent-to-treatment,
// medical-records-release-permission, research-and-planning-privacy-notice)
// all use it as the actual grading engine's entry file — the exclusion
// silently broke both bin/test-engines and bin/test-personas for all 4.
const NON_ENGINE = new Set([
  'form-app.js', 'dashboard-app.js', 'dashboard-types.js', 'api.js',
  'data.js', 'sample-data.js', 'a11y.js',
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

// Run fn with console silenced (engines may console.warn on odd input while
// we probe them) and never let it throw — return { ok, value }.
function quietCall(fn, ...args) {
  const saved = { log: console.log, warn: console.warn, error: console.error };
  const noop = () => {};
  console.log = noop; console.warn = noop; console.error = noop;
  try {
    return { ok: true, value: fn(...args) };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e).split('\n')[0] };
  } finally {
    console.log = saved.log; console.warn = saved.warn; console.error = saved.error;
  }
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// Names that are helpers / labels / sub-scorers rather than an entry point.
const HELPER_NAME = /label$|class$|band$|points$|helper|^is[A-Z]|^has[A-Z]|^format|^parse|^to[A-Z]|^round|^clamp|^num$|^present$|^nonEmpty$|^normalise$|^labelFor$|^rule$|^worse|^max[A-Z]|^min[A-Z]|^sum|^count|Label$|Class$|Order$|^collect|^weeksBetween|^ageIn|^age(Years|Band|On)|^calculateAge|^calculateBMI$|^computeBmi$|^bmiCategory$/;

// A candidate entry-point name: something that grades, scores, validates,
// classifies, evaluates, computes, assesses, summarises, or runs the form.
const ENTRY_NAME = /grade|assess|evaluate|calculate|classify|validat|validity|compute|score|check|status|complet|risk|maturity|stratif|readiness|eligib|review|summari[sz]e|^run|gate|^derive|^aggregate|^worst|candidacy|reconcil|optimi[sz]|triage|decision|screen/i;

// Sub-axis / per-item names the OLD heuristic avoided; still a tie-breaker
// penalty (a real composite usually wins on the probe anyway).
const PER_ITEM_NAME = /timepoint|domain|item|sign|section|criterion|question|category|row|dimension|subscale|response|answer|single|subscore|etiologic|phenotypic|capillary|heartrate|oxygen|respiratory|consciousness/i;

const RULE_KEY = /rule|flag|issue|problem|error|warning|missing|blocker|deficienc|failure|violation|finding/i;
const STATUS_KEY = /^(overall|status|outcome|grade|level|band|category|classification|risk|severity|result|verdict|recommendation|eligib|validity|stage|zone|score|total)/i;

// Score how much a probe result looks like a composite grading result.
function resultScore(res) {
  if (!res.ok) return -1000;
  const v = res.value;
  if (v === undefined || v === null) return -900;
  if (!isPlainObject(v)) {
    // Numbers / strings are tolerated as a last resort (bin/test-engines
    // accepts them) but any structured candidate beats them; a bare array
    // (a flags list) ranks below a string classification.
    if (Array.isArray(v)) return -600;
    return typeof v === 'boolean' ? -800 : -500;
  }
  const keys = Object.keys(v);
  let s = Math.min(keys.length, 6);
  const arrayKeys = keys.filter((k) => Array.isArray(v[k]));
  // One bonus per CLASS of audit array — rules and flags/issues — so a result
  // carrying both (the canonical composite) beats one carrying two rule lists.
  if (arrayKeys.some((k) => /rule|blocker|deficienc|failure|violation|finding|missing|error|warning|problem/i.test(k))) s += 10;
  if (arrayKeys.some((k) => /flag|issue/i.test(k))) s += 10;
  if (keys.some((k) => STATUS_KEY.test(k))) s += 5;
  // A composite that aggregates sub-results (an object of per-instrument
  // objects, e.g. { sf36: {...}, ndi: {...} }) beats any one sub-result.
  if (keys.some((k) => isPlainObject(v[k]) && Object.keys(v[k]).length >= 2)) s += 4;
  // A result that is *only* arrays of sub-rows (e.g. a per-item scorer
  // returning its rows) is less composite than one that also classifies.
  if (keys.length === arrayKeys.length) s -= 3;
  return s;
}

// Default-state factories and other constructors are never the grader, even
// though "emptyAssessment" contains "assess".
const FACTORY_NAME = /^(create|empty|default|initial|blank|fresh|new|make|build)/i;

function nameBonus(n) {
  let b = 0;
  if (/^(calculate|grade|assess|evaluate|validate|compute|classify)/i.test(n)) b += 3;
  if (/(Grade|Assessment|Evaluation|Composite|Overall|Total|Status|Validity|Score|Risk)$/.test(n)) b += 2;
  if (/All|Composite|Overall|Total|Evaluation/.test(n)) b += 3;
  if (/^calculate.*grade$/i.test(n)) b += 2;
  if (PER_ITEM_NAME.test(n)) b -= 4;
  if (HELPER_NAME.test(n)) b -= 6;
  return b;
}

// Discover the default-state factory: try every zero-arg-looking candidate
// and keep the one that builds the LARGEST plain object (a form's root state
// beats any per-row helper such as emptyDrug / createEmptyAddress).
function discoverFactory(ns, fns) {
  const cands = fns.filter((n) =>
    /^(createDefault|createEmpty|createInitial|empty|default|initial|blank|fresh|new|make|build)/i.test(n) ||
    /(Assessment|Checklist|State|Data|Form|Record|Plan|Note|Card|Certificate|Evaluation|Questionnaire|Reconciliation|Review|Application|Authorization|Prescription|Lpa)$/i.test(n));
  let best = null, bestSize = -1;
  for (const n of cands) {
    if (ns[n].length > 0) continue; // needs args: not a default-state factory
    const res = quietCall(ns[n]);
    if (!res.ok || !isPlainObject(res.value)) continue;
    let size;
    try { size = JSON.stringify(res.value).length; } catch { continue; }
    if (size > bestSize) { best = n; bestSize = size; }
  }
  return best;
}

// Discover the grader by PROBING: call every plausible entry point over the
// default state and prefer the one whose result looks most like a composite
// grading result (a plain object carrying rule/flag arrays and a status-like
// key), with the name only as a tie-breaker. Replaces the old name-only
// heuristic, which verifiably mis-picked sub-axis graders and helpers on at
// least six forms (classifyHernia, scoreOhs, classifyCompleteness, gradeOrder,
// completenessPercent, calculateGrade-over-assess).
function discoverGrader(ns, fns, factory) {
  // Flag detectors are never the grader — but only names SHAPED like a
  // detector are excluded (detectFlaggedIssues, computeFlags, runFlaggers),
  // not every name containing "issue" (gradeIssue is the issue-tracker's
  // composite grader).
  const cands = fns.filter((n) =>
    ENTRY_NAME.test(n) && !FACTORY_NAME.test(n) &&
    !/^(detect|run|apply|collect|compute|build|get|list)\w*(flag|issue)s?$/i.test(n) && !/^detect/i.test(n));
  if (!cands.length) return { grader: undefined, probe: {} };
  let state = null;
  if (factory) {
    const r = quietCall(ns[factory]);
    if (r.ok) state = r.value;
  }
  const probe = {};
  let best = null, bestScore = -Infinity;
  for (const n of cands) {
    let score;
    if (state !== null) {
      const res = quietCall(ns[n], JSON.parse(JSON.stringify(state)));
      score = resultScore(res) + nameBonus(n);
      probe[n] = res.ok ? score : `threw: ${res.error}`;
    } else {
      // No state to probe with: fall back to the name heuristics only.
      score = nameBonus(n) + (HELPER_NAME.test(n) ? -50 : 0);
      probe[n] = score;
    }
    if (score > bestScore) { best = n; bestScore = score; }
  }
  // If nothing probed to a usable result, still report the best-named
  // candidate so bin/test-engines can explain the SKIP.
  return { grader: best, probe };
}

// Discover the grader / default-state factory / flags entry points on a
// namespace object. Shared by both load paths.
function discover(ns) {
  const fns = Object.keys(ns).filter((k) => typeof ns[k] === 'function');
  const factory = discoverFactory(ns, fns);
  const { grader, probe } = discoverGrader(ns, fns, factory);
  const flags =
    pick(fns, /^(detect|run|apply|collect)\w*(flag|issue)/i) ||
    pick(fns, /flag|detect/i, /^(has|is)[A-Z]/);
  return { fns, grader, factory, flags, probe };
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
 *  Returns { ns, name, fns, grader, factory, flags, probe, esm, loaded, error }.
 *  `probe` maps each grader candidate to its probe score (or "threw: …"). */
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
