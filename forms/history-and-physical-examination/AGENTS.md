# History and Physical Examination (H&P) — Agent Instructions

The comprehensive clerking and admission document. Collects the full history
(presenting complaint, history of presenting complaint, past medical/surgical
history, drug history and allergies, family history, social history, systems
review) and physical examination (vital signs and examination by body system),
plus investigations, an impression / problem list, and a management plan, via a
single continuous single-page wizard. This is a **documentation / completeness
form**, not a scored instrument: the engine grades clerking completeness
(**Complete** / **Partial** / **Incomplete**), reports a completeness
percentage, and raises safety flags (allergies not documented, no impression or
plan, red-flag findings without a plan, abnormal vitals, incomplete systems
examination).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Macleod's, OSCE clerking guides,
  NEWS2 vital-sign ranges)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `HistoryAndPhysical` TypeScript type — the encounter and
  identification fields, the history sections, vital signs, examination by
  system, investigations, impression, and management plan.
- **Output shape:**
  ```ts
  validate(hp: HistoryAndPhysical): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number; // 0..100
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
  (The engine also exposes `satisfiedComponents[]` and `missingComponents[]`
  used to render the completeness checklist; see spec §4.)
- **Algorithm:** completeness, not scoring — ten required components are each
  evaluated as satisfied or missing; `completenessPercent` is the proportion
  satisfied. Two **blocking flags** (allergies undocumented; no impression and no
  plan) force `incomplete`. `complete` requires all ten components and no
  blocking flag; otherwise `partial` when the core clinical narrative is present.
  See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `hp-validator.ts`, `flagged-issues.ts`.
- **Tests:** `hp-validator.test.ts`, `validation-rules.test.ts` — cover each
  status class (Complete / Partial / Incomplete), both blocking flags, and every
  vital-sign boundary.

## Flagged issues

Computed independently of the status (see spec §5), each with a priority:
allergies not documented (high, blocking), no impression or plan (high,
blocking), red-flag finding without a plan (high), abnormal vital signs
(medium), incomplete systems examination (medium), incomplete history (low).

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

- Douglas G., Nicol F., Robertson C. (eds). *Macleod's Clinical Examination.*
- Talley N.J., O'Connor S. *Clinical Examination: A Systematic Guide to Physical
  Diagnosis.*
- Geeky Medics. *History Taking* and *Clinical Examination* OSCE guides.
- Royal College of Physicians. *NEWS2* (2017) — vital-sign reference ranges.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form history-and-physical-examination
```
