# Columbia Suicide Severity Rating Scale (C-SSRS) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `columbia-suicide-severity-rating-scale`

## 1. Purpose

A structured suicide-risk assessment. It records the severity of suicidal
ideation on a five-point ordinal scale, categories of suicidal behaviour, and
the lethality of any actual attempt, then derives a **Low / Moderate / High**
risk tier and a management recommendation. It is a severity- and
status-classification instrument, **not** a summed score, and not a diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, statutory safeguarding
workflow, and paediatric-specific scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | clinician / nurse / mental-health-practitioner / crisis-worker / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | mental-health / emergency-department / primary-care / crisis-service / inpatient / other |
| `scaleVersion` | enum | screener / full |
| `reasonForAssessment` | text | trigger for the screen |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adolescent / adult age band |
| `sex` | enum | patient sex |

**Suicidal ideation (Q1–Q5, each yes/no).**

| Field | Type | Ideation level |
| --- | --- | --- |
| `ideationWishToBeDead` | enum (yes/no) | 1 |
| `ideationActiveNonSpecific` | enum (yes/no) | 2 |
| `ideationActiveWithMethods` | enum (yes/no) | 3 |
| `ideationActiveWithIntent` | enum (yes/no) | 4 |
| `ideationActiveWithPlanAndIntent` | enum (yes/no) | 5 |
| `ideationTimeframe` | enum | past-month / lifetime-worst |

**Ideation intensity (optional; full version).** `ideationFrequency`,
`ideationDuration`, `ideationControllability`, `ideationDeterrents`,
`ideationReasons` — numeric ordinals (each 0–5) or `null`.

**Suicidal behaviour.**

| Field | Type | Notes |
| --- | --- | --- |
| `behaviourActualAttempt` | enum (yes/no) | counts as suicidal behaviour |
| `behaviourInterruptedAttempt` | enum (yes/no) | counts as suicidal behaviour |
| `behaviourAbortedAttempt` | enum (yes/no) | counts as suicidal behaviour |
| `behaviourPreparatoryActs` | enum (yes/no) | counts as suicidal behaviour |
| `behaviourNonSuicidalSelfInjury` | enum (yes/no) | NSSI — tracked separately, not suicidal behaviour |
| `behaviourRecency` | enum | within-3-months / over-3-months (recency of most recent suicidal behaviour) |
| `lifetimeAttemptCount` | numeric | total lifetime actual attempts |
| `mostRecentAttemptDate` | date | most recent actual attempt |

**Lethality.**

| Field | Type | Notes |
| --- | --- | --- |
| `actualLethality` | numeric (0–5) | medical damage of most recent actual attempt |
| `potentialLethality` | numeric (0–2) | coded only when `actualLethality` is 0 |

**Means and protective factors.**

| Field | Type | Notes |
| --- | --- | --- |
| `accessToLethalMeans` | enum | yes / no / unknown |
| `protectiveFactors` | text | free-text note |

**Derived (never stored as input).** `ideationLevel` (0–5),
`suicidalBehaviourPresent` (bool), `recentBehaviour` (bool), `riskTier`,
`firedCriteria[]`, `flaggedIssues[]`, `managementRecommendation`.

## 4. Classification algorithm

Pure function, no I/O.

```
ideationLevel = highest N in 1..5 whose ideation item == 'yes', else 0

suicidalBehaviourPresent =
    behaviourActualAttempt == 'yes'
 || behaviourInterruptedAttempt == 'yes'
 || behaviourAbortedAttempt == 'yes'
 || behaviourPreparatoryActs == 'yes'

recentBehaviour  = suicidalBehaviourPresent && behaviourRecency == 'within-3-months'
highLethality    = (actualLethality != null && actualLethality >= 3)
                 || (potentialLethality != null && potentialLethality == 2)

riskTier =
    HIGH      if ideationLevel >= 4 || recentBehaviour || highLethality
    MODERATE  else if ideationLevel == 3 || suicidalBehaviourPresent
    LOW       otherwise            // ideationLevel 1–2 with no behaviour, or none
```

- Non-suicidal self-injury (`behaviourNonSuicidalSelfInjury`) does **not**
  contribute to `suicidalBehaviourPresent` or set a tier; it raises its own flag.
- `ideationLevel` is the maximum affirmative item, so a "yes" at level 4 sets the
  level to 4 even if level 3 is "no" (items are asked in ascending order but each
  is recorded independently).
- Missing ideation items are treated as "no" for levelling but raise a
  data-completeness flag when the assessment is otherwise sparse.

## 5. Flagged issues (red flags)

Emitted independently of the tier, each with a priority:

- **Immediate safety / crisis referral** (high) — `riskTier == HIGH`: urgent
  psychiatric or crisis-service response; do not leave the person alone.
- **Active plan and intent** (high) — `ideationActiveWithPlanAndIntent == 'yes'`
  (ideation level 5).
- **Recent suicide attempt** (high) — `behaviourActualAttempt == 'yes'` with
  `behaviourRecency == 'within-3-months'`.
- **High-lethality attempt** (high) — `highLethality`: actual lethality ≥ 3 or
  potential lethality = 2.
- **Access to lethal means** (high) — `accessToLethalMeans == 'yes'`: means
  restriction required.
- **Recent preparatory acts** (medium) — `behaviourPreparatoryActs == 'yes'`
  within the past 3 months.
- **Non-suicidal self-injury** (medium) — `behaviourNonSuicidalSelfInjury ==
  'yes'`: recorded separately from suicidal behaviour.
- **Incomplete assessment** (low) — required ideation or behaviour fields
  missing: the tier may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  ideationLevel: 0 | 1 | 2 | 3 | 4 | 5;
  suicidalBehaviourPresent: boolean;
  recentBehaviour: boolean;
  riskTier: 'low' | 'moderate' | 'high';
  firedCriteria: FiredCriterion[];
  flaggedIssues: FlaggedIssue[];
  managementRecommendation: string;
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

- `bin/test-form columbia-suicide-severity-rating-scale` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each ideation level 0–5, every behaviour category, each recency
  window, the lethality thresholds, and each risk tier.
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
bin/test-form columbia-suicide-severity-rating-scale
```
