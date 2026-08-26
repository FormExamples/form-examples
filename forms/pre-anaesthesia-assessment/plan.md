# Plan: Pre-Anaesthesia Assessment

## Current status

Foundation COMPLETE as of 2026-07-12. The form is full-stack: SQL migrations
(canonical `NN_create_table_<name>.sql` layout + `schema.sql`), generated
XML/DTD, FHIR R5, Protocol Buffers, and OpenAPI 3.1 representations,
consolidated `front-end-with-html/` (Lily Design System wizard + dashboard),
`front-end-with-svelte/` (SvelteKit 2 / Svelte 5 wizard + dashboard + PDF
report, routes nested under `src/routes/pre-anaesthesia-assessment/`),
and `back-end-with-loco/` (Rust edition 2024, Loco 0.16 + axum 0.8 + SeaORM,
relational per-table schema). `bin/test-form pre-anaesthesia-assessment`
passes. This form is the **canonical reference layout** for the monorepo, so
improvements here set the template other forms will follow.

This plan now covers the **next major release**: capability, functionality,
documentation, tutorial, and example improvements. Execution phases and
per-task checkboxes live in [`tasks.md`](./tasks.md).

## Why this form exists

A pre-operative assessment must ultimately be *validated by a clinician*. A
patient self-report questionnaire captures symptoms and history but cannot
record auscultation findings, ECG interpretation, laboratory results, or
airway anatomy. This form is the clinician-operated record of objective
findings used to set the ASA grade and the anaesthesia plan — the document an
anaesthetist reviews before signing the WHO Safer Surgery Checklist.

## Design principles (unchanged)

- **Objective, clinician-observed data only.**
- **Max-grade composite scoring** — the worst finding sets the risk band;
  safety flags fire independently.
- **Clinician override is first-class** — computed and final ASA grades are
  both stored and printed.
- **Single-page wizard** — 16 steps on one continuous page (monorepo rule).
- **Symmetric with the patient self-report sibling**
  (`forms/pre-operative-assessment-by-patient/`) for side-by-side review.
- **Pure scoring engine** — `calculateASA()` is a pure function, unit-tested.
- **FHIR-first exchange** — FHIR R5 Bundle is canonical; XML is archival.
- **Spec-driven** — `spec/index.md` is updated *before* code in every phase,
  and derived artefacts are regenerated after any schema change.

## Improvement phases

### Phase 0 — Housekeeping and doc-truth (prerequisite)

The repo's docs must describe what actually exists before new work lands.

- Remove the stale `back-end-with-loco/todo/` embedded subcrate (it uses Tera
  templates, which the back-end conventions ban; it predates the JSON-API
  refactor).
- Fix stale references: `tasks.md` lists the pre-rename SQL filenames
  (`00-extensions.sql`…); `AGENTS.md` points at a `seeds/` directory that no
  longer exists (the CPOC PDF lives in `doc/`), claims an `asa-rules.test.ts`
  that is not present, and describes a dynamic `/assessment/[step=step]` route
  that the consolidated single-page wizard replaced.
- Refresh `spec/index.md` so it reflects the shipped 16-step wizard, the
  grade/rule/flag tables, and the RESTful Svelte routes.
- Acceptance: every path or filename named in `index.md`, `AGENTS.md`,
  `plan.md`, `tasks.md`, `spec/index.md`, and `doc/*.md` exists on disk;
  `bin/test-form pre-anaesthesia-assessment` still passes.

### Phase 1 — Engine capabilities: one truth, three runtimes

The scoring engine currently exists twice in TypeScript
(`front-end-with-svelte/src/lib/engine/` and `front-end-with-html/js/`) with
no automated guarantee they agree, and not at all in Rust (grades are computed
client-side and merely stored by the back-end).

- **Golden test vectors.** Author `examples/golden-vectors.json`: an array of
  `{ name, input: ClinicianAssessment, expected: GradingResult }` cases
  covering every ASA rule, every flag, all four sub-scores, boundary values
  (EF exactly 40, INR exactly 1.5, SpO₂ exactly 92, CFS 6 vs 7, 7-week COVID
  boundary), and the override path. This file becomes the single
  cross-runtime conformance contract.
- **TS conformance tests** (Vitest) in the Svelte engine and a lightweight
  Node test runner for the HTML `js/` engine, both replaying the golden
  vectors. Divergence between the two TS copies becomes a test failure.
- **Rust engine port.** Add a pure `grading` module to the Loco crate
  (mirroring `asa-rules` / `mallampati` / `rcri` / `stopbang` / `frailty` /
  `composite-grader`), with `serde(rename_all = "camelCase")` types matching
  the TS input shape. Expose it via a `POST …/grade` endpoint that accepts an
  assessment payload and returns the computed grading result, so the server
  can verify (and re-derive) any client-submitted grade. A Rust test replays
  the same golden vectors.
- **New validated instruments** (clinician-relevant, additive — no schema
  breakage; each is an optional sub-score alongside RCRI/STOP-BANG):
  - **SORT** (Surgical Outcome Risk Tool) 30-day mortality estimate.
  - **ARISCAT** postoperative pulmonary complication risk.
  - **Apfel score** for post-operative nausea and vomiting (0–4).
  - **DASI-derived METs** to formalize the existing functional-capacity step.
  Each instrument: SQL columns (new migration, never editing shipped ones),
  regenerate derived artefacts, engine rules + tests, both front-ends, Rust
  port, golden vectors, `doc/` reference page.
- Acceptance: golden vectors pass in Svelte TS, HTML JS, and Rust; `cargo
  test` and `pnpm test` green; `bin/test-sql-apply
  pre-anaesthesia-assessment` green after the new migration.

### Phase 2 — Functionality: validation, drafts, override audit, interchange

- **Zod runtime validation** on the SvelteKit client: one schema module
  derived from `types.ts`, applied per-step (blocking Next on hard errors,
  warning on physiologically-implausible values, e.g. SpO₂ > 100, negative
  creatinine). Mirror the plausibility bounds in the HTML front-end's
  existing validation.
- **Draft autosave + recovery**: debounced localStorage persistence keyed by
  form slug + schema version; restore banner on reload; explicit discard.
  Same behaviour in both front-ends.
- **Override audit trail**: new `…_override_audit` table (who, when, computed
  grade, final grade, reason); Loco endpoint + entity + tests; surfaced
  read-only in the dashboard row detail and the PDF report.
- **Import/export completeness** (monorepo convention: JSON, XML, CSV, TSV):
  verify what the front-ends actually implement, then close the gaps in both,
  with round-trip tests (export → import → deep-equal).
- **Dashboard upgrades**: filter by ASA grade / composite risk / urgency in
  both dashboards (SVAR dropdown filters already exist in Svelte — verify),
  add CSV/TSV export of the visible rows, add a side-by-side view linking a
  clinician assessment to its patient self-report sibling when IDs match.
- Acceptance: manual walkthrough of both front-ends per the Phase 5 tutorial;
  round-trip tests green; audit rows visible after an override.

### Phase 3 — Quality gates: E2E, accessibility, property tests

- **Playwright E2E** (`front-end-with-svelte/e2e/`): fill all 16 steps from a
  golden-vector input, assert the rendered grade/flags match the expected
  output, exercise override, PDF-route 200, dashboard filter, and draft
  restore. A slimmer suite drives `front-end-with-html/index.html` via file
  or static server.
- **Accessibility**: axe-core scan wired into Playwright for every step and
  the dashboards; fix all critical/serious findings; keyboard-only
  walkthrough documented; visible focus states; `aria-live` on the flag
  banner and error summary. Target WCAG 2.2 AA.
- **Property-based tests** (fast-check) for engine invariants: composite risk
  is monotone (adding a worse finding never lowers the band), ASA default is
  I on empty input, sub-scores stay in range, grader is deterministic and
  side-effect-free.
- Acceptance: `pnpm test`, `pnpm exec playwright test`, and the axe gate all
  green; findings log kept in `doc/accessibility-audit.md`.

### Phase 4 — Documentation

- **`doc/data-dictionary.md`** — generated table-by-table, column-by-column
  reference derived from the SQL `COMMENT ON` metadata (script may live in
  the form or be proposed for `bin/`); regenerated whenever `sql/` changes.
- **`doc/scoring-engine-reference.md`** — every rule with its predicate,
  source instrument, evidence citation, band, and priority; the max-grade
  composite algorithm; the override semantics. Supersedes and absorbs
  `doc/asa-grading-rules.md` gaps for the new Phase 1 instruments.
- **`doc/api-reference.md`** — every Loco endpoint (method, path, auth,
  request/response JSON, error shapes) with `curl` examples, including the
  new `grade` and override-audit endpoints.
- **`doc/architecture.md`** — Mermaid diagrams: component/data-flow (wizard →
  engine → API → Postgres → dashboard/PDF/FHIR) and the ER diagram.
- **Safety case**: expand `doc/safety-case-notes.md` from placeholder to a
  structured DCB0129/DCB0160 hazard log (hazard, cause, effect, existing
  controls, residual risk) covering at least: wrong-patient data entry,
  stale investigation results, engine mis-grade, override misuse, fasting
  flag missed, data loss on draft.
- **CHANGELOG.md** — release `1.1.0` (or next SemVer) entries per phase,
  Keep-a-Changelog 1.1.0 format.
- Acceptance: `bin/test-form` still passes; every doc cross-link resolves.

### Phase 5 — Tutorials

New `tutorials/` directory (with `index.md` catalogue, `AGENTS.md`,
`CLAUDE.md` per monorepo layout conventions):

1. `01-quickstart-html.md` — open the static wizard, complete a sample
   assessment, read the grade panel. Zero build steps.
2. `02-run-svelte-front-end.md` — pnpm install/dev, the nested route URL,
   themes, running Vitest.
3. `03-run-loco-back-end.md` — scratch Postgres (port 5433, short socket
   dir), migrations, seeding, `cargo test`, hitting the JSON API with curl.
4. `04-end-to-end-walkthrough.md` — one clinical vignette ("67-year-old for
   elective hip replacement, AF on DOAC, EF 38 %") carried from wizard entry
   through grading, override, PDF report, FHIR bundle export, and dashboard
   review, with expected outputs at each stage.
5. `05-extend-the-engine.md` — developer tutorial: add a hypothetical rule
   end-to-end (spec → SQL migration → regenerate artefacts → TS + Rust rule +
   golden vector → both front-ends → docs), demonstrating the spec-driven
   workflow.
6. `06-clinician-dashboard-guide.md` — operator-facing guide: filters,
   side-by-side patient/clinician comparison, exports, reading flags.

Each tutorial ends with a "verify" block of exact commands and expected
output. Tutorials are checked by a link/path validator (all referenced files
and commands exist).

### Phase 6 — Examples

Grow `examples/` from one persona to a library that doubles as test input:

- `asa1-healthy-day-case.json` — 28-year-old, no findings, ASA I, low risk.
- `asa2-controlled-comorbidity.json` — hypertension + BMI 32, ASA II.
- `asa3-complex.json` — the tutorial vignette (RCRI 3, EF 38 %, flags fire).
- `asa4-critical.json` — decompensated CHF, high/critical band.
- `override-case.json` — computed III, clinician override to II with reason.
- Matching `*.expected.json` grading outputs (these are the golden vectors of
  Phase 1 — one file, referenced from both places, no duplication).
- `fhir-bundle-asa3.json` — full FHIR R5 Bundle for the complex persona.
- `assessment.csv` / `assessment.tsv` / `assessment.xml` — the interchange
  formats exercised by the Phase 2 round-trip tests.
- `api-session.md` — a recorded curl session against the Loco API (register,
  create patient, create assessment, grade, override, fetch).
- Acceptance: every example validates against the Zod schema and replays
  through all three engine runtimes.

## Sequencing and dependencies

Phase 0 first (cheap, unblocks truthful docs). Phase 1 before 2/3 (golden
vectors underpin validation, E2E assertions, and examples). Phases 4–6 can
interleave once 1–2 land, but tutorial 4 and the example library depend on
the Phase 1 vectors and Phase 2 export formats. Every phase ends with:

```sh
bin/test-form pre-anaesthesia-assessment
bin/test-sql-apply pre-anaesthesia-assessment   # if sql/ changed
bin/lily-html-refactor --check pre-anaesthesia-assessment
bin/lily-svelte-refactor --check pre-anaesthesia-assessment
bin/generate-llms-txt.py --check pre-anaesthesia-assessment
bin/generate-changelog-and-examples.py --check pre-anaesthesia-assessment
```

plus regeneration of derived artefacts after any `sql/` change.

## Out of scope (recorded, not planned)

- NHS Digital PDS integration for NHS-number validation (needs live service
  credentials).
- Trust SSO / smartcard e-signature capture (needs an identity provider).
- User acceptance testing with a real anaesthetic pre-assessment team.
- Bilingual English/Cymraeg UI — deferred until the monorepo i18n approach is
  decided repo-wide (a per-form one-off would fork the Lily conventions).
