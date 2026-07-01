# Hypertension Annual Review — Agent Instructions

A UK primary-care annual hypertension review (NICE NG136). Collects clinic and
home/ambulatory blood pressure, medication and adherence, cardiovascular risk
(QRISK), annual bloods (U&E, HbA1c, lipids), urine albumin:creatinine ratio
(ACR), lifestyle, and complications via a single continuous single-page wizard.
The engine classifies blood-pressure control against an age- and
comorbidity-specific target, assigns a hypertension stage, grades review
completeness, and raises flags. It is a documentation and control-classification
tool — it does not diagnose or prescribe.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG136, QRISK, HBPM protocol)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `HypertensionReview` TypeScript type — context and
  identification, diagnosis/comorbidity (target drivers), clinic and
  home/ambulatory BP, medication and adherence, cardiovascular risk, bloods,
  urine ACR, and lifestyle fields.
- **Output shape:**
  ```ts
  review(data: HypertensionReview): {
    controlStatus: {
      controlClass: 'controlled' | 'uncontrolled' | 'severe-uncontrolled';
      bpTarget: { clinic: { systolic: number; diastolic: number };
                  home:   { systolic: number; diastolic: number };
                  group: string };
      primarySource: 'home' | 'clinic' | 'none';
      hypertensionStage: 'none' | 'stage-1' | 'stage-2' | 'stage-3-severe';
    };
    reviewStatus: 'complete' | 'partial' | 'incomplete';
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
- **Algorithm:** select the tightest applicable BP target from age band and
  comorbidity (home/ambulatory target is 5 mmHg lower than clinic on each of
  systolic and diastolic); classify control against the primary reading (home if
  present, else clinic); the clinic reading always drives the ≥ 180/120 severe
  flag; stage from the raw readings; grade completeness against the core review
  components. See spec §4. Pure function, no I/O.
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover each target
  group, the 180/120 severe boundary, target boundaries (139/140, 89/90), each
  hypertension stage, and each review-status level.

## Flagged issues

Computed independently of the control class (see spec §5): severe hypertension
(`clinic ≥ 180/120`, high — same-day assessment), uncontrolled blood pressure
(`controlClass == 'uncontrolled'`, high — medication review), missing annual
bloods (U&E / HbA1c / lipids absent, medium), missing urine ACR
(`urineAcr == null`, medium), high cardiovascular risk untreated
(`qriskPercent ≥ 10` and not on a statin, medium), adherence concern
(`adherence == 'poor'` or side effects, medium), postural drop (medium).

## Conventions

- British English throughout.
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

- NICE NG136. *Hypertension in adults: diagnosis and management.*
- NICE CG181. *Cardiovascular disease: risk assessment and reduction.*
- NICE NG203. *Chronic kidney disease: assessment and management.*
- ClinRisk. *QRISK3 cardiovascular risk calculator.*
- British and Irish Hypertension Society. *Home blood-pressure monitoring
  protocol.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form hypertension-review
```
