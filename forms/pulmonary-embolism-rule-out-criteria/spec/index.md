# Pulmonary Embolism Rule-out Criteria (PERC) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `pulmonary-embolism-rule-out-criteria`

## 1. Purpose

A bedside rule-out screen for adults with a **low** clinician pre-test
probability of pulmonary embolism (PE). It records eight objective criteria and
the clinician's gestalt pre-test probability, then produces a **binary
classification**: **PERC-negative** (PE excluded without further testing) or
**PERC-positive** (proceed to D-dimer / imaging). PERC is a rule-out gestalt
tool, not a graded severity score — the output is a status, not a number.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric use,
pregnancy-specific pathways, and the downstream D-dimer / imaging workflow
itself.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | physician / advanced-practitioner / nurse / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / acute-ambulatory / other |
| `presentingComplaint` | text | symptom prompting PE consideration |
| `patientIdentifier` | text | local identifier |
| `age` | numeric (years) | drives criterion 1 |
| `sex` | enum | patient sex |

**Applicability gate.**

| Field | Type | Notes |
| --- | --- | --- |
| `pretestProbability` | enum (`low` / `not-low`) | clinician gestalt; PERC applies only when `low` |

**Criterion inputs.**

| Field | Type | Criterion | Satisfied when |
| --- | --- | --- | --- |
| `age` | numeric (years) | 1 — age | `age < 50` |
| `heartRate` | numeric (beats/min) | 2 — heart rate | `heartRate < 100` |
| `oxygenSaturation` | numeric (SpO₂ %) | 3 — oxygen saturation | `oxygenSaturation >= 95` |
| `unilateralLegSwelling` | enum (yes/no) | 4 — leg swelling | `no` |
| `haemoptysis` | enum (yes/no) | 5 — haemoptysis | `no` |
| `recentSurgeryOrTrauma` | enum (yes/no) | 6 — surgery/trauma ≤ 4 weeks needing GA | `no` |
| `priorVenousThromboembolism` | enum (yes/no) | 7 — prior DVT/PE | `no` |
| `oestrogenUse` | enum (yes/no) | 8 — exogenous oestrogen | `no` |

**Derived (never stored as input).** `criterionResults[]` (per-criterion
satisfied/failed), `failedCriteria[]`, `allCriteriaSatisfied` (boolean),
`applicable` (boolean; `pretestProbability == 'low'`), `percClassification`
(`perc-negative` / `perc-positive`), `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Each criterion evaluates to `satisfied` (true) or
`failed` (false); a criterion whose input is missing is treated as **failed**
(not satisfied — the reassuring state must be positively documented) and raises a
data-completeness flag.

```
c1 = age                        != null && age                <  50   // age
c2 = heartRate                  != null && heartRate          <  100  // heart rate
c3 = oxygenSaturation           != null && oxygenSaturation   >= 95   // SpO2
c4 = unilateralLegSwelling      == 'no'                                // leg swelling
c5 = haemoptysis                == 'no'                                // haemoptysis
c6 = recentSurgeryOrTrauma      == 'no'                                // surgery/trauma
c7 = priorVenousThromboembolism == 'no'                                // prior DVT/PE
c8 = oestrogenUse               == 'no'                                // oestrogen

allCriteriaSatisfied = c1 && c2 && c3 && c4 && c5 && c6 && c7 && c8
applicable           = pretestProbability == 'low'

percClassification = (applicable && allCriteriaSatisfied) ? 'perc-negative'
                                                          : 'perc-positive'
```

- The classification is a **boolean conjunction**, not a count or sum. A single
  failed criterion yields `perc-positive`.
- PERC is **only applicable** when `pretestProbability == 'low'`. When it is
  `not-low`, the result is `perc-positive` regardless of the eight criteria, and
  the summary states that PERC does not apply and the criteria are informational
  only.
- Criterion 1 (age) derives from the shared `age` field rather than a separate
  input.

## 5. Flagged issues (red flags)

Emitted independently of the classification, each with a priority:

- **Requires PE workup** (high) — `percClassification == 'perc-positive'`: PERC
  did not exclude PE; proceed to D-dimer and/or imaging per local policy.
- **Not applicable — pre-test probability not low** (high) —
  `pretestProbability != 'low'`: PERC must not be used to rule out; the criteria
  do not exclude PE at moderate or high suspicion.
- **Hypoxia** (high) — `oxygenSaturation < 95`: oxygen saturation below the
  reassuring threshold.
- **Tachycardia** (medium) — `heartRate >= 100`: heart rate at or above the
  threshold.
- **Prior venous thromboembolism** (medium) —
  `priorVenousThromboembolism == 'yes'`: history raises baseline PE risk.
- **Incomplete assessment** (low) — any criterion input or the pre-test
  probability missing: the result defaults toward PERC-positive and may not
  reflect the true clinical picture; complete the assessment.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  criterionResults: CriterionResult[];   // one per criterion, satisfied|failed
  failedCriteria: CriterionId[];
  allCriteriaSatisfied: boolean;
  applicable: boolean;                    // pretestProbability === 'low'
  percClassification: 'perc-negative' | 'perc-positive';
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

- `bin/test-form pulmonary-embolism-rule-out-criteria` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each threshold boundary (age 49/50, HR 99/100, SpO₂ 94/95), each
  criterion failing in isolation, the all-satisfied case, and the
  not-low-pre-test override.
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
bin/test-form pulmonary-embolism-rule-out-criteria
```
