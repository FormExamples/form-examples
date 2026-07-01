# QRISK3 Cardiovascular Disease Risk Score — Agent Instructions

Primary-prevention CVD risk calculator for UK primary care. Collects demographic,
lifestyle, comorbidity, and measurement inputs via a single continuous
single-page wizard, applies the sex-specific **QRISK3 Cox proportional-hazards
model**, and returns a **10-year CVD risk percentage**, a risk band, and a
**heart age**. A result **≥ 10 %** meets the NICE threshold at which a statin
(atorvastatin 20 mg) plus lifestyle advice should be offered.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (QRISK3 BMJ 2017, NICE NG238)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `Qrisk3Assessment` TypeScript type — the model inputs
  (demographics, lifestyle, cardiometabolic, history, medication) plus context,
  identification, and eligibility fields.
- **Output shape:**
  ```ts
  gradeQrisk3(data: Qrisk3Assessment): {
    linearPredictor: number;
    tenYearRiskPercent: number;   // 0.0..99.9, one decimal
    riskBand: 'low' | 'raised' | 'high';
    heartAge: number | null;      // years; null when not computable
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted risk engine (**not** an additive point sum). Select the
  female or male coefficient set by `sex`; centre and fractional-polynomial
  transform the continuous inputs; multiply each transformed value by its fitted
  Cox coefficient and add age-interaction terms to form the linear predictor
  `LP`; then `tenYearRiskPercent = 100 × (1 − S0^exp(LP))` using the model's
  10-year baseline survival `S0`. Band at `>= 10` (`raised`) and `>= 20`
  (`high`). Heart age inverts the risk function with modifiable factors optimal.
  See spec §4. Optional `townsendScore` defaults to the cohort mean; a missing
  required input blocks a valid result and raises a completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `qrisk3-rules.ts` (coefficient tables
  and transforms), `qrisk3-grader.ts` (linear predictor → risk % + heart age),
  `flagged-issues.ts`.
- **Tests:** `qrisk3-grader.test.ts`, `qrisk3-rules.test.ts` — cover the 10 % and
  20 % band boundaries, the male/female model split, the optional Townsend
  default, and the eligibility guards (age 24/25/84/85, established CVD, FH).

## Flagged issues

Computed independently of the numeric result (see spec §5): statin offer
(`tenYearRiskPercent >= 10`, high), high risk (`>= 20`, high), not eligible
(established CVD, familial hypercholesterolaemia, or age outside 25–84, high),
missing cholesterol ratio (`cholesterolHdlRatio == null`, medium), incomplete
assessment (any required model input missing, medium), severe hypertension
(`systolicBloodPressure >= 180`, medium).

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

- Hippisley-Cox J., Coupland C., Brindle P. Development and validation of QRISK3.
  *BMJ* 2017; 357:j2099.
- NICE NG238. *Cardiovascular disease: risk assessment and reduction, including
  lipid modification* (2023).
- NICE CG181. *Cardiovascular disease: risk assessment and reduction* (2014).
- ClinRisk Ltd. *QRISK3-2017* open-source reference implementation.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form qrisk3-cardiovascular-disease-risk-score
```
