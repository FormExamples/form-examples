# Wells Score for Pulmonary Embolism — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `wells-score-for-pulmonary-embolism`

## 1. Purpose

A clinical prediction rule that estimates the pre-test probability of acute
pulmonary embolism (PE) in adults with suspected PE. It records seven weighted
criteria, sums a total of **0–12.5**, and stratifies the patient into a
probability band that selects the next diagnostic step: **D-dimer** when PE is
unlikely, or **CTPA** when PE is likely. It is a risk-stratification aid, not a
diagnosis of PE.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric and
pregnancy-specific scoring, and the downstream D-dimer / CTPA results
themselves.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / physician-associate / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / acute-medical-unit / ambulatory / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `haemodynamicStatus` | enum | stable / unstable |

**Criterion inputs.** Each yes/no criterion is an enum (`yes` / `no` / `''`).

| Field | Type | Criterion | Points |
| --- | --- | --- | --- |
| `dvtSigns` | enum yes/no | 1 — clinical signs/symptoms of DVT | +3 |
| `peMostLikely` | enum yes/no | 2 — PE is #1 diagnosis or equally likely | +3 |
| `heartRate` | numeric (beats/min) | 3 — heart rate > 100 | +1.5 |
| `immobilisationSurgery` | enum yes/no | 4 — immobilization ≥ 3 days or surgery in previous 4 weeks | +1.5 |
| `previousDvtPe` | enum yes/no | 5 — previous DVT/PE | +1.5 |
| `haemoptysis` | enum yes/no | 6 — haemoptysis | +1 |
| `malignancy` | enum yes/no | 7 — malignancy on treatment / within 6 months / palliative | +1 |

**Derived (never stored as input).** `dvtSignsPoints`, `peMostLikelyPoints`,
`heartRatePoints`, `immobilisationSurgeryPoints`, `previousDvtPePoints`,
`haemoptysisPoints`, `malignancyPoints`, `wellsScore`, `twoLevelBand`,
`threeLevelBand`, `recommendedPathway`, `firedCriteria[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes its weight when present:

```
dvtSignsPoints              = dvtSigns              == 'yes' ? 3   : 0
peMostLikelyPoints          = peMostLikely          == 'yes' ? 3   : 0
heartRatePoints             = heartRate != null && heartRate > 100 ? 1.5 : 0
immobilisationSurgeryPoints = immobilisationSurgery == 'yes' ? 1.5 : 0
previousDvtPePoints         = previousDvtPe         == 'yes' ? 1.5 : 0
haemoptysisPoints           = haemoptysis           == 'yes' ? 1   : 0
malignancyPoints            = malignancy            == 'yes' ? 1   : 0

wellsScore = sum(all points)                                    // 0 .. 12.5

twoLevelBand      = wellsScore >  4 ? 'likely' : 'unlikely'
recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'

threeLevelBand =
    wellsScore <  2 ? 'low'
  : wellsScore <= 6 ? 'moderate'
  :                   'high'
```

- A missing numeric heart rate contributes 0 points (absent, not positive) and
  raises a data-completeness flag.
- Floating-point totals arise only from the 1.5-weighted items; compare against
  thresholds using the exact sum (no rounding before banding).

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Haemodynamic instability** (high) — `haemodynamicStatus == 'unstable'`:
  suspected massive PE; do not wait on scoring — resuscitate and arrange
  immediate CTPA or bedside echocardiography, and consider empirical
  thrombolysis per local policy.
- **PE likely — arrange CTPA** (high) — `twoLevelBand == 'likely'`
  (`wellsScore > 4`): arrange immediate CTPA; give interim anticoagulation if
  imaging is delayed.
- **PE unlikely — arrange D-dimer** (medium) — `twoLevelBand == 'unlikely'`
  (`wellsScore ≤ 4`): arrange a D-dimer; consider the PERC rule to support
  ruling PE out without D-dimer when gestalt probability is low.
- **Incomplete assessment** (low) — any criterion input missing (`''` enum or
  `null` heart rate): the score may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  dvtSignsPoints: 0 | 3;
  peMostLikelyPoints: 0 | 3;
  heartRatePoints: 0 | 1.5;
  immobilisationSurgeryPoints: 0 | 1.5;
  previousDvtPePoints: 0 | 1.5;
  haemoptysisPoints: 0 | 1;
  malignancyPoints: 0 | 1;
  wellsScore: number;            // 0 .. 12.5
  twoLevelBand: 'unlikely' | 'likely';
  threeLevelBand: 'low' | 'moderate' | 'high';
  recommendedPathway: 'd-dimer' | 'ctpa';
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

- `bin/test-form wells-score-for-pulmonary-embolism` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each threshold boundary (heart rate 100/101, two-level 4/4.5, three-level
  1.5/2 and 6/6.5) and the 0 and 12.5 extremes.
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
bin/test-form wells-score-for-pulmonary-embolism
```
