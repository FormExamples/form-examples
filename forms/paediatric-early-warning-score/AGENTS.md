# Paediatric Early Warning Score (PEWS) — Agent Instructions

An age-banded track-and-trigger early-warning tool for children. Collects
physiological observations via a single continuous single-page wizard across
three domains — respiratory (rate, effort/recession, SpO₂, oxygen),
cardiovascular (heart rate, capillary refill/colour), and behaviour/neurological
(ACVPU) — scores each parameter **0–3** against the **normal range for the
selected age band**, aggregates the total, and maps it onto an **escalation
band**. Any single parameter scoring 3, or documented nurse or parent/carer
concern, is an independent escalation trigger. **Age-banding is central: the age
band is selected first and sets the normal ranges for the rate parameters.**

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (national PEWS, NICE NG51)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `PewsAssessment` TypeScript type — the age band, the seven
  parameter inputs, the two concern flags, plus context and identification.
- **Output shape:**
  ```ts
  gradePews(data: PewsAssessment): {
    respiratoryRateScore: 0 | 1 | 2 | 3;
    respiratoryEffortScore: 0 | 1 | 2 | 3;
    oxygenSaturationScore: 0 | 1 | 2 | 3;
    supplementalOxygenScore: 0 | 1 | 2 | 3;
    heartRateScore: 0 | 1 | 2 | 3;
    capillaryRefillScore: 0 | 1 | 2 | 3;
    consciousnessScore: 0 | 1 | 2 | 3;
    aggregateScore: number;                 // 0..21
    maxParameterScore: 0 | 1 | 2 | 3;
    escalationBand: 'routine' | 'low' | 'medium' | 'high';
    firedTriggers: FiredTrigger[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** age-band-driven then additive. Resolve the age-band normal
  ranges for respiratory rate and heart rate; score every parameter 0–3; sum to
  `aggregateScore`; map to `escalationBand` (`≥6` high, `4–5` medium, `2–3` low,
  else routine). Override triggers — `maxParameterScore == 3`, `nurseConcern`,
  `parentConcern` — raise the effective escalation without changing the total.
  See spec §4. A missing numeric input contributes 0 and raises a
  data-completeness flag; an unset age band leaves the rate parameters unscored.
- **Engine files:** `types.ts`, `utils.ts`, `pews-rules.ts` (age-band tables +
  per-parameter thresholds), `pews-grader.ts`, `flagged-issues.ts`.
- **Tests:** `pews-grader.test.ts`, `pews-rules.test.ts` — cover each age band's
  rate boundaries, every parameter's 0–3 thresholds, the single-parameter=3
  override, the nurse / parent concern triggers, and each escalation-band
  boundary.

## Flagged issues

Computed independently of the aggregate (see spec §5): high escalation
(`aggregateScore ≥ 6`, high), single parameter critical (`maxParameterScore == 3`,
high), medium escalation (`aggregateScore` 4–5, high), parent/carer concern
(`parentConcern == 'yes'`, high), nurse/staff concern (`nurseConcern == 'yes'`,
high), deteriorating trend (`aggregateScore` 2–3, medium), incomplete assessment
(any parameter or age band missing, low).

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

- NHS England & RCPCH. *National Paediatric Early Warning System (PEWS) chart*
  (2023).
- Royal College of Paediatrics and Child Health. *The National PEWS programme.*
- NICE NG51. *Sepsis: recognition, diagnosis and early management* — paediatric
  considerations.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form paediatric-early-warning-score
```
