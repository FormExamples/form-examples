# Return to Work — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

Consolidated Lily HTML front-end (gold standard): `index.html` is the single-page
12-step clinician wizard; `dashboard.html` is the clinician review dashboard.
They share one `css/` and `js/`. The pure grading engine lives in
`js/{types,rules,grader,flags}.js`; the wizard controller in `js/form-app.js`;
the dashboard app in `js/dashboard-app.js` (with `js/dashboard-types.js`,
`js/data.js`, `js/api.js`).

The engine is a faithful port of the SvelteKit stack
(`../front-end-with-svelte/src/lib/engine/`): restriction rule IDs (`RST-NNN`)
and safety-flag IDs (`FLAG-*`) are identical across every front-end and the
back-end. `calculateReturnToWork(data)` returns
`{ fitnessStatement, computedFitness, overridden, restrictionPriority,
firedRules[], additionalFlags[], timestamp }`; restriction priority uses the
max-grade rule.

No build step; the pages work when opened directly via `file://`.
