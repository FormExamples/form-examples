# Full-stack Loco implementation — plan

## Goal

Stand up a server-rendered Rust web app that mirrors the SvelteKit form,
backed by PostgreSQL via SeaORM, with Loco JSON API views.

## Stages

1. `cargo loco new --name agile_principles_assessment` to bootstrap the
   crate.
2. Run `../back-end-with-loco-setup` to generate
   scaffolds for all five tables.
3. Apply the migrations against a local Postgres instance.
4. Port the maturity-engine logic from
   `front-end-with-svelte/src/lib/engine/` into a Rust module
   (`src/grading/`). Keep the same rule IDs and flag categories.
5. Add a controller `POST /assessments/:id/grade` that re-grades the
   assessment and upserts the grade + child rules/flags.
6. Add `GET /api/assessments` returning the JSON shape the dashboards
   already consume.
7. Add a Tera report view at `GET /assessments/:id/report`.
8. Wire HTMX for in-place Likert updates on the assessment form.

## Open questions

- Should the grading run on every form save, or only on explicit submit?
  The SvelteKit form computes it eagerly via `$derived`; the Rust app
  can do the same on POST or run it lazily before render.
- Whether to embed the principle text in the database (i18n-friendly)
  or leave it in code constants.

## Verification

`cargo build`, `cargo check`, and `cargo test` must all pass before this
plan is considered complete. The integration test suite should at least
exercise: create-respondent, create-assessment, grade, fetch JSON.
