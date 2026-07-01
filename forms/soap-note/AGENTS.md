# SOAP Note — Agent Instructions

A structured clinical progress note that records one patient encounter in the
four SOAP sections (Subjective, Objective, Assessment, Plan) via a single
continuous single-page wizard, then grades the note for **documentation
completeness**. The engine classifies the note as **Complete**, **Partial**, or
**Incomplete**, reports a completeness percentage, and raises safety flags
(missing assessment or plan, red-flag symptoms without a plan, no safety-netting,
abnormal vitals not addressed). This is a documentation/completeness form, not a
numeric clinical score.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (SOAP / problem-oriented record)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `SoapNote` TypeScript type — the four SOAP sections' fields
  plus encounter-context and patient-identification fields.
- **Output shape:**
  ```ts
  validate(note: SoapNote): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number;   // 0..100
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
- **Algorithm:** presence-based completeness, not a numeric score. Each SOAP
  section contributes one or more required components; "present" means the
  relevant field (or any field in an at-least-one group) is a non-empty string.
  The status is derived as follows (see spec §4):
  - **Incomplete** — the Assessment or the Plan section is missing (or empty).
  - **Complete** — every required component (core + any conditionally required)
    is present and no high-priority flag has fired; `completenessPercent == 100`.
  - **Partial** — both Assessment and Plan present, but a required component is
    still missing.
  - `completenessPercent` = present required components / total required × 100.
  - Conditionally required: safety-netting (when red-flag symptoms present or the
    patient is managed at home) and follow-up (whenever a plan is recorded).
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `note-validator.ts`, `flagged-issues.ts`.
- **Tests:** `note-validator.test.ts`, `validation-rules.test.ts` — cover each
  status boundary (Complete / Partial / Incomplete), the conditional
  safety-netting and follow-up requirements, and every flag.

## Flagged issues

Computed independently of the status (see spec §5): missing assessment
(`!assessmentPresent`, high), missing plan (`!planPresent`, high), red-flag
symptoms without a plan (`redFlagSymptomsPresent == 'yes' && !planPresent`,
high), no safety-netting (safety-netting required but empty, medium), abnormal
vitals not addressed (`abnormalVitalsPresent == 'yes'` but not referenced in
Assessment or Plan, medium), incomplete documentation
(`completenessPercent < 100`, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Weed L.L. *Medical Records That Guide and Teach.* *N Engl J Med* 1968;
  278(11):593–600 — the problem-oriented medical record and SOAP structure.
- Podder V., Lew V., Ghassemzadeh S. *SOAP Notes.* StatPearls, 2023.
- Royal College of Physicians. *Generic Medical Record Keeping Standards.*
- Academy of Medical Royal Colleges. *Standards for the clinical structure and
  content of patient records* (2013).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form soap-note
```
