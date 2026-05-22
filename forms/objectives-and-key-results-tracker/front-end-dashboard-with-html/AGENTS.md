# Agent notes — HTML dashboard (vanilla)

Static dashboard listing OKR objectives in a sortable, filterable table. No
bundler, no framework. Plain HTML + CSS + ES2022 modules. Sample data is
hand-written and includes baked-in engine output; later plans replace the
sample fetch with a backend call.

## Files

- `index.html` — table shell, filter controls, CSV button
- `style.css` — table layout, RAG color tokens, detail-row styling
- `app.js` — fetches `objectives.json`, renders rows, filters, sorts, expands details, exports CSV
- `objectives.json` — 5 hand-written sample objectives
- `smoke.spec.mjs` — Playwright tests; runs a tiny static HTTP server because browsers block `fetch()` and ES-module imports over `file://`
- `package.json` — Playwright dev dependency

## Conventions

- Vanilla ES2022 — no transpilation, no JSX
- `view` is the filtered+sorted projection of `data`; one `refresh()` rebuilds the tbody
- Detail rows are sibling `<tr class="detail">` inserted with `insertAdjacentHTML('afterend', …)`
- CSV escapes quotes by doubling them (`"` → `""`); every cell is double-quoted

## Parent docs

- [`../AGENTS.md`](../AGENTS.md)
- [Design spec](../../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md)
- [HTML-dashboard plan](../../../docs/superpowers/plans/2026-05-10-okr-tracker-plan-4-html-dashboard.md)
