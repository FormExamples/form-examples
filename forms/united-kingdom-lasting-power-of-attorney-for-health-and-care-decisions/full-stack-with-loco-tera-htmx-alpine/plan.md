# Plan: Rust full-stack LP1H wizard

## Status

Scaffolded 2026-05-18. The Loco scaffold script lives in the sibling
`full-stack-with-loco-tera-htmx-alpine-new/` directory and runs
`cargo loco generate scaffold` to produce the crate skeleton.

## Build order

1. [ ] Run sibling `full-stack-with-loco-tera-htmx-alpine-new/00-new.sh`
       to scaffold the Loco crate.
2. [ ] `Cargo.toml` dependencies: axum 0.8, loco-rs 0.16, sea-orm 1.1,
       tera, serde, uuid, chrono, anyhow, thiserror.
3. [ ] Translate SQL migrations from `../sql-migrations/` into Loco
       migration files.
4. [ ] SeaORM entity generation from the database.
5. [ ] `src/models/lpa.rs`, `src/models/attorney.rs`, `src/models/
       certificate_provider.rs`, etc.
6. [ ] `src/services/lpa_validator.rs` — `calculate_lpa_validity` pure
       function mirroring the SvelteKit engine.
7. [ ] `src/controllers/lpa.rs` — wizard step routes, validation route,
       PDF / FHIR / XML export routes.
8. [ ] `templates/base.html.tera` with HTMX + Alpine.js CDN imports and
       `<body hx-boost="true">`.
9. [ ] `templates/lpa/wizard.html.tera` and 14 step templates.
10. [ ] `templates/lpa/_validity.html.tera` validity-summary fragment.
11. [ ] `templates/dashboard.html.tera` case-manager dashboard.
12. [ ] PDF builder via `genpdf` or `printpdf`.
13. [ ] FHIR Bundle builder (serialise SeaORM entities as FHIR R5).
14. [ ] XML builder (serialise via `quick-xml`).
15. [ ] `cargo test` unit tests for the validator rules.
16. [ ] `cargo build` and `cargo check` clean.

## Why server-rendered

- LPAs contain special-category personal data (UK GDPR Art.9). A
  server-rendered workflow keeps PII out of client-side state where
  practical, simplifying the data-protection impact assessment.
- HTMX boosts allow progressive enhancement without shipping a JS
  framework bundle to the donor's browser — relevant for low-bandwidth
  rural deployments.
- The Tera templates double as the canonical visual specification: the
  SvelteKit and static HTML builds copy their step layouts from the
  Tera templates.
