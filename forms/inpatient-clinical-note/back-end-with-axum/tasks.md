# Inpatient Clinical Note — back-end tasks

## Done

- Generated the per-table migrations, entities, model wrappers, and controllers
  from `../sql/`, matching the gold-reference crate's shapes.
- Ported the NEWS2, completeness, acuity, and flag logic to Rust.
- Wrote the engine test suite and got the whole crate green against Postgres.

## Notes

- Two FKs point from `inpatient_clinical_notes` to `clinicians`. The migration
  must pass explicit FK column names, and the entity must give each FK a
  distinct `Relation` variant with only one `Related` impl. See `AGENTS.md`.
- `AcuityBand`'s variant order is load-bearing: `Ord` gives the max-band
  algorithm for free.
- Two warnings (`clippy::clippy::pedantic` unknown lint in `lib.rs`, unused
  `base` in `app.rs::seed`) are inherited verbatim from the reference crate and
  are present fleet-wide; left alone to avoid drifting from the other crates.
