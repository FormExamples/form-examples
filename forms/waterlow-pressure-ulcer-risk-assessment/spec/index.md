# Waterlow Pressure Ulcer Risk Assessment — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `waterlow-pressure-ulcer-risk-assessment`

## 1. Purpose

A bedside screening tool that estimates an adult patient's risk of developing a
pressure ulcer. It records weighted risk categories (build / weight for height,
skin type, sex and age, continence, mobility) plus four special-risk groups
(tissue malnutrition, neurological deficit, major surgery or trauma, medication),
**sums** all points into a Waterlow total, and places the patient in a risk band.
A **higher total means higher risk** — the band drives escalation of
pressure-relieving support surfaces, repositioning, and skin care. It is a
screening prompt, not a diagnosis or staging of existing pressure damage.

Note: this is a **summed weighted score** (higher = worse), the inverse of the
Braden Scale used in the [integumentary assessment](../../integumentary-assessment/index.md),
where lower = worse.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric scoring, and
existing-ulcer staging.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `nurseName` | text | assessing nurse |
| `nurseRole` | enum | registered-nurse / healthcare-assistant / tissue-viability / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | acute-ward / community / care-home / hospice / other |
| `assessmentReason` | enum | admission / routine / change-in-condition |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | 14–49 / 50–64 / 65–74 / 75–80 / 81+ |
| `sex` | enum | male / female |

**Core category inputs.**

| Field | Type | Category |
| --- | --- | --- |
| `buildWeightForHeight` | enum | average / above-average / obese / below-average |
| `skinType` | enum | healthy / tissue-paper / dry / oedematous / clammy-pyrexial / discoloured / broken |
| `continence` | enum | complete-catheterized / incontinent-urine / incontinent-faeces / doubly-incontinent |
| `mobility` | enum | fully-mobile / restless / apathetic / restricted / bedbound / chairbound |

**Special-risk inputs.**

| Field | Type | Group |
| --- | --- | --- |
| `tissueMalnutrition` | enum | none / smoking / anaemia / peripheral-vascular-disease / single-organ-failure / multiple-organ-failure / terminal-cachexia |
| `neurologicalDeficit` | enum | none / mild / moderate / severe |
| `majorSurgeryTrauma` | enum | none / orthopaedic-spinal / on-table-over-2h / on-table-over-6h |
| `medication` | enum | none / high-dose-steroids-cytotoxics-anti-inflammatory |
| `existingPressureDamage` | enum | no / yes |

**Derived (never stored as input).** `buildPoints`, `skinPoints`, `sexPoints`,
`agePoints`, `continencePoints`, `mobilityPoints`, `tissueMalnutritionPoints`,
`neurologicalDeficitPoints`, `majorSurgeryTraumaPoints`, `medicationPoints`,
`waterlowScore`, `riskBand`, `contributingCategories[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each core category maps its selected enum to points; the
sex-and-age category adds `sexPoints + agePoints`; each special-risk group maps
its highest applicable enum to points. All contributions are **summed**.

```
buildPoints        = { average:0, above-average:1, obese:2, below-average:3 }[buildWeightForHeight]
skinPoints         = { healthy:0, tissue-paper:1, dry:1, oedematous:1, clammy-pyrexial:1,
                       discoloured:2, broken:3 }[skinType]
sexPoints          = { male:1, female:2 }[sex]
agePoints          = { 14-49:1, 50-64:2, 65-74:3, 75-80:4, 81+:5 }[ageBand]
continencePoints   = { complete-catheterised:0, incontinent-urine:1,
                       incontinent-faeces:2, doubly-incontinent:3 }[continence]
mobilityPoints     = { fully-mobile:0, restless:1, apathetic:2, restricted:3,
                       bedbound:4, chairbound:5 }[mobility]

tissueMalnutritionPoints = { none:0, smoking:1, anaemia:2, peripheral-vascular-disease:5,
                             single-organ-failure:5, multiple-organ-failure:8,
                             terminal-cachexia:8 }[tissueMalnutrition]
neurologicalDeficitPoints = { none:0, mild:4, moderate:5, severe:6 }[neurologicalDeficit]
majorSurgeryTraumaPoints  = { none:0, orthopaedic-spinal:5, on-table-over-2h:5,
                              on-table-over-6h:8 }[majorSurgeryTrauma]
medicationPoints          = { none:0, high-dose-steroids-cytotoxics-anti-inflammatory:4 }[medication]

waterlowScore = buildPoints + skinPoints + sexPoints + agePoints + continencePoints
              + mobilityPoints + tissueMalnutritionPoints + neurologicalDeficitPoints
              + majorSurgeryTraumaPoints + medicationPoints

riskBand = waterlowScore >= 20 ? 'very-high'
         : waterlowScore >= 15 ? 'high'
         : waterlowScore >= 10 ? 'at-risk'
         :                       'low'
```

- An unanswered enum defaults to `''`, contributing 0 points for that category
  and raising a data-completeness flag; the total can then understate risk.
- `contributingCategories[]` lists each category that contributed > 0 points,
  with its label and point value, for display in the summary.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Very high risk** (high) — `waterlowScore >= 20`: institute high-specification
  dynamic support surface, frequent repositioning, urgent tissue-viability review.
- **High risk** (high) — `15 <= waterlowScore < 20`: alternating-pressure support
  surface, increased repositioning, tissue-viability referral.
- **At risk** (medium) — `10 <= waterlowScore < 15`: pressure-redistributing foam
  mattress and cushion, documented repositioning schedule.
- **Existing pressure damage** (high) — `existingPressureDamage == 'yes'` or
  `skinType` is `discoloured` / `broken`: skin already compromised; grade and
  treat the ulcer, do not rely on prevention alone.
- **Multiple special risk factors** (medium) — two or more of tissue
  malnutrition, neurological deficit, major surgery/trauma, medication contribute
  points: compounded risk; treat reversible factors.
- **Incomplete assessment** (low) — any core category input missing: score may
  understate risk; complete and re-score.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  buildPoints: number;
  skinPoints: number;
  sexPoints: number;
  agePoints: number;
  continencePoints: number;
  mobilityPoints: number;
  tissueMalnutritionPoints: number;
  neurologicalDeficitPoints: number;
  majorSurgeryTraumaPoints: number;
  medicationPoints: number;
  waterlowScore: number;
  riskBand: 'low' | 'at-risk' | 'high' | 'very-high';
  contributingCategories: ContributingCategory[];
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

- `bin/test-form waterlow-pressure-ulcer-risk-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each band boundary (9/10, 14/15, 19/20) and each category's point mapping.
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
bin/test-form waterlow-pressure-ulcer-risk-assessment
```
