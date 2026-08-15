# Hernia Diagnostic Evaluation — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the 14-step
single-page clinician wizard; `dashboard.html` is the review dashboard. Shared
`css/` and `js/`. Lily Design System headless classes, native ES modules, no
build step.

## Layout

```
front-end-with-html/
  index.html                 # 14-step single-page wizard
  dashboard.html              # review dashboard
  css/style.css               # wizard styles, aliased onto the Lily theme tokens
  css/dashboard.css           # dashboard styles
  css/themes/*.css            # the vendored Lily theme catalogue (one loaded at a time)
  js/types.js                 # createDefaultAssessment() and JSDoc typedefs
  js/utils.js                 # num(), rule(), ageInYears(), titleCase(), labelFor()
  js/classification-rules.js  # classifyHernia(), assessReducibility(), screenRedFlags(), computeUrgency()
  js/flagged-issues.js        # detectFlags() — the safety-flag categories
  js/composite-grader.js      # calculateHerniaEvaluation() — the public entry point
  js/form-app.js               # wizard controller (module entry point)
  js/dashboard-app.js          # dashboard controller (module entry point)
  js/dashboard-types.js        # JSDoc types for the dashboard rows
  js/data.js                   # sample rows, used when the back-end is offline
  js/api.js                    # back-end client
  js/table-export.js           # shared CSV / TSV export toolbar
  js/theme-select.js           # header controls
  js/locale-select.js
  js/text-size-picker.js
  js/share-picker.js
  js/date-time-picker.js       # vendored Lily helper, not wired into the form
```

## Import graph

`form-app.js` → `composite-grader.js` → { `classification-rules.js`,
`flagged-issues.js` } and `types.js`, `utils.js`. `dashboard-app.js` → {
`api.js`, `data.js`, `dashboard-types.js` }. Dependency order is expressed by
the imports, not by script order. This is a plain-JavaScript port of the
TypeScript engine under
[`../front-end-with-svelte/src/lib/engine/`](../front-end-with-svelte/src/lib/engine) —
same field names, same rule IDs, same flag IDs, same thresholds.

## Running it

The JavaScript is native ES modules, so the directory must be served over HTTP
rather than opened via `file://`:

```sh
python3 -m http.server --directory forms/hernia-diagnostic-evaluation/front-end-with-html 8000
```

Then open <http://localhost:8000/index.html>.

The dashboard reads `GET /api/hernia_diagnostic_evaluations` from the Loco
back-end at `http://localhost:5150`, and falls back to the sample rows in
`js/data.js` with a banner when that is unavailable.

## State

Draft state is saved to `localStorage` under
`hernia-diagnostic-evaluation.front-end-with-html.v1`. On load the stored
value is merged over a fresh `createDefaultAssessment()`, so fields added in a
later version do not orphan an existing draft.

## Step 8 — red-flag / emergency symptom screen

Step 8 is rendered as a visually distinct warning panel
(`<fieldset class="fieldset" data-variant="danger">`) because any single
positive answer there forces the computed urgency band to `emergency`,
regardless of every other finding. It is a self-contained safety screen — a
clinician can complete it without cross-referencing earlier steps.

## Conventions

See [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for the Lily
HTML headless contract.
