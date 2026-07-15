# Spec — HTML front-end JavaScript uses ES modules

Status: **accepted** (2026-07-15). Supersedes the previous classic-script
convention. Applies to every form's `front-end-with-html/` (both `index.html`
wizard and `dashboard.html`). This is a domain spec under the top-level
[`spec.md`](../spec.md); read it before changing any HTML front-end JavaScript.

## 1. Decision

Every HTML front-end ships its JavaScript as **native ES modules**
(`<script type="module">` + `import` / `export`), not classic
`<script>` tags that share code through a `window.<Namespace>` global.

- `index.html` loads exactly one module entry point: the wizard app
  (`<script type="module" src="js/form-app.js"></script>`). Every other
  wizard module is reached through that entry's `import` graph.
- `dashboard.html` loads exactly one module entry point: the dashboard app
  (`<script type="module" src="js/dashboard-app.js"></script>`), plus any
  standalone utility (e.g. `table-export.js`) that has no import graph.
- Each JS file `export`s its public symbols at their declaration
  (`export function`, `export const`) and `import`s what it consumes from
  sibling files by relative path (`import { x } from './rules.js'`).

## 2. Rationale

- ES modules are the platform-native module system: real dependency edges,
  per-module scope, no manual load-ordering, no global-namespace collisions.
- The prior classic-script pattern encoded the dependency graph *implicitly*
  in the order of `<script>` tags in the HTML and a hand-maintained
  `window.<Namespace>` object. That is error-prone (a reordered tag or a
  missing publish line breaks the page silently) and duplicates, per form, the
  wiring the module system does for free.
- It aligns the HTML front-end with the SvelteKit front-end, whose engine
  already uses TypeScript ES modules — the HTML `js/*.js` files are hand-ports
  of those modules and now share the same import/export shape.

## 3. Accepted tradeoff — no `file://`

The classic-script convention existed for one reason: an `index.html` opened
directly from disk (`file://…/index.html`) would run. **ES-module `import` is
CORS-blocked over `file://`**, so a form opened that way now has a dead wizard
(the entry module never loads its dependencies).

This is accepted. Forms are served over HTTP in every context that matters:

- the Playwright e2e harness (`bin/test-e2e`) serves each form from a static
  HTTP server;
- any real deployment serves over HTTP.

To preview a form locally, serve the directory rather than double-clicking the
file, e.g.:

```sh
cd forms/<slug>/front-end-with-html && python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## 4. Source pattern (what we converted away from)

Each form's `js/` used a single `window.<Namespace>` object per surface
(one for the wizard, e.g. `window.PatientIntake`; one for the dashboard, e.g.
`window.PatientIntakeDashboard`). Files were IIFE-wrapped and linked through
that object. The idioms varied only in formatting:

- **Namespace init** (one or two lines):
  `window.NS = window.NS || {};`
- **Publish**, either per-symbol or batched:
  `window.NS.foo = foo;`   /   `Object.assign(NS, { foo, bar });`
- **Consume**, either direct or via a local alias:
  `const { foo } = window.NS;`   /   `const NS = window.NS; const { foo } = NS;`
- **Wrapper**: `(function () { 'use strict'; … })();`
- **HTML**: an ordered block of classic `<script src="js/*.js">` tags,
  dependencies first, entry last.

## 5. Target pattern (canonical)

```js
// js/rules.js
import { scoreX } from './utils.js';

export const someRules = [ /* … */ ];

export function runRules(data) { /* … */ }
```

```html
<!-- index.html -->
<script type="module" src="js/form-app.js"></script>
```

Rules for the conversion:

- Drop the IIFE wrapper and `'use strict'` (modules are strict and scoped).
  Where an IIFE parameter aliased a global other than the namespace
  (`(function (root, doc) { … })(window, document)`), re-declare it
  (`const doc = document;`) so the body still resolves.
- Drop every `window.NS = window.NS || {}`, `const NS = window.NS`, and publish
  line. Each published symbol becomes an `export` — the tool emits a trailing
  `export { a, b };` list for plain re-exports and inline `export const foo = …`
  where the publish carried an expression. (Both forms are equivalent; hand-
  written modules may put `export` directly on the declaration.)
- Turn each consumed symbol into a named `import` from the sibling file that
  exports it (a per-form symbol→file map resolves the path). A local binding
  that shadows an imported name (`const X = NS.X || d;`) imports under an alias
  (`import { X as X$imported }`) to avoid the clash.
- `@typedef {import('./types.js').Foo}` JSDoc already uses `import()` type
  syntax and is unchanged.
- **Preserve** any genuine `window.*` assignment that is *not* namespace
  plumbing — e.g. an entry that exposes `window.gradeObjective`,
  `window.submitForm`, or `window.__A11Y_DRAFT_KEY__` for inline handlers or
  the smoke test. Those stay; a module can still assign to `window`.

## 6. Tooling and verification

- `bin/es-modules-refactor [--check] [--dry-run] [--all|<slug>…]` performs the
  mechanical conversion and, with `--check`, is the CI drift detector (fails if
  any form still ships a classic `window.<Namespace>` front-end).
- `bin/test-e2e --html <slug>` is the runtime gate: it serves each form over
  HTTP, loads it, and asserts the wizard renders and its primary action fires
  without a page error — which is what catches a broken import graph.
- `node --check js/*.js` catches syntax-level breakage per file.
- A few forms shared code through *bare* top-level globals (no
  `window.<Namespace>` object) rather than a namespace — the tool refuses to
  touch those (it would silently drop scripts) and reports them for manual
  conversion. `issue-tracker`, `meeting`, and `architecture-decision-record`
  were converted by hand to the same import/export shape.

## 7. Out of scope

- The SvelteKit front-end (`front-end-with-svelte/`) already uses ES modules;
  unchanged.
- The Rust/Loco back-end; unchanged.
- `table-export.js` and other standalone utilities that neither import nor
  export stay as-is except for being loaded alongside the module entry.
