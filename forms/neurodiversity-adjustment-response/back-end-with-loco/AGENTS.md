# Neurodiversity Adjustment Response — Rust axum + Loco JSON API

Agent instructions for this directory. See the form root
[`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md), and this
directory's [`index.md`](index.md) for the full API and engine overview.

## What this crate is

A pure JSON API back-end (axum + Loco + SeaORM + PostgreSQL) for the UK
workplace **reasonable-adjustments employer response** for neurodiversity — not
a clinical form. No HTML, Tera, HTMX, Alpine.js, or CSS.

## Conventions

- Relational schema: one Loco migration and one SeaORM `_entity` per SQL table
  (plus the Loco-default `users` table). UUIDv4 primary keys via
  `gen_random_uuid()`; `created_at` / `updated_at` / `deleted_at` on every
  table.
- The four-axis engine (`src/engine/`) is a pure, side-effect-free port of the
  SvelteKit / HTML engines with **identical** rule IDs (`R-OUTCOME-*`,
  `R-LEGAL-*`, `R-COMPLETE-*`, `R-FOLLOWUP-*`), flag IDs (`F-*`), bands, and
  fire conditions — see `../../neurodiversity-adjustment-response` specs. Do
  not diverge the IDs between stacks.
- `serde(rename_all = "camelCase")` on every struct shared with the front-end;
  snake_case in SQL and SeaORM internals.
- `POST .../submit` runs the engine and persists the grade + rule rows + flag
  rows in one transaction, idempotently (re-submitting replaces the prior
  grade).

## Verify

```sh
cargo build
cargo test
```
