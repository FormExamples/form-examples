# Agile Checklist — Full-stack Plan

## Goal

A Loco / axum / SeaORM / Tera / HTMX / Alpine.js implementation of the
agile-checklist form, sharing the canonical PostgreSQL schema in
`../sql/`.

## Build order

1. Run the scaffolding script in
   `../back-end-with-loco-new/00-new.sh`.
2. Apply the SQL migrations from `../sql/`.
3. Generate SeaORM entities via `cargo loco db entities`.
4. Define routes for: index, new submission wizard, submit, list,
   detail, report (PDF).
5. Tera templates with HTMX-driven partial step navigation and
   Alpine.js for local form state.
6. Implement the composite grader in Rust mirroring the TypeScript
   engine.

## Status

Pending — not yet scaffolded.
