# Implementation Plan

1. Spec — `spec/index.md` (50-indicator Balanced Scorecard catalogue).
   Done.
2. SQL — `sql/` Liquibase migrations: `hospital_performance_indicators`
   (parent, one row per reporting period) +
   `hospital_performance_indicator_value` (child, one row per recorded
   indicator).
3. Generated representations — XML, FHIR R5, protobuf, OpenAPI per
   SQL entity via the repo's generator scripts.
4. Front-end-with-html — vanilla JS wizard (6 steps: reporting
   period, Finance, Process, Learning and Growth, Customer, summary)
   + dashboard.
5. Front-end-with-svelte — SvelteKit wizard mirroring the HTML
   front-end + dashboard.
6. Back-end-with-loco — Rust axum + Loco JSON API, relational
   (parent + child entity) SeaORM models.
7. Verify — `bin/test-form hospital-performance-indicators`,
   `bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`.

## Status

- [x] Spec
- [x] SQL
- [x] Generated representations
- [x] Front-end-with-html
- [x] Front-end-with-svelte
- [x] Back-end-with-loco
- [x] Verify
