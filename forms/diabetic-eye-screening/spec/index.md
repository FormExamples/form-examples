# Diabetic Eye Screening record — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `diabetic-eye-screening`

## 1. Purpose

Records a diabetic retinal screening episode for the UK NHS Diabetic Eye
Screening Programme. For each eye it captures the retinopathy (R) grade,
maculopathy (M) grade, photocoagulation (P) marker, and ungradable (U) marker
assigned to the retinal photographs. From the two graded eyes it classifies the
worst-eye result and derives a recall interval or referral pathway, validates
completeness, and raises flagged issues. It documents and classifies a human
grader's decision; it does not interpret raw images.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, grading engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: automated image analysis, hosted deployment, authentication,
multi-tenancy, paediatric (< 12) scoring, non-diabetic retinopathy.

## 3. Data model

A single logical screening record with a right-eye and a left-eye grade block.
Fields default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Grading context.**

| Field | Type | Notes |
| --- | --- | --- |
| `graderName` | text | screener / grader |
| `graderRole` | enum | screener / primary-grader / secondary-grader / ophthalmologist / other |
| `gradedAt` | date | date grade assigned |
| `imageCapturedAt` | date | date retinal images captured |
| `imagingMedia` | enum | digital-fundus / mydriatic / non-mydriatic / oct / other |

**Patient identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | local / NHS identifier |
| `ageBand` | enum | screening-eligible age band (≥ 12) |
| `diabetesType` | enum | type-1 / type-2 / other / unknown |
| `yearsSinceDiagnosis` | numeric | years since diabetes diagnosis |
| `previousScreenDate` | date | date of last screen (drives overdue + low-risk) |
| `previousScreenResult` | enum | r0m0 / background / referable / none / unknown |

**Per-eye grading (repeated for `rightEye` and `leftEye`).**

| Field | Type | Notes |
| --- | --- | --- |
| `<eye>Retinopathy` | enum | R0 / R1 / R2 / R3A / R3S / '' |
| `<eye>Maculopathy` | enum | M0 / M1 / '' |
| `<eye>Photocoagulation` | enum | yes / no / '' — marker P |
| `<eye>Ungradable` | enum | yes / no / '' — marker U |
| `<eye>VisualAcuity` | text | e.g. logMAR or Snellen (optional) |

**Derived (never stored as input).** `worstRetinopathy`, `worstMaculopathy`,
`anyUngradable`, `recallPathway`, `recallIntervalMonths`, `referral`,
`flaggedIssues[]`.

## 4. Grading / outcome algorithm

Pure function, no I/O. Retinopathy severity ranks `R0 < R1 < R2 < R3S < R3A`.

```
worstRetinopathy = max-by-severity(rightEyeRetinopathy, leftEyeRetinopathy)   // ignore '' / ungradable
worstMaculopathy = (rightEyeMaculopathy == 'M1' || leftEyeMaculopathy == 'M1') ? 'M1' : 'M0'
anyUngradable    = rightEyeUngradable == 'yes' || leftEyeUngradable == 'yes'
lowRiskEligible  = both eyes R0 && worstMaculopathy == 'M0' && previousScreenResult == 'r0m0'

recallPathway =
  worstRetinopathy == 'R3A'                                   -> 'refer-hes-urgent'      (interval null)
  worstMaculopathy == 'M1' || worstRetinopathy == 'R3S'       -> 'refer-hes'             (interval null)
  anyUngradable                                               -> 'refer-slit-lamp'       (interval null)
  worstRetinopathy == 'R2'                                    -> 'surveillance-6-month'  (6)
  worstRetinopathy == 'R1'                                    -> 'routine-12-month'      (12)
  worstRetinopathy == 'R0' && lowRiskEligible                 -> 'routine-24-month'      (24)
  otherwise (R0, not low-risk eligible)                       -> 'routine-12-month'      (12)

referral = recallPathway in {refer-hes-urgent} -> 'hes-urgent'
         | recallPathway in {refer-hes}        -> 'hes-routine'
         | recallPathway in {refer-slit-lamp}  -> 'slit-lamp'
         | otherwise                            -> 'none'
```

- Priority is by clinical urgency: urgent proliferative > referable
  (maculopathy / stable proliferative) > ungradable > pre-proliferative
  surveillance > routine recall. The most urgent applicable pathway wins.
- An eye marked ungradable (`U = yes`) does not contribute a retinopathy grade;
  `anyUngradable` routes to slit-lamp unless a referable grade in the other eye
  already routes to HES.
- `P` (photocoagulation) is contextual and does not by itself change the pathway.
- Missing an eye's R or M grade (and not ungradable) contributes nothing to the
  worst-eye grade and raises a data-completeness flag; the outcome may
  understate risk.

## 5. Flagged issues (red flags)

Emitted independently of the pathway, each with a priority:

- **Active proliferative retinopathy** (high) — any eye `R3A`: urgent /
  fast-track referral to ophthalmology.
- **Maculopathy referral** (high) — any eye `M1`: refer to hospital eye service.
- **Stable proliferative retinopathy** (high) — any eye `R3S`: refer to / keep
  under hospital eye service.
- **Pre-proliferative retinopathy** (medium) — any eye `R2`: 6-monthly digital
  surveillance.
- **Ungradable images** (medium) — any eye `U`: re-screen or refer for
  slit-lamp biomicroscopy.
- **Patient overdue** (medium) — `previousScreenDate` earlier than the
  recommended interval before `gradedAt`: recall interval exceeded.
- **Incomplete grading** (low) — an eye's R or M grade missing and not marked
  ungradable: grade may understate risk; complete the grade.
- **Eligibility** (low) — `ageBand` below 12 or `diabetesType` not diabetic:
  outside programme eligibility.

## 6. Inputs and outputs

**Input.** A typed screening object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  rightEyeGrade: EyeGrade;   // { retinopathy, maculopathy, photocoagulation, ungradable }
  leftEyeGrade: EyeGrade;
  worstRetinopathy: 'R0' | 'R1' | 'R2' | 'R3S' | 'R3A';
  worstMaculopathy: 'M0' | 'M1';
  anyUngradable: boolean;
  recallPathway:
    | 'refer-hes-urgent' | 'refer-hes' | 'refer-slit-lamp'
    | 'surveillance-6-month' | 'routine-12-month' | 'routine-24-month';
  recallIntervalMonths: 6 | 12 | 24 | null;
  referral: 'none' | 'hes-routine' | 'hes-urgent' | 'slit-lamp';
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

- `bin/test-form diabetic-eye-screening` exits cleanly.
- The grading engine is pure (no side effects, no I/O) and unit-tested, covering
  every R grade (R0/R1/R2/R3A/R3S), both M grades, the ungradable and
  photocoagulation markers, worst-eye selection across mismatched eyes, and each
  recall / referral pathway.
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

- [`index.md`](../index.md) — form description and grading details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form diabetic-eye-screening
```
