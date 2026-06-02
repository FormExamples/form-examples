# Plan: Meeting — Full-stack (Rust)

## Current status

Scaffolded 2026-05-13. Implementation deferred — requires `cargo build`.
`tasks.md` tracks the remaining build steps.

## Goal

A Rust full-stack that serves the 10-step single-page wizard via Tera
templates plus HTMX partial updates, and persists meetings, participants,
agenda items, resources, recurrence rules, action items, outputs, and
outcomes in PostgreSQL via SeaORM.

## Build order

1. Run `../back-end-with-loco-setup` to scaffold the
   project shell.
2. Author SeaORM migrations mirroring `../sql-migrations/`.
3. Author entity models with `serde(rename_all = "camelCase")`.
4. Author controllers for each entity — list, read, create, update,
   delete.
5. Author Tera templates for the wizard, the report preview, and the
   dashboard.
6. Author Alpine.js controllers for the agenda / participant / resource
   / action-item / output / outcome editors.
7. Port `validate_meeting()` from the SvelteKit engine; cover every
   fired rule with `cargo test`.
8. Wire ICS export.
9. Wire FHIR R5 Appointment / Encounter Bundle export.
10. Run `bin/test-form meeting`.

## Design principles

- Server-rendered HTML is the source of truth; HTMX swaps drive the
  wizard's interactivity.
- The Rust validation engine matches the SvelteKit engine rule-for-rule
  and is exercised by the same fixture set where practical.
- camelCase JSON on the wire, snake_case internally.
- One Loco controller per SQL entity.
