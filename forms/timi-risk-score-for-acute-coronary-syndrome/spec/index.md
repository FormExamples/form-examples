# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `timi-risk-score-for-acute-coronary-syndrome`

## 1. Purpose

A risk-stratification tool for adults presenting with unstable angina (UA) or
non-ST-elevation myocardial infarction (NSTEMI). It records seven clinical
criteria, awards 1 point for each present, and produces a total TIMI score of
0–7 with a risk band (0–1 low, 2–4 intermediate, 5–7 high). The total maps to
the 14-day risk of the composite end point: all-cause death, new/recurrent MI,
or severe recurrent ischaemia requiring urgent revascularisation. It is a
prognostic and therapeutic-decision aid, not a diagnostic test. A separate TIMI
STEMI score exists; this form is the UA/NSTEMI version only.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, STEMI scoring,
paediatric use.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | physician / cardiologist / nurse-practitioner / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / chest-pain-unit / ward / coronary-care / other |
| `workingDiagnosis` | enum | unstable-angina / nstemi |
| `patientIdentifier` | text | local identifier |
| `age` | numeric (years) | drives criterion 1 |
| `sex` | enum | patient sex |

**Criterion inputs.**

| Field | Type | Criterion |
| --- | --- | --- |
| `age` | numeric (years) | 1 — age ≥ 65 |
| `hypertension` | enum (yes/no) | 2 — risk-factor count |
| `hypercholesterolaemia` | enum (yes/no) | 2 — risk-factor count |
| `diabetes` | enum (yes/no) | 2 — risk-factor count |
| `currentSmoker` | enum (yes/no) | 2 — risk-factor count |
| `familyHistoryCad` | enum (yes/no) | 2 — risk-factor count |
| `knownCad` | enum (yes/no) | 3 — prior stenosis ≥ 50% |
| `aspirinPrior7Days` | enum (yes/no) | 4 — aspirin use |
| `severeAngina` | enum (yes/no) | 5 — ≥ 2 anginal episodes in 24 h |
| `stDeviation` | enum (yes/no) | 6 — ST deviation ≥ 0.5 mm |
| `positiveCardiacMarker` | enum (yes/no) | 7 — elevated troponin / CK-MB |

**Derived (never stored as input).** `agePoint`, `riskFactorPoint`,
`knownCadPoint`, `aspirinPoint`, `anginaPoint`, `stDeviationPoint`,
`cardiacMarkerPoint`, `riskFactorCount`, `timiScore`, `riskBand`,
`fourteenDayRiskPercent`, `firedCriteria[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes 0 or 1:

```
agePoint            = age != null && age >= 65                       ? 1 : 0
riskFactorCount     = count(yes among hypertension, hypercholesterolaemia,
                            diabetes, currentSmoker, familyHistoryCad)   // 0..5
riskFactorPoint     = riskFactorCount >= 3                           ? 1 : 0
knownCadPoint       = knownCad             == 'yes'                  ? 1 : 0
aspirinPoint        = aspirinPrior7Days    == 'yes'                  ? 1 : 0
anginaPoint         = severeAngina         == 'yes'                  ? 1 : 0
stDeviationPoint    = stDeviation          == 'yes'                  ? 1 : 0
cardiacMarkerPoint  = positiveCardiacMarker == 'yes'                 ? 1 : 0

timiScore = agePoint + riskFactorPoint + knownCadPoint + aspirinPoint
          + anginaPoint + stDeviationPoint + cardiacMarkerPoint         // 0..7

riskBand  = timiScore <= 1 ? 'low'
          : timiScore <= 4 ? 'intermediate'
          :                  'high'
```

**14-day event risk** (composite of death, MI, urgent revascularisation) is
looked up from the derivation cohort by score:

| Score | 0 | 1 | 2 | 3 | 4 | 5 | 6–7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Risk % | 4.7 | 4.7 | 8.3 | 13.2 | 19.9 | 26.2 | 40.9 |

- A missing enum input (`''`) counts as absent (0 points) for its criterion and
  raises a data-completeness flag — the score can understate risk.
- `age == null` scores 0 for criterion 1 and also raises the completeness flag.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High-risk score** (high) — `timiScore >= 5`: early invasive strategy;
  urgent cardiology / coronary-care involvement.
- **Positive troponin with ST deviation** (high) — `positiveCardiacMarker == 'yes'`
  and `stDeviation == 'yes'`: objective evidence of NSTEMI with dynamic ECG
  change; expedite invasive assessment.
- **Positive cardiac marker** (high) — `positiveCardiacMarker == 'yes'`: myocardial
  injury; confirms/upgrades toward NSTEMI.
- **ST deviation** (medium) — `stDeviation == 'yes'`: ischaemic ECG change.
- **Intermediate-risk score** (medium) — `timiScore` 2–4: an early invasive
  strategy should be considered.
- **Incomplete assessment** (low) — any criterion input missing (`''` or `age`
  null): score may understate risk; complete and re-score.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  agePoint: 0 | 1;
  riskFactorCount: 0 | 1 | 2 | 3 | 4 | 5;
  riskFactorPoint: 0 | 1;
  knownCadPoint: 0 | 1;
  aspirinPoint: 0 | 1;
  anginaPoint: 0 | 1;
  stDeviationPoint: 0 | 1;
  cardiacMarkerPoint: 0 | 1;
  timiScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  riskBand: 'low' | 'intermediate' | 'high';
  fourteenDayRiskPercent: number;
  firedCriteria: FiredCriterion[];
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

- `bin/test-form timi-risk-score-for-acute-coronary-syndrome` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the age boundary (64/65), the risk-factor threshold (2/3 factors), every band
  transition (1→2, 4→5), and every total 0–7 with its 14-day risk.
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
bin/test-form timi-risk-score-for-acute-coronary-syndrome
```
