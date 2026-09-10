# Diabetes Podiatry Assessment — specification

This file is the **living domain spec** for this form. It captures the
contract each implementation (SQL schema, generated representations,
front-ends, and Rust back-end) must satisfy. Treat it as the source of truth
for behaviour — update the spec before changing code.

Slug: `diabetes-podiatry-assessment`

## 1. Purpose

Records a diabetic foot risk-screening episode aligned with NICE NG19
(*Diabetic foot problems: prevention and management*). For each foot it
captures sensory neuropathy status, pedal pulses, deformity, callus, skin
breakdown, active ulceration and severity, ulceration/amputation history, and
a suspected-Charcot-foot marker, plus patient-wide risk factors. From the two
examined feet it classifies each foot's risk, applies patient-wide
high-risk/urgent overrides, derives an overall risk category and review
pathway, validates completeness, and raises flagged issues. It documents and
classifies an assessor's examination findings; it does not manage a wound.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API
crate, and the generated representations (XML, FHIR R5, protobuf, OpenAPI).
Out of scope: wound management/dressing selection, non-diabetic peripheral
neuropathy or arterial disease, paediatric scoring, hosted deployment,
authentication, multi-tenancy.

## 3. Data model

A single logical assessment record with a right-foot and a left-foot
examination block plus patient-wide risk factors. Fields default to `''`
(text/enum) or `null` (numeric/date/time) when unanswered.

**Assessment context.**

| Field | Type | Notes |
| --- | --- | --- |
| `assessedAt` | date | date the assessment was performed |
| `assessmentSetting` | enum | annual-review / foot-protection-clinic / hospital-admission / pre-discharge / other |

**Patient-wide risk factors.**

| Field | Type | Notes |
| --- | --- | --- |
| `diabetesType` | enum | type-1 / type-2 / other / unknown |
| `yearsSinceDiagnosis` | numeric | years since diabetes diagnosis |
| `onRenalReplacementTherapy` | enum | yes / no — automatic high-risk factor |
| `visualAcuityImpairment` | enum | yes / no |
| `selfCareAbility` | enum | independent / partial / unable |
| `footwearAppropriate` | enum | yes / no |

**Per-foot examination (repeated for `rightFoot` and `leftFoot`).**

| Field | Type | Notes |
| --- | --- | --- |
| `<foot>NeuropathyStatus` | enum | sensate / insensate / not-tested / '' |
| `<foot>PulsesStatus` | enum | normal / diminished / absent / not-tested / '' |
| `<foot>Deformity` | enum | yes / no / '' |
| `<foot>Callus` | enum | yes / no / '' |
| `<foot>SkinBreakdown` | enum | yes / no / '' |
| `<foot>ActiveUlcer` | enum | yes / no / '' |
| `<foot>UlcerSeverity` | enum | superficial / deep / infected / critical-ischaemia / '' — only meaningful when `<foot>ActiveUlcer` is `yes` |
| `<foot>PreviousUlcer` | enum | yes / no / '' — automatic high-risk factor |
| `<foot>PreviousAmputation` | enum | none / minor / major / '' — automatic high-risk factor |
| `<foot>SuspectedCharcot` | enum | yes / no / '' — automatic active-urgent override |

**Derived (never stored as input).** `rightFootRisk`, `leftFootRisk`,
`overallRisk`, `reviewPathway`, `reviewIntervalMonths`, `referral`,
`flaggedIssues[]`.

## 4. Grading / outcome algorithm

Pure function, no I/O. Risk severity ranks
`low < moderate < high < active-urgent`.

```
perFootRiskFactorCount(foot) = count of:
  foot.neuropathyStatus == 'insensate'
  foot.pulsesStatus in ('diminished', 'absent')
  foot.deformity == 'yes'
  foot.callus == 'yes' || foot.skinBreakdown == 'yes'   // combined as one factor

perFootBaseRisk(foot) =
  count == 0 -> 'low'
  count == 1 -> 'moderate'
  count >= 2 -> 'high'

perFootRisk(foot) =
  foot.activeUlcer == 'yes' || foot.suspectedCharcot == 'yes'            -> 'active-urgent'
  foot.previousUlcer == 'yes' || foot.previousAmputation != 'none'        -> max('high', perFootBaseRisk(foot))
  otherwise                                                               -> perFootBaseRisk(foot)

rightFootRisk = perFootRisk(rightFoot)
leftFootRisk  = perFootRisk(leftFoot)

worstFootRisk = max-by-severity(rightFootRisk, leftFootRisk)

overallRisk =
  worstFootRisk == 'active-urgent'                                       -> 'active-urgent'
  worstFootRisk == 'high' || onRenalReplacementTherapy == 'yes'          -> 'high'
  otherwise                                                              -> worstFootRisk

reviewPathway =
  overallRisk == 'active-urgent' -> 'urgent-mdt-referral'   (interval null)
  overallRisk == 'high'          -> 'high-risk-review'      (interval 1 if either foot active-adjacent high-risk-with-history else 3)
  overallRisk == 'moderate'      -> 'moderate-risk-review'  (interval 6)
  overallRisk == 'low'           -> 'annual-review'         (interval 12)

referral = reviewPathway == 'urgent-mdt-referral'  -> 'urgent-mdt'
         | reviewPathway == 'high-risk-review'     -> 'multidisciplinary-foot-team'
         | reviewPathway == 'moderate-risk-review' -> 'foot-protection-service'
         | otherwise                                -> 'none'
```

- Priority is by clinical urgency: active ulceration / suspected Charcot >
  previous ulceration or amputation or renal replacement therapy (high) >
  combined risk factors (high) > a single risk factor (moderate) > no risk
  factors (low). The most urgent applicable category wins, per foot and then
  overall.
- `reviewIntervalMonths` for `high-risk-review` is the tighter of the two
  NICE NG19-recommended high-risk intervals: 1 month when the triggering
  foot also carries a previous-ulcer or previous-amputation history, 3
  months otherwise (combined risk factors without a history).
- An ulcer's severity (`<foot>UlcerSeverity`) is recorded for clinical
  context and downstream triage; it does not itself change the
  `active-urgent` override, since any active ulcer already forces it.
- Missing a foot's neuropathy or pulses status (not tested) contributes
  nothing to that foot's risk-factor count and raises a data-completeness
  flag; the classification may understate risk.

## 5. Flagged issues (red flags)

Emitted independently of the pathway, each with a priority:

- **Active ulceration** (high) — either foot `activeUlcer == 'yes'`: urgent
  referral to the multidisciplinary foot team.
- **Suspected Charcot foot** (high) — either foot `suspectedCharcot ==
  'yes'`: urgent same/next-working-day referral; do not wait for imaging.
- **Critical limb ischaemia** (high) — either foot's `ulcerSeverity ==
  'critical-ischaemia'`: urgent vascular referral.
- **Previous major amputation** (high) — either foot
  `previousAmputation == 'major'`: high-risk regardless of current exam.
- **Renal replacement therapy** (high) — `onRenalReplacementTherapy ==
  'yes'`: automatic high-risk factor per NICE NG19.
- **Combined risk factors** (medium) — either foot's risk-factor count ≥ 2
  without an active ulcer: high risk from combination, review referral
  timing.
- **Footwear** (medium) — `footwearAppropriate == 'no'` and overall risk is
  `moderate` or above: refer to orthotics / footwear assessment.
- **Self-care** (medium) — `selfCareAbility != 'independent'` (and/or
  `visualAcuityImpairment == 'yes'`) without a carer/support noted in
  `clinicalContext`: arrange support for foot self-inspection.
- **Incomplete examination** (low) — either foot's `neuropathyStatus` or
  `pulsesStatus` is `not-tested` or `''`: classification may understate
  risk; complete the examination.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric,
date, and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  rightFootRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
  leftFootRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
  overallRisk: 'low' | 'moderate' | 'high' | 'active-urgent';
  reviewPathway:
    | 'urgent-mdt-referral' | 'high-risk-review'
    | 'moderate-risk-review' | 'annual-review';
  reviewIntervalMonths: 1 | 3 | 6 | 12 | null;
  referral: 'none' | 'foot-protection-service' | 'multidisciplinary-foot-team' | 'urgent-mdt';
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

- `bin/test-form diabetes-podiatry-assessment` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and
  unit-tested, covering every risk category boundary, every override
  (active ulcer, suspected Charcot, previous ulcer/amputation, renal
  replacement therapy), and mismatched feet.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA
Software and AI as a Medical Device. Form-specific classification is
recorded in [`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where
it differs from the baseline.

## 10. References

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form diabetes-podiatry-assessment
```
