# Plan: Hip Replacement Surgery Evaluation

## Current status

Created 2026-08-14. Foundation and full stack COMPLETE as of 2026-08-14.

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/`, all `--check` gates green |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| Scoring engine (`front-end-with-svelte/src/lib/engine/`) | complete — 25/25 Vitest cases pass |
| `front-end-with-svelte/` UI (steps, routes, dashboard, PDF) | complete — svelte-check clean, vite build succeeds |
| `front-end-with-html/` | complete — 49/49 cross-check cases pass, Lily/ES-modules gates clean |
| `back-end-with-loco/` | complete — loco-rs 1.0.1, `cargo build` + 28/28 tests pass |

`bin/test-form hip-replacement-surgery-evaluation` passes except for the
intentionally-empty `typespec/` placeholder (left alone per the build
instructions).

## Why this form exists

Joint-replacement clinics need a structured record of *why* a patient is or
is not being listed for total hip arthroplasty — not another anaesthetic
fitness form (the monorepo already has three ASA-grading pre-operative
assessments and a dedicated optimization form), but the orthopaedic case for
surgery itself: pain and functional decline quantified with a validated
instrument, imaging correlation, and a documented conservative-treatment
trial. This form is that record.

## Design principles

- **Validated instrument only.** The Oxford Hip Score is the real published
  12-item PROM (Dawson et al. 1996); nothing is invented in the item set.
- **Documented convention where the source is silent.** The OHS category
  banding is not part of the original instrument; this form's four-band split
  is fixed and documented in `spec/index.md` §3 and `doc/ohs-scoring.md`
  rather than left as an undocumented magic number.
- **Rule-order candidacy, not max-grade.** Unlike some sibling forms'
  max-grade composites, candidacy here is a strict rule-order evaluation
  because "conservative measures not exhausted" must categorically override
  every other input — see `AGENTS.md` §Surgical-candidacy computation.
- **Clinician override is first-class.** Computed and final candidacy are
  both stored and printed, with a mandatory reason when they differ.
- **Single-page wizard.** 15 steps on one continuous page — the monorepo
  rule.
- **Pure scoring engine.** `calculateHipEvaluation()` is a pure function with
  boundary tests on every OHS-band and candidacy-band threshold.
- **Scope discipline.** This form does not compute or grow an ASA grade — see
  `AGENTS.md` §"What this form is not".
- **Spec-driven.** `spec/index.md` is updated *before* code, and derived
  artefacts are regenerated after any schema change.

## Build order

1. Spec + docs (`index.md`, `spec/index.md`, `AGENTS.md`, `doc/`) — done.
2. SQL migrations 02–06 — done.
3. Generated representations (xml, fhir, protobuf, openapi, back-end setup
   script, CHANGELOG, examples, llms.txt) — done.
4. Pure TypeScript engine under `front-end-with-svelte/src/lib/engine/` with
   `grader.test.ts` green — done.
5. SvelteKit UI: 15 step components, wizard route, RESTful dashboard routes,
   PDF report, vendored Lily UI components and theme CSS.
6. HTML front-end: JS engine port (byte-identical rule/flag IDs), wizard
   `index.html`, `dashboard.html`, vendored shared JS/CSS, a standalone
   Node cross-check harness against the Vitest cases.
7. Loco back-end: relational per-table schema, `i64` ids, JSON API only.
8. Full verification gate sweep (see `AGENTS.md` §Verify).

## Risks

- **Conflation with the ASA-grading siblings.** A future change must not pull
  detailed anaesthetic fitness scoring into this form; see `AGENTS.md`
  §"What this form is not".
- **OHS licensing.** Commercial/large-scale digital use of the Oxford Hip
  Score needs a licence from Oxford University Innovation — see
  `doc/ohs-scoring.md` §Instrument licensing.
- **Duplicate data entry** if a deployment also runs one of the ASA-grading
  pre-operative forms for the same patient; a real deployment should
  cross-populate rather than ask twice.
