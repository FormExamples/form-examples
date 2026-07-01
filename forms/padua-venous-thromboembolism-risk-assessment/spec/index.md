# Padua Venous Thromboembolism Risk Assessment — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `padua-venous-thromboembolism-risk-assessment`

## 1. Purpose

A VTE (venous thromboembolism) risk-stratification tool for hospitalised
**medical** patients. It records eleven weighted risk factors, sums a total
Padua Prediction Score of **0–20**, and produces a risk band. A score of
**≥ 4** classifies the patient as **high risk** and prompts consideration of
pharmacological thromboprophylaxis (subject to a bleeding-risk check); a score
of **< 4** is **low risk**. It is a decision-support tool, not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, surgical/obstetric/
paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | acute-medical / general-medical / admissions-unit / other |
| `admissionReason` | text | reason for admission |
| `patientIdentifier` | text | local identifier |
| `ageYears` | numeric | patient age in years (drives factor 6) |
| `sex` | enum | patient sex |

**Risk-factor inputs.** Each is an enum (`yes` / `no`) unless noted; each maps to
one weighted factor.

| Field | Type | Factor (points) |
| --- | --- | --- |
| `activeCancer` | enum yes/no | 1 — active cancer (3) |
| `previousVte` | enum yes/no | 2 — previous VTE (3) |
| `reducedMobility` | enum yes/no | 3 — reduced mobility ≥ 3 days (3) |
| `knownThrombophilia` | enum yes/no | 4 — known thrombophilia (3) |
| `recentTraumaOrSurgery` | enum yes/no | 5 — trauma/surgery ≤ 1 month (2) |
| `ageYears` | numeric | 6 — age ≥ 70 (1) |
| `heartOrRespiratoryFailure` | enum yes/no | 7 — heart/respiratory failure (1) |
| `acuteMiOrIschaemicStroke` | enum yes/no | 8 — acute MI or ischaemic stroke (1) |
| `acuteInfectionOrRheumatological` | enum yes/no | 9 — acute infection/rheumatological (1) |
| `bodyMassIndex` | numeric (kg/m²) | 10 — obesity BMI ≥ 30 (1) |
| `ongoingHormonalTreatment` | enum yes/no | 11 — ongoing hormonal treatment (1) |

**Bleeding-risk check (informational; gates the recommendation, not the score).**

| Field | Type | Notes |
| --- | --- | --- |
| `activeBleeding` | enum yes/no | active bleeding contraindicates pharmacological prophylaxis |
| `highBleedingRisk` | enum yes/no | other high bleeding-risk factors present |

**Derived (never stored as input).** `factorPoints` per factor, `paduaScore`,
`riskBand`, `firedFactors[]`, `flaggedIssues[]`, `prophylaxisRecommendation`.

## 4. Grading algorithm

Pure function, no I/O. Each factor contributes its weight when present:

```
activeCancerPoint                    = activeCancer == 'yes'                       ? 3 : 0
previousVtePoint                     = previousVte == 'yes'                        ? 3 : 0
reducedMobilityPoint                 = reducedMobility == 'yes'                    ? 3 : 0
knownThrombophiliaPoint              = knownThrombophilia == 'yes'                 ? 3 : 0
recentTraumaOrSurgeryPoint           = recentTraumaOrSurgery == 'yes'             ? 2 : 0
elderlyAgePoint                      = ageYears != null && ageYears >= 70          ? 1 : 0
heartOrRespiratoryFailurePoint       = heartOrRespiratoryFailure == 'yes'        ? 1 : 0
acuteMiOrIschaemicStrokePoint        = acuteMiOrIschaemicStroke == 'yes'         ? 1 : 0
acuteInfectionOrRheumatologicalPoint = acuteInfectionOrRheumatological == 'yes' ? 1 : 0
obesityPoint                         = bodyMassIndex != null && bodyMassIndex >= 30 ? 1 : 0
ongoingHormonalTreatmentPoint        = ongoingHormonalTreatment == 'yes'         ? 1 : 0

paduaScore = sum of the eleven points                                              // 0..20
riskBand   = paduaScore >= 4 ? 'high' : 'low'
```

- A missing numeric input (`ageYears`, `bodyMassIndex`) contributes 0 points for
  its factor (absent, not positive) and raises a data-completeness flag.
- The bleeding-risk fields do **not** change `paduaScore`; they gate the
  prophylaxis recommendation (see §5).

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High VTE risk** (high) — `paduaScore >= 4`: high-risk classification;
  consider pharmacological thromboprophylaxis subject to bleeding-risk check.
- **Bleeding-risk contraindication** (high) — `activeBleeding == 'yes'` or
  `highBleedingRisk == 'yes'`: pharmacological prophylaxis may be
  contraindicated; consider mechanical prophylaxis and senior review.
- **Active cancer** (medium) — `activeCancer == 'yes'`: highest single-factor
  contribution; heightened VTE risk.
- **Previous VTE** (medium) — `previousVte == 'yes'`: strong independent VTE
  predictor.
- **Incomplete assessment** (low) — `ageYears` or `bodyMassIndex` missing:
  score may understate risk; complete the assessment.

**Prophylaxis recommendation.** `riskBand == 'high'` and no bleeding
contraindication → recommend pharmacological thromboprophylaxis. `riskBand ==
'high'` with a bleeding contraindication → recommend mechanical prophylaxis and
review. `riskBand == 'low'` → routine pharmacological prophylaxis not indicated
on risk grounds.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  factorPoints: Record<string, number>; // per-factor contribution
  paduaScore: number;                   // 0..20
  riskBand: 'low' | 'high';
  firedFactors: FiredFactor[];
  flaggedIssues: FlaggedIssue[];
  prophylaxisRecommendation: 'pharmacological' | 'mechanical' | 'none';
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

- `bin/test-form padua-venous-thromboembolism-risk-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each factor's contribution, the age 69/70 and BMI 29/30 boundaries, the score
  3/4 band boundary, and the bleeding-risk gating of the recommendation.
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
bin/test-form padua-venous-thromboembolism-risk-assessment
```
