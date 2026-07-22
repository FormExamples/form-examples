# Implementation Plan

1. Spec — `spec/index.md` (67-metric catalogue across 14 editorially-
   titled categories). Done.
2. SQL — `sql/` Liquibase migrations: `hospital_dashboard_metrics`
   (parent, one row per reporting period) +
   `hospital_dashboard_metric_value` (child, one row per recorded
   metric).
3. Generated representations — XML, FHIR R5, protobuf, OpenAPI per
   SQL entity via the repo's generator scripts.
4. Front-end-with-html — vanilla JS wizard (16 steps: reporting
   period, 14 category steps, summary/sign-off) + dashboard.
5. Front-end-with-svelte — SvelteKit wizard mirroring the HTML
   front-end + dashboard.
6. Back-end-with-loco — Rust axum + Loco JSON API, relational
   (parent + child entity) SeaORM models.
7. Verify — `bin/test-form hospital-dashboard-metrics`,
   `bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`.

## Status

- [x] Spec
- [x] SQL
- [x] Generated representations
- [x] Front-end-with-html
- [x] Front-end-with-svelte
- [x] Back-end-with-loco
- [x] Verify
