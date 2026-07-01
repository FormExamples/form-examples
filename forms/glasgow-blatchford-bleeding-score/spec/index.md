# Glasgow-Blatchford Bleeding Score (GBS) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `glasgow-blatchford-bleeding-score`

## 1. Purpose

A pre-endoscopy risk-stratification score for adults with suspected acute upper
gastrointestinal bleeding. It sums eight weighted admission parameters into a
total of **0–23** that predicts the need for clinical intervention (transfusion,
endoscopic therapy, interventional radiology, surgery) or death. A score of
**0** (or **≤ 1** by local policy) identifies very-low-risk patients suitable for
consideration of outpatient management; higher scores prompt admission and
endoscopy. It is a decision-support score, not a diagnosis, and does not replace
resuscitation of the unstable patient.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric scoring,
lower GI bleeding, and post-endoscopy Rockall scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / advanced-practitioner / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / acute-medical-unit / ward / other |
| `presentingComplaint` | text | haematemesis / coffee-ground / melaena / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | male / female — selects the haemoglobin band table |

**Parameter inputs.**

| Field | Type | Parameter |
| --- | --- | --- |
| `bloodUrea` | numeric (mmol/L) | 1 — blood urea |
| `haemoglobin` | numeric (g/L) | 2/3 — haemoglobin (sex-specific bands) |
| `systolicBloodPressure` | numeric (mmHg) | 4 — systolic BP |
| `pulse` | numeric (beats/min) | 5 — pulse |
| `melaenaPresent` | enum (yes/no) | 6 — melaena |
| `syncope` | enum (yes/no) | 7 — syncope |
| `hepaticDisease` | enum (yes/no) | 8 — hepatic disease |
| `cardiacFailure` | enum (yes/no) | 9 — cardiac failure |

**Derived (never stored as input).** `bloodUreaPoints`, `haemoglobinPoints`,
`systolicBloodPressurePoints`, `pulsePoint`, `melaenaPoint`, `syncopePoint`,
`hepaticDiseasePoint`, `cardiacFailurePoint`, `gbsScore`, `riskBand`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each parameter contributes points by band; the total is
their sum (0–23).

```
bloodUreaPoints =
  bloodUrea == null            ? 0
  : bloodUrea >= 25.0          ? 6
  : bloodUrea >= 10.0          ? 4
  : bloodUrea >= 8.0           ? 3
  : bloodUrea >= 6.5           ? 2
  :                              0

haemoglobinPoints (sex == 'male') =
  haemoglobin == null          ? 0
  : haemoglobin < 100          ? 6
  : haemoglobin < 120          ? 3
  : haemoglobin < 130          ? 1
  :                              0
haemoglobinPoints (sex == 'female') =
  haemoglobin == null          ? 0
  : haemoglobin < 100          ? 6
  : haemoglobin < 120          ? 1
  :                              0
  // sex unknown/'' → use the female (more conservative, fewer points) table
  // and raise a data-completeness flag

systolicBloodPressurePoints =
  systolicBloodPressure == null ? 0
  : systolicBloodPressure < 90   ? 3
  : systolicBloodPressure < 100  ? 2
  : systolicBloodPressure < 110  ? 1
  :                                0

pulsePoint           = pulse != null && pulse >= 100 ? 1 : 0
melaenaPoint         = melaenaPresent == 'yes'       ? 1 : 0
syncopePoint         = syncope == 'yes'              ? 2 : 0
hepaticDiseasePoint  = hepaticDisease == 'yes'       ? 2 : 0
cardiacFailurePoint  = cardiacFailure == 'yes'       ? 2 : 0

gbsScore = bloodUreaPoints + haemoglobinPoints + systolicBloodPressurePoints
         + pulsePoint + melaenaPoint + syncopePoint + hepaticDiseasePoint
         + cardiacFailurePoint            // 0..23

riskBand =
  gbsScore == 0  ? 'very-low'
  : gbsScore <= 5 ? 'low-moderate'
  :                 'high'
```

- A missing numeric input contributes 0 points for that parameter and raises a
  data-completeness flag — the score can understate risk.
- When `sex` is unknown, the female haemoglobin table is used (it never awards
  the men-only 120–129 point) and a data-completeness flag is raised.
- The very-low-risk discharge threshold is `gbsScore == 0`; local policy may
  extend the very-low band to `≤ 1`. The band boundaries above encode the
  default (`0` → `very-low`).

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High-risk bleed** (high) — `gbsScore >= 6`: high likelihood of intervention
  or transfusion; admit and arrange urgent endoscopy.
- **Shock / hypotension** (high) — `systolicBloodPressure < 90` or
  `pulse >= 100`: haemodynamic instability; resuscitate.
- **Severe anaemia** (high) — `haemoglobin < 100`: consider transfusion.
- **Syncope** (medium) — `syncope == 'yes'`: marker of significant blood loss.
- **Very low risk** (info) — `gbsScore == 0` (or `≤ 1` by policy): consider
  outpatient management / discharge; confirm no other admission indication.
- **Incomplete assessment** (low) — any parameter input missing (including
  unknown sex): score may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  bloodUreaPoints: 0 | 2 | 3 | 4 | 6;
  haemoglobinPoints: 0 | 1 | 3 | 6;
  systolicBloodPressurePoints: 0 | 1 | 2 | 3;
  pulsePoint: 0 | 1;
  melaenaPoint: 0 | 1;
  syncopePoint: 0 | 2;
  hepaticDiseasePoint: 0 | 2;
  cardiacFailurePoint: 0 | 2;
  gbsScore: number; // 0..23
  riskBand: 'very-low' | 'low-moderate' | 'high';
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

- `bin/test-form glasgow-blatchford-bleeding-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  every band boundary (urea 6.4/6.5, 7.9/8.0, 9.9/10.0, 24.9/25.0; Hb 99/100,
  119/120, 129/130 for both sexes; SBP 89/90, 99/100, 109/110; pulse 99/100) and
  the total endpoints 0 and 23.
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
bin/test-form glasgow-blatchford-bleeding-score
```
