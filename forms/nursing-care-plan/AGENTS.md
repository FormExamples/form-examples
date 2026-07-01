# Nursing Care Plan — Agent Instructions

A structured nursing care plan following the nursing process (Assessment,
Diagnosis, Planning, Implementation, Evaluation — ADPIE) and the Roper–Logan–
Tierney activities-of-living model. Collected via a single continuous single-page
wizard: identified problems / needs, SMART goals, planned interventions,
evaluation / review, and referenced risk assessments (falls, pressure ulcer, VTE,
MUST). It is a **documentation and completeness** form, not a numeric score — the
engine grades care-plan completeness (**Complete / Partial / Incomplete**),
returns a completeness percent, and raises flagged issues.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (RLT model, NMC Code, record
  keeping, referenced risk-assessment tools)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `CarePlan` TypeScript type — the parent plan (context,
  identification, four referenced risk-assessment groups) plus an array of
  `Problem`, each with arrays of `Goal` and `Intervention` and an inline
  evaluation.
- **Output shape:**
  ```ts
  validate(plan: CarePlan): {
    status: 'complete' | 'partial' | 'incomplete';
    completenessPercent: number;      // 0..100
    problemClasses: Array<{ problemId: string;
                            completenessClass: 'complete' | 'partial' | 'incomplete' }>;
    firedRules: FiredRule[];
    flags: FlaggedIssue[];
  }
  ```
- **Algorithm:** completeness grading, not scoring. Each problem is Complete when
  it has ≥ 1 goal **and** ≥ 1 intervention **and** an evaluation; Partial with
  some of those; Incomplete with a statement only. The plan is Complete when every
  problem is Complete and no high-priority flag fired; Incomplete when there are no
  problems or all are Incomplete; Partial otherwise. `completenessPercent` is the
  proportion of the three required elements present across all problems. See
  spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `care-plan-validator.ts`, `flagged-issues.ts`.
- **Tests:** `care-plan-validator.test.ts`, `validation-rules.test.ts` — cover
  each problem class, each plan status, the percent calculation (including the
  empty-plan zero case), and every flag.

## Flagged issues

Computed independently of the status (see spec §5): risk without intervention
(high), high-risk assessment not actioned (high), missing evaluation (medium),
unmet goal overdue for review (medium), no review date (medium), incomplete
problem (low).

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
- Parent plan + child problem / goal / intervention rows are separate relational
  tables (one migration + one entity per table); never a single JSONB blob.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Roper N., Logan W., Tierney A. *The Roper–Logan–Tierney Model of Nursing*
  (2000).
- Nursing and Midwifery Council. *The Code* (2018, updated).
- Royal College of Nursing. *Record keeping* guidance.
- NICE CG161 (falls), CG179 (pressure ulcers), NG89 (VTE); BAPEN *MUST.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification) — documentation /
  completeness aid, low-risk end of clinical decision support.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form nursing-care-plan
```
