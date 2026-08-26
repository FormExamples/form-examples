# Estimated Glomerular Filtration Rate (eGFR) Calculator — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `estimated-glomerular-filtration-rate-calculator`

## 1. Purpose

A formula calculator that estimates the glomerular filtration rate from a single
serum creatinine measurement plus age and sex, using the **CKD-EPI 2021
creatinine equation (race-free)** as the primary instrument. It returns an
**eGFR in mL/min/1.73 m²** and classifies the result into a **CKD G-stage**
(G1–G5). It is a numeric calculator, not a diagnostic test: the output supports
monitoring, medication-dose review, and referral decisions.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric equations,
albuminuria (ACR) staging, and cystatin-C / MDRD calculation (named for context
only; the engine computes CKD-EPI 2021 creatinine).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | requesting / interpreting clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / laboratory / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | primary-care / secondary-care / laboratory / pharmacy / other |
| `equation` | enum | `ckd-epi-2021-creatinine` (default) / `ckd-epi-2021-cystatin-c` / `mdrd` |
| `patientIdentifier` | text | local identifier |

**Calculation inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `ageYears` | numeric (years) | patient age |
| `sex` | enum | `female` / `male` (drives κ, α, and the female multiplier) |
| `serumCreatinine` | numeric (µmol/L) | standardized (IDMS-traceable) serum creatinine |
| `specimenDate` | date | date the specimen was taken |
| `steadyState` | enum (yes/no) | whether renal function is at steady state |

**Derived (never stored as input).** `serumCreatinineMgDl`, `egfr`, `egfrStage`,
`egfrStageLabel`, `flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. The engine computes the CKD-EPI 2021 creatinine equation.

```
Scr_mgdl = serumCreatinine / 88.42            // µmol/L → mg/dL

κ = sex == 'female' ? 0.7  : 0.9
α = sex == 'female' ? -0.241 : -0.302

ratio = Scr_mgdl / κ

egfr = 142
     × pow(min(ratio, 1), α)
     × pow(max(ratio, 1), -1.200)
     × pow(0.9938, ageYears)
     × (sex == 'female' ? 1.012 : 1.0)
```

- `egfr` is rounded to the nearest whole number for display; values > 90 may be
  reported as "> 90" per UK laboratory convention while the numeric value is
  retained for banding.
- The engine returns `null` for `egfr` (and no stage) when any required input
  (`ageYears`, `sex`, `serumCreatinine`) is missing, and raises a
  data-completeness flag.

### G-stage banding

```
egfr >= 90            → G1   (Normal or high)
60 <= egfr <= 89.999  → G2   (Mildly decreased)
45 <= egfr <= 59.999  → G3a  (Mildly to moderately decreased)
30 <= egfr <= 44.999  → G3b  (Moderately to severely decreased)
15 <= egfr <= 29.999  → G4   (Severely decreased)
egfr < 15             → G5   (Kidney failure)
```

Banding uses the unrounded eGFR. The boundaries are inclusive of the lower value
of each higher band (≥ 90, ≥ 60, ≥ 45, ≥ 30, ≥ 15).

## 5. Flagged issues (red flags)

Emitted independently of the stage, each with a priority:

- **Kidney failure — nephrology referral** (high) — `egfrStage == 'G5'`
  (eGFR < 15): established kidney failure; refer to nephrology / renal
  replacement planning.
- **Severely decreased — nephrology referral** (high) — `egfrStage == 'G4'`
  (eGFR 15–29): refer to nephrology per NICE NG203.
- **Drug-dosing review** (high) — `egfr < 60` (G3a or worse): review and adjust
  renally-cleared medicines and contrast exposure; avoid nephrotoxins.
- **Possible acute drop** (high) — `steadyState == 'no'`: eGFR assumes steady
  state; a non-steady-state creatinine may reflect acute kidney injury — do not
  stage, repeat and consider AKI pathway.
- **Reduced function** (medium) — `egfrStage in {G3a, G3b}` (eGFR 30–59):
  reduced renal function; monitor and manage per CKD guidance.
- **Confirm CKD near threshold** (low) — `egfrStage in {G2, G3a}` within a small
  margin of a band boundary: consider a confirmatory cystatin-C estimate.
- **Incomplete assessment** (low) — any required input (`ageYears`, `sex`,
  `serumCreatinine`) missing: eGFR cannot be computed; complete the inputs.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A result object emitted by the engine:

```ts
{
  serumCreatinineMgDl: number | null;
  egfr: number | null;                 // mL/min/1.73 m²
  egfrStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
  egfrStageLabel: string;              // e.g. 'Mildly decreased'
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

- `bin/test-form estimated-glomerular-filtration-rate-calculator` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering: the µmol/L → mg/dL conversion; female and male κ/α/multiplier
  branches; the piecewise `min`/`max` behaviour either side of κ; each G-stage
  boundary (eGFR 14/15, 29/30, 44/45, 59/60, 89/90); and the missing-input path.
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
bin/test-form estimated-glomerular-filtration-rate-calculator
```
