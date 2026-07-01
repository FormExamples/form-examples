# Modified Early Warning Score (MEWS) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `modified-early-warning-score`

## 1. Purpose

A bedside aggregate track-and-trigger score for adult inpatients. It records
five physiological observations (systolic blood pressure, heart rate,
respiratory rate, temperature, AVPU level of consciousness), allocates each a
sub-score of 0–3, and produces an aggregate MEWS of 0–14 with a risk band. An
aggregate of **≥ 5**, or **any single parameter scoring 3**, triggers urgent
medical review and consideration of critical-care outreach. It is not a
diagnostic test.

MEWS predates and is superseded by NEWS2 (see sibling form
`national-early-warning-score-2`). Full design description:
[`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric or
pregnancy-specific scoring, and longitudinal trend storage beyond a single
observation record.

## 3. Data model

A single logical observation record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | nurse / healthcare-assistant / doctor / other |
| `observedAt` | timestamp | date and time of observation |
| `careSetting` | enum | acute-ward / admissions-unit / assessment-unit / other |
| `wardLocation` | text | ward or bed location |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Parameter inputs.**

| Field | Type | Parameter |
| --- | --- | --- |
| `systolicBloodPressure` | numeric (mmHg) | 1 — systolic BP |
| `heartRate` | numeric (bpm) | 2 — heart rate |
| `respiratoryRate` | numeric (breaths/min) | 3 — respiratory rate |
| `temperature` | numeric (°C) | 4 — temperature |
| `avpu` | enum (`alert`/`voice`/`pain`/`unresponsive`) | 5 — level of consciousness |

**Optional trend input.** `previousMewsScore` (numeric, nullable) — the
aggregate from the previous observation set, used only to compute a
deteriorating-trend flag; never used in the aggregate itself.

**Derived (never stored as input).** `systolicBloodPressurePoint`,
`heartRatePoint`, `respiratoryRatePoint`, `temperaturePoint`, `avpuPoint`,
`mewsScore`, `riskBand`, `singleParameterTrigger`, `firedParameters[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each parameter maps its measured value to a sub-score of
0–3 by the Subbe (2001) allocation table:

```
systolicBloodPressurePoint:
  <= 70            -> 3
  71..80           -> 2
  81..100          -> 1
  101..199         -> 0
  >= 200           -> 2
heartRatePoint:
  <= 40            -> 2
  41..50           -> 1
  51..100          -> 0
  101..110         -> 1
  111..129         -> 2
  >= 130           -> 3
respiratoryRatePoint:
  < 9              -> 2
  9..14            -> 0
  15..20           -> 1
  21..29           -> 2
  >= 30            -> 3
temperaturePoint:
  < 35.0           -> 2
  35.0..38.4       -> 0
  >= 38.5          -> 2
avpuPoint:
  alert            -> 0
  voice            -> 1
  pain             -> 2
  unresponsive     -> 3

mewsScore = systolicBloodPressurePoint + heartRatePoint + respiratoryRatePoint
          + temperaturePoint + avpuPoint                               // 0..14

riskBand = mewsScore >= 5 ? 'high'
         : mewsScore >= 2 ? 'medium'
         : 'low'

singleParameterTrigger = any parameter sub-score == 3
```

- A missing numeric input contributes 0 points for that parameter (treated as
  not scored, not normal) and raises a data-completeness flag; the aggregate can
  understate risk.
- `riskBand == 'high'` **or** `singleParameterTrigger == true` both indicate
  urgent medical review / critical-care outreach.

## 5. Flagged issues (red flags)

Emitted independently of the aggregate, each with a priority:

- **Aggregate escalation** (high) — `mewsScore >= 5`: high-risk aggregate;
  urgent medical review and consider critical-care outreach.
- **Single-parameter trigger** (high) — any parameter scores 3: critical
  single-axis derangement warrants urgent review regardless of aggregate.
- **Deteriorating trend** (high) — `previousMewsScore != null` and
  `mewsScore > previousMewsScore`: rising score across observation sets; escalate
  even within the same band.
- **Hypotension** (high) — `systolicBloodPressure <= 100`.
- **Reduced consciousness** (high) — `avpu` is `voice`, `pain`, or
  `unresponsive`.
- **Tachypnoea / bradypnoea** (medium) — `respiratoryRate >= 21` or `< 9`.
- **Tachycardia / bradycardia** (medium) — `heartRate >= 111` or `<= 40`.
- **Pyrexia / hypothermia** (medium) — `temperature >= 38.5` or `< 35.0`.
- **Incomplete observation** (low) — any of the five parameter inputs missing:
  aggregate may understate risk; re-observe.

## 6. Inputs and outputs

**Input.** A typed observation object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  systolicBloodPressurePoint: 0 | 1 | 2 | 3;
  heartRatePoint: 0 | 1 | 2 | 3;
  respiratoryRatePoint: 0 | 1 | 2 | 3;
  temperaturePoint: 0 | 1 | 2 | 3;
  avpuPoint: 0 | 1 | 2 | 3;
  mewsScore: number;              // 0..14
  riskBand: 'low' | 'medium' | 'high';
  singleParameterTrigger: boolean;
  firedParameters: FiredParameter[];
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

- `bin/test-form modified-early-warning-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  every band boundary in the allocation table (e.g. SBP 70/71, 80/81, 100/101,
  199/200; HR 40/41, 50/51, 100/101, 110/111, 129/130; RR 8/9, 14/15, 20/21,
  29/30; temperature 34.9/35.0, 38.4/38.5; each AVPU level) and the aggregate
  band edges (1/2, 4/5) plus the single-parameter=3 trigger.
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
bin/test-form modified-early-warning-score
```
