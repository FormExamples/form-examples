# Ward Round Note — Agent Instructions

A daily inpatient review entry documented at the bedside during a ward round.
Collects ten review components via a single continuous single-page wizard —
review header (date, time, clinician name and grade), overnight events, current
problem list and progress, examination and latest observations (NEWS2),
investigations reviewed, VTE assessment status, medication changes, plan and
jobs, escalation / ceiling-of-care status, and estimated discharge date. This is
a **documentation / completeness** form, not a numeric score: the engine grades
each entry **Complete / Partial / Incomplete** and raises safety flags.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NEWS2, GMC record-keeping,
  AoMRC record standards, NICE NG89 VTE)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `WardRoundNote` TypeScript type — the review-header and
  identification fields plus the ten review-component fields.
- **Output shape:**
  ```ts
  validate(note: WardRoundNote): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number; // 0..100 over required components
    documentedComponents: ComponentKey[];
    firedRules: FiredRule[];
    flags: FlaggedIssue[];
  }
  ```
- **Algorithm:** completeness — evaluate each component's `documented`
  predicate, then classify. 8 required components (`header`, `problems`,
  `examination`, `investigations`, `vte`, `medication`, `plan`, `escalation`)
  and 2 recommended (`overnightEvents`, `estimatedDischarge`). See spec §4.
  - `complete` — all 8 required documented.
  - `partial` — `header` and `plan` documented and ≥ 4 required documented.
  - `incomplete` — `header` or `plan` missing, or < 4 required documented.
  - An explicit negative flag (e.g. "no changes", "none outstanding") counts as
    documented — a deliberate negative is a valid clinical record.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `note-validator.ts`, `flagged-issues.ts`.
- **Tests:** `note-validator.test.ts`, `validation-rules.test.ts` — cover each
  status boundary and every flag.

## Flagged issues

Computed independently of the status (see spec §5): deteriorating NEWS2 —
escalation needed (`news2Total >= 5` or single-parameter 3 or deteriorating
trend, no escalation action, high), VTE assessment not done
(`vteStatus == 'not-done'`, high), no plan or jobs documented
(`planAndJobs == ''`, high), abnormal results not actioned (flagged but not
actioned, medium), no senior review when required (deteriorating patient or
ceiling-of-care decision with no senior named, medium), incomplete entry (any
required component absent, low).

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

- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- General Medical Council. *Good Medical Practice* — record-keeping (2024).
- Academy of Medical Royal Colleges. *Standards for the Clinical Structure and
  Content of Patient Records* (2013).
- NICE NG89. *Venous thromboembolism in over 16s* (2018).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form ward-round-note
```
