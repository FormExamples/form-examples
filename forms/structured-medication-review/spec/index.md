# Structured Medication Review (SMR) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `structured-medication-review`

## 1. Purpose

A comprehensive, patient-centred medication review (NHS England PCN service) for
people with problematic polypharmacy, frailty, long-term conditions, or high-risk
medicines. It documents the patient's problems and priorities, every medicine
with its indication and adherence, deprescribing opportunities, anticholinergic
burden, high-risk-medicine checks, monitoring due, and the shared decisions and
agreed actions. It reports a **review status** (Complete / Incomplete), a
**polypharmacy + anticholinergic burden indicator**, and a set of **flags**. It is
a documentation instrument with partial scoring, not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, prescribing execution,
and a validated diagnostic score.

## 3. Data model

A parent **review** record with a one-to-many child **medicine** list. Fields
default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Review — context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianRole` | enum | clinical-pharmacist / gp / pharmacy-technician / other |
| `reviewedAt` | timestamp | date and time of review |
| `careSetting` | enum | gp-practice / pcn / care-home / community-pharmacy / patient-home |
| `consultationMode` | enum | face-to-face / telephone / video / home-visit |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `frailtyStatus` | enum | fit / mild / moderate / severe |
| `livesInCareHome` | enum | yes / no |
| `longTermConditions` | text | comma-separated list |

**Review — problems, goals, plan.**

| Field | Type | Notes |
| --- | --- | --- |
| `presentingProblems` | text | reasons for review |
| `patientReportedIssues` | text | side effects, difficulties |
| `whatMattersToPatient` | text | patient priorities |
| `sharedDecisions` | text | decisions agreed together |
| `monitoringDue` | text | tests / bloods due |
| `overdueMonitoringCount` | numeric | count of overdue monitoring items |
| `followUpPlan` | text | agreed plan |
| `followUpDate` | date | next review |
| `reviewCompleted` | enum | yes / no |

**Medicine (repeating child).**

| Field | Type | Notes |
| --- | --- | --- |
| `drugName` | text | medicine name |
| `formStrength` | text | form and strength |
| `doseRegimen` | text | dose and frequency |
| `indication` | text | reason prescribed |
| `indicationRecorded` | enum | yes / no |
| `isRegular` | enum | yes / no (counts toward polypharmacy) |
| `isHighRisk` | enum | yes / no |
| `highRiskClass` | enum | anticoagulant / insulin / opioid / dmard / lithium / methotrexate / other / '' |
| `adherence` | enum | good / partial / poor / unknown |
| `anticholinergicBurdenPoints` | numeric | 0–3 (ACB scale) |
| `monitoringRequired` | enum | yes / no |
| `monitoringUpToDate` | enum | yes / no / na |
| `deprescribingCandidate` | enum | yes / no |
| `stoppCriterion` | text | STOPP code / description, or `''` |
| `startCriterion` | text | START code / description, or `''` |

**Derived (never stored as input).** `medicineCount`, `regularMedicineCount`,
`anticholinergicBurdenScore`, `polypharmacyBand`, `anticholinergicBand`,
`burdenBand`, `reviewStatus`, `stopFlags[]`, `startFlags[]`, `flaggedIssues[]`.

## 4. Review and scoring algorithm

Pure function, no I/O.

```
regularMedicineCount      = count(medicines where isRegular == 'yes')
medicineCount             = count(medicines)
anticholinergicBurdenScore = sum(medicine.anticholinergicBurdenPoints ?? 0)

polypharmacyBand = regularMedicineCount >= 10 ? 'hyperpolypharmacy'
                 : regularMedicineCount >= 5  ? 'polypharmacy'
                 :                              'none'

anticholinergicBand = anticholinergicBurdenScore >= 3 ? 'significant' : 'low'

burdenBand = (regularMedicineCount >= 10 || anticholinergicBurdenScore >= 3) ? 'high'
           : (regularMedicineCount >= 5)                                     ? 'moderate'
           :                                                                   'low'

reviewStatus = allRequiredSectionsComplete ? 'complete' : 'incomplete'
```

**`reviewStatus` is `complete` only when:** the problems section is filled; every
medicine has a non-empty `indication` and an `adherence` other than `unknown`;
the monitoring section is reviewed; `whatMattersToPatient` and `sharedDecisions`
are recorded; and `reviewCompleted == 'yes'`. Otherwise `incomplete`.

- A missing `anticholinergicBurdenPoints` contributes 0 to the ACB sum.
- `stopFlags[]` = one flag per medicine with a non-empty `stoppCriterion`.
- `startFlags[]` = one flag per medicine with a non-empty `startCriterion`.

## 5. Flagged issues (red flags)

Emitted independently of the bands, each with a priority:

- **High anticholinergic burden** (high) — `anticholinergicBurdenScore >= 3`:
  review sedating / anticholinergic medicines; falls and cognition risk.
- **STOPP trigger** (high) — one or more medicines carry a `stoppCriterion`:
  potentially inappropriate prescribing to review for stopping.
- **START omission** (medium) — one or more medicines carry a `startCriterion`:
  potential prescribing omission to consider starting.
- **Missing monitoring** (high) — any medicine with `monitoringRequired == 'yes'`
  and `monitoringUpToDate == 'no'`, or `overdueMonitoringCount > 0`.
- **Adherence concern** (medium) — any medicine with `adherence` of `partial` or
  `poor`.
- **High-risk medicine without indication** (high) — any medicine with
  `isHighRisk == 'yes'` and (`indicationRecorded == 'no'` or empty `indication`).
- **Incomplete review** (low) — `reviewStatus == 'incomplete'`: required sections
  not finished; the burden indicator may understate risk.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`,
including the repeating medicine list. Unanswered text/enum fields default to
`''`; unanswered numeric, date, and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  medicineCount: number;
  regularMedicineCount: number;
  anticholinergicBurdenScore: number;      // sum of per-medicine ACB points
  polypharmacyBand: 'none' | 'polypharmacy' | 'hyperpolypharmacy';
  anticholinergicBand: 'low' | 'significant';
  burdenBand: 'low' | 'moderate' | 'high';
  reviewStatus: 'complete' | 'incomplete';
  stopFlags: StoppFlag[];
  startFlags: StartFlag[];
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

- `bin/test-form structured-medication-review` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the polypharmacy band boundaries (4/5, 9/10 regular medicines), the ACB
  boundary (2/3), the composite burden band, and each flagged issue.
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
bin/test-form structured-medication-review
```
