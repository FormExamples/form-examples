# Implementation Plan

1. Spec — `spec/index.md` (97-checkpoint catalogue, response model). Done.
2. SQL — `sql/` Liquibase migrations: `hospital_daily_monitoring_checklists`
   (parent) + `hospital_daily_monitoring_checklist_items` (child, one
   row per answered checkpoint).
3. Generated representations — XML, FHIR R5, protobuf, OpenAPI per
   SQL entity via the repo's generator scripts.
4. Front-end-with-html — vanilla JS wizard (24 steps: inspection
   details, 22 area steps, summary/sign-off) + dashboard.
5. Front-end-with-svelte — SvelteKit wizard mirroring the HTML
   front-end + dashboard.
6. Back-end-with-loco — Rust axum + Loco JSON API, relational
   (parent + child entity) SeaORM models.
7. Verify — `bin/test-form hospital-daily-monitoring-checklist`,
   `bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`.

## Status

- [x] Spec
- [x] SQL
- [x] Generated representations
- [x] Front-end-with-html
- [x] Front-end-with-svelte
- [x] Back-end-with-loco
- [x] Verify
