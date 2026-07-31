# Inpatient Clinical Note — Agent Instructions

An episode-scoped clinical note about an admitted patient. One schema covers
eight note types (`admission-clerking`, `progress`, `consult`, `event`,
`procedure`, `handover`, `transfer`, `discharge-planning`), collected via a
single continuous 12-step wizard. Two engines run over each entry: a
**documentation completeness** engine grading **Complete / Partial /
Incomplete**, and a **clinical acuity** engine assigning **Stable / Watch /
Escalate / Critical**. Safety flags fire independently of both.

See [`index.md`](./index.md) for the full design and the 12-step wizard table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Positioning against neighbouring forms

- [`ward-round-note`](../ward-round-note) — one daily bedside ward-round entry.
  This form is broader: any note type, keyed to the admission episode.
- [`soap-note`](../soap-note) — generic SOAP-structured encounter note for any
  setting. This form is inpatient-specific and problem-oriented rather than
  SOAP-sectioned.
- [`medical-operation-note`](../medical-operation-note) — the theatre operation
  note. Bedside ward procedures belong here as `note_type = 'procedure'`;
  theatre procedures do not.
- [`hospital-discharge`](../hospital-discharge) — the discharge summary itself.
  This form's `discharge-planning` note type records readiness, not the summary.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NEWS2, AoMRC record standards,
  GMC record-keeping, NICE VTE / sepsis / delirium / pressure-ulcer guidance)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `InpatientClinicalNote` type — identification and admission
  fields plus the twelve component field groups and the four child collections
  (`problems`, `medicationChanges`, `investigations`, `jobs`).
- **Output shape:**

  ```ts
  gradeNote(note: InpatientClinicalNote): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number;        // 0..100 over required components
    acuityBand: 'stable' | 'watch' | 'escalate' | 'critical';
    news2Total: number | null;
    documentedComponents: ComponentKey[];
    requiredComponents: ComponentKey[]; // varies by note type
    firedRules: FiredRule[];
    flags: FlaggedIssue[];
  }
  ```

- **Algorithm:** completeness — evaluate each component's `documented`
  predicate against the note-type-specific required set, then classify. See
  spec §4.
  - `complete` — every required component documented.
  - `partial` — `header`, `impression`, and `plan` documented and at least half
    the required components documented.
  - `incomplete` — `header`, `impression`, or `plan` missing, or fewer than half
    the required components documented.
  - An explicit negative ("no changes", "nil outstanding") counts as documented.
- **Engine files:** `types.js`, `utils.js`, `component-rules.js`,
  `note-grader.js`, `news2-rules.js`, `acuity-rules.js`, `flagged-issues.js`.

## Acuity engine

- **Algorithm:** max-band — the worst finding sets the band; `stable` is the
  default when no rule fires. The band never falls below a fired rule's band.
- **NEWS2:** entered directly, or derived from the seven RCP 2017 parameters
  when all are present. A derived total never silently overwrites an entered
  one; the entered value wins and the derived value is reported alongside it.
- **Bands:** see spec §5. `critical` is reserved for arrest, peri-arrest,
  critical-care referral, NEWS2 ≥ 9, or new organ support.

## Author override

The engines produce a computed completeness status and acuity band. The author
may override the acuity band on step 12 with a documented reason. Both the
**computed** and the **final** band are stored and rendered in the report and
the FHIR Bundle. The completeness status is never overridable — it is a
mechanical property of the record.

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
- Academy of Medical Royal Colleges. *Standards for the Clinical Structure and
  Content of Patient Records* (2013).
- General Medical Council. *Good Medical Practice* — record-keeping (2024).
- NICE NG89. *Venous thromboembolism in over 16s* (2018).
- NICE NG51. *Sepsis: recognition, diagnosis and early management* (2016,
  updated 2024).
- NICE CG103. *Delirium* (2010, updated 2023).
- NICE CG161. *Falls in older people* (2013, updated 2019).
- NICE CG179. *Pressure ulcers* (2014).
- NICE NG15. *Antimicrobial stewardship* (2015).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form inpatient-clinical-note
```
