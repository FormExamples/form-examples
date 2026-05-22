# Agent notes — HTML form (vanilla)

Static single-page wizard. No bundler, no framework. Plain HTML + CSS + ES2022 modules.

## Files

- `index.html` — wizard shell + pdfmake CDN scripts
- `style.css` — minimal layout, RAG color tokens
- `engine.js` — port of `front-end-form-with-svelte/src/lib/engine/` to vanilla JS (sole source of truth for scoring shared with that Svelte app)
- `app.js` — wizard state, step rendering, Compute / PDF / Copy handlers; exposes `window.gradeObjective` for the smoke test
- `smoke.spec.mjs` — Playwright test that drives the engine over the 14 shared fixtures in `../test-fixtures/scoring/`
- `package.json` — Playwright dev dependency

## Conventions

- Vanilla ES2022 — no transpilation, no JSX
- `state` is a single object mutated by `input` listeners; no framework reactivity
- Empty strings for unanswered text fields; `null` for unanswered numerics

## Parent docs

- [`../AGENTS.md`](../AGENTS.md)
- [Design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md)
- [HTML-form plan](../../../docs/superpowers/plans/2026-05-10-okr-tracker-plan-2-html-form.md)
