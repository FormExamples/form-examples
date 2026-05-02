# Pre-Operative Assessment by Clinician — Full Stack with Rust Axum Loco Tera

Server-rendered Rust web app for clinician-led pre-operative assessment.
ASA-grading driven, NICE NG45 aligned, with safety-critical flags.

## Layout

This crate has two cargo subcrates:

- `pre_operative_assessment_by_clinician/` — the primary Loco app (axum +
  Tera + SeaORM + Postgres) implementing the clinician workflow
- `todo/` — supplementary subcrate with extension work

See [AGENTS.md](AGENTS.md) for the planned project structure, and the
parent
[AGENTS/full-stack-with-loco-tera-htmx-alpine.md](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the canonical full-stack stack.
