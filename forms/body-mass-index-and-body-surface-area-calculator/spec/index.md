# Body Mass Index and Body Surface Area Calculator — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `body-mass-index-and-body-surface-area-calculator`

## 1. Purpose

An anthropometric calculator that takes a patient's height and weight and derives
two measurements: **Body Mass Index (BMI)** in kg/m² with the WHO adult
weight-status category, and **Body Surface Area (BSA)** in m² (Mosteller by
default; Du Bois shown for comparison). BMI screens for underweight/overweight/
obesity; BSA is used to normalize physiological parameters and to calculate
drug (especially chemotherapy) doses. It is a calculator with classification,
not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric centile
scoring, and body-composition (fat-vs-muscle) assessment.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | recording clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / dietitian / other |
| `assessedAt` | timestamp | date and time of measurement |
| `careSetting` | enum | primary-care / outpatient / inpatient / oncology / pre-operative / other |
| `purpose` | enum | screening / drug-dosing / monitoring / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | patient age band |
| `sex` | enum | patient sex |
| `ancestry` | enum | for the Asian lower-threshold flag: asian / other / unspecified |

**Measured inputs.**

| Field | Type | Unit | Used by |
| --- | --- | --- | --- |
| `heightCm` | numeric | centimetres | BMI, BSA |
| `weightKg` | numeric | kilograms | BMI, BSA |

**Derived (never stored as input).** `bmi`, `bmiCategory`, `bsaMosteller`,
`bsaDuBois`, `firedThresholds[]`, `flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. Requires both `heightCm` and `weightKg` to be non-null and
positive; otherwise numeric outputs are `null` and an incomplete-data flag is
raised.

```
heightM      = heightCm / 100
bmi          = weightKg / (heightM * heightM)                       // kg/m²
bsaMosteller = sqrt((heightCm * weightKg) / 3600)                    // m²
bsaDuBois    = 0.007184 * heightCm^0.725 * weightKg^0.425            // m²
```

Numeric outputs are rounded for display (BMI to 1 decimal place, BSA to 2) but
computed at full precision.

**BMI banding (WHO adult categories).** Applied to the rounded-to-context BMI
using inclusive lower bounds:

```
bmi < 18.5              -> 'underweight'
18.5 <= bmi < 25.0      -> 'normal'
25.0 <= bmi < 30.0      -> 'overweight'
30.0 <= bmi < 35.0      -> 'obese-class-1'
35.0 <= bmi < 40.0      -> 'obese-class-2'
bmi >= 40.0             -> 'obese-class-3'
```

**Asian lower thresholds.** When `ancestry == 'asian'`, additional action points
are recorded (as flags, not as a change to `bmiCategory`): `bmi >= 23` (increased
risk) and `bmi >= 27.5` (high risk).

## 5. Flagged issues (red flags)

Emitted independently of the category, each with a priority:

- **Severe obesity** (high) — `bmiCategory == 'obese-class-3'` (`bmi >= 40`):
  obese class III; consider specialist weight-management referral.
- **Underweight** (high) — `bmi < 18.5`: possible undernutrition; consider
  nutritional assessment.
- **Extreme value — verify** (high) — height or weight outside plausible adult
  range (`heightCm < 100` or `> 250`, `weightKg < 20` or `> 400`, or `bmi < 10`
  or `> 80`): likely data-entry error; re-measure before using BSA for dosing.
- **Asian high risk** (medium) — `ancestry == 'asian'` and `bmi >= 27.5`.
- **Asian increased risk** (low) — `ancestry == 'asian'` and `23 <= bmi < 27.5`.
- **Incomplete data** (low) — `heightCm` or `weightKg` missing: BMI and BSA
  cannot be computed.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A calculation object emitted by the engine:

```ts
{
  bmi: number | null;
  bmiCategory:
    | 'underweight'
    | 'normal'
    | 'overweight'
    | 'obese-class-1'
    | 'obese-class-2'
    | 'obese-class-3'
    | '';
  bsaMosteller: number | null;
  bsaDuBois: number | null;
  firedThresholds: FiredThreshold[];
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

- `bin/test-form body-mass-index-and-body-surface-area-calculator` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering each BMI band boundary (18.5, 25, 30, 35, 40), the Asian thresholds
  (23, 27.5), and known BSA reference points (for example 180 cm / 80 kg →
  BMI ≈ 24.7, Mosteller BSA ≈ 2.0 m²).
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

- [`index.md`](../index.md) — form description and calculation details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form body-mass-index-and-body-surface-area-calculator
```
