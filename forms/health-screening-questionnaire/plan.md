# Plan: Health Screening Questionnaire

## Current status

Created 2026-08-14. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

Foundation COMPLETE as of 2026-08-14. The form is full-stack.

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/`, all `--check` gates green |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| `front-end-with-html/` | complete — Playwright smoke pass (14-step wizard, conditional step 10, validation, report, dashboard), `node js/cross-check.mjs` green |
| `front-end-with-svelte/` | complete — `svelte-check` clean, 39 Vitest cases, `vite build` green, all routes wired |
| `back-end-with-loco/` | complete — loco-rs 1.0.1, relational per-table schema, `i64` ids |

## Why this form exists

The monorepo's screening-form family lacked a generic, purpose-flexible
baseline health screen that a non-clinical operator — a gym instructor, a
personal trainer, an HR officer — could administer, alongside clinicians in
occupational-health, primary-care, and perioperative-referral settings. Two
real, validated instruments already exist for the two questions this brief
calls out — "is it safe to start exercising" (PAR-Q+) and "is alcohol use a
risk factor" (AUDIT-C) — so the form wraps both inside a wider occupational
and wellness questionnaire, rather than inventing a new scoring scheme.

## Design principles

- **Validated instruments only.** PAR-Q+ (PAR-Q+ Collaboration, 2011
  revision) and AUDIT-C (Bush et al. 1998) are reproduced faithfully. Nothing
  is invented.
- **Deliberate scope simplification, recorded not hidden.** The real PAR-Q+
  branches into condition-specific supplementary questionnaires. This form
  raises a single `further-assessment-required` follow-up state instead —
  documented explicitly in `spec/index.md` §2 so it reads as a decision, not
  an oversight.
- **`assessor`, not `clinician`.** The table and TypeScript section name
  reflect that this form's users are frequently non-clinical.
- **Max-grade composite risk.** The worst finding sets the band; a single
  urgent finding (unexplained chest pain, fainting) cannot be diluted by
  otherwise reassuring answers.
- **Safety flags never suppressed.** The assessor may override the risk band
  with a mandatory reason, but flags are computed independently and always
  render on the report.
- **Paediatric routing.** PAR-Q+ and AUDIT-C are adult instruments; under-16
  respondents are routed to a `paediatric` flag rather than scored.

## Differentiation from `patient-intake`

Recorded in `spec/index.md` §2.1 and `AGENTS.md`: `patient-intake` registers a
person and captures administrative + clinical intake with a generic
Low/Medium/High risk stratification; this form screens a person's baseline
health and readiness for an activity or role using two named, validated
instruments (PAR-Q+, AUDIT-C) and produces a referral recommendation.

## Build sequence followed

1. Spec rewrite (`spec/index.md`), `index.md`, `AGENTS.md`.
2. SQL migrations (`patient`, `assessor`, `health_screening_questionnaire`,
   `health_screening_questionnaire_grade`,
   `health_screening_questionnaire_grade_flag`).
3. Regenerated derived representations (XML, FHIR R5, protobuf, OpenAPI, Loco
   setup script, CHANGELOG + examples, llms.txt, combined `schema.sql`).
4. Engine-first: pure TypeScript engine
   (`front-end-with-svelte/src/lib/engine/`), 39 Vitest boundary cases green
   before any UI was written.
5. SvelteKit front end: 14 step components, RESTful dashboard, PDF report.
6. HTML front end: vanilla-JS port of the same engine, cross-checked against
   the same boundary cases via `js/cross-check.mjs`; wizard + dashboard.
7. Loco back end: `cargo loco generate scaffold` for all 5 tables, routed into
   `src/health_screening_questionnaire/`, loco-rs 1.0.1 conventions applied.
8. `doc/` reference material, `plan.md`, `tasks.md`, `CHANGELOG.md`.
9. Verification gates (see `tasks.md`).

## Deferred / out of scope

- PAR-Q+'s condition-specific supplementary questionnaires (deliberate scope
  simplification, see `spec/index.md` §2).
- Automated onward referral booking.
- Authentication, multi-tenancy, hosted deployment.
