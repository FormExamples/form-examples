# Breast Screening Record — Agent Instructions

Documentation and result-classification record for a mammography breast
screening encounter within the NHS Breast Screening Programme. Collects
eligibility, consent, mammogram views, the radiological reporting outcome, and —
where the woman is recalled — a five-point breast imaging classification, all via
a single continuous single-page wizard. The engine derives the **screening
outcome and next action**, validates completeness, and raises flags. It is a
documentation + classification form, not a scored screen and not a diagnosis.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHSBSP, RCR imaging classification)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `BreastScreeningRecord` TypeScript type — context and
  identification, eligibility and consent, mammogram and reading-outcome fields,
  and assessment-result fields.
- **Output shape:**
  ```ts
  gradeBreastScreening(data: BreastScreeningRecord): {
    eligibilityStatus: 'eligible' | 'outside-age-range'
      | 'higher-risk-surveillance' | 'symptomatic-referral';
    readingOutcome: 'normal-routine-recall' | 'technical-repeat'
      | 'recall-for-assessment' | '';
    imagingClassification: 1 | 2 | 3 | 4 | 5 | null;
    screeningOutcome: 'routine-recall' | 'technical-repeat'
      | 'recall-to-assessment-clinic' | 'short-interval-follow-up'
      | 'urgent-breast-clinic' | 'symptomatic-pathway-referral' | '';
    outcomeBand: 'routine' | 'repeat' | 'assessment' | 'urgent'
      | 'referral' | 'incomplete';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** deterministic mapping (see spec §4): eligibility first
  (symptomatic → symptomatic pathway; higher-risk → surveillance pathway;
  age 50–70 for routine episodes → eligible). Then the reading outcome maps to a
  screening outcome; a *recall for assessment* is refined by the imaging
  classification — 1–2 → routine recall, 3 → short-interval follow-up,
  4–5 → urgent breast clinic. Missing required inputs leave the outcome
  incomplete.
- **Engine files:** `types.ts`, `utils.ts`, `screening-rules.ts`,
  `screening-grader.ts`, `flagged-issues.ts`.
- **Tests:** `screening-grader.test.ts`, `screening-rules.test.ts` — cover every
  reading outcome, every imaging classification 1–5, the symptomatic override,
  the age boundaries (49/50, 70/71), and recalled-but-not-yet-assessed.

## Result classes and outcomes

- **Reading outcome:** normal / routine recall · technical repeat · recall for
  assessment.
- **Assessment result (imaging classification 1–5):** 1 normal · 2 benign ·
  3 indeterminate/probably benign · 4 suspicious · 5 malignant.
- **Screening outcome / next action:** routine 3-yearly recall · technical
  repeat · recall to assessment clinic · short-interval follow-up · urgent
  breast-clinic referral · symptomatic-pathway referral.

## Flagged issues

Computed independently of the outcome (see spec §5): symptomatic — wrong pathway
(high), suspicious/malignant class 4–5 (high), recall for assessment (medium),
indeterminate class 3 (medium), technical repeat / inadequate image (medium),
consent not given (medium), outside eligible age range (low), overdue (low),
incomplete record (low).

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

- NHS Breast Screening Programme (NHSBSP) guidance and consolidated standards
  (routine 3-yearly recall, ages 50–70; extension trial 47–73).
- Royal College of Radiologists breast imaging classification (five-point,
  aligned with the BI-RADS family).
- NHSBSP clinical guidance for screening assessment (double reading,
  arbitration, assessment clinic).
- NICE NG101 *Early and locally advanced breast cancer*.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form breast-screening
```
