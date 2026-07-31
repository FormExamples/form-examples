# Inpatient Clinical Note — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

The engine modules are pure and have no DOM dependency; keep them that way so
the Svelte front-end and any test runner can import them unchanged. `grader.js`
is the only entry point the apps should call.

The required-component set varies by `noteType` — never hard-code a single
required list. Read it from `NOTE_TYPE_EXTRA_REQUIRED` in `types.js` via
`requiredComponentKeys()` in `rules.js`.
