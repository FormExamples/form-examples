# Medical Device Assessment: Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Medical Device Assessment form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The schema is relational, mirroring `../sql/`: one migration, one SeaORM
entity and one RESTful scaffold controller per SQL table, with UUID primary
keys and camelCase JSON. Each controller exposes list, create, read, update
(PUT and PATCH) and delete under these prefixes:

- `/api/manufacturers`
- `/api/assessors`
- `/api/medical_device_assessments`
- `/api/medical_device_assessment_grades`
- `/api/medical_device_assessment_grade_rules`
- `/api/medical_device_assessment_grade_flags`

It also serves `GET /api/openapi.yaml` (the form's combined OpenAPI 3.1
spec) and the Loco `/api/auth` routes. The companion front-ends in
`../front-end-with-svelte/` and `../front-end-with-html/` consume this API.

See [AGENTS.md](AGENTS.md) for the project layout and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md) for
the canonical back-end stack and conventions.
