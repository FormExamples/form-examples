# GRACE Score for Acute Coronary Syndrome — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `grace-score-for-acute-coronary-syndrome`

## 1. Purpose

A risk-stratification tool for adults with an acute coronary syndrome (chiefly
NSTE-ACS). It records eight admission variables, applies the **GRACE weighted
regression point model**, and produces a **point total** mapped to an
**in-hospital** and **6-month mortality** band and an overall **Low /
Intermediate / High** risk category, with guidance on the timing of an invasive
strategy. It quantifies prognosis; it does not diagnose ACS.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric scoring,
and the full non-linear GRACE 2.0 spline coefficients (the engine uses the
published banded point tables that approximate them).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | emergency-physician / acute-physician / cardiologist / nurse / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / acute-medical-unit / coronary-care-unit / cardiology-ward / other |
| `presentationType` | enum | nstemi / unstable-angina / stemi |
| `patientIdentifier` | text | local identifier |
| `ageYears` | numeric (years) | variable 1 |
| `sex` | enum | patient sex |

**GRACE variable inputs.**

| Field | Type | Variable |
| --- | --- | --- |
| `heartRate` | numeric (beats/min) | 2 — heart rate |
| `systolicBloodPressure` | numeric (mmHg) | 3 — systolic BP (inverse weight) |
| `serumCreatinine` | numeric | 4 — serum creatinine |
| `serumCreatinineUnit` | enum (`mg/dL` / `umol/L`) | unit for variable 4 |
| `killipClass` | enum (`I`/`II`/`III`/`IV`) | 5 — heart-failure severity |
| `cardiacArrestAtAdmission` | enum (yes/no) | 6 — cardiac arrest |
| `stSegmentDeviation` | enum (yes/no) | 7 — ST deviation |
| `elevatedCardiacEnzymes` | enum (yes/no) | 8 — elevated troponin/enzymes |

**Derived (never stored as input).** `gracePoints`, `inHospitalMortalityBand`,
`sixMonthMortalityBand`, `riskCategory`, `firedContributors[]`,
`flaggedIssues[]`, `invasiveStrategy`.

## 4. Grading algorithm (weighted regression point model)

Pure function, no I/O. GRACE is **not** a simple sum of yes/no items: each
variable maps through a **weighted, banded lookup** derived from the model's
regression coefficients, and the resulting points are summed.

```
creatinine_mgdl = serumCreatinineUnit == 'umol/L'
                    ? serumCreatinine / 88.4      // normalise to mg/dL
                    : serumCreatinine

agePoints        = weightedBand(ageYears)               // increases with age
heartRatePoints  = weightedBand(heartRate)              // increases with rate
sbpPoints        = weightedBandInverse(systolicBP)      // decreases with pressure
creatininePoints = weightedBand(creatinine_mgdl)        // increases with creatinine
killipPoints     = { I: 0, II: k2, III: k3, IV: k4 }[killipClass]   // k2<k3<k4
arrestPoints     = cardiacArrestAtAdmission == 'yes' ? A : 0
stPoints         = stSegmentDeviation      == 'yes' ? S : 0
enzymePoints     = elevatedCardiacEnzymes  == 'yes' ? E : 0

gracePoints = agePoints + heartRatePoints + sbpPoints + creatininePoints
            + killipPoints + arrestPoints + stPoints + enzymePoints

inHospitalMortalityBand = gracePoints <= 108 ? 'low'
                        : gracePoints <= 140 ? 'intermediate' : 'high'
sixMonthMortalityBand   = gracePoints <=  88 ? 'low'
                        : gracePoints <= 118 ? 'intermediate' : 'high'

riskCategory = worseOf(inHospitalMortalityBand, sixMonthMortalityBand)  // max-band rule
```

- The exact per-band point coefficients live in the engine (`grace-rules.ts`) as
  named lookup tables; boundaries follow the published GRACE / GRACE 2.0 point
  tables and are covered by unit tests.
- **Unit normalisation:** creatinine entered in µmol/L is divided by 88.4 to
  mg/dL before banding; the raw value and unit are stored.
- A **missing** numeric input contributes 0 points for that variable and raises
  a data-completeness flag — the total (and therefore the risk category) may
  understate risk.
- `invasiveStrategy` is a derived recommendation string keyed on `riskCategory`
  (Low → selective; Intermediate → angiography within 72 h; High → early
  angiography within 24 h).

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High-risk category** (high) — `riskCategory == 'high'`: recommend early
  invasive strategy (coronary angiography within 24 h) and senior cardiology
  review.
- **Cardiac arrest at admission** (high) — `cardiacArrestAtAdmission == 'yes'`:
  arrest survivor; urgent review, consider post-arrest pathway.
- **Killip class ≥ II** (high) — `killipClass in {II, III, IV}`: clinical heart
  failure to cardiogenic shock; escalate.
- **Hypotension** (high) — `systolicBloodPressure < 90`: haemodynamic
  compromise.
- **Renal impairment** (medium) — normalised creatinine ≥ 2.0 mg/dL
  (≈ 177 µmol/L): affects contrast and antithrombotic dosing.
- **ST-segment deviation** (medium) — `stSegmentDeviation == 'yes'`: dynamic
  ischaemia; repeat ECG and expedite.
- **Incomplete assessment** (low) — any GRACE variable input missing: score may
  understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  gracePoints: number;                       // weighted total, ~0..350+
  inHospitalMortalityBand: 'low' | 'intermediate' | 'high';
  sixMonthMortalityBand: 'low' | 'intermediate' | 'high';
  riskCategory: 'low' | 'intermediate' | 'high';
  invasiveStrategy: string;                  // recommendation keyed on riskCategory
  firedContributors: FiredContributor[];     // per-variable point contribution
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

- `bin/test-form grace-score-for-acute-coronary-syndrome` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each band boundary (age, heart rate, systolic BP, creatinine bands; Killip
  I–IV; each yes/no contributor) and every mortality-band boundary (108/109,
  140/141, 88/89, 118/119).
- Creatinine unit normalisation (mg/dL vs µmol/L) is tested.
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
bin/test-form grace-score-for-acute-coronary-syndrome
```
