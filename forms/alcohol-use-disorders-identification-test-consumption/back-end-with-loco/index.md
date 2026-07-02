# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C): Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The Loco crate lives in [`alcohol_use_disorders_identification_test_consumption/`](alcohol_use_disorders_identification_test_consumption/) — one migration, SeaORM
entity, and JSON REST controller per SQL table, with routes under
`/api/<plural>/`. The companion consolidated front-ends in
[`../front-end-with-html/`](../front-end-with-html/) and
[`../front-end-with-svelte/`](../front-end-with-svelte/) consume this API.

See [AGENTS.md](AGENTS.md) for conventions, the form spec in
[`../spec/index.md`](../spec/index.md) for the behavioural contract, and
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the system-wide back-end rules.
