# Perioperative Optimization — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the 16-step
single-page assessment wizard; `dashboard.html` is the waiting-list review
dashboard. Shared `css/` and `js/`. Lily Design System headless classes, native
ES modules, no build step.

## Layout

```
front-end-with-html/
  index.html                 # 16-step single-page wizard
  dashboard.html             # waiting-list dashboard
  css/style.css              # wizard styles, aliased onto the Lily theme tokens
  css/dashboard.css          # dashboard styles
  css/themes/*.css           # the vendored Lily theme catalogue (one loaded at a time)
  js/types.js                # emptyAssessment() and the display-label tables
  js/domain-rules.js         # DOMAIN_DEFINITIONS: the eight triggers, lead times, and derived scores
  js/gating.js               # time-to-surgery gating
  js/composite-grader.js     # calculateOptimization() — the public entry point
  js/flagged-issues.js       # the safety-flag categories
  js/form-app.js             # wizard controller (module entry point)
  js/dashboard-app.js        # dashboard controller (module entry point)
  js/dashboard-types.js      # JSDoc types for the dashboard rows
  js/data.js                 # sample rows, used when the back-end is offline
  js/api.js                  # back-end client
  js/table-export.js         # shared CSV / TSV export toolbar
  js/theme-select.js         # header controls
  js/locale-select.js
  js/text-size-picker.js
  js/share-picker.js
  js/date-time-picker.js     # vendored Lily helper, not wired into the form
```

## Import graph

`form-app.js` → `composite-grader.js` → { `domain-rules.js`, `gating.js`,
`flagged-issues.js` } and `types.js`. `dashboard-app.js` → { `api.js`,
`data.js`, `domain-rules.js`, `types.js` }. Dependency order is expressed by
the imports, not by script order.

## What the wizard shows that others do not

A **live readiness strip** sits under the progress bar and updates as the
clinician types: the current surgical readiness band, the weeks remaining before
surgery, and the count of domains in each state. The time remaining is the
number the whole assessment turns on, so it is never more than a glance away.

Step 10 shows read-only derived body mass index and weight-loss percentage, both
computed by the engine, so the MUST inputs and their result are visible together.

## What the dashboard shows that others do not

**Weeks to surgery** and **domains short on time**, side by side, sorted by
surgery date ascending. Together they answer the question a waiting-list
coordinator actually has: *which of next month's lists are about to go ahead
without the optimisation they were promised?* The weeks column is colour-banded
at four and eight weeks, and rows with no surgery date sort last rather than
appearing imminent.

## Running it

The JavaScript is native ES modules, so the directory must be served over HTTP
rather than opened via `file://`:

```sh
python3 -m http.server --directory forms/perioperative-optimization/front-end-with-html 8000
```

Then open <http://localhost:8000/index.html>.

The dashboard reads `GET /api/perioperative_optimizations` from the Loco
back-end at `http://localhost:5150`, and falls back to the sample rows in
`js/data.js` with a banner when that is unavailable.

## State

Draft state is saved to `localStorage` under
`perioperative-optimization.front-end-with-html.v1`. On load the stored value is
merged over a fresh `emptyAssessment()`, so fields added in a later version do
not orphan an existing draft.

## Conventions

See [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for the Lily
HTML headless contract.
