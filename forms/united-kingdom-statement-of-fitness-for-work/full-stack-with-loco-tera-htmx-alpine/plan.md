# Plan: UK Statement of Fitness for Work — Full Stack

## Current status

Implemented. The Rust crate compiles, the engine port covers the four
canonical rule sets (validity / adaptation / period / safety), the Tera
templates render the ten-step single-page wizard with HTMX boost and
Alpine.js step navigation, and `tests/grader_test.rs` asserts the
grader's headline policy outcomes.

The development build keeps state in a process-local `HashMap`. The
SeaORM 1.1 + PostgreSQL persistence layer is scaffolded by the sibling
`../full-stack-with-loco-tera-htmx-alpine-setup` shell script; running
it requires a running `loco` Postgres user and database. See
[`AGENTS.md`](AGENTS.md) for the directory layout.

## Implementation plan

1. Port `front-end-form-with-html/js/grader.js` to `src/grading/*.rs`
   preserving rule IDs (`R-VALID-*`, `R-ADAPT-*`, `R-PERIOD-*`,
   `R-SAFE-*`) and flag IDs (`F-VALID-*`, `F-AUTO-DISABILITY`,
   `F-PERIOD-MAX`, etc.) so the grader output is interoperable across
   implementations.
2. Wire the axum router with five routes (`GET /`,
   `POST /fit-note/new`, `GET /fit-note/{id}`,
   `POST /fit-note/{id}/submit`, `GET /fit-note/{id}/report`) and a
   process-local in-memory store.
3. Author `templates/base.html.tera` carrying the pinned HTMX 2.0.8 and
   Alpine.js 3.14.8 `<script defer>` tags and `<body hx-boost="true">`
   (asserted by `bin/test-form`).
4. Build the ten-step single-page wizard in
   `templates/fit_note/form.html.tera` with one `<div x-show>` per step
   and Alpine.js client-side branching for the `may_be_fit` adaptations
   step.
5. Add cargo tests covering the grader's headline outcomes (empty form
   → `review_for_validity`, comprehensive adaptations →
   `refer_occupational_health`, 200-day period → `refer_access_to_work`).
6. Run the sibling setup script to materialise the SeaORM scaffolding
   against PostgreSQL once a `loco` user / database is available.

## Deviations from the standard stack

- **Cargo edition is `2021`**, not `2024`, to match the proven-working
  reference crate at
  `forms/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/full-stack-with-loco-tera-htmx-alpine/`.
  Edition 2024 requires Rust 1.85+ which may not be installed on every
  CI runner; the rest of the codebase consistently uses edition 2021 for
  this exact reason. Once the toolchain pin moves to 1.85+, this can be
  switched to `2024` without any code changes.
- **Plain axum 0.8 rather than the full Loco 0.16 framework.** The Loco
  scaffolding (database, SeaORM entities, mailers, workers) is deferred
  to the sibling
  `../full-stack-with-loco-tera-htmx-alpine-setup` shell script, which
  runs `cargo loco generate scaffold` for each of the seven SQL tables
  against a running PostgreSQL instance. Building the full Loco runtime
  inline would require Postgres at compile time for the SeaORM derive
  macros, which is out of scope for a stand-alone test build.

## Verification

```sh
cargo build
RUSTFLAGS=-Awarnings cargo check
cargo test
bin/test-form united-kingdom-statement-of-fitness-for-work
```
