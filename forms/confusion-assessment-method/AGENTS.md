# Confusion Assessment Method (CAM) — Agent Instructions

Bedside **delirium screening** instrument. Records four observational
**features** via an 8-step single-page wizard and applies the validated CAM
diagnostic algorithm to classify delirium as **present** or **absent**. This is
a **status / classification** form, not a numeric-score form — there is no
total, no cut-off, and no band table. A **CAM-ICU** mode adapts the same four
features and the same algorithm for ventilated and non-verbal patients.

See [`index.md`](./index.md) for the full design and the 8-step wizard table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/` — living domain spec (`index.md`)
- `./doc/` — clinical reference documentation (CAM algorithm, CAM-ICU, NICE
  CG103 mapping, delirium safety notes)
- `./sql/` — Liquibase-formatted Postgres schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./front-end-with-html/` — HTML + Lily wizard (`index.html`) + dashboard
- `./front-end-with-svelte/` — SvelteKit + Lily wizard + dashboard
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

This form **classifies**; it does not sum. The engine is a pure boolean
function of four present / absent features.

- **Input shape:** `CamAssessment` TypeScript type — four features plus
  identification, variant, consciousness level, RASS, attention test, motoric
  subtype, and observation notes.
- **Output shape:**
  ```ts
  gradeCam(data: CamAssessment): {
    classification: 'present' | 'absent' | 'unableToAssess';
    deliriumPresent: boolean;
    positiveFeatures: number[];        // subset of [1,2,3,4]
    motoricSubtype: 'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | '';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  ```
  deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
  ```
  where feature1 = acute onset and fluctuating course, feature2 = inattention,
  feature3 = disorganised thinking, feature4 = altered level of consciousness.
  `classification = deliriumPresent ? 'present' : 'absent'`. For the CAM-ICU
  variant, an unrousable patient (RASS −4/−5) yields `unableToAssess` and the
  algorithm is not evaluated.
- **Engine files:**
  - `types.ts` — `CamAssessment`, `CamResult`, `FlaggedIssue`, feature and enum
    types.
  - `cam-rules.ts` — the boolean feature predicates and the
    `1 AND 2 AND (3 OR 4)` diagnostic rule; CAM-ICU RASS gating.
  - `cam-grader.ts` — pure `gradeCam(data)` orchestrator returning the output
    shape above.
  - `flagged-issues.ts` — derives the prioritised flagged-issue list.
  - `utils.ts` — shared helpers (feature normalisation, tri-state handling,
    positive-feature-set construction).
- **Tests:** `cam-grader.test.ts` (each satisfying and non-satisfying feature
  pattern plus the `unableToAssess` edge case), `cam-rules.test.ts`.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- Unset features default to `absent` at algorithm evaluation but are stored
  distinctly so incomplete assessments are detectable.
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

- Inouye S.K. *et al.* The Confusion Assessment Method. *Ann Intern Med* 1990.
- Ely E.W. *et al.* CAM-ICU validation. *JAMA* 2001.
- NICE CG103 *Delirium: prevention, diagnosis and management* (updated 2023).
- SIGN 157 *Risk reduction and management of delirium* (2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class IIa where output
  drives clinical management of delirium.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form confusion-assessment-method
```
