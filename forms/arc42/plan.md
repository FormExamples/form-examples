# Plan: arc42 Architecture Documentation Form

## Current status

Scaffolded 2026-05-08. Design based on the approved spec
`docs/superpowers/specs/2026-05-08-arc42-form-design.md`, implemented across
the full monorepo stack (SQL, FHIR, XML, HTML, SvelteKit, Rust full-stack).

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

- **Section-level completeness scoring** — each of the 12 arc42 sections is
  scored 0–3 so teams can see precisely where documentation is thin.
- **Maturity summary** — the unweighted sum drives a four-band label
  (Draft / Developing / Established / Optimised) that is easy to track quarter
  over quarter.
- **Coaching rules** — each gap fires a concrete, actionable coaching rule
  rather than a vague warning; rules live in `doc/maturity-rules.md`.
- **ADR-first** — the form treats the architectural decision record as a
  first-class sub-entity; a missing ADR log is a high-priority flag.
- **Single-page wizard** — 14 steps on one continuous page (monorepo rule).
- **Pure scoring engine** — `calculateMaturity()` is a pure function with no
  side-effects, fully unit-tested with Vitest.
- **FHIR-first exchange** — even though the form is non-clinical the canonical
  interchange format is FHIR R5 `QuestionnaireResponse` for monorepo
  consistency; XML is an archival fallback.

## Scoring engine

The composite grader runs a single pass over the 12 section scores:

- **Per-section completeness (0–3)** measures how thoroughly each arc42 section
  is populated. The completeness rules (in `doc/completeness-rules.md`) define
  what "stub", "partial", and "complete" mean for each section.
- **Maturity sum** is the unweighted sum across answered sections.
  Thresholds are defined in `doc/maturity-rules.md`.
- **Completeness flags** fire for any section with a high-priority role that
  scores 0 (e.g. missing context diagram, missing goals, no ADRs).
- **Stale-documentation flag** fires when the review date is more than 180
  days ago.

## Build order

1. [x] Scaffold directory via manual shell commands (skel/ removed).
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`, `doc/*.md`.
3. [ ] Author SQL Liquibase migrations for respondent, assessment, section
       responses, stakeholders, ADRs, glossary terms, risks, grading result,
       fired rules, additional flags.
4. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
5. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [ ] Build SvelteKit form (single-page architect wizard, 14 steps).
7. [ ] Build HTML form (static single-page, Alpine.js).
8. [ ] Build dashboard SvelteKit (SVAR DataGrid).
9. [ ] Build dashboard HTML (static review table).
10. [ ] Build Rust full-stack with axum/Loco/Tera/HTMX/Alpine.
11. [ ] Unit-test composite grader (Vitest).
12. [ ] Run `bin/test-form arc42`.

## Future enhancements

- Zod runtime validation on the SvelteKit client.
- Axe-core accessibility audit.
- End-to-end tests with Playwright.
- LocalStorage autosave with draft-recovery.
- Version history: track maturity across multiple review cycles for the same
  system.
- Radar-chart visualisation of per-section completeness.
- Export of gap-action-plan as JIRA/Linear tickets via API.
