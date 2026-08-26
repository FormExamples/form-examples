# Plan: United Kingdom Statement of Fitness for Work

## Current status

Scaffolded 2026-05-18. Design based on the August 2023 DWP fit-note guidance
for patients and employees, and the 2022 amendment to the Social Security
(Medical Evidence) Regulations.

## Why this form exists

The fit note (Med 3) is the legally-recognized UK record of a healthcare
professional's assessment of fitness for work. It is the statutory route to
Statutory Sick Pay, the evidence for many health-related benefit claims, and
the trigger document for employer conversations about workplace adjustments.

Until 2022, only doctors could issue fit notes and they were always
hand-signed. The 2022 amendments enabled digital delivery and broadened the
set of authorized issuers to include nurses, occupational therapists,
pharmacists, and physiotherapists. This implementation reflects the post-2022
form and supports both digital and printed issuance.

## Design principles

- **Single-page wizard** — ten steps on one continuous page (monorepo rule).
- **Policy-first grading** — the grader does not try to second-guess clinical
  judgement; it enforces DWP policy compliance and surfaces non-compliance as
  safety flags.
- **No "fit for work" branch** — per policy 3.2 the form cannot say a patient
  is fit for work; the UI does not offer that option.
- **Both period inputs are supported** — duration-based ("for 4 weeks") and
  date-range-based ("from … to …"); the grader computes period days from
  whichever is supplied.
- **Issuer-aware** — the form records the issuer profession (doctor, nurse,
  OT, pharmacist, physiotherapist) and flags the 2022-new authorities for
  audit visibility.
- **Equality Act aware** — diagnoses matching HIV, cancer, multiple
  sclerosis trigger an automatic-disability flag (policy 5.8) prompting
  Access to Work signposting.
- **Auditable** — every rule that fires is persisted to
  `..._grade_rule`; every safety flag to `..._grade_flag`.

## Grading engine

The grader has four independent rule sets that combine into a single
recommendation.

- **Validity rules** check the structural requirements imposed by policy 3.7
  (name, profession, practice address must all be present).
- **Adaptation rules** count the number of tick boxes selected when
  `may_be_fit` is chosen and classify intensity from `none` (a policy
  inconsistency) to `comprehensive` (all four).
- **Period rules** compute the period length in days, then classify it as
  `self_cert_range` (< 7 days), `compliant`, `exceeds_initial_max` (> 3
  months in the first 6 months of the condition), `long_term` (> 4 weeks),
  or `very_long_term` (> 6 months).
- **Safety-flag rules** scan the assessment for the eighteen-flag catalogue
  described in `index.md` and emit prioritized flags with suggested actions.

The recommendation is the worst-severity match across the fired flags, with
`review_for_validity` superseding all others.

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`, `doc/*.md`.
3. [ ] Author SQL Liquibase migrations for patient, clinician, medical
       practice, fit note, grade, grade rule, grade flag.
4. [ ] Generate XML + DTD via `bin/xml-representations/generate-xml-representations.py`.
5. [ ] Generate FHIR R5 JSON via `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [ ] Generate Protocol Buffers via
       `bin/protobuf/generate-protobuf-representations.py`.
7. [ ] Build SvelteKit form (single-page ten-step wizard).
8. [ ] Build HTML form (static single-page Alpine.js).
9. [ ] Build dashboard SvelteKit (SVAR DataGrid).
10. [ ] Build dashboard HTML (review table).
11. [ ] Build Rust full-stack with axum/Loco JSON API.
12. [ ] Unit-test grader (Vitest).
13. [ ] Run `bin/test-form united-kingdom-statement-of-fitness-for-work`.

## Future enhancements

- Integration with the NHS Digital Personal Demographics Service for NHS
  number validation.
- Auto-completion of SNOMED CT codes for diagnosis using a UK clinical
  terminology service.
- Bilingual (English / Cymraeg) UI in line with NHS Wales.
- Direct submission to GP IT systems (EMIS, SystmOne, Vision) for digital
  issuance.
- DWP benefits-integration mock for end-to-end testing.
- Clinical safety case (DCB0129 / DCB0160) documentation.
- LocalStorage autosave with draft-recovery.
- Axe-core accessibility audit.
- End-to-end tests with Playwright covering the validity-rule matrix.
- Audit log of every grade override.
