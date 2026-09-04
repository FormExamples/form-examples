# Diabetes Eye Screening record — Agent Instructions

A structured record of a UK NHS Diabetic Eye Screening Programme (DESP) retinal
screening episode. Captures, per eye, the retinopathy (R) grade, maculopathy (M)
grade, photocoagulation (P) marker, and ungradable (U) marker assigned to the
retinal photographs, then classifies the worst-eye result and derives a recall
interval or referral pathway via a single continuous single-page wizard. A
documentation + result-classification form: it records a human grader's decision
and applies the programme's deterministic outcome rules; it does not interpret
raw images.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS DESP grading definitions)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Grading engine

- **Input shape:** `DiabetesEyeScreening` TypeScript type — grading context,
  patient identification, and a right-eye and left-eye grading block (R grade,
  M grade, P marker, U marker, visual acuity).
- **Output shape:**
  ```ts
  gradeDiabetesEyeScreening(data: DiabetesEyeScreening): {
    rightEyeGrade: EyeGrade;
    leftEyeGrade: EyeGrade;
    worstRetinopathy: 'R0' | 'R1' | 'R2' | 'R3S' | 'R3A';
    worstMaculopathy: 'M0' | 'M1';
    anyUngradable: boolean;
    recallPathway:
      | 'refer-hes-urgent' | 'refer-hes' | 'refer-slit-lamp'
      | 'surveillance-6-month' | 'routine-12-month' | 'routine-24-month';
    recallIntervalMonths: 6 | 12 | 24 | null;
    referral: 'none' | 'hes-routine' | 'hes-urgent' | 'slit-lamp';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** worst-eye classification (see spec §4). Retinopathy severity
  ranks `R0 < R1 < R2 < R3S < R3A`; the engine takes the worst R and M grade
  across both eyes plus any ungradable marker, then maps to a recall / referral
  pathway by clinical urgency (most urgent wins):
  - any `R3A` → `refer-hes-urgent`
  - any `M1` or `R3S` → `refer-hes`
  - any ungradable (and no referable disease above) → `refer-slit-lamp`
  - any `R2` → `surveillance-6-month`
  - worst `R1`, or `R0` not low-risk eligible → `routine-12-month`
  - `R0`/`M0` both eyes and low-risk eligible → `routine-24-month`
  - `P` is contextual and does not change the pathway. A missing R/M grade (not
    ungradable) raises a data-completeness flag and may understate the outcome.
- **Engine files:** `types.ts`, `utils.ts`, `des-rules.ts`, `des-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `des-grader.test.ts`, `des-rules.test.ts` — cover every R grade,
  both M grades, the U and P markers, worst-eye selection across mismatched
  eyes, and each recall / referral pathway.

## Flagged issues

Computed independently of the pathway (see spec §5): active proliferative
retinopathy (`R3A`, high → urgent ophthalmology), maculopathy referral (`M1`,
high → HES), stable proliferative (`R3S`, high → HES), pre-proliferative (`R2`,
medium → 6-monthly surveillance), ungradable images (`U`, medium → re-screen /
slit-lamp biomicroscopy), patient overdue (`previousScreenDate` beyond interval,
medium), incomplete grading (R/M grade missing and not ungradable, low),
eligibility (age < 12 or not diabetic, low).

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

- NHS Diabetic Eye Screening Programme. *Grading definitions for referable
  disease* / *feature classification* (R0–R3, M0–M1, P, U).
- Public Health England / NHS England. *NHS DESP overview and pathway standards.*
- Harding S. *et al.* Grading and disease management in national screening for
  diabetic retinopathy in England and Wales. *Diabetic Medicine* 2003.
- Royal College of Ophthalmologists. *Diabetic Retinopathy Guidelines.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form diabetes-eye-screening
```
