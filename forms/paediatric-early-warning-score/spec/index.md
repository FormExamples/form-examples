# Paediatric Early Warning Score (PEWS) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `paediatric-early-warning-score`

## 1. Purpose

An age-banded track-and-trigger early-warning tool for children. It records
physiological observations across three domains (respiratory, cardiovascular,
behaviour / neurological), scores each parameter **0–3** against the **normal
range for the child's age band**, sums an aggregate total, and maps that total —
together with single-parameter and concern override triggers — onto an
**escalation band** with a recommended review timeframe. It is a screening and
monitoring aid, not a diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, neonatal-intensive-care
scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | nurse / healthcare-assistant / doctor / other |
| `observedAt` | timestamp | date and time of the observation set |
| `careSetting` | enum | ward / childrens-assessment-unit / emergency-department / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | `neonate` / `infant` / `young-child` / `child` / `adolescent` |
| `sex` | enum | patient sex |

**Age bands (`ageBand`).** The age band is selected first and drives the normal
ranges for the rate parameters. Enum values map to:

| Value | Age range | Normal RR (breaths/min) | Normal HR (beats/min) |
| --- | --- | --- | --- |
| `neonate` | 0–<1 month | 40–60 | 110–160 |
| `infant` | 1–11 months | 30–50 | 100–160 |
| `young-child` | 1–4 years | 20–40 | 90–140 |
| `child` | 5–11 years | 18–30 | 70–120 |
| `adolescent` | ≥ 12 years | 12–20 | 60–100 |

**Parameter inputs.**

| Field | Type | Domain / parameter |
| --- | --- | --- |
| `respiratoryRate` | numeric (breaths/min) | respiratory — rate (scored vs age band) |
| `respiratoryEffort` | enum (none/mild/moderate/severe) | respiratory — effort / recession |
| `oxygenSaturation` | numeric (%) | respiratory — SpO₂ |
| `supplementalOxygen` | enum (room-air/low-flow/high-flow) | respiratory — oxygen |
| `heartRate` | numeric (beats/min) | cardiovascular — rate (scored vs age band) |
| `capillaryRefill` | enum (under-2s/2-3s/3-4s/over-4s) | cardiovascular — refill / colour |
| `consciousness` | enum (alert/voice/pain/unresponsive) | behaviour — ACVPU |
| `nurseConcern` | enum (yes/no) | override trigger |
| `parentConcern` | enum (yes/no) | override trigger |

**Derived (never stored as input).** Per-parameter 0–3 sub-scores
(`respiratoryRateScore`, `respiratoryEffortScore`, `oxygenSaturationScore`,
`supplementalOxygenScore`, `heartRateScore`, `capillaryRefillScore`,
`consciousnessScore`), `aggregateScore`, `escalationBand`, `maxParameterScore`,
`firedTriggers[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O.

1. **Resolve the age-band normal range** for `respiratoryRate` and `heartRate`
   from `ageBand`. A value inside the range scores 0; increasing deviation above
   or below the range scores 1, 2, then 3 (grossly abnormal / apnoea).
2. **Score the remaining parameters 0–3** from their enum / numeric value:
   - `respiratoryEffort`: none 0, mild 1, moderate 2, severe/grunting 3.
   - `oxygenSaturation`: ≥ 96 → 0, 94–95 → 1, 92–93 → 2, < 92 → 3.
   - `supplementalOxygen`: room-air 0, low-flow 1, high-flow 3.
   - `capillaryRefill`: <2s 0, 2–3s 1, 3–4s 2, >4s 3.
   - `consciousness` (ACVPU): alert 0, voice 1, pain 2, unresponsive 3.
3. **Aggregate.**
   ```
   aggregateScore  = sum of all seven parameter sub-scores
   maxParameterScore = max of the seven sub-scores
   escalationBand  = aggregateScore >= 6 ? 'high'
                   : aggregateScore >= 4 ? 'medium'
                   : aggregateScore >= 2 ? 'low'
                   :                       'routine'
   ```
4. **Apply override triggers** (do not change `aggregateScore`, but raise the
   effective escalation and emit flags):
   - `maxParameterScore == 3` → at least `medium` escalation (urgent review).
   - `nurseConcern == 'yes'` → escalation trigger.
   - `parentConcern == 'yes'` → escalation trigger.

- A missing numeric input contributes 0 for its parameter (absent, not
  abnormal) and raises a data-completeness flag — the score can understate risk.
- If `ageBand` is unset, rate parameters cannot be scored: they contribute 0 and
  raise a data-completeness flag.

## 5. Flagged issues (red flags)

Emitted independently of the aggregate, each with a priority:

- **High escalation** (high) — `aggregateScore >= 6`: immediate senior review;
  consider critical-care outreach.
- **Single parameter critical** (high) — `maxParameterScore == 3`: a single
  parameter is grossly abnormal; urgent review regardless of total.
- **Medium escalation** (high) — `aggregateScore` 4–5: urgent nurse-in-charge and
  doctor review within 30 minutes.
- **Parent / carer concern** (high) — `parentConcern == 'yes'`: documented family
  concern is a recognised predictor of deterioration; escalate and act.
- **Nurse / staff concern** (high) — `nurseConcern == 'yes'`: documented staff
  concern; escalate.
- **Deteriorating trend** (medium) — `aggregateScore` 2–3: increase observation
  frequency and review within 1 hour; compare against the previous score.
- **Incomplete assessment** (low) — any parameter input (or `ageBand`) missing:
  score may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  respiratoryRateScore: 0 | 1 | 2 | 3;
  respiratoryEffortScore: 0 | 1 | 2 | 3;
  oxygenSaturationScore: 0 | 1 | 2 | 3;
  supplementalOxygenScore: 0 | 1 | 2 | 3;
  heartRateScore: 0 | 1 | 2 | 3;
  capillaryRefillScore: 0 | 1 | 2 | 3;
  consciousnessScore: 0 | 1 | 2 | 3;
  aggregateScore: number;                 // 0..21
  maxParameterScore: 0 | 1 | 2 | 3;
  escalationBand: 'routine' | 'low' | 'medium' | 'high';
  firedTriggers: FiredTrigger[];
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

- `bin/test-form paediatric-early-warning-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each age band's rate boundaries, every parameter's 0–3 thresholds, the
  single-parameter=3 override, the nurse / parent concern triggers, and each
  escalation band boundary.
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
bin/test-form paediatric-early-warning-score
```
