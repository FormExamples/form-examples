# Plan: Eye Prescription — Rust Full-Stack

## Build order

1. Run `../full-stack-with-loco-tera-htmx-alpine-setup` to bootstrap a
   Loco project with axum routes, SeaORM entities, and Tera views for
   each of the 10 tables.
2. Re-author the SeaORM migrations from `../sql-migrations/`. Preserve
   every `CHECK` and `COMMENT` statement.
3. Author `src/engine/refractive_rules.rs` with the sphere / cylinder /
   addition band tables. Mirror the TypeScript engine.
4. Author `src/engine/complexity_grader.rs` with the worst-of composite
   engine.
5. Author `src/engine/flagged_issues.rs` with the 11 safety flags.
6. Wire the engine into the `eye_prescription_grade` controller so that
   creating or updating a prescription triggers a re-grade and writes
   `eye_prescription_grade_rule` and `eye_prescription_grade_flag` rows.
7. Author `src/fhir/vision_prescription.rs` that emits a FHIR R5
   `VisionPrescription` Bundle per
   `../doc/fhir-vision-prescription-mapping.md`.
8. Author Tera templates in `assets/views/` for the 11-step single-page
   wizard. Use HTMX `hx-post` + `hx-swap="innerHTML"` for the live
   classification preview at step 11.
9. Cargo test for the engine.
10. `cargo build && cargo check && cargo test` pass.
11. Smoke-test in a browser: complete a prescription end-to-end, confirm
    PDF and FHIR export.

## Design principles

- Server-rendered HTML; HTMX for partial swaps; Alpine.js for client-
  side state (form validation, sign-convention check).
- One axum route per HTTP verb per resource; HTMX swaps server-rendered
  fragments.
- Engine is a pure module with no async, no IO; controllers handle IO
  and call the engine.
- `serde(rename_all = "camelCase")` on every struct shared with the
  front-end.

## Out of scope (deferred)

- WebSocket live updates (the dashboard polls instead).
- Full FHIR validation (rely on external validator).
- DCB0129 / DCB0160 clinical safety case.
