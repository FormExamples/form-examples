# back-end-with-loco — plan

Rust axum + Loco JSON API for the DEXA bone density request. Generated scaffold
is driven by `../back-end-with-loco-setup` (one `cargo loco generate scaffold
--api` per SQL table, in FK-dependency order).

- [ ] Setup script generated from `sql-migrations/`
- [ ] `cargo loco new` crate materialised (requires loco CLI + Postgres)
- [ ] Four-axis grading engine port (`src/engine/`)
- [ ] JSON API: CRUD + submit/grade + dashboard
- [ ] `cargo test` green (requires local Postgres test database)
