# Lumbar Puncture Test Result — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
CSF-report wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the four-axis interpretation engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

Plain classic `<script>` tags (no build step, no ES modules) so both pages work
opened directly via `file://`. Each script attaches its public symbols to the
`window.LumbarPunctureTestResult` (form) or
`window.LumbarPunctureTestResultDashboard` (dashboard) namespace.

## Files

| File | Role |
| --- | --- |
| `index.html` | Single-page seven-section CSF-report wizard |
| `dashboard.html` | Sortable / filterable clinician dashboard |
| `css/style.css` | Lily Design System styles for the wizard |
| `css/dashboard.css` | Lily Design System styles for the dashboard |
| `js/types.js` | Empty-result shape, display labels, Lily badge-class mappers |
| `js/rules.js` | Axis A–D grading rules + structured-findings predicates |
| `js/flags.js` | Safety-critical flag detection |
| `js/grader.js` | Composes the four axes into a `GradingResult` |
| `js/form-app.js` | Wizard rendering, persistence, validation, live preview |
| `js/data.js` | Sample graded-report rows (dashboard fallback) |
| `js/api.js` | Backend dashboard-reports fetch client |
| `js/dashboard-types.js` | JSDoc `ReportRow` type definitions |
| `js/dashboard-app.js` | Dashboard filter / sort / render app |

The engine is a faithful vanilla-JavaScript port of the SvelteKit
`front-end-with-svelte/src/lib/engine/*.ts`; rule and flag IDs are identical
across every front-end and the back-end. State is persisted to localStorage
under `lumbar-puncture-test-result.front-end-with-html.v1`.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md).
Lily Design System headless conventions:
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).
