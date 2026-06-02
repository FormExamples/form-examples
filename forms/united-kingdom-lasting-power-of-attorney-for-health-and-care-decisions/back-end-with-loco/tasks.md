# Tasks: Rust full-stack LP1H wizard

- [ ] Run sibling `back-end-with-loco-new/00-new.sh`.
- [ ] `Cargo.toml` with axum 0.8, loco-rs 0.16, sea-orm 1.1, tera, serde,
      uuid, chrono, anyhow, thiserror, quick-xml, genpdf.
- [ ] Translate SQL migrations from `../sql-migrations/` into Loco
      migrations.
- [ ] Generate SeaORM entities from the database.
- [ ] `src/models/lpa.rs`.
- [ ] `src/models/attorney.rs`.
- [ ] `src/models/replacement_attorney.rs`.
- [ ] `src/models/certificate_provider.rs`.
- [ ] `src/models/person_to_notify.rs`.
- [ ] `src/models/lpa_signature.rs`.
- [ ] `src/models/lpa_validity.rs`.
- [ ] `src/services/lpa_validator.rs` — `calculate_lpa_validity` pure
      function with all rule families.
- [ ] `src/services/pdf.rs` — OPG-ready PDF builder.
- [ ] `src/services/fhir.rs` — FHIR R5 Bundle builder.
- [ ] `src/services/xml.rs` — archival XML builder.
- [ ] `src/controllers/lpa.rs` — wizard routes (`GET`, `POST` per step).
- [ ] `src/controllers/dashboard.rs` — case-manager dashboard.
- [ ] `templates/base.html.tera` — HTMX + Alpine + `<body hx-boost="true">`.
- [ ] `templates/lpa/wizard.html.tera`.
- [ ] `templates/lpa/steps/step_01.html.tera` … `step_14.html.tera`.
- [ ] `templates/lpa/_validity.html.tera`.
- [ ] `templates/lpa/_fired_rules.html.tera`.
- [ ] `templates/dashboard.html.tera`.
- [ ] `tests/lpa_validator.rs` — unit tests covering every rule.
- [ ] `cargo build` clean.
- [ ] `cargo test` green.
- [ ] `RUSTFLAGS=-Awarnings cargo check` clean.
