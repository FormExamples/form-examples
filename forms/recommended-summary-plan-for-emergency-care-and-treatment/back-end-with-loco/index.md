# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT): Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The Loco crate lives in [`recommended_summary_plan_for_emergency_care_and_treatment/`](recommended_summary_plan_for_emergency_care_and_treatment/) — one migration, SeaORM
entity, and JSON REST controller per SQL table, with routes under
`/api/<plural>/`. The companion consolidated front-ends in
[`../front-end-with-html/`](../front-end-with-html/) and
[`../front-end-with-svelte/`](../front-end-with-svelte/) consume this API.

See [AGENTS.md](AGENTS.md) for conventions, the form spec in
[`../spec/index.md`](../spec/index.md) for the behavioural contract, and
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the system-wide back-end rules.
