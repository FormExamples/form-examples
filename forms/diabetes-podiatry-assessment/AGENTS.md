# Diabetes Podiatry Assessment — Agent Instructions

A structured diabetic foot risk-screening record aligned with NICE NG19
(*Diabetic foot problems: prevention and management*). Captures, per foot,
sensory neuropathy status, pedal pulses, deformity, callus, skin breakdown,
active ulceration and its severity, ulceration/amputation history, and a
suspected-Charcot-foot marker, plus patient-wide risk factors (renal
replacement therapy, visual acuity impairment, self-care ability, footwear),
then classifies each foot's risk and the overall risk category and review
pathway via a single continuous single-page wizard. A risk-stratification
form: it records the findings an assessor has made on examination and
applies the programme's deterministic classification rules; it does not
manage a wound.

See [`index.md`](./index.md) for the full design and the assessment-step
table, and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG19, IWGDF guidelines)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `DiabetesPodiatryAssessment` TypeScript type — assessment
  context, patient-wide risk factors, and a right-foot and left-foot
  examination block.
- **Output shape:**
  ```ts
  gradeDiabetesPodiatryAssessment(data: DiabetesPodiatryAssessment): {
    rightFootRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
    leftFootRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
    overallRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
    reviewPathway:
      | 'urgent-mdt-referral' | 'high-risk-review'
      | 'moderate-risk-review' | 'annual-review';
    reviewIntervalMonths: 1 | 3 | 6 | 12 | null;
    referral: 'none' | 'foot-protection-service' | 'multidisciplinary-foot-team' | 'urgent-mdt';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** per-foot classification then worst-foot with overrides (see
  spec §4). Each foot's risk factors are counted (insensate neuropathy,
  diminished/absent pulses, deformity, callus, skin breakdown); zero factors
  is `low`, exactly one is `moderate`, two or more is `high`. The overall
  category takes the worse of the two feet, then applies overrides
  (most urgent wins): an active ulcer or suspected Charcot on either foot
  forces `active-urgent`; a previous ulcer, previous amputation, or renal
  replacement therapy forces at least `high`.
- **Engine files:** `types.ts`, `utils.ts`, `podiatry-rules.ts`,
  `podiatry-grader.ts`, `flagged-issues.ts`.
- **Tests:** `podiatry-grader.test.ts`, `podiatry-rules.test.ts` — cover each
  risk category boundary, every override (active ulcer, suspected Charcot,
  previous ulcer/amputation, renal replacement therapy), and mismatched feet
  (one low-risk, one high-risk).

## Flagged issues

Computed independently of the pathway (see spec §5): active ulceration
(high → urgent MDT referral), suspected Charcot foot (high → urgent
same/next-working-day referral), critical limb ischaemia signs (high →
urgent vascular referral), previous major amputation (high), renal
replacement therapy (high), combined risk factors on one foot (medium-high),
footwear inappropriate for risk level (medium), self-care impaired without
support recorded (medium), incomplete examination — neuropathy or pulses not
tested on either foot (low).

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

- National Institute for Health and Care Excellence. *NG19: Diabetic foot
  problems: prevention and management* (2015, updated) — the risk
  stratification categories (low / moderate / high / active) this form's
  classification model follows.
- International Working Group on the Diabetic Foot (IWGDF). *Guidelines on
  the prevention and management of diabetic foot disease.*
- NHS England. *Diabetic foot care pathway and risk stratification.*
- Boulton AJM *et al.* The global burden of diabetic foot disease. *Lancet*
  2005; 366(9498):1719-1724.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form diabetes-podiatry-assessment
```
