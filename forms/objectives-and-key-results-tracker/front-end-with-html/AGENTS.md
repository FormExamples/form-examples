# Objectives and Key Results Tracker — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

ES-module front-end with a Playwright smoke harness: `pnpm install && pnpm test` runs `smoke.spec.mjs` (engine fixtures against `index.html`; grid behaviour against `dashboard.html`). The dashboard reads `objectives.json`; the form imports `js/engine.js` and exports PDF via the pdfmake CDN.
