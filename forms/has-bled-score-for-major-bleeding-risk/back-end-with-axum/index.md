# HAS-BLED Score for Major Bleeding Risk: Back-end with Rust Axum (JSON API)

Server-side Rust JSON API for the HAS-BLED Score for Major Bleeding Risk form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The Axum crate lives in [`has_bled_score_for_major_bleeding_risk/`](has_bled_score_for_major_bleeding_risk/) — one migration, sqlx
entity, and JSON REST controller per SQL table, with routes under
`/api/<plural>/`. The companion consolidated front-ends in
[`../front-end-with-html/`](../front-end-with-html/) and
[`../front-end-with-svelte/`](../front-end-with-svelte/) consume this API.

See [AGENTS.md](AGENTS.md) for conventions, the form spec in
[`../spec/index.md`](../spec/index.md) for the behavioural contract, and
[AGENTS/back-end-with-axum.md](../../../AGENTS/back-end-with-axum.md)
for the system-wide back-end rules.
