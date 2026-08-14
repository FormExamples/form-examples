# Hip Replacement Surgery Evaluation — HTML front-end (form + dashboard)

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
  js/ohs-rules.js              # scoreOhs(), ohsCategoryFromTotal(), and the shared pure utilities
  js/composite-grader.js       # calculateHipEvaluation() — the public entry point
  js/flagged-issues.js         # the safety-flag categories
  js/form-app.js               # wizard controller (module entry point)
  js/dashboard-app.js          # dashboard controller (module entry point)
  js/dashboard-types.js        # JSDoc types for the dashboard rows
  js/data.js                   # sample rows, used when the back-end is offline
  js/api.js                    # back-end client
  js/cross-check.mjs           # Node.js harness asserting parity with the TS engine's boundary tests
  js/table-export.js           # shared CSV / TSV export toolbar
  js/theme-select.js           # header controls
  js/locale-select.js
  js/text-size-picker.js
  js/share-picker.js
  js/date-time-picker.js       # vendored Lily helper, not wired into the form
```

## Import graph

`form-app.js` → `composite-grader.js` → { `ohs-rules.js`, `flagged-issues.js` }
and `types.js`. `dashboard-app.js` → { `api.js`, `data.js` }. Dependency order
is expressed by the imports, not by script order.

## Running it

The JavaScript is native ES modules, so the directory must be served over HTTP
rather than opened via `file://`:

```sh
python3 -m http.server --directory forms/hip-replacement-surgery-evaluation/front-end-with-html 8000
```

Then open <http://localhost:8000/index.html>.

The dashboard reads `GET /api/hip_replacement_surgery_evaluations` from the
Loco back-end at `http://localhost:5150`, and falls back to the sample rows in
`js/data.js` with a banner when that is unavailable.

## Cross-check

`js/cross-check.mjs` re-runs the same boundary cases as
`../front-end-with-svelte/src/lib/engine/grader.test.ts` (OHS category
boundaries at 19/20, 29/30, 39/40; candidacy rule-order boundaries; every
safety-flag threshold) against this directory's own vanilla-JS engine, so the
two implementations stay provably identical:

```sh
node forms/hip-replacement-surgery-evaluation/front-end-with-html/js/cross-check.mjs
```

## State

Draft state is saved to `localStorage` under
`hip-replacement-surgery-evaluation.front-end-with-html.v1`. On load the
stored value is merged over a fresh `emptyEvaluation()`, so fields added in a
later version do not orphan an existing draft.

## Conventions

See [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for the Lily
HTML headless contract.
