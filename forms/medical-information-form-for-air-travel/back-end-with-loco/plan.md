# Plan — Full-stack with Loco / Tera / HTMX / Alpine

## Phase 0 — Scaffold (done)

- Top-level docs: `AGENTS.md`, `CLAUDE.md`, `index.md`, `plan.md`, `tasks.md`
- Nested crate `medical_information_form_for_air_travel/` with the standard
  Loco source layout (`src/bin/`, `src/app.rs`, `src/controllers/`,
  `src/models/`, `src/views/`, `src/tasks/`, `src/workers/`)
- Tera template tree: `templates/base.html.tera`, `templates/assessment.html.tera`,
  and 14 `templates/assessment/stepNN.html.tera` partials
- Environment configs: `config/development.yaml`, `config/test.yaml`,
  `config/production.yaml`
- `.gitignore` covering `/target`, `/node_modules`, `*.swp`
- Empty `target/` directory placeholder for `cargo build` output
- Sibling generator script `back-end-with-loco-setup`
  emitting one `cargo loco generate scaffold` invocation per SQL table

## Phase 1 — Schema and models

- Port SQL migrations from `sql-migrations/02_*.sql` ... `07_*.sql` to
  SeaORM migrations under `migration/src/`
- Generate `src/models/_entities/` via `sea-orm-cli generate entity`
- Add domain models for `patient`, `clinician`,
  `medical_information_form_for_air_travel`,
  `medical_information_form_for_air_travel_grade`,
  `medical_information_form_for_air_travel_grade_rule`,
  `medical_information_form_for_air_travel_grade_flag`

## Phase 2 — Controllers and routing

- `GET /` — render the 14-step single-page wizard
- `POST /assessment` — persist a draft
- `POST /assessment/{id}/submit` — finalise and run grading engine
- `GET /assessment/{id}` — render the read-only report

## Phase 3 — Grading engine (Rust port)

Port the TypeScript engine in `front-end-form-with-svelte/src/lib/engine/`:

- `engine/cardiorespiratory.rs`
- `engine/recent_event.rs`
- `engine/pregnancy.rs`
- `engine/communicable.rs`
- `engine/equipment.rs`
- `engine/composite.rs`
- `engine/flagged_issues.rs`

Output type:

```rust
pub struct MedifResult {
    pub fitness_band: FitnessBand,
    pub fired_rules: Vec<FiredRule>,
    pub safety_flags: Vec<SafetyFlag>,
    pub desk_recommendation: String,
    pub valid_until: chrono::NaiveDate,
}
```

## Phase 4 — Tera views

- `base.html.tera` — Tailwind + HTMX + Alpine.js shell
- `assessment.html.tera` — single-page wizard wrapper
- `assessment/stepNN.html.tera` — one partial per wizard step
- `report.html.tera` — read-only summary with band, rules and flags

## Phase 5 — Tests

- `tests/grading.rs` — unit tests mirroring
  `composite-grader.test.ts`, `recent-event-rules.test.ts`,
  `cardiorespiratory-rules.test.ts`, `pregnancy-rules.test.ts`
- `tests/api.rs` — integration tests using `loco-rs::testing`

## Phase 6 — Polish

- Tailwind CDN swap to local build
- Production Docker image with multi-stage build
- Liquibase parity check against `sql-migrations/`
