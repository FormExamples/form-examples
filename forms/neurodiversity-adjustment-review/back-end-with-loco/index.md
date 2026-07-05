# Neurodiversity Adjustment Review — Rust axum + Loco JSON API

Pure JSON API back-end for the Neurodiversity Adjustment Review (a UK workplace
reasonable-adjustments effectiveness review — not a clinical form), built with
axum + Loco + SeaORM + PostgreSQL. No HTML rendering, no Tera, no HTMX, no
Alpine.js, no CSS.

## Four-axis grading engine

The `src/engine/` module ports the SvelteKit / HTML grading engine to Rust with
identical rule IDs, flag IDs, axis names, bands, and thresholds:

- Axis A — effectiveness band: `effective` / `partially-effective` /
  `ineffective` / `not-yet-assessed` (`effectiveness_rules.rs`, `R-EFFECT-*`).
- Axis B — wellbeing risk: `ok` / `caution` / `high-risk` (`wellbeing_rules.rs`,
  `R-WELL-*`).
- Axis C — review completeness percent 0–100 over ten weighted mandatory
  sections (`completeness_rules.rs`, `R-COMPLETE-*`).
- Axis D — next-step urgency: `none` / `review-scheduled` / `adjust-now` /
  `escalate`, plus a target timeframe (`next_step_rules.rs`, `R-NEXT-*`).

Plus an overall recommendation, a fired-rule audit trail, and compliance / risk
flags (`flagged_issues.rs`, `F-*`). Any adjustment reported as not-working, a
dissatisfied worker, declining wellbeing, or an escalation drives the
wellbeing-risk axis and the next-step urgency and raises the corresponding flag,
regardless of the other axes. The grader is a pure, side-effect-free function
(`grader.rs`).

## Relational schema

One Loco migration and one SeaORM `_entity` per SQL table (plus the Loco-default
`users` table): `workers`, `managers`, `neurodiversity_adjustment_reviews` (FKs
to worker + manager), `neurodiversity_adjustment_review_grades` (1:1 unique FK
to review), `neurodiversity_adjustment_review_grade_rules`, and
`neurodiversity_adjustment_review_grade_flags`. UUIDv4 primary keys via
`gen_random_uuid()`; `created_at` / `updated_at` / `deleted_at` on every table.

## HTTP API

```text
POST   /api/neurodiversity_adjustment_reviews              create a review (draft or filled)
GET    /api/neurodiversity_adjustment_reviews              list reviews (newest first)
GET    /api/neurodiversity_adjustment_reviews/{id}         fetch one review
PATCH  /api/neurodiversity_adjustment_reviews/{id}         overwrite the review payload
DELETE /api/neurodiversity_adjustment_reviews/{id}         soft-delete the review
POST   /api/neurodiversity_adjustment_reviews/{id}/submit  run the engine, persist the grade
GET    /api/neurodiversity_adjustment_reviews/{id}/result  read back the persisted grade
GET    /api/dashboard                          list graded reviews (review joined to grade)
```

`POST .../submit` runs the engine and persists the grade + fired-rule rows +
flag rows in one transaction, idempotently (re-submitting replaces the prior
grade).

## Verify

```sh
cargo build
cargo test
```
