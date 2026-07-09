# Plan: Return to Work

## Current status

Scaffolded 2026-05-18 with `bin/create-form return-to-work`. Subprojects
authored 2026-05-18 from the brief in `seed.md`.

## Why this form exists

Employers and statutory sick pay (SSP) processes need a clinician's
written authorisation before an employee returns to work after illness,
injury, or extended absence. In the UK this is the *Statement of
Fitness for Work* (Med 3, often called a "fit note"). In other
jurisdictions it is called a medical clearance letter or physician's
return-to-work release. Short absences are covered by employee
self-certification (SC2 in the UK) and are intentionally **out of
scope** for this clinician-operated form.

## Design principles

- **Clinician-authored, employer-facing** — every field is either
  clinician-observed or clinician-confirmed; nothing is patient-only
  self-report.
- **Med 3 alignment** — the three-state fitness outcome (`fit` /
  `may be fit` / `not fit`) and the workplace-adjustment vocabulary
  mirror the current UK Med 3 form.
- **Max-grade restriction scoring** — the most severe adjustment sets
  the restriction-priority grade; safety flags fire independently so
  that occupational-health teams see them even when the overall grade
  is low.
- **Clinician override is first-class** — the computed statement is
  never silently discarded; both computed and final values are stored
  and printed.
- **Single-page wizard** — 12 steps on one continuous page (no
  multi-page forms; monorepo rule).
- **Symmetric with patient self-certification** — the data shape allows
  a `Patient` resource and a `Practitioner` resource to be linked so a
  side-by-side review is possible in the clinician dashboard when an
  SC2 self-certification preceded the Med 3.
- **Pure scoring engine** — `calculateReturnToWork()` is a pure
  function with no side-effects, fully unit-tested with Vitest.
- **FHIR-first exchange** — the canonical interchange format is FHIR R5
  Bundle; XML is an archival fallback; Protocol Buffers and TypeSpec
  are alternative wire representations.

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`,
       `plan.md`, `tasks.md`, `doc/*.md`.
3. [x] Author SQL Liquibase migrations for patient, clinician,
       employer, the return-to-work record, restrictions, grade, fired
       rules, additional flags.
4. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
5. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [ ] Generate Protocol Buffers schemas.
7. [ ] Generate TypeSpec schemas.
8. [ ] Build SvelteKit clinician-form (single-page wizard).
9. [ ] Build HTML clinician-form (static single-page, Alpine.js).
10. [ ] Build clinician-dashboard SvelteKit (SVAR DataGrid).
11. [ ] Build clinician-dashboard HTML (static review table).
12. [ ] Build Rust full-stack with axum/Loco JSON API.
13. [ ] Unit-test composite grader (Vitest).
14. [ ] Run `bin/test-form return-to-work`.

## Future enhancements

- Zod runtime validation on the SvelteKit client.
- Axe-core accessibility audit.
- End-to-end tests with Playwright.
- LocalStorage autosave with draft-recovery.
- Bilingual (English / Cymraeg) UI in line with NHS Wales.
- Integration with NHS Digital Personal Demographics Service (PDS) for
  NHS-number validation.
- SNOMED CT lookup for diagnosis field with NHS Digital terminology
  server.
- ICD-10 cross-walk for international interoperability.
- Clinical safety case (DCB0129 / DCB0160) documentation.
- Equality Act *reasonable adjustment* checklist generation.
- DVLA notification helper (auto-fill the DVLA online form from the
  clinician statement).
- Direct push to the NHS Digital Electronic Fit Note service.
