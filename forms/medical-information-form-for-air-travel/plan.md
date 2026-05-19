# Plan: Medical Information Form for Air Travel (MEDIF)

## Current status

Scaffolded 2026-05-18. Design seeded from `seed.md` (consolidated airline
references for Emirates, Qatar Airways, British Airways, LOT Polish, KLM,
ANA, Air India, Starlux), the IATA Medical Manual, and Aerospace Medical
Association guidance.

## Why this form exists

Airlines must determine whether a passenger with a specific health need can
safely fly and whether in-flight accommodations (supplemental oxygen,
stretcher, incubator, medical escort, battery-powered device) need to be
provisioned ahead of departure. The MEDIF is the standardised industry
artefact that captures this clinical evaluation and translates it into an
airline medical-desk decision. The form is not a medical device in the
diagnostic sense; it is an information aid that supports the airline's
final decision under the IATA Medical Manual.

## Design principles

- **Single-page wizard** — 14 steps on one continuous page (monorepo rule).
- **Conservative airline rule set** — where carriers differ, the most
  conservative window is used (e.g. 14-day pneumothorax window, 7-day MI
  window) so the form is acceptable to the widest range of airlines.
- **Max-grade composite scoring** — the worst-band finding sets the fitness
  band; safety flags fire independently and are listed in the report.
- **Pure scoring engine** — `evaluateFitnessToFly()` is a pure function
  with no side effects, fully unit-tested with Vitest.
- **FHIR-first exchange** — the canonical interchange format is a FHIR R5
  Bundle (`Patient`, `Practitioner`, `Encounter`, `Observation`s,
  `ClinicalImpression`, `DetectedIssue`s); XML is an archival fallback.
- **Symmetric agent / clinician fields** — Part 1 (submitting agent) and
  Part 2 (attending physician) are clearly separated so the airline medical
  desk can verify clinical authorship.
- **No silent decisions** — the computed fitness band and every fired rule
  are stored and printed; the airline medical desk has full transparency.

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`, `doc/*.md`.
3. [x] Author SQL Liquibase migrations for patient, clinician (attending
       physician), assessment, grading result, fired rules, additional flags.
4. [x] Generate XML + DTD representations.
5. [x] Generate FHIR HL7 R5 JSON representations.
6. [x] Generate Protocol Buffers `.proto` schemas.
7. [x] Generate TypeSpec interface definitions.
8. [x] Build SvelteKit single-page MEDIF wizard.
9. [x] Build HTML single-page MEDIF wizard.
10. [x] Build medical-desk dashboard (SvelteKit + HTML).
11. [x] Build Rust full-stack with axum / Loco / Tera / HTMX / Alpine.
12. [x] Vitest unit tests for the fitness-to-fly engine.
13. [x] Run `bin/test-form medical-information-form-for-air-travel`.

## Future enhancements

- Airline-specific output profiles (e.g. Emirates extras, BA extras) generated
  from the same canonical model.
- IATA SSR (Special Service Request) code generator from the requested
  accommodations.
- Zod runtime validation on the SvelteKit client.
- LocalStorage autosave with draft recovery for the passenger.
- Bilingual UI (English / Cymraeg, English / Arabic) for international use.
- Airline electronic submission API (where supported).
- Integration with the airline's accessible-travel portal SSO.
