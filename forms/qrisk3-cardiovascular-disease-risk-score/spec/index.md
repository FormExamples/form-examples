# QRISK3 Cardiovascular Disease Risk Score — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `qrisk3-cardiovascular-disease-risk-score`

## 1. Purpose

A primary-prevention CVD risk calculator for UK primary care. It records
demographic, lifestyle, comorbidity, and measurement inputs, applies the
sex-specific **QRISK3 Cox proportional-hazards model**, and produces a **10-year
CVD risk percentage**, a risk band, and a **heart age**. A result **≥ 10 %** meets
the NICE threshold at which a statin (atorvastatin 20 mg) plus lifestyle advice
should be offered. It estimates risk; it is not a diagnosis and does not
prescribe.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, secondary-prevention
scoring, and patients outside the 25–84 age range.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | gp / nurse / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | general-practice / pharmacy / nhs-health-check / other |
| `patientIdentifier` | text | local identifier |

**Model inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `age` | numeric (years) | valid 25–84 |
| `sex` | enum | female / male (sex-specific model) |
| `ethnicity` | enum | nine-category QRISK3 ethnicity |
| `townsendScore` | numeric | deprivation score from postcode; optional (defaults to cohort mean when null) |
| `smokingStatus` | enum | non / ex / light / moderate / heavy |
| `bodyMassIndex` | numeric (kg/m²) | may be derived from height and weight |
| `diabetesStatus` | enum | none / type1 / type2 |
| `cholesterolHdlRatio` | numeric | total-cholesterol : HDL ratio |
| `systolicBloodPressure` | numeric (mmHg) | mean systolic BP |
| `systolicBloodPressureSd` | numeric (mmHg) | SBP standard deviation (visit-to-visit variability) |
| `onBloodPressureTreatment` | enum (yes/no) | antihypertensive treatment |
| `familyHistoryChd` | enum (yes/no) | first-degree relative CHD < 60 |
| `atrialFibrillation` | enum (yes/no) | |
| `chronicKidneyDiseaseStage` | enum | none / stage3 / stage4 / stage5 |
| `migraine` | enum (yes/no) | |
| `rheumatoidArthritis` | enum (yes/no) | |
| `systemicLupusErythematosus` | enum (yes/no) | |
| `severeMentalIllness` | enum (yes/no) | |
| `erectileDysfunction` | enum (yes/no) | men only; ignored for female model |
| `onAtypicalAntipsychotics` | enum (yes/no) | |
| `onCorticosteroids` | enum (yes/no) | regular oral corticosteroids |

**Eligibility flags (not model inputs).** `hasEstablishedCvd`,
`hasFamilialHypercholesterolaemia` — either being `yes` makes QRISK3
inappropriate (see §5).

**Derived (never stored as input).** `linearPredictor`, `tenYearRiskPercent`,
`riskBand`, `heartAge`, `flaggedIssues[]`.

## 4. Grading algorithm (weighted risk engine)

Pure function, no I/O. **Not** an additive point score — QRISK3 is a Cox
proportional-hazards model with sex-specific coefficients.

1. **Select model** by `sex` (female vs male coefficient set and baseline
   survival).
2. **Transform inputs.** Continuous variables (age, BMI, cholesterol:HDL ratio,
   systolic BP, SBP SD, Townsend) are centred on the cohort mean and, where the
   published model specifies, raised to fractional-polynomial powers. Categorical
   variables (ethnicity, smoking, CKD stage) select their category coefficient.
3. **Weight and sum.** Multiply each transformed value by its fitted coefficient
   and add the age-interaction terms to form the **linear predictor** `LP`.
4. **Map to risk.** `tenYearRiskPercent = 100 × (1 − S0^exp(LP))`, where `S0` is
   the model's 10-year baseline survival. Round to one decimal place; clamp to
   `[0, 99.9]`.
5. **Band.** `riskBand = tenYearRiskPercent >= 10 ? 'raised' : 'low'`; a
   `'high'` sub-band is noted at `>= 20`.
6. **Heart age.** Invert the risk function with all modifiable factors set to
   optimal (non-smoker, no comorbidities, ideal BMI/BP/ratio) to find the age
   giving the same risk for the same sex.

Missing optional `townsendScore` defaults to the cohort mean (neutral
contribution). A missing **required** numeric input (age, BMI, ratio, systolic
BP) blocks a valid result and raises a data-completeness flag rather than
substituting a value.

## 5. Flagged issues (red flags)

Emitted independently of the numeric result, each with a priority:

- **Statin offer** (high) — `tenYearRiskPercent >= 10`: meets the NICE threshold;
  offer atorvastatin 20 mg plus lifestyle advice after informed discussion.
- **High risk** (high) — `tenYearRiskPercent >= 20`: prioritize statin and
  intensive lifestyle optimization.
- **Not eligible** (high) — `hasEstablishedCvd == 'yes'` or
  `hasFamilialHypercholesterolaemia == 'yes'` or `age < 25` or `age > 84`: QRISK3
  is not valid; assess by the appropriate pathway instead.
- **Missing cholesterol ratio** (medium) — `cholesterolHdlRatio == null`: result
  cannot be computed accurately; obtain a lipid profile.
- **Incomplete assessment** (medium) — any required model input missing: result
  may be unreliable or unavailable.
- **Severe hypertension** (medium) — `systolicBloodPressure >= 180`: review blood
  pressure independently of the CVD score.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  linearPredictor: number;
  tenYearRiskPercent: number;   // 0.0..99.9, one decimal
  riskBand: 'low' | 'raised' | 'high';
  heartAge: number | null;      // years; null when not computable
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form qrisk3-cardiovascular-disease-risk-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the 10 % and 20 % band boundaries, the male/female model split, the optional
  Townsend default, and the eligibility guards (age 24/25/84/85, established CVD,
  FH).
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form qrisk3-cardiovascular-disease-risk-score
```
