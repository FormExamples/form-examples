# Plan: Hernia Diagnostic Evaluation

## Current status

Created 2026-08-14. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

Full-stack build complete as of 2026-08-14.

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/`, all `--check` gates green |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| Scoring engine (`front-end-with-svelte/src/lib/engine/`) | complete — 35 Vitest boundary cases pass |
| `front-end-with-html/` | complete — Lily HTML drift-check clean, standalone Node engine-parity check passes |
| `front-end-with-svelte/` (UI) | complete — `pnpm check`/`pnpm test`/`pnpm build` pass, Lily Svelte drift-check clean |
| `back-end-with-loco/` | complete — loco-rs 1.0.1, `cargo build` + 28 `cargo test` pass |

`bin/test-form hernia-diagnostic-evaluation` passes.

## Why this form exists

A hernia is usually diagnosed on physical examination in minutes, but the
consequences of getting the triage decision wrong are immediate and severe: an
incarcerated or strangulating hernia missed as "just a lump" can progress to
bowel ischaemia within hours. No existing form in this monorepo answers the
specific question this one does — *what type of hernia is this, and does it
need referral today?* — as distinct from
[`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
which assumes the decision to operate has already been made. This form is
upstream of that decision.

## Design principles

1. **Diagnostic classification, not a numeric score.** No single validated
   instrument dominates groin- and abdominal-wall-hernia assessment the way
   MUST dominates malnutrition screening. The form borrows the European
   Hernia Society's type / subtype / laterality / size-grade structure for
   classification, and a dedicated red-flag screen for urgency, rather than
   inventing a numeric total that would carry false precision.
2. **Red-flag-first urgency, not max-grade.** The sibling forms
   (`dietic-assessment`, `perioperative-optimization`) use a max-grade
   algorithm across several weighted findings. Hernia urgency instead uses a
   strict evaluation order where any positive red flag short-circuits to
   `emergency` before any other branch runs — see
   [`doc/urgency-rules.md`](./doc/urgency-rules.md) for the rationale.
3. **Engine-first.** The TypeScript engine under
   `front-end-with-svelte/src/lib/engine/` was written and fully
   boundary-tested (35 Vitest cases) before any UI code, per the repo's
   engine-first workflow. The HTML front-end's JavaScript engine is a
   byte-for-byte-equivalent port with identical rule IDs and flag IDs,
   verified against the same boundary cases with a standalone Node harness.
4. **Overrides are visible, safety flags are not suppressible.** The
   clinician may override the final urgency band with a mandatory reason;
   `computedUrgency` and `finalUrgency` are both stored so the override is
   auditable. Safety flags are computed independently of the override and
   always reported — see `doc/safety-case-notes.md` hazard H-01.

## Build order

1. Spec (`spec/index.md`), design docs (`index.md`, `AGENTS.md`).
2. SQL migrations (`sql/02`–`06`), validated against a scratch Postgres.
3. Generated representations (XML, FHIR R5, protobuf, OpenAPI, examples,
   CHANGELOG, llms.txt, combined schema).
4. TypeScript scoring engine + Vitest boundary tests (engine-first).
5. Front-end with SvelteKit (wizard, dashboard, PDF report) — mirrors
   `dietic-assessment`'s structure and Lily Svelte conventions.
6. Front-end with HTML (wizard, dashboard) — mirrors `dietic-assessment`'s
   structure and Lily HTML conventions; JavaScript engine ported from the
   TypeScript engine and parity-checked with a standalone Node harness.
7. Back-end with Loco — relational per-table schema, `i64` ids, JSON API
   only, mirroring `dietic-assessment`'s crate structure.
8. Clinical reference documentation (`doc/`).
9. Verification gates (`bin/test-form`, `bin/test-sql-apply`,
   `bin/test-examples-conformance`, Lily drift detectors, `llms.txt` and
   `spec/` drift detectors).

## Relationship to sibling forms

See `index.md` §"Relationship to the pre-operative assessment forms" for how
this form differs from `pre-operative-assessment-by-clinician` and
`pre-operative-assessment-by-patient`. See `AGENTS.md` §"Urgency computation"
for how the red-flag-first algorithm differs from the max-grade algorithm
used by `dietic-assessment` and `perioperative-optimization`.

## Open items

- `capacity-concern` is reserved in the `hernia_diagnostic_evaluation_grade_flag`
  category `CHECK` constraint for fleet-wide flag-taxonomy consistency but is
  not currently wired to a wizard field — see `doc/safety-case-notes.md`
  hazard H-08.
- `cargo deny --all-features check` is expected to fail fleet-wide on
  RUSTSEC-2023-0071 (`rsa`, transitive via SeaORM's MySQL driver) — the
  canonical reference crate `forms/medical-operation-note/back-end-with-loco`
  fails identically, so this is not specific to this form.
