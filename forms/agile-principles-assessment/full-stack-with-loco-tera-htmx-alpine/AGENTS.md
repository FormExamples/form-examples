# Agile Principles Assessment — Full Stack with Rust / axum / Loco / Tera / HTMX / Alpine

Server-rendered Rust web app for the agile-principles assessment.
Five tables (`respondent`, `agile_principles_assessment`,
`agile_principles_assessment_grade`, `agile_principles_assessment_grade_rule`,
`agile_principles_assessment_grade_flag`) scaffolded into a single Loco crate.

## Status

The crate is **not yet generated in this checkout**. The
`cargo loco generate scaffold` calls live in
[`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup),
auto-generated from
[`../sql-migrations/`](../sql-migrations/) by
[`bin/full-stack-with-loco-tera-htmx-alpine/generate-full-stack-with-loco-tera-htmx-alpine-setup.py`](../../../bin/full-stack-with-loco-tera-htmx-alpine/generate-full-stack-with-loco-tera-htmx-alpine-setup.py).

## How to scaffold

From the repository root:

```sh
cd forms/agile-principles-assessment/full-stack-with-loco-tera-htmx-alpine
cargo loco new --name agile_principles_assessment
cd agile_principles_assessment
sh ../../full-stack-with-loco-tera-htmx-alpine-setup
cargo loco db migrate
cargo loco start
```

After scaffolding, the crate layout will mirror the
[`pre-operative-assessment-by-clinician`](../../pre-operative-assessment-by-clinician/full-stack-with-loco-tera-htmx-alpine/)
reference and the canonical
[`AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
guide.

## Stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Tables (scaffold order)

1. `respondent`
2. `agile_principles_assessment` (FK → respondent)
3. `agile_principles_assessment_grade` (FK → assessment, 1:1)
4. `agile_principles_assessment_grade_rule` (FK → grade)
5. `agile_principles_assessment_grade_flag` (FK → grade)

## Custom routes / controllers (post-scaffold work)

- `POST /assessments/:id/grade` — re-run the maturity engine and upsert
  `agile_principles_assessment_grade` plus its child rules and flags.
- `GET /api/assessments` — JSON feed consumed by the dashboards.
- `GET /assessments/:id/report` — server-rendered report view.

## Verify

```sh
cargo build
RUSTFLAGS=-Awarnings cargo check
cargo test
```
