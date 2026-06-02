# WHO Surgical Safety Checklist — Full Stack with Rust Axum Loco Tera (new)

Working directory for the next iteration of the full-stack Rust
implementation of the WHO Surgical Safety Checklist. Mirrors the layout
of the sibling
[`../back-end-with-loco/`](../back-end-with-loco/)
crate but holds in-progress redesign work.

## Stack

- Rust + axum + Loco
- Tera server-side templates
- HTMX 2.0.8 + Alpine.js 3.14.8 on the client
- SeaORM + PostgreSQL
- Tailwind CSS (server-side assets)

## Relationship to the sibling crate

This `-new/` directory exists so that a clean re-scaffold can be
attempted without disturbing the existing
`back-end-with-loco/` crate. When the new crate is
verified, it replaces the sibling and this directory is removed.

See [AGENTS.md](AGENTS.md) for the planned project structure, and the
parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the canonical full-stack stack.
