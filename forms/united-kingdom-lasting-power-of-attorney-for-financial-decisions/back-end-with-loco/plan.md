# Plan: UK LPA for Financial Decisions — Full Stack

## Current status

Scaffold structure in place. The Loco crate root has the required
files (`Cargo.toml`, `.gitignore`, `src/`, `target/`, `templates/`,
`migration/`, `config/`, `assets/`, `tests/`). HTMX 2.0.8, Alpine.js
3.14.8, and `hx-boost` are wired into `templates/base.html.tera`.

## Implementation plan

1. Bring the Loco crate up to scaffold by running
   `../back-end-with-loco-setup` against a running
   Loco app + Postgres (this generates SeaORM entities, controllers, and
   templates for the 16 tables).
2. Port the validation engine from the TypeScript front-end
   (`front-end-with-svelte/src/lib/engine`) into
   `src/services/validator.rs` with one Rust function per fired-rule
   and per additional-flag.
3. Add controller routes for the 15-step wizard (`/lpa/new`, step
   navigation via HTMX swaps, `POST /lpa/{id}/validate`).
4. Persist `lpa_validation_result` + `lpa_validation_rule` +
   `lpa_validation_flag` rows on every validation pass so the dashboard
   can show the latest band and risk per LPA.
5. Add cargo tests for the engine (every blocker rule + every flag) and
   request tests for the wizard endpoints.
6. Wire `cargo loco db migrate` into CI.

See [`AGENTS.md`](AGENTS.md) for the directory map and conventions.
