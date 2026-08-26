# Apgar Score — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `apgar-score`

## 1. Purpose

A rapid assessment of a newborn's condition in the first minutes after birth. It
records five signs (Appearance, Pulse, Grimace, Activity, Respiration), each
scored 0, 1, or 2, and sums a total of **0–10** at each of several timepoints
(**1 minute**, **5 minutes**, and — when the 5-minute total is below 7 —
**10 minutes** and beyond). Each total maps to a band (7–10 reassuring, 4–6
moderately low, 0–3 low), and the trend across timepoints is reported. It
describes condition and response to resuscitation; it is not a prediction of
long-term outcome.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, outcome prediction,
resuscitation-algorithm guidance.

## 3. Data model

A single logical assessment record holds birth context, newborn identification,
resuscitation notes, and a **repeated set of five-sign scores, one per
timepoint**. Fields default to `''` (text/enum) or `null` (numeric/date/time)
when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | attending clinician |
| `clinicianRole` | enum | midwife / obstetrician / neonatologist / neonatal-nurse / paediatrician / other |
| `bornAt` | timestamp | date and time of birth |
| `careSetting` | enum | delivery-room / theatre / birth-centre / home / neonatal-unit / other |
| `gestationalAgeWeeks` | numeric (weeks) | gestation at birth |
| `modeOfDelivery` | enum | vaginal / assisted / caesarean / other |
| `newbornIdentifier` | text | local identifier |
| `sex` | enum | newborn sex |
| `birthOrder` | numeric | position for multiple births (1 for singleton) |
| `resuscitationMeasures` | text | measures given (drying, stimulation, oxygen, IPPV, chest compressions, etc.) |
| `clinicianNote` | text | free-text clinical note |

**Timepoint scores (repeated).** One record per timepoint; the `1` and `5`
minute timepoints are always present, `10` (and further) is conditional on the
5-minute total being below 7.

| Field | Type | Sign |
| --- | --- | --- |
| `timepointMinutes` | numeric (1, 5, 10, …) | which timepoint |
| `appearance` | enum score (0/1/2) | A — skin colour |
| `pulse` | enum score (0/1/2) | P — heart rate |
| `grimace` | enum score (0/1/2) | G — reflex irritability |
| `activity` | enum score (0/1/2) | A — muscle tone |
| `respiration` | enum score (0/1/2) | R — respiration |

**Derived (never stored as input).** Per timepoint: `total` (0–10), `band`
(`reassuring` / `moderately-low` / `low`). Across timepoints: `trend`
(`improving` / `static` / `falling` / `insufficient`), `firedSigns[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. For each timepoint, sum the five sign scores:

```
total(t) = appearance(t) + pulse(t) + grimace(t) + activity(t) + respiration(t)   // 0..10

band(t)  = total(t) >= 7 ? 'reassuring'
         : total(t) >= 4 ? 'moderately-low'
         :                 'low'
```

Trend compares consecutive available timepoints (1 → 5 → 10 …):

```
trend = fewer than 2 scored timepoints            -> 'insufficient'
      | latest total > previous total             -> 'improving'
      | latest total < previous total             -> 'falling'
      | otherwise                                  -> 'static'
```

- Each sign is an explicit 0/1/2 selection; a missing sign contributes 0 to that
  timepoint's total and raises a data-completeness flag.
- The 10-minute (and later) timepoint is expected — not optional — whenever the
  5-minute total is below 7.

## 5. Flagged issues (red flags)

Emitted independently of the totals, each with a priority:

- **Resuscitation required** (high) — any timepoint total ≤ 3: newborn severely
  depressed; commence active resuscitation and obtain neonatal support.
- **Continue scoring** (high) — 5-minute total < 7: repeat scoring at 10 minutes
  (and every 5 minutes thereafter) until the newborn stabilizes.
- **Falling trend** (high) — a later total is lower than an earlier total: the
  newborn is deteriorating; escalate.
- **Support and stimulation** (medium) — any timepoint total 4–6: provide
  support, stimulation, and oxygen as indicated; reassess.
- **Missing 10-minute score** (medium) — 5-minute total < 7 but no 10-minute
  timepoint recorded: the required follow-up score is absent.
- **Incomplete assessment** (low) — any of the five signs missing at a scored
  timepoint: total may understate depression; complete the record.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`, including the repeated per-timepoint sign scores. Unanswered text/enum
fields default to `''`; unanswered numeric, date, and time fields default to
`null`.

**Output.** A grading object emitted by the engine:

```ts
{
  timepoints: Array<{
    timepointMinutes: number;
    total: number;                                   // 0..10
    band: 'reassuring' | 'moderately-low' | 'low';
  }>;
  trend: 'improving' | 'static' | 'falling' | 'insufficient';
  firedSigns: FiredSign[];
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

- `bin/test-form apgar-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each band boundary (totals 3/4 and 6/7), every trend direction, and the
  conditional 10-minute rule.
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
bin/test-form apgar-score
```
</content>
