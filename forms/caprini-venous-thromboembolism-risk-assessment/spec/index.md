# Caprini Venous Thromboembolism Risk Assessment — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `caprini-venous-thromboembolism-risk-assessment`

## 1. Purpose

A VTE risk-stratification tool for surgical and medical inpatients. It records a
checklist of weighted risk factors (1, 2, 3, or 5 points each), sums a total
Caprini score, maps the total to a risk band (very low, low, moderate, high),
and recommends a prophylaxis strategy. A high score prompts pharmacological
prophylaxis after a bleeding-risk check; it is not a diagnostic test for VTE.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, obstetric-specific and
paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered. Each risk factor is a yes/no enum item.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / surgeon / nurse / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | surgical-ward / medical-ward / pre-operative-clinic / other |
| `admissionType` | enum | surgical / medical |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | `under-41` (0) / `41-60` (1) / `61-74` (2) / `75-plus` (3) |
| `sex` | enum | patient sex |

**Risk-factor inputs.** Each is a yes/no enum; the factor's fixed weight applies
when `yes`. Age contributes through `ageBand` (not a separate factor).

- **1-point:** `minorSurgery`, `recentMajorSurgery`, `varicoseVeins`,
  `inflammatoryBowelDisease`, `swollenLegs`, `obesity`, `acuteMyocardialInfarction`,
  `congestiveHeartFailure`, `sepsis`, `seriousLungDisease`,
  `abnormalPulmonaryFunction`, `medicalPatientBedRest`, `oralContraceptiveOrHrt`,
  `pregnancyOrPostpartum`, `adversePregnancyHistory`.
- **2-point:** `arthroscopicSurgery`, `majorOpenSurgery`, `laparoscopicSurgery`,
  `malignancy`, `confinedToBed`, `immobilisingCast`, `centralVenousAccess`.
- **3-point:** `historyOfVte`, `familyHistoryOfThrombosis`, `factorVLeiden`,
  `prothrombin20210a`, `lupusAnticoagulant`, `anticardiolipinAntibodies`,
  `elevatedHomocysteine`, `heparinInducedThrombocytopenia`, `otherThrombophilia`.
- **5-point:** `stroke`, `electiveArthroplasty`, `hipPelvisLegFracture`,
  `acuteSpinalCordInjury`, `multipleTrauma`.

**Bleeding risk.** `highBleedingRisk` (enum yes/no) — an active or high risk of
bleeding that contraindicates pharmacological prophylaxis.

**Derived (never stored as input).** `factorPoints[]`, `capriniScore`,
`riskBand`, `recommendedProphylaxis`, `firedFactors[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Sum the weight of every fired factor plus the age-band
weight:

```
ageBandPoints = { 'under-41': 0, '41-60': 1, '61-74': 2, '75-plus': 3 }[ageBand] ?? 0

capriniScore = ageBandPoints
             + sum(1 for each fired 1-point factor)
             + sum(2 for each fired 2-point factor)
             + sum(3 for each fired 3-point factor)
             + sum(5 for each fired 5-point factor)

riskBand =
  capriniScore <= 1 ? 'very-low' :
  capriniScore == 2 ? 'low'      :
  capriniScore <= 4 ? 'moderate' :
                      'high'

recommendedProphylaxis =
  riskBand == 'very-low' ? 'early-ambulation'          :
  riskBand == 'low'      ? 'mechanical'                :
  riskBand == 'moderate' ? 'pharmacological-or-mechanical' :
                           'pharmacological-plus-mechanical'
```

- When `highBleedingRisk == 'yes'`, any pharmacological recommendation is
  downgraded to `mechanical` and a contraindication flag is raised (see §5).
- A factor answered `''` (unanswered) contributes 0 points and raises a
  data-completeness flag; the total may understate risk.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High VTE risk** (high) — `capriniScore >= 5`: pharmacological prophylaxis
  plus mechanical prophylaxis indicated; consider extended duration.
- **Bleeding-risk contraindication** (high) — `highBleedingRisk == 'yes'` while
  risk band is moderate or high: substitute mechanical prophylaxis for
  pharmacological until the bleeding risk resolves; senior review.
- **Prior VTE** (medium) — `historyOfVte == 'yes'`: strong independent risk
  factor; confirm prophylaxis and consider extended duration.
- **Known thrombophilia** (medium) — any 3-point thrombophilia factor fired:
  consider haematology input.
- **Incomplete assessment** (low) — any risk-factor or bleeding-risk input
  unanswered: score may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  factorPoints: FactorPoints[];   // each fired factor with its weight
  capriniScore: number;           // 0..40+
  riskBand: 'very-low' | 'low' | 'moderate' | 'high';
  recommendedProphylaxis:
    'early-ambulation' | 'mechanical'
    | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical';
  firedFactors: FiredFactor[];
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

- `bin/test-form caprini-venous-thromboembolism-risk-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each band boundary (score 1/2, 2/3, 4/5), the age-band weights, the
  bleeding-risk downgrade, and a representative fired-factor mix.
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
bin/test-form caprini-venous-thromboembolism-risk-assessment
```
