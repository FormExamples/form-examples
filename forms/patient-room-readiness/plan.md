# Implementation Plan

1. Spec — `spec/index.md` (25-checkpoint catalogue). Done.
2. SQL — `sql/` Liquibase migration: single flat
   `patient_room_readiness_checklist` table.
3. Generated representations — XML, FHIR R5, protobuf, OpenAPI.
4. Front-end-with-html — vanilla JS wizard (3 steps: location,
   checklist, inspector/sign-off) + dashboard.
5. Front-end-with-svelte — SvelteKit wizard mirroring the HTML
   front-end + dashboard.
6. Back-end-with-loco — Rust axum + Loco JSON API, single entity.
7. Verify — `bin/test-form patient-room-readiness`,
   `bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`.

## Status

- [x] Spec
- [x] SQL
- [x] Generated representations
- [x] Front-end-with-html
- [x] Front-end-with-svelte
- [x] Back-end-with-loco
- [x] Verify
