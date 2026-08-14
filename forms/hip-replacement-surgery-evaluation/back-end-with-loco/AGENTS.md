# Hip Replacement Surgery Evaluation — back-end-with-loco/

Rust axum + Loco JSON API for the Hip Replacement Surgery Evaluation form.
Crate source under `src/hip_replacement_surgery_evaluation/`; one migration
and one entity per SQL table.

## Rules for agents working here

- [`../sql/`](../sql) is the source of truth for the schema. Migrations are
  derived; keep them in step with `bin/loco-migration-defaults` and
  `bin/loco-migration-nullability` rather than hand-editing.
- Relational schema only: one table per entity. A single JSONB blob is wrong.
- `serde(rename_all = "camelCase")` on every struct shared with the front-ends.
- `i64` ids — loco-rs 1.0's `ColType::PkAuto` renders `BIGINT`.
- JSON API only. No Tera, HTMX, Alpine, or CSS in this crate.
- `seed()` in `app.rs` resolves fixtures from `CARGO_MANIFEST_DIR` because the
  canonical route layout moved them to
  `src/hip_replacement_surgery_evaluation/fixtures/`; do not revert it to the
  scaffold's `base.join(...)` form.
- The scaffolded per-entity `tests/requests/*.rs` files are deliberately absent
  (they assert 200 on a bare list route and are not meaningful); `tests/models/`
  and `tests/requests/auth.rs` are the kept suite, matching the fleet.
- `patient.united_kingdom_nhs_number` is a nullable `UNIQUE` column: the
  migration expresses it as `ColType::StringNull` plus an explicit unique
  index, and the entity/controller `Params` field is `Option<String>`. A plain
  `ColType::StringUniq` would be `NOT NULL UNIQUE`, which admits at most one
  patient without an NHS number.

See [`index.md`](./index.md) for the route map, the form root
[`../AGENTS.md`](../AGENTS.md), and
[`/AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).
