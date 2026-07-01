# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk`

## 1. Purpose

A clinical prediction tool that estimates the annual risk of ischaemic stroke and
systemic thromboembolism in adults with non-valvular atrial fibrillation, and
guides the decision to start oral anticoagulation. It records eight weighted risk
factors, sums a total CHA2DS2-VASc score of **0–9**, and maps the total to a risk
band, an estimated annual stroke rate, and an anticoagulation recommendation. It
is a decision-support tool, not a diagnostic test, and pairs with **HAS-BLED**
(bleeding risk) for the treatment decision.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, valvular-AF management,
and bleeding-risk scoring (HAS-BLED is a separate form).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | primary-care / cardiology / anticoagulation-clinic / emergency-department / other |
| `atrialFibrillationType` | enum | paroxysmal / persistent / permanent / flutter |
| `patientIdentifier` | text | local identifier |
| `ageYears` | numeric (years) | drives the age criteria |
| `sex` | enum | female / male / other |

**Criterion inputs.**

| Field | Type | Criterion | Points |
| --- | --- | --- | --- |
| `congestiveHeartFailure` | enum (yes/no) | C — CHF / LV dysfunction | 1 |
| `hypertension` | enum (yes/no) | H — hypertension | 1 |
| `diabetes` | enum (yes/no) | D — diabetes mellitus | 1 |
| `priorStrokeTiaThromboembolism` | enum (yes/no) | S₂ — prior stroke / TIA / TE | 2 |
| `vascularDisease` | enum (yes/no) | V — vascular disease | 1 |
| `ageYears` (derived) | numeric | A₂ (≥ 75 → 2) / A (65–74 → 1) | 2 or 1 |
| `sex` (derived) | enum | Sc — female sex category | 1 |

**Derived (never stored as input).** `congestiveHeartFailurePoint`,
`hypertensionPoint`, `agePoint`, `diabetesPoint`, `strokePoint`,
`vascularDiseasePoint`, `sexPoint`, `cha2ds2VascScore`, `riskBand`,
`annualStrokeRatePercent`, `anticoagulationRecommendation`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Age is mutually exclusive (never scores both bands):

```
congestiveHeartFailurePoint = congestiveHeartFailure == 'yes'         ? 1 : 0
hypertensionPoint           = hypertension == 'yes'                   ? 1 : 0
diabetesPoint               = diabetes == 'yes'                       ? 1 : 0
strokePoint                 = priorStrokeTiaThromboembolism == 'yes'  ? 2 : 0
vascularDiseasePoint        = vascularDisease == 'yes'                ? 1 : 0
agePoint                    = ageYears == null ? 0
                            : ageYears >= 75   ? 2
                            : ageYears >= 65   ? 1
                            : 0
sexPoint                    = sex == 'female'                         ? 1 : 0

cha2ds2VascScore = congestiveHeartFailurePoint + hypertensionPoint + agePoint
                 + diabetesPoint + strokePoint + vascularDiseasePoint + sexPoint  // 0..9

riskBand =
    (sex == 'male'   && cha2ds2VascScore == 0)                       ? 'low'
  | (sex == 'female' && cha2ds2VascScore == 1)                       ? 'low'    // sex point only
  | (sex == 'male'   && cha2ds2VascScore == 1)                       ? 'intermediate'
  | otherwise                                                        ? 'high'

annualStrokeRatePercent = LOOKUP[cha2ds2VascScore]   // 0..9 → 0.2,1.3,2.2,3.2,4.0,6.7,9.8,9.6,6.7,15.2
```

- `annualStrokeRatePercent` is a fixed lookup table indexed by total score, from
  Lip *et al.* (*Chest* 2010) adjusted annual stroke rates.
- `anticoagulationRecommendation` mirrors the risk band: `none` (low),
  `consider` (intermediate), `recommended` (high).
- A missing enum input is treated as `no` (criterion absent) and raises a
  data-completeness flag; a missing `ageYears` scores 0 for age and flags.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Anticoagulation recommended, none recorded** (high) — `riskBand == 'high'`
  and treatment plan absent: high stroke risk that may be untreated; document
  the anticoagulation decision.
- **Bleeding-risk cross-reference** (high) — `riskBand == 'high'`: before
  starting anticoagulation, complete a **HAS-BLED** assessment and correct
  modifiable bleeding risks; a high HAS-BLED score is not a reason to withhold.
- **Prior stroke / TIA** (high) — `priorStrokeTiaThromboembolism == 'yes'`:
  strongest single risk factor (2 points); secondary prevention indicated.
- **Advanced age** (medium) — `ageYears >= 75`: age ≥ 75 contributes 2 points and
  independently raises both stroke and fall/bleeding considerations.
- **Female sex modifier** (low) — `sex == 'female'` and total is 1: score driven
  by sex alone; manage as low risk, no anticoagulation for sex category alone.
- **Incomplete assessment** (low) — any criterion input or `ageYears` missing:
  score may misstate risk; complete all fields.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  congestiveHeartFailurePoint: 0 | 1;
  hypertensionPoint: 0 | 1;
  agePoint: 0 | 1 | 2;
  diabetesPoint: 0 | 1;
  strokePoint: 0 | 2;
  vascularDiseasePoint: 0 | 1;
  sexPoint: 0 | 1;
  cha2ds2VascScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  riskBand: 'low' | 'intermediate' | 'high';
  annualStrokeRatePercent: number;
  anticoagulationRecommendation: 'none' | 'consider' | 'recommended';
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

- `bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk` exits
  cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the age boundaries (64/65/74/75), the mutually-exclusive age bands, the
  female-sex low-risk edge case (total 1 → low), the male total-1 intermediate
  case, and every total 0–9 against the stroke-rate lookup.
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
bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
```
