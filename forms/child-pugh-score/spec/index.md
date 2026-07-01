# Child-Pugh Score (Child-Turcotte-Pugh) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `child-pugh-score`

## 1. Purpose

A prognostic score for the severity of chronic liver disease (cirrhosis). It
grades five parameters (total bilirubin, serum albumin, INR or prothrombin time,
ascites, hepatic encephalopathy) on a 1-to-3 scale, sums a total of 5-15, and
assigns a class (A 5-6, B 7-9, C 10-15) mapped to one- and two-year survival and
peri-operative mortality risk. It supports prognosis, transplant assessment, and
surgical-risk stratification; it is not an organ-allocation priority score
(MELD / UKELD serve that role).

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, MELD/UKELD allocation,
paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | hepatologist / surgeon / anaesthetist / physician / nurse / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | hepatology-clinic / ward / pre-operative / intensive-care / other |
| `aetiology` | enum | alcohol / viral-hepatitis / nafld / autoimmune / cholestatic / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Parameter inputs.**

| Field | Type | Parameter |
| --- | --- | --- |
| `totalBilirubin` | numeric (µmol/L) | 1 — total bilirubin |
| `serumAlbumin` | numeric (g/L) | 2 — serum albumin |
| `inr` | numeric (ratio) | 3 — coagulation (INR) |
| `prothrombinTimeProlongation` | numeric (seconds) | 3 — coagulation (PT fallback when INR unavailable) |
| `ascites` | enum (none / mild / moderate-to-severe) | 4 — ascites |
| `encephalopathy` | enum (none / grade-1-2 / grade-3-4) | 5 — hepatic encephalopathy |

**Derived (never stored as input).** `bilirubinPoint`, `albuminPoint`,
`coagulationPoint`, `ascitesPoint`, `encephalopathyPoint`, `childPughScore`,
`childPughClass`, `oneYearSurvival`, `twoYearSurvival`, `surgicalRisk`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each parameter maps to 1, 2, or 3 points:

```
bilirubinPoint      = totalBilirubin <  34   ? 1 : totalBilirubin <=  50   ? 2 : 3   // µmol/L
albuminPoint        = serumAlbumin   >  35   ? 1 : serumAlbumin   >=  28   ? 2 : 3   // g/L
coagulationPoint    = inr            <  1.7  ? 1 : inr            <=  2.3  ? 2 : 3   // INR
                      // PT-prolongation fallback: < 4 s → 1, 4-6 s → 2, > 6 s → 3
ascitesPoint        = ascites == 'none'  ? 1 : ascites == 'mild'      ? 2 : 3
encephalopathyPoint = encephalopathy == 'none' ? 1 : encephalopathy == 'grade-1-2' ? 2 : 3

childPughScore = bilirubinPoint + albuminPoint + coagulationPoint
               + ascitesPoint + encephalopathyPoint                                 // 5..15

childPughClass = childPughScore <= 6 ? 'A' : childPughScore <= 9 ? 'B' : 'C'
```

Class banding also fixes the prognostic estimates:

| Class | Score | `oneYearSurvival` | `twoYearSurvival` | `surgicalRisk` |
| --- | --- | --- | --- | --- |
| A | 5-6 | ~100% | ~85% | low |
| B | 7-9 | ~80% | ~60% | moderate |
| C | 10-15 | ~45% | ~35% | high |

- INR is preferred; when only prothrombin-time prolongation (seconds) is
  recorded, the coagulation point uses the < 4 / 4-6 / > 6 second bands.
- A parameter with no input cannot be scored; the engine computes a partial total
  over the answered parameters and raises a data-completeness flag. A total is
  only clinically valid once all five parameters are answered.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Decompensated cirrhosis** (high) — `childPughClass == 'C'`: poor prognosis;
  review goals of care.
- **Transplant consideration** (high) — `childPughClass == 'C'`: refer for
  transplant assessment where appropriate.
- **High surgical risk** (high) — `childPughClass == 'C'`; **moderate surgical
  risk** (medium) — `childPughClass == 'B'`: elective surgery carries raised
  peri-operative mortality.
- **Hepatic encephalopathy** (high) — `encephalopathyPoint >= 2`: overt
  encephalopathy present.
- **Refractory ascites** (high) — `ascitesPoint == 3`: moderate-to-severe /
  diuretic-refractory ascites.
- **Severe coagulopathy** (medium) — `coagulationPoint == 3`: markedly prolonged
  INR / prothrombin time.
- **Incomplete assessment** (low) — any of the five parameter inputs missing:
  the score and class are provisional; complete all parameters.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  bilirubinPoint: 1 | 2 | 3;
  albuminPoint: 1 | 2 | 3;
  coagulationPoint: 1 | 2 | 3;
  ascitesPoint: 1 | 2 | 3;
  encephalopathyPoint: 1 | 2 | 3;
  childPughScore: number;              // 5..15
  childPughClass: 'A' | 'B' | 'C';
  oneYearSurvival: string;
  twoYearSurvival: string;
  surgicalRisk: 'low' | 'moderate' | 'high';
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

- `bin/test-form child-pugh-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each threshold boundary (bilirubin 34/50, albumin 28/35, INR 1.7/2.3), each
  ordinal grade for ascites and encephalopathy, and every class boundary (6/7,
  9/10).
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
bin/test-form child-pugh-score
```
