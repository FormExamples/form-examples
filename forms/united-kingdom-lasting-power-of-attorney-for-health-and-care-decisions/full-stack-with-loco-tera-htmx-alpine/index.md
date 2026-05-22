# UK LPA for Health and Care Decisions — Full stack (axum + Loco + Tera + HTMX + Alpine.js)

Server-rendered Rust web app for the statutory LP1H workflow. axum + Loco
backend with SeaORM-managed Postgres, Tera-templated HTML, HTMX-progressive
enhancement, and Alpine.js client-side state.

## Layout

The crate implements the same 14-step wizard as the SvelteKit and static
HTML clients, but server-rendered. Validation, persistence, and the OPG
submission packet generation all run server-side; the browser receives
fragments via HTMX rather than a JSON API.

See [AGENTS.md](AGENTS.md) for the project structure, and the parent
[AGENTS/full-stack-with-loco-tera-htmx-alpine.md](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the canonical full-stack conventions.

## Running

```sh
cargo loco start
```

Browse to `http://localhost:5150/lpa/new` to begin a draft.
