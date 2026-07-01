# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `alcohol-use-disorders-identification-test-consumption`

## 1. Purpose

A brief three-item alcohol screen for adults. It records the three consumption
items of the AUDIT (frequency of drinking, typical quantity in UK units,
frequency of heavy episodic drinking), scores each 0–4, and produces a total
AUDIT-C score of 0–12 with a risk band. A total of **≥ 5** is a positive screen
that prompts a full 10-item AUDIT and a brief intervention. It is not a
diagnostic test for alcohol dependence.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, the full 10-item AUDIT,
and withdrawal scoring (CIWA-Ar).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | gp / nurse / healthcare-assistant / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | primary-care / emergency-department / health-check / inpatient / other |
| `administrationMode` | enum | self-completed / interview |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex (selects the Q3 heavy-episode threshold: ≥ 6 units female, ≥ 8 units male) |

**Item inputs.** Each is an integer 0–4 (the chosen response's point value), or
`null` when unanswered.

| Field | Type | Item |
| --- | --- | --- |
| `frequencyOfDrinking` | numeric (0–4) | Q1 — how often you drink |
| `typicalQuantity` | numeric (0–4) | Q2 — units on a typical drinking day |
| `heavyEpisodeFrequency` | numeric (0–4) | Q3 — frequency of ≥ 6/≥ 8 units in one session |

**Derived (never stored as input).** `frequencyOfDrinkingPoint`,
`typicalQuantityPoint`, `heavyEpisodeFrequencyPoint`, `auditcScore`, `riskBand`,
`firedItems[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each item contributes its own 0–4 point value:

```
frequencyOfDrinkingPoint   = frequencyOfDrinking   != null ? frequencyOfDrinking   : 0
typicalQuantityPoint       = typicalQuantity       != null ? typicalQuantity       : 0
heavyEpisodeFrequencyPoint = heavyEpisodeFrequency != null ? heavyEpisodeFrequency : 0

auditcScore = frequencyOfDrinkingPoint + typicalQuantityPoint + heavyEpisodeFrequencyPoint  // 0..12

riskBand =
    auditcScore >= 11 ? 'possible-dependence'
  : auditcScore >=  8 ? 'higher'
  : auditcScore >=  5 ? 'increasing'
  :                     'lower'
```

- The positive-screen threshold is `auditcScore >= 5` (UK default cut for both
  sexes). The optional sex-specific cut (≥ 4 for women) is recorded in
  §5 as an additional flag, not applied to the default band.
- A missing item input contributes 0 points for that item and raises a
  data-completeness flag — the total can understate risk.
- If Q1 = 0 (Never) a lifetime abstainer would answer 0 throughout; the engine
  does not special-case this beyond the additive sum.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Positive screen** (high) — `auditcScore >= 5`: increasing- or higher-risk
  drinking; complete the full 10-item AUDIT and deliver a brief intervention.
- **Possible dependence** (high) — `auditcScore >= 11`: complete the full AUDIT;
  consider referral to specialist alcohol services.
- **Heavy episodic drinking** (medium) — `heavyEpisodeFrequency >= 3` (weekly or
  more): binge pattern; advise on single-session harm.
- **Sex-specific low-cut positive** (low) — `sex == 'female'` and
  `auditcScore == 4`: below the default cut but at or above the female-specific
  cut; consider brief advice.
- **Incomplete assessment** (low) — any of the three item inputs missing: score
  may understate risk; re-administer.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  frequencyOfDrinkingPoint: 0 | 1 | 2 | 3 | 4;
  typicalQuantityPoint: 0 | 1 | 2 | 3 | 4;
  heavyEpisodeFrequencyPoint: 0 | 1 | 2 | 3 | 4;
  auditcScore: number; // 0..12
  riskBand: 'lower' | 'increasing' | 'higher' | 'possible-dependence';
  firedItems: FiredItem[];
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

- `bin/test-form alcohol-use-disorders-identification-test-consumption` exits
  cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the positive-screen boundary (total 4/5), every band boundary (5, 8, 11), and
  the minimum and maximum totals (0 and 12).
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
bin/test-form alcohol-use-disorders-identification-test-consumption
```
