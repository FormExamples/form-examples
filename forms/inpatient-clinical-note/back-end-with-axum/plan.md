# Inpatient Clinical Note — back-end plan

- [x] Crate scaffolded on the gold-reference Loco layout (`src/<snake>/`).
- [x] Ten migrations, one per SQL table, in dependency order.
- [x] Ten SeaORM entities with relations, including the two FKs from the note to
      `clinicians` (author, responsible consultant).
- [x] Ten model wrappers and ten RESTful controllers registered in `app.rs`.
- [x] Both grading engines ported to Rust under `engine/`.
- [x] 16 engine tests mirroring the spec's worked examples and boundaries.
- [x] `cargo build` clean, `cargo clippy --all-targets` clean apart from two
      warnings inherited verbatim from the reference crate.
- [x] `cargo test` — 49/49 passing against a real Postgres test database, so the
      migrations are proven to apply.

## Deferred

- Persisting a computed grade: the engine is pure and callable, but no
  controller yet writes `inpatient_clinical_note_grade` rows from it. The
  front-ends compute their own grade today.
- Request-level integration tests for the ten domain resources; only the
  starter's auth request tests are present.
