# UK Statement of Fitness for Work — Full Stack Agent Instructions

Server-rendered Rust web application for the UK Med 3 / fit note. This
directory hosts a self-contained axum 0.8 + Tera + HTMX + Alpine.js crate
that mirrors the ten-step single-page wizard and the policy-compliance
grading engine in the sibling
[`../front-end-form-with-html`](../front-end-form-with-html) and
[`../front-end-form-with-svelte`](../front-end-form-with-svelte)
implementations.

## Files

```
Cargo.toml                 # axum + Tera + serde + uuid + chrono + tracing
.gitignore                 # /target
src/main.rs                # axum bootstrap, Tera glob, in-memory Store, router
src/controllers/mod.rs
src/controllers/fit_note.rs   # 5 handlers + form_to_fit_note() parser
src/views/mod.rs
src/views/fit_note.rs         # build_form_context, build_report_context
src/grading/mod.rs            # public re-exports
src/grading/types.rs          # FitNote, Clinician, Patient, Grade, FiredRule, SafetyFlag
src/grading/utils.rs          # compute_period_days, count_adaptations
src/grading/validity_rules.rs # DWP policy 3.6 / 3.7 validity rules
src/grading/adaptation_rules.rs
src/grading/period_rules.rs   # 7 days / 28 days / 84 days / 90 days / 180 days thresholds
src/grading/safety_flag_rules.rs
src/grading/grader.rs         # grade_fit_note() entry point
templates/base.html.tera      # HTMX 2.0.8 + Alpine.js 3.14.8 + <body hx-boost="true">
templates/home/index.html.tera
templates/fit_note/form.html.tera
templates/fit_note/report.html.tera
tests/grader_test.rs
target/                       # cargo artefacts (gitignored)
```

## Conventions

- Rust edition 2021 (matches the proven-working reference crate at
  `forms/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/full-stack-with-loco-tera-htmx-alpine/`;
  edition 2024 requires Rust 1.85+, which is not yet pinned in the
  shared toolchain). See `plan.md` for details.
- `serde(rename_all = "camelCase")` on every struct that crosses the
  HTTP boundary or is serialised into a Tera context. This mirrors the
  TypeScript engine in
  [`../front-end-form-with-svelte/src/lib/grading/`](../front-end-form-with-svelte/src/lib/grading/).
- snake_case Rust field names; camelCase JSON / Tera keys.
- Empty string `""` for unanswered text / enum fields; `Option<i64>` for
  numeric fields.
- UUIDv4 primary keys produced by `uuid::Uuid::new_v4()`.
- Tera templates use `{{ data.foo.barBaz }}` (camelCase) thanks to serde.

## Grading engine

Pure functions, ported from
[`../front-end-form-with-html/js/grader.js`](../front-end-form-with-html/js/grader.js).
Rule IDs (`R-VALID-*`, `R-ADAPT-*`, `R-PERIOD-*`, `R-SAFE-*`) and flag
IDs (`F-VALID-*`, `F-AUTO-DISABILITY`, `F-PERIOD-MAX`, etc.) are
identical to the canonical JavaScript / TypeScript source so the grader
output is interoperable across implementations.

The recommendation ladder, descending in priority:

1. `review_for_validity` — any high-severity validity rule fired.
2. `refer_access_to_work` — automatic disability or `very_long_term`.
3. `refer_occupational_health` — `substantial` / `comprehensive` adaptations
   or `long_term` period.
4. `refer_employment_advisor` — `not_fit` for >= 84 days.
5. `standard` — default.

## HTMX + Alpine.js

- `base.html.tera` carries the pinned CDN script tags and
  `<body hx-boost="true">` so navigation between landing / wizard /
  report is a partial swap.
- The wizard `form.html.tera` declares `x-data="{ step: 1, totalSteps:
  10 }"` and toggles `x-show="step === N"` for each of the ten steps.
- Step 6 (adaptations) only appears when `fitnessForWork === 'may_be_fit'`.
- The whole form posts to `/fit-note/{id}/submit` and the server
  re-grades on receipt.

## SeaORM persistence

The development build keeps state in process memory. To run against the
real PostgreSQL schema, execute the sibling
[`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup)
script, which calls `cargo loco generate scaffold` for each of the
seven tables in
[`../sql-migrations/`](../sql-migrations/) in dependency order:
`patient`, `clinician`, `medical_practice`,
`united_kingdom_statement_of_fitness_for_work`, `_grade`,
`_grade_rule`, `_grade_flag`.

## Tests

`tests/grader_test.rs` exercises the grader end-to-end:

- An empty fit note fires the three high-severity validity rules and
  yields `recommendation = review_for_validity`.
- A `may_be_fit` fit note with all four adaptation tick boxes set yields
  `adaptationIntensity = comprehensive` and
  `recommendation = refer_occupational_health`.
- A 200-day period yields `periodCompliance = very_long_term` and
  `recommendation = refer_access_to_work`.

## Verify

```sh
cd full-stack-with-loco-tera-htmx-alpine
cargo build
RUSTFLAGS=-Awarnings cargo check
cargo test
```

or from the repo root:

```sh
bin/test-form united-kingdom-statement-of-fitness-for-work
```
