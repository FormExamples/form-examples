# back-end-with-loco — tasks

- [x] Materialize the Loco crate (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Relational per-table migrations: `users` (Loco default), `workers`,
      `managers`, `neurodiversity_adjustment_reviews` (FKs to worker +
      manager), `neurodiversity_adjustment_review_grades` (1:1 unique FK to
      review), `neurodiversity_adjustment_review_grade_rules`,
      `neurodiversity_adjustment_review_grade_flags`
- [x] SeaORM `_entities` mirroring each SQL table, with relations
- [x] Domain models: `from_payload` / `to_payload` mappers and the
      transactional, idempotent `persist_grade`
- [x] Pure four-axis engine (`src/engine/`) with canonical rule IDs
      (`R-EFFECT-*`, `R-WELL-*`, `R-COMPLETE-*`, `R-NEXT-*`) and flag IDs (`F-*`)
- [x] JSON controllers: review CRUD, `submit`, `result`, dashboard join
- [x] Engine tests (`tests/engine/`) with a shared `fixtures.rs`
- [x] `cargo build` (0 errors) and `cargo test` (all pass)
