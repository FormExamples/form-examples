# Plan — Full stack with Loco JSON API.js

Implemented per [`../spec/index.md`](../spec/index.md).

## Status

Plan 6 path 2 (Loco scaffold without DB) — `cargo build` passes, `bin/test-form`
passes, but the server is not yet bound to a live Postgres.

- [x] Cargo workspace + Loco dependencies
- [x] `migration/` subcrate with 9 SeaORM migrations (extensions + 8 entities)
- [x] Minimal `App` impl wiring `create_app::<App, Migrator>`
- [x] `src/bin/main.rs` Loco CLI entry point
- [x] Stub `controllers/home.rs`
- [x] `config/{development,test,production}.yaml`
- [x] `templates/base.html.tera` with HTMX 2.0.8 / Alpine.js 3.14.8 / `hx-boost`
- [x] Stub `templates/{dashboard,objectives}/*.tera`
- [x] `../back-end-with-loco-setup` with `cargo loco generate scaffold` calls for all 8 entities
- [x] Sub-project docs
- [ ] Run scaffold script against a live Postgres → populates `src/models/`, `src/controllers/`, `src/views/`
- [ ] Wire generated controllers into `App::routes()`
- [ ] Server-side wizard with HTMX KR add/remove
- [ ] Score endpoint persisting to `okr_grade*` tables
- [ ] Export endpoints (PDF / JSON / FHIR R5 / XML / TXT)
- [ ] Integration tests + Playwright e2e
- [ ] Acceptance gate + tag `okr-tracker-plan-6-full-stack-rust`
