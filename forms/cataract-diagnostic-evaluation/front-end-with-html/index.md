# Cataract Diagnostic Evaluation — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the 15-step
single-page clinician wizard; `dashboard.html` is the review dashboard. Shared
`css/` and `js/`. Lily Design System headless classes, native ES modules, no
build step.

## Layout

```
front-end-with-html/
  index.html                 # 15-step single-page wizard
  dashboard.html              # review dashboard
  css/style.css               # wizard styles, aliased onto the Lily theme tokens
  css/dashboard.css           # dashboard styles
  css/themes/*.css            # the vendored Lily theme catalogue (one loaded at a time)
  js/types.js                 # emptyEvaluation() and the display-label tables
  js/locs-rules.js            # LOCS III severity banding, surgical-candidacy computation
  js/composite-grader.js      # calculateCataractEvaluation() — the public entry point
  js/flagged-issues.js        # the safety-flag categories
  js/form-app.js               # wizard controller (module entry point)
  js/dashboard-app.js         # dashboard controller (module entry point)
  js/dashboard-types.js       # JSDoc types for the dashboard rows
  js/data.js                  # sample rows, used when the back-end is offline
  js/api.js                   # back-end client
  js/table-export.js          # shared CSV / TSV export toolbar
  js/theme-select.js          # header controls
  js/locale-select.js
  js/text-size-picker.js
  js/share-picker.js
  js/date-time-picker.js      # vendored Lily helper, not wired into the form
  test/engine.test.mjs        # boundary-test harness (plain Node, node:test)
```

## Import graph

`form-app.js` → `composite-grader.js` → { `locs-rules.js`, `flagged-issues.js`
} and `types.js`. `dashboard-app.js` → { `api.js`, `data.js` }. Dependency
order is expressed by the imports, not by script order.

## Running it

The JavaScript is native ES modules, so the directory must be served over HTTP
rather than opened via `file://`:

```sh
python3 -m http.server --directory forms/cataract-diagnostic-evaluation/front-end-with-html 8000
```

Then open <http://localhost:8000/index.html>.

The dashboard reads `GET /api/cataract_diagnostic_evaluations` from the Loco
back-end at `http://localhost:5150`, and falls back to the sample rows in
`js/data.js` with a banner when that is unavailable.

## Engine tests

```sh
node forms/cataract-diagnostic-evaluation/front-end-with-html/test/engine.test.mjs
```

Runs the same 40 boundary cases as
`../front-end-with-svelte/src/lib/engine/grader.test.ts` (LOCS III severity
at 2.9/3.0/4.9/5.0/5.9/6.9, acuity at LogMAR 0.30/0.31/0.47/0.48, each safety
flag on/off, the paediatric age-16 boundary, and the clinician-override
behaviour) against this directory's vanilla-JS engine, using plain Node's
built-in `node:test` — no build step, no test-framework dependency.

## State

Draft state is saved to `localStorage` under
`cataract-diagnostic-evaluation.front-end-with-html.v1`. On load the stored
value is merged over a fresh `emptyEvaluation()`, so fields added in a later
version do not orphan an existing draft. This matters here: the full
evaluation typically takes 1 to 2 hours because it requires pupil dilation.

## Conventions

See [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for the Lily
HTML headless contract.
