# Quick Sequential Organ Failure Assessment (qSOFA) — Agent Instructions

Bedside sepsis-risk screen for adults with suspected or confirmed infection.
Collects three objective criteria via a single continuous single-page wizard —
respiratory rate ≥ 22/min, altered mentation (GCS < 15), systolic blood pressure
≤ 100 mmHg — scores each 0 or 1, sums a total of 0–3, and flags **qSOFA ≥ 2** as
a positive screen that prompts escalation to a full SOFA and sepsis workup.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Sepsis-3, NICE NG51)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `QsofaAssessment` TypeScript type — the three criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeQsofa(data: QsofaAssessment): {
    respiratoryRatePoint: 0 | 1;
    mentationPoint: 0 | 1;
    systolicBloodPressurePoint: 0 | 1;
    qsofaScore: 0 | 1 | 2 | 3;
    riskBand: 'lower' | 'higher';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–3
  determines the risk band (`≥ 2` → `higher`). See spec §4. A missing numeric
  input contributes 0 points and raises a data-completeness flag.
  - respiratory rate ≥ 22 → 1
  - GCS < 15 (or "mentation altered" = yes) → 1
  - systolic BP ≤ 100 → 1
- **Engine files:** `types.ts`, `utils.ts`, `qsofa-rules.ts`, `qsofa-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `qsofa-grader.test.ts`, `qsofa-rules.test.ts` — cover each threshold
  boundary (RR 21/22, GCS 14/15, SBP 100/101) and every total 0–3.

## Flagged issues

Computed independently of the total (see spec §5): sepsis escalation
(`qsofaScore ≥ 2`, high), hypotension (`SBP ≤ 100`, high), altered mentation
(`GCS < 15`, high), tachypnoea (`RR ≥ 22`, medium), incomplete assessment (any
criterion input missing, low).

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

- Singer M. *et al.* Sepsis-3. *JAMA* 2016; 315(8):801–810.
- Seymour C.W. *et al.* Assessment of Clinical Criteria for Sepsis. *JAMA* 2016;
  315(8):762–774.
- NICE NG51. *Sepsis: recognition, diagnosis and early management.*
- Royal College of Physicians. *NEWS2* (2017).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form quick-sequential-organ-failure-assessment
```
