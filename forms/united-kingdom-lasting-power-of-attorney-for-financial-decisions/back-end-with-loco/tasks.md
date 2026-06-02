# Tasks: UK LPA for Financial Decisions — Full Stack

- [x] Setup script `back-end-with-loco-setup` for 16 tables
- [x] Loco crate root: `Cargo.toml`, `.gitignore`, `src/`, `target/`
- [x] `templates/base.html.tera` with HTMX 2.0.8 + Alpine.js 3.14.8 + `hx-boost`
- [x] `config/development.yaml`, `config/test.yaml`, `config/production.yaml`
- [x] `migration/` crate scaffold
- [x] `assets/` (`static/`, `i18n/`, `views/`)
- [x] `tests/mod.rs` integration-test entrypoint
- [ ] Run `cargo loco generate scaffold` for all 16 tables via the setup script
- [ ] SeaORM entities + migration files for `person`, `address`, 14 LPA tables
- [ ] Validation engine port: blocker rules, flag rules, band rules,
      max-grade composite risk
- [ ] Controllers: landing, `lpa/new` 15-step wizard, validate endpoint,
      child-resource CRUD
- [ ] Per-resource Tera templates (`list`, `show`, `new`, `edit`, `_form`)
- [ ] Cargo tests for the engine and the wizard endpoints
- [ ] Verify with `bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions`
