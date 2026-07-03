# Biopsy Test Result — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

The four-axis interpretation engine (`js/{types,rules,grader,flags}.js`) is a
faithful vanilla-JS port of the tested SvelteKit engine in
[`../front-end-with-svelte/src/lib/engine/`](../front-end-with-svelte/src/lib/engine).
Rule IDs and flag IDs are identical across every front-end and the back-end —
keep them in sync.
