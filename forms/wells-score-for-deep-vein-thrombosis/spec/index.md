# Wells Score for Deep Vein Thrombosis (DVT) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `wells-score-for-deep-vein-thrombosis`

## 1. Purpose

A bedside clinical prediction rule for the pre-test probability of a first
lower-limb DVT in adults. It records nine clinical criteria (each **+1**) and a
**−2** adjustment when an alternative diagnosis is at least as likely as DVT,
sums a total of **−2 to 9**, and stratifies the patient into a two-level band
(**DVT likely** at ≥ 2 → proximal leg vein ultrasound; **DVT unlikely** at ≤ 1 →
D-dimer). A three-level band (low / moderate / high) is also computed for
continuity with the original Wells rule. It is not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, PE scoring, pregnancy
pathways, and the interpretation of downstream D-dimer or ultrasound results.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered. Each criterion is a boolean-style enum
(`yes` / `no` / `''`), scored as present only when `yes`.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse-practitioner / physician-associate / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / ambulatory / acute-medical-unit / dvt-clinic / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `symptomaticLeg` | enum | left / right |

**Criterion inputs** (each `yes` / `no` / `''`).

| Field | Points | Criterion |
| --- | --- | --- |
| `activeCancer` | +1 | 1 — active cancer (ongoing, ≤ 6 months, or palliative) |
| `paralysisParesisImmobilisation` | +1 | 2 — paralysis, paresis, or recent plaster immobilisation |
| `bedriddenOrMajorSurgery` | +1 | 3 — bedridden ≥ 3 days or major surgery ≤ 12 weeks |
| `localisedTenderness` | +1 | 4 — localised deep-vein tenderness |
| `entireLegSwollen` | +1 | 5 — entire leg swollen |
| `calfSwellingOver3cm` | +1 | 6 — calf swelling ≥ 3 cm vs asymptomatic side |
| `pittingOedema` | +1 | 7 — pitting oedema confined to symptomatic leg |
| `collateralSuperficialVeins` | +1 | 8 — collateral (non-varicose) superficial veins |
| `previousDvt` | +1 | 9 — previously documented DVT |
| `alternativeDiagnosisAsLikely` | −2 | alternative diagnosis at least as likely as DVT |

**Derived (never stored as input).** `criterionPoints[]`, `wellsScore`,
`twoLevelBand`, `threeLevelBand`, `recommendedInvestigation`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each of the nine criteria contributes 0 or 1; the
alternative-diagnosis adjustment subtracts 2:

```
plus = sum of +1 for each criterion whose value == 'yes'      // 0..9
minus = alternativeDiagnosisAsLikely == 'yes' ? 2 : 0         // 0 or 2

wellsScore = plus - minus                                     // -2..9

twoLevelBand   = wellsScore >= 2 ? 'likely' : 'unlikely'
threeLevelBand = wellsScore >= 3 ? 'high'
               : wellsScore >= 1 ? 'moderate'
               : 'low'                                        // wellsScore <= 0

recommendedInvestigation = twoLevelBand == 'likely'
                           ? 'proximal-leg-vein-ultrasound'
                           : 'd-dimer'
```

- A criterion left blank (`''`) or `no` contributes 0 points (absent, not
  positive). A blank criterion also raises a data-completeness flag.
- The two-level band drives the recommended investigation; the three-level band
  is informational and mirrors the original Wells stratification.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **DVT likely — image** (high) — `wellsScore >= 2`: DVT likely; offer a
  proximal leg vein ultrasound (within 4 hours where possible).
- **DVT unlikely — D-dimer** (medium) — `wellsScore <= 1`: DVT unlikely; offer a
  D-dimer test; a negative result effectively excludes DVT.
- **Active cancer** (high) — `activeCancer == 'yes'`: malignancy raises VTE risk
  and affects anticoagulation choice; consider occult-cancer context.
- **Previous DVT** (medium) — `previousDvt == 'yes'`: prior clot; interpret
  imaging against any known residual thrombus.
- **Incomplete assessment** (low) — any criterion input blank: score may
  understate or overstate probability; complete the assessment.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  criterionPoints: Record<string, 0 | 1 | -2>;
  wellsScore: number;                       // -2..9
  twoLevelBand: 'likely' | 'unlikely';
  threeLevelBand: 'low' | 'moderate' | 'high';
  recommendedInvestigation: 'proximal-leg-vein-ultrasound' | 'd-dimer';
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

- `bin/test-form wells-score-for-deep-vein-thrombosis` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the two-level boundary (score 1 vs 2), the three-level boundaries (0/1 and
  2/3), the `−2` adjustment (including a negative total), and all-present /
  all-absent extremes (−2 and 9).
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
bin/test-form wells-score-for-deep-vein-thrombosis
```
