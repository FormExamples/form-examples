# Anaesthetic Record — Agent Instructions

The intra-operative anaesthesia chart. Documents an anaesthetic from
pre-induction checks through recovery handover via a single continuous
single-page wizard — case identification, pre-induction checks, ASA and airway
assessment, drugs and doses, airway management, monitoring, timed physiological
observations, fluids and blood loss, regional / neuraxial technique, events and
complications, and recovery handover. Its engine grades **completeness and
validity** (not a numeric severity score): it classifies each record as
**Complete**, **Partial**, or **Incomplete** against mandatory-item rules, and
independently raises **safety flags**.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (RCoA GPAS, WHO checklist,
  monitoring standards)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness / validation engine

This is a **documentation / completeness** form. The engine does **not** compute
a numeric clinical score; it validates the record for completeness and raises
safety flags.

- **Input shape:** `AnaestheticRecord` TypeScript type — the parent record plus
  child arrays for drug administrations, timed observations, and intra-operative
  events. Its shape mirrors the SQL schema in `sql/`.
- **Output shape:**
  ```ts
  validate(record: AnaestheticRecord): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number;   // 0..100
    firedRules: FiredRule[];       // mandatory-item rule results
    flags: Flag[];                 // safety flags, each with a priority
  }
  ```
- **Algorithm:** completeness classification (see spec §4). Any *critical*
  mandatory item missing → `incomplete`; else any *non-critical* mandatory item
  missing → `partial`; else `complete`. `completenessPercent` is the proportion
  of mandatory items satisfied.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `record-validator.ts`, `flagged-issues.ts`.
- **Tests:** `record-validator.test.ts`, `validation-rules.test.ts` — cover each
  status class (Complete / Partial / Incomplete), each mandatory rule's
  satisfied / unsatisfied path, and every safety flag firing and not firing.

## Status classes

- **Complete** — every mandatory item present and valid; ready to sign.
- **Partial** — all safety-critical items present, one or more non-critical
  items missing; may be signed with acknowledgement.
- **Incomplete** — one or more safety-critical items missing or invalid; must not
  be signed until resolved.

## Mandatory-item rules

- **Critical** (missing → Incomplete): `patientIdentifier`, `anaesthetistName`,
  `asaStatus`, `anaestheticTechnique`, `airwayTechnique`, WHO checklist status
  (`whoSignIn` + `whoTimeOut`), at least one timed-observation row,
  `anaesthetistSignature`.
- **Non-critical** (missing → Partial): `weightKg`, `monitoringModalities`,
  fluids summary, `estimatedBloodLossMl`, `recoveryDestination`.

## Safety flags

Computed independently of status (see spec §5), each with a priority:
WHO checklist not done (high), allergy conflict (high), difficult airway (high),
drug / anaphylaxis event (high), unlogged consent (high), physiological
derangement (medium), incomplete assessment (low).

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
- Drug administrations, timed observations, and events are repeating child rows,
  each in its own table with its own timestamp and a foreign key to the record.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Royal College of Anaesthetists (RCoA). *Guidelines for the Provision of
  Anaesthesia Services (GPAS): Anaesthesia Records.*
- Association of Anaesthetists. *Recommendations for Standards of Monitoring
  during Anaesthesia and Recovery* (2021).
- World Health Organization. *Surgical Safety Checklist* (2009).
- ASA Physical Status Classification.
- Cormack–Lehane grading of the laryngoscopic view.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form anaesthetic-record
```
