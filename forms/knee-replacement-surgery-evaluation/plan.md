# Plan: Knee Replacement Surgery Evaluation

## Current status

Created 2026-08-14. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/`, `bin/test-examples-conformance` passes |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| Scoring engine (`front-end-with-svelte/src/lib/engine/`) | complete — pure TypeScript, 40 Vitest boundary cases, all green |
| `front-end-with-svelte/` (wizard + dashboard) | in progress |
| `front-end-with-html/` (wizard + dashboard) | in progress |
| `back-end-with-loco/` | in progress |

## Why this form exists

The monorepo already has three pre-operative forms that answer *how risky is
this patient under anaesthesia?* via an ASA grade. None of them answer the
question a joint-replacement clinic actually starts with: *is this knee bad
enough, and has conservative treatment failed, to justify replacement
surgery?* This form is that assessment — the one an orthopaedic surgeon or
extended-scope physiotherapist completes at a joint-replacement triage clinic,
using the validated Oxford Knee Score rather than an invented severity scale,
and with an explicit audit of what conservative treatment has already been
tried before surgery is recommended.

It is deliberately a twin of
[`hip-replacement-surgery-evaluation`](../hip-replacement-surgery-evaluation)
(Oxford Hip Score instead of Oxford Knee Score) — the two forms share
structure by design, so a deployment can run both from one joint-replacement
service without inventing two different data models for the same clinical
question at two different joints.

## Design principles

- **Validated instrument only.** The Oxford Knee Score is the sole primary
  instrument; the engine invents no severity scale of its own.
- **First-match-wins candidacy rule**, not a weighted score. Surgical
  candidacy is a small, auditable, ordered rule list (`doc/oks-scoring.md`),
  not a black-box formula — a clinician can read the five rules and know
  exactly why a given recommendation was reached.
- **Conservative-first.** `conservative_measures_exhausted` is a hard gate:
  no computed rule can recommend `strong-candidate` or `candidate` without it,
  and `F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001` fires independently of the
  clinician override if a surgical recommendation is made anyway.
- **Clinician override is first-class.** Computed and final candidacy are both
  stored and printed, with a mandatory reason when they differ.
- **Single-page wizard.** 15 steps on one continuous page — the monorepo rule.
- **Not an ASA form.** Step 11 (general health) stays a high-level screen; see
  `spec/index.md` §2 "What this form is not".
- **Pure scoring engine.** `calculateKneeEvaluation()` is a pure function with
  boundary tests on every OKS category threshold and the full candidacy
  precedence order.
- **FHIR-first exchange.** The FHIR R5 Bundle is canonical; XML is archival.
- **Spec-driven.** `spec/index.md` is updated *before* code, and derived
  artefacts are regenerated after any schema change.

## Build order

### Phase 1 — Documentation and spec (complete)

`index.md` (15-step wizard table, scoring, flags), `spec/index.md` (living
spec, rewritten from the initial raw research brief into the repo's
living-spec format), `AGENTS.md`, `doc/oks-scoring.md`,
`doc/safety-case-notes.md`.

### Phase 2 — Schema (complete)

`sql/02` through `sql/06`: `patient`, `clinician`,
`knee_replacement_surgery_evaluation` (the wide wizard-payload table),
`knee_replacement_surgery_evaluation_grade` (1:1 computed/final result),
`knee_replacement_surgery_evaluation_grade_flag` (1:many safety flags).
Verified against a fresh scratch Postgres via `bin/test-sql-apply`.

### Phase 3 — Generated representations (complete)

XML, FHIR R5, Protocol Buffers, OpenAPI regenerated from `sql/`; `examples/`,
`CHANGELOG.md`, `llms.txt`, `back-end-with-loco-setup`, `sql/schema.sql`
regenerated.

### Phase 4 — Scoring engine (complete)

`front-end-with-svelte/src/lib/engine/`: `types.ts`, `defaults.ts`,
`utils.ts`, `oks-rules.ts`, `flagged-issues.ts`, `grader.ts`. 40 Vitest
boundary cases in `grader.test.ts` covering both sides of every OKS category
threshold (19/20, 29/30, 39/40), the full five-rule candidacy precedence
order, the override, and every safety flag.

### Phase 5 — Front-ends (in progress)

`front-end-with-svelte/`: 15 step components, wizard route, RESTful
dashboard routes, `pdfmake` report, vendored Lily UI/theme assets.

`front-end-with-html/`: the same 15-step wizard and dashboard as static HTML
with a plain-JavaScript ES-module port of the TypeScript engine (identical
rule/flag IDs), cross-checked against the TypeScript engine's boundary cases
via a standalone Node harness.

### Phase 6 — Back-end (in progress)

`back-end-with-loco/`: Loco 1.0.1, relational per-table schema, `i64` ids,
JSON API only, mirroring `dietic-assessment/back-end-with-loco/`'s crate
layout.

### Phase 7 — Verification

`bin/test-form`, `bin/test-sql-apply`, `bin/test-examples-conformance`,
`bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`,
`bin/generate-llms-txt.py --check`, `bin/generate-spec.py --check`, `cargo
build` + `cargo test` in the Loco crate.

## Risks

- **Concurrent build with `hip-replacement-surgery-evaluation`.** The two
  forms are twins built in parallel by separate agents in the same shared
  checkout. Structural drift between the two is acceptable (they are not
  required to be byte-identical beyond the shared repo conventions); accidental
  cross-editing of each other's files is not, and has been guarded against by
  scoping every change to this form's own directory.
- **Regulatory classification.** Likely EU MDR Class IIa given the output
  gates a surgical decision — see `doc/safety-case-notes.md`.
