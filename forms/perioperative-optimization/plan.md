# Plan: Perioperative Optimization

## Current status

Created 2026-08-13. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/` |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| `front-end-with-html/` | complete |
| `front-end-with-svelte/` | complete |
| `back-end-with-loco/` | complete |

## Why this form exists

The monorepo has three pre-operative assessment forms and all three compute an
ASA Physical Status grade. ASA answers *how risky is this patient?* — a
descriptive question whose answer the team cannot change. It is silent on the
question a modern perioperative pathway actually turns on: **which of these
risks are reversible, and is there time to reverse them before the listed
date?**

That second question is what NHS England's perioperative-pathway guidance and
CPOC's optimization work are about, and it is what this form computes. A patient
can be ASA III and fully optimized, or ASA II with an untreated iron deficiency
that four weeks of intravenous iron would fix. The ASA grade is identical in
both directions of that comparison; the optimization status is not.

## Design principles

- **Time is the first-class input.** Every domain carries a lead time, and the
  engine gates each finding against the weeks remaining. A finding without a
  gate is just a fact; a gated finding is a decision.
- **`insufficient-time` is never softened.** It forces `defer-surgery` and
  raises a flag. The team must then either re-date or record an explicit
  accept-risk decision. That is the clinical value of the form, and the one
  behaviour that must not be diluted.
- **Validated instruments only.** MUST, AUDIT-C, DASI, STOP-BANG, and the
  Clinical Frailty Scale, with thresholds from CPOC, NICE, and the source
  papers. Nothing is invented.
- **Max-grade composite.** The worst domain sets the readiness band, so one
  unoptimized domain cannot be averaged away by seven good ones.
- **One domain table, read everywhere.** `DOMAIN_DEFINITIONS` is the single
  source of thresholds and lead times; no implementation inlines them.
- **The override is auditable, not silent.** Computed and final bands are both
  stored and printed, with a mandatory reason. Safety flags ignore it entirely.
- **Single-page wizard.** 16 steps on one continuous page — the monorepo rule.
- **Pure engine.** `calculateOptimization()` reads both dates from the data, so
  it never touches the clock and is deterministic under test.
- **Spec-driven.** `spec/index.md` is updated *before* code, and derived
  artefacts are regenerated after any schema change.

## Build order

### Phase 1 — Documentation and spec

Settle the eight domains, their thresholds, and their lead times first: the SQL
column list and the engine are both derived from that table, so changing it
later is expensive.

Acceptance: every threshold in `index.md` has a citation in `doc/`, and every
wizard step maps to a named group of SQL columns.

### Phase 2 — Schema

Author `sql/02`–`sql/11`. Note the extra child table relative to the sibling
forms: `_grade_domain` holds the per-domain result set, because domain statuses
are this form's primary output rather than a by-product of a single score.

Acceptance: `bin/test-sql-apply perioperative-optimization` passes.

### Phase 3 — Generated representations

XML/DTD, FHIR R5, protobuf, OpenAPI, then the SQL comment and combined-schema
generators, then the Loco setup script, CHANGELOG/examples, `llms.txt`, and
`forms.tsv`.

Acceptance: every generator's `--check` reports no drift and
`bin/test-examples-conformance` passes.

### Phase 4 — HTML front-end

The 16-step single-page wizard plus a review dashboard. Lily headless classes,
native ES modules, the four header controls, and the engine in `js/`. The
dashboard's distinguishing column is **weeks to surgery** alongside the
readiness band, so a coordinator can see at a glance which lists are at risk.

Acceptance: `bin/lily-html-refactor --check`, `bin/es-modules-refactor --check`,
and `bin/test-e2e --html` all pass.

### Phase 5 — SvelteKit front-end

The same wizard and dashboard in SvelteKit 2 / Svelte 5 runes, a welcome page, a
`pdfmake` report endpoint, and Vitest tests covering every domain threshold and
both sides of every gating boundary.

Acceptance: `pnpm check`, `pnpm test`, and the Lily Svelte drift detectors pass.

### Phase 6 — Loco back-end

Loco 1.0.1 on axum 0.8 with SeaORM and PostgreSQL, JSON API only, relational
per-table schema. Run the `bin/loco-*` tools afterwards so defaults,
nullability, deny policy, and the queue/observability config match the fleet.

Acceptance: `cargo build`, `cargo test`, and every `bin/loco-* --check` pass.

## Risks and open questions

- **Lead times are policy, not physiology.** Four weeks of smoking cessation and
  twelve weeks for HbA1c are the widely cited figures, but a trust may set its
  own. They live in one table for exactly this reason; a deployment should
  expect to tune them. A future version could move `DOMAIN_DEFINITIONS` into
  configuration rather than code.
- **HbA1c lead time versus reality.** HbA1c reflects roughly three months of
  glycaemia, so a twelve-week lead time is honest but will mark most
  short-notice lists as `insufficient-time`. This is arguably correct — the
  value genuinely cannot be moved in three weeks — but teams may find the volume
  of `defer-surgery` results high. Worth reviewing against real list data.
- **Regulatory classification.** Software that gates a surgical decision sits
  closer to Class IIa under EU MDR Rule 11 than a pure calculator does. The form
  is positioned as decision support with a mandatory clinician gate decision and
  an auditable override; `doc/safety-case-notes.md` holds the DCB0129 / DCB0160
  placeholders.
- **Overlap with the siblings.** Steps 3, 4, and 5 (history, medications,
  allergies) duplicate fields the ASA-grading forms also collect. That is
  deliberate — this form is often the *first* contact in the pathway — but a
  deployment integrating both should populate one from the other rather than
  asking the patient twice.
- **Emergency surgery.** Out of scope by design. If a future version needs it,
  the gating model breaks down and would need replacing rather than extending.
