# Hospital Discharge: Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Hospital Discharge form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The HTTP contract is `/api/assessments` (list, create, read, update,
submit, result) plus `/api/dashboard`. The companion front-ends in
`../front-end-with-svelte/` and `../front-end-with-html/`
consume this API.

See [AGENTS.md](AGENTS.md) for the planned project layout, [spec.md](spec.md)
for the JSON API contract, and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md) for
the canonical back-end stack and conventions.
