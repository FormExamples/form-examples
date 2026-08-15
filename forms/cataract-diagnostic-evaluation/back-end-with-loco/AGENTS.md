# Cataract Diagnostic Evaluation — back-end-with-loco/

Rust axum + Loco JSON API for the Cataract Diagnostic Evaluation form. Crate
source under `src/cataract_diagnostic_evaluation/`; one migration and one
entity per SQL table.

## Rules for agents working here

- [`../sql/`](../sql) is the source of truth for the schema. Migrations are
  derived; keep them in step with `bin/loco-migration-defaults` and
  `bin/loco-migration-nullability` rather than hand-editing.
- Relational schema only: one table per entity. A single JSONB blob is wrong.
- `i64` ids — loco-rs 1.0's `ColType::PkAuto` renders `BIGINT`.
- JSON API only. No Tera, HTMX, Alpine, or CSS in this crate.
- `seed()` in `app.rs` resolves fixtures from `CARGO_MANIFEST_DIR` because the
  canonical route layout moved them to
  `src/cataract_diagnostic_evaluation/fixtures/`; do not revert it to the
  scaffold's `base.join(...)` form.
- The scaffolded per-entity `tests/requests/*.rs` files are deliberately absent
  (they assert 200 on a bare list route and are not meaningful); `tests/models/`
  and `tests/requests/auth.rs` are the kept suite, matching the fleet.

See [`index.md`](./index.md) for the route map, the form root
[`../AGENTS.md`](../AGENTS.md), and
[`/AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).
