# Plan: arc42 Architecture Documentation Form

## Current status

Scaffolded 2026-05-08. Design based on an approved planning spec (since
removed). Build scope that session: foundation + Svelte form (option B
from the spec).

## Why this form exists

Software architecture documentation is frequently incomplete, inconsistent, or
out of date. The arc42 template (Starke & Hruschka) is widely adopted but lacks
a structured completeness check. This form provides a single-page assessment
wizard that helps a team objectively measure how well their architecture is
documented, identify the highest-value gaps, and track improvement over time.

As a non-clinical reference form in the `form-examples` monorepo, it also
demonstrates that the standard form pattern (wizard + scoring engine +
multi-format output) applies equally well outside the healthcare domain.

## Design principles

- **Section-level completeness** — each of the 12 arc42 sections is graded
  `empty` / `partial` / `complete` so teams can see precisely where
  documentation is thin.
- **Maturity band** — the composite grade (Draft / Reviewable / Ready / Mature)
  is derived by a max-grade algorithm and is easy to track quarter over quarter.
- **Flags** — high / medium / low priority flags fire independently of the
  maturity band and surface specific actionable gaps.
- **ADR-first** — the form treats the architectural decision record as a
  first-class sub-entity; a missing ADR log is a high-priority flag.
- **Single-page wizard** — 12 steps on one continuous page (monorepo rule).
- **Pure scoring engine** — `calculateMaturity()` is a pure function with no
  side-effects, fully unit-tested with Vitest.
- **FHIR-first exchange** — the canonical interchange format is FHIR R5 Bundle;
  XML is an archival fallback.

## Scoring engine

The composite grader runs a single pass over the 12 sections:

- **Per-section completeness** (`empty` / `partial` / `complete`) measures how
  thoroughly each arc42 section is populated. Thresholds are defined in
  `doc/completeness-rules.md`.
- **Composite maturity** (Draft / Reviewable / Ready / Mature) is derived by
  the max-grade algorithm defined in `doc/maturity-rules.md`.
- **Flags** fire independently for any missing or thin content in a
  high-priority position (e.g. no ADRs, no stakeholders, no deployment view).

## Build order

1. [x] Scaffold directory tree manually (skel/ removed from repo).
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`, `doc/*.md`.
3. [ ] Author SQL Liquibase migrations (00–20).
4. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
5. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [ ] Build SvelteKit 12-step wizard with scoring engine, Vitest tests,
       `pdfmake` PDF, and AsciiDoc export.
7. [ ] Run `bin/test-form arc42`.

## Future enhancements

- HTML form (static single-page, Alpine.js).
- Dashboard SvelteKit (SVAR DataGrid).
- Dashboard HTML (static review table).
- Rust full-stack with axum/Loco JSON API.
- Zod runtime validation on the SvelteKit client.
- Axe-core accessibility audit.
- End-to-end tests with Playwright.
- LocalStorage autosave with draft-recovery.
- Multi-cycle maturity tracking (version history per system).
- Radar-chart visualization of per-section completeness.
- ADR diff tool across architecture versions.
- Multi-architecture collaboration and co-authoring.
- Import from existing arc42 AsciiDoc.
