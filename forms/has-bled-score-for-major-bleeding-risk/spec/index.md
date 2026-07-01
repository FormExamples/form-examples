# HAS-BLED Score for Major Bleeding Risk — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `has-bled-score-for-major-bleeding-risk`

## 1. Purpose

A bleeding-risk score for adults with atrial fibrillation (AF) on, or being
considered for, oral anticoagulation. It records nine clinical criteria
(H, A×2, S, B, L, E, D×2), scores each present criterion, and produces a total
HAS-BLED score of **0–9** with a risk band. A score of **≥ 3** flags higher
major-bleeding risk. This is **not** a contraindication to anticoagulation: it
prompts caution, more frequent review, and correction of modifiable factors, and
is interpreted alongside the CHA₂DS₂-VASc stroke-risk score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric scoring,
CHA₂DS₂-VASc computation (recorded as an optional context input only).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | cardiology / general-practice / anticoagulation-clinic / acute-medical / other |
| `anticoagulationStatus` | enum | on / considering |
| `chaDsVascScore` | numeric (0–9) | optional paired stroke-risk score |
| `patientIdentifier` | text | local identifier |
| `age` | numeric (years) | drives criterion E |
| `sex` | enum | patient sex |

**Criterion inputs (each yes/no unless noted).**

| Field | Type | Criterion | Points |
| --- | --- | --- | --- |
| `hypertensionUncontrolled` | enum (yes/no) | H — SBP > 160 mmHg | 1 |
| `abnormalRenalFunction` | enum (yes/no) | A — dialysis/transplant/creatinine ≥ 200 µmol/L | 1 |
| `abnormalLiverFunction` | enum (yes/no) | A — cirrhosis or bilirubin >2× ULN with transaminases >3× ULN | 1 |
| `strokeHistory` | enum (yes/no) | S — prior stroke | 1 |
| `bleedingHistory` | enum (yes/no) | B — prior major bleed, diathesis, or anaemia | 1 |
| `labileInr` | enum (yes/no) | L — unstable/high INR or TTR < 60% | 1 |
| `age` | numeric | E — age > 65 (derived, not a separate boolean) | 1 |
| `antiplateletOrNsaid` | enum (yes/no) | D — concomitant antiplatelets/NSAIDs | 1 |
| `alcoholUnitsPerWeek` | numeric | D — ≥ 8 units/week | 1 |

**Derived (never stored as input).** `hypertensionPoint`, `renalPoint`,
`liverPoint`, `strokePoint`, `bleedingPoint`, `labileInrPoint`, `elderlyPoint`,
`drugsPoint`, `alcoholPoint`, `hasBledScore`, `riskBand`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes 0 or 1; the elderly and alcohol
criteria are derived from numeric inputs:

```
hypertensionPoint = hypertensionUncontrolled == 'yes' ? 1 : 0
renalPoint        = abnormalRenalFunction    == 'yes' ? 1 : 0
liverPoint        = abnormalLiverFunction     == 'yes' ? 1 : 0
strokePoint       = strokeHistory             == 'yes' ? 1 : 0
bleedingPoint     = bleedingHistory           == 'yes' ? 1 : 0
labileInrPoint    = labileInr                 == 'yes' ? 1 : 0
elderlyPoint      = age != null && age > 65          ? 1 : 0
drugsPoint        = antiplateletOrNsaid       == 'yes' ? 1 : 0
alcoholPoint      = alcoholUnitsPerWeek != null && alcoholUnitsPerWeek >= 8 ? 1 : 0

hasBledScore = hypertensionPoint + renalPoint + liverPoint + strokePoint
             + bleedingPoint + labileInrPoint + elderlyPoint + drugsPoint
             + alcoholPoint                                    // 0..9
riskBand     = hasBledScore >= 3 ? 'high'
             : hasBledScore >= 1 ? 'moderate'
             : 'low'
```

- A missing numeric input (`age`, `alcoholUnitsPerWeek`) contributes 0 points for
  its criterion (treated as absent, not positive) and raises a data-completeness
  flag.
- Enum criteria treat any value other than `'yes'` (including `''`) as absent.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High bleeding risk** (high) — `hasBledScore >= 3`: higher estimated
  major-bleeding risk; not a contraindication to anticoagulation, but review more
  frequently and correct modifiable factors.
- **Modifiable: uncontrolled hypertension** (medium) — `hypertensionPoint == 1`:
  optimise blood-pressure control (target SBP ≤ 160 mmHg).
- **Modifiable: labile INR** (medium) — `labileInrPoint == 1`: improve INR
  stability or consider a DOAC.
- **Modifiable: antiplatelets/NSAIDs** (medium) — `drugsPoint == 1`: review the
  need for concomitant antiplatelet or NSAID therapy.
- **Modifiable: excess alcohol** (medium) — `alcoholPoint == 1`: advise reducing
  alcohol to < 8 units/week.
- **Incomplete assessment** (low) — any criterion input missing: score may
  understate risk; re-assess.

The four "modifiable" flags exist because HAS-BLED's chief purpose is to surface
correctable bleeding-risk factors rather than to gate anticoagulation.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  hypertensionPoint: 0 | 1;
  renalPoint: 0 | 1;
  liverPoint: 0 | 1;
  strokePoint: 0 | 1;
  bleedingPoint: 0 | 1;
  labileInrPoint: 0 | 1;
  elderlyPoint: 0 | 1;
  drugsPoint: 0 | 1;
  alcoholPoint: 0 | 1;
  hasBledScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  riskBand: 'low' | 'moderate' | 'high';
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

- `bin/test-form has-bled-score-for-major-bleeding-risk` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the age boundary (65/66), the alcohol boundary (7/8 units), the risk-band
  boundaries (0, 2/3), and the minimum and maximum totals (0 and 9).
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
bin/test-form has-bled-score-for-major-bleeding-risk
```
