# Medical Fit Note: Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Medical Fit Note form (the UK
"Statement of Fitness for Work"). Pure back-end: no HTML rendering, no Tera
templates, no HTMX, no Alpine.js, no CSS, no Lily Design System.

The schema is relational and mirrors [`../sql/`](../sql/): one migration, one
SeaORM entity and one RESTful scaffold controller per SQL table (`employee`,
`clinician`, `medical_fit_note`, `medical_fit_note_grade`,
`medical_fit_note_grade_rule`, `medical_fit_note_grade_flag`), with UUID primary
keys and camelCase JSON. `GET /api/openapi.yaml` serves the form's combined
OpenAPI 3.1 specification. The companion front-ends in
`../front-end-with-svelte/` and `../front-end-with-html/` consume this API.

See [AGENTS.md](AGENTS.md) for the layout and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md) for the
canonical back-end stack and conventions.
