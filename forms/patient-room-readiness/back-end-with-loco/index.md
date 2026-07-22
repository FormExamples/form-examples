# Patient Room Readiness: Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Patient Room Readiness form. Pure
back-end: no HTML rendering, no Tera templates, no HTMX, no Alpine.js,
no CSS, no Lily Design System.

A single RESTful JSON resource, `patient_room_readiness_checklist`, is
served under `/api/patient_room_readiness_checklists` (list, create,
read, update, delete). The companion front-ends in
`../front-end-with-svelte/` and `../front-end-with-html/` consume this
API.

See [AGENTS.md](AGENTS.md) for the crate layout and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the canonical back-end stack and conventions.
