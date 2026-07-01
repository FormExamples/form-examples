# Emergency Department Triage Note — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `emergency-department-triage-note`

## 1. Purpose

A first-contact ED triage assessment. It records arrival, presenting complaint,
brief history, triage vital signs, and a pain score, then **classifies** the
patient into one of the five Manchester Triage System (MTS) priority levels,
each with a fixed **target time** to first clinical assessment. It computes a
supporting NEWS2 aggregate and raises red-flag issues. It is a prioritisation
tool, not a diagnosis or a numeric additive score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, disposition/treatment
decisions, paediatric early-warning scoring (PEWS).

## 3. Data model

A single logical triage record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and arrival.**

| Field | Type | Notes |
| --- | --- | --- |
| `nurseName` | text | triage nurse |
| `triagedAt` | timestamp | date and time of triage |
| `careSetting` | enum | emergency-department / urgent-treatment-centre / minor-injuries-unit |
| `arrivalMode` | enum | walk-in / ambulance / other |
| `arrivedAt` | timestamp | time of arrival |
| `referralSource` | text | self / GP / ambulance service / other |

**Identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | paediatric / adult / older-adult age band |
| `sex` | enum | patient sex |

**Presenting complaint.**

| Field | Type | Notes |
| --- | --- | --- |
| `presentingComplaint` | text | chief complaint |
| `briefHistory` | text | relevant history |
| `symptomOnset` | text | onset timing |

**Vital signs (NEWS2 inputs).**

| Field | Type | Notes |
| --- | --- | --- |
| `respiratoryRate` | numeric (breaths/min) | NEWS2 |
| `oxygenSaturation` | numeric (% SpO₂) | NEWS2 (scale 1) |
| `oxygenSupplemental` | enum (yes/no) | NEWS2 +2 when yes |
| `systolicBloodPressure` | numeric (mmHg) | NEWS2 |
| `pulse` | numeric (bpm) | NEWS2 |
| `temperature` | numeric (°C) | NEWS2 |
| `consciousness` | enum (A/V/P/U) | NEWS2 (alert = 0; V/P/U = 3) |
| `glasgowComaScale` | numeric (3–15) | optional supporting disability finding |
| `painScore` | numeric (0–10) | pain discriminator |

**Discriminator flags (each enum yes/no).** `airwayThreat`, `breathingInadequate`,
`circulationShock`, `haemorrhageMajor`, `consciousnessReduced`, `seizureActive`,
`focalNeurology`, `sepsisFeatures`, `chestPainCardiac`, `strokeFeatures`,
`paediatricRedFlag`.

**Derived (never stored as input).** `news2Total`, `news2AnyParameterThree`,
`firedDiscriminators[]`, `priorityLevel`, `priorityColour`, `priorityName`,
`targetMinutes`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. The engine does **not** sum a total. It selects the most
urgent MTS level justified by the findings.

1. **Evaluate discriminators.** Each discriminator flag maps to a minimum MTS
   level:
   - Level 1 (Immediate): `airwayThreat`, `breathingInadequate` (severe),
     `circulationShock`, `haemorrhageMajor` (catastrophic), `consciousness` U,
     `seizureActive`.
   - Level 2 (Very urgent): `consciousnessReduced` (V/P), `focalNeurology`,
     `strokeFeatures`, `chestPainCardiac`, `sepsisFeatures`,
     `paediatricRedFlag`, `painScore ≥ 7`, `oxygenSaturation < 92`.
   - Level 3 (Urgent): moderate `painScore` 4–6, moderate physiological
     derangement.
   - Level 4 (Standard) / Level 5 (Non-urgent): default when no higher
     discriminator fires; a fully normal presentation with minimal complaint may
     be Level 5.

2. **Compute NEWS2.** Aggregate the vital-sign sub-scores per RCP NEWS2 (2017).
   Set `news2AnyParameterThree` if any single parameter scores 3.

3. **Apply NEWS2 escalation.** If `news2Total ≥ 7` or `news2AnyParameterThree`,
   force the level to at least 2 (Very urgent) and raise a deterioration flag. A
   NEWS2 of 5–6 forces at least Level 3 (Urgent).

4. **Assign.** `priorityLevel` = the most urgent (lowest number) level from
   steps 1 and 3. Derive `priorityColour`, `priorityName`, and `targetMinutes`
   from the level:

   | Level | Colour | Name | `targetMinutes` |
   | --- | --- | --- | --- |
   | 1 | Red | Immediate | 0 |
   | 2 | Orange | Very urgent | 10 |
   | 3 | Yellow | Urgent | 60 |
   | 4 | Green | Standard | 120 |
   | 5 | Blue | Non-urgent | 240 |

- Missing vital-sign inputs are treated as *not measured* (no NEWS2 contribution)
  and raise a data-completeness flag; they never lower the category.

## 5. Flagged issues (red flags)

Emitted independently of the assigned level, each with a priority:

- **Life threat / category 1** (high) — any Level-1 discriminator fires: move to
  resuscitation immediately.
- **Sepsis / high NEWS2** (high) — `sepsisFeatures`, or `news2Total ≥ 7`, or any
  parameter scoring 3: escalate, start sepsis screen, senior review.
- **Time-critical presentation** (high) — `chestPainCardiac`, `strokeFeatures`,
  or `paediatricRedFlag`: prioritise onto the relevant pathway.
- **Severe pain** (medium) — `painScore ≥ 7`: analgesia and Very-urgent review.
- **Incomplete triage** (low) — any core vital sign missing: NEWS2 and category
  may understate risk; complete the observations.

## 6. Inputs and outputs

**Input.** A typed triage object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  news2Total: number;
  news2AnyParameterThree: boolean;
  firedDiscriminators: FiredDiscriminator[];
  priorityLevel: 1 | 2 | 3 | 4 | 5;
  priorityColour: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
  priorityName: 'Immediate' | 'Very urgent' | 'Urgent' | 'Standard' | 'Non-urgent';
  targetMinutes: 0 | 10 | 60 | 120 | 240;
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

- `bin/test-form emergency-department-triage-note` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each MTS level 1–5, the NEWS2 escalation thresholds (5–6 → Level 3;
  ≥ 7 or any-parameter-3 → Level 2), the pain-score bands (≥ 7, 4–6), and the
  "highest discriminator wins" selection.
- Every level maps to its fixed colour, name, and target time (0 / 10 / 60 / 120
  / 240 minutes).
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form emergency-department-triage-note
```
