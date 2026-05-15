# Meeting — Full-stack (Rust / Loco / Tera / HTMX / Alpine)

Canonical full-stack implementation of the meeting form. Rust edition
2024, axum 0.8, Loco 0.16, SeaORM 1.1 against PostgreSQL, Tera server-
rendered templates, HTMX 2.0.8 for partial updates, Alpine.js 3.14.8 for
client-side micro-state. The same 10-step single-page wizard rendered
on the server.

The crate carries a hand-ported copy of `validate_meeting()` so the
fired rules and flags emitted by the backend match the SvelteKit and
HTML front-ends exactly. SeaORM entity structs use
`serde(rename_all = "camelCase")` so the JSON over the wire matches the
front-end type model.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions and
[`plan.md`](./plan.md) for the implementation roadmap.
