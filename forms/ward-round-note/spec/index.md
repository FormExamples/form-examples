# Ward Round Note — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `ward-round-note`

## 1. Purpose

A daily inpatient review entry documented at the bedside during a ward round. It
records who saw the patient and when, overnight events, the current problem list
and progress, examination and latest observations (NEWS2), investigations
reviewed, VTE assessment status, medication changes, the day's plan and jobs,
escalation / ceiling-of-care status, and estimated discharge date. This is a
**documentation / completeness** form, not a numeric score: the engine grades
entry completeness (Complete / Partial / Incomplete) and raises safety flags.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, the admission clerking
document, and discharge summaries.

## 3. Data model

A single logical ward-round-note record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Review header and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianGrade` | enum | fy1 / fy2 / core-trainee / specialty-registrar / acp / physician-associate / consultant |
| `reviewedAt` | timestamp | date and time of review |
| `ward` | text | ward / location |
| `patientIdentifier` | text | local identifier |
| `admissionDate` | date | date of admission |
| `primaryDiagnosis` | text | reason for admission / working diagnosis |

**Review components.**

| Field | Type | Component |
| --- | --- | --- |
| `overnightEvents` | text | 2 — overnight events |
| `noOvernightEvents` | enum (yes/no) | 2 — explicit "no events" flag |
| `problemList` | text | 3 — current issues + progress |
| `examinationSummary` | text | 4 — examination |
| `news2Total` | numeric (0–20+) | 4 — latest NEWS2 total |
| `news2SingleParamThree` | enum (yes/no) | 4 — any single parameter scoring 3 |
| `observationTrend` | enum | 4 — improving / stable / deteriorating |
| `investigationsReviewed` | text | 5 — results reviewed |
| `noInvestigationsOutstanding` | enum (yes/no) | 5 — explicit "none outstanding" flag |
| `abnormalResultFlagged` | enum (yes/no) | 5 — abnormal / critical result present |
| `abnormalResultActioned` | enum (yes/no) | 5 — action recorded for the abnormal result |
| `vteStatus` | enum | 6 — assessed / not-required / not-done |
| `vteProphylaxisInPlace` | enum (yes/no) | 6 — prophylaxis in place |
| `medicationChanges` | text | 7 — medication changes |
| `noMedicationChanges` | enum (yes/no) | 7 — explicit "no changes" flag |
| `planAndJobs` | text | 8 — plan / jobs for the day |
| `escalationStatus` | enum | 9 — for-full-escalation / ward-level-ceiling / dnacpr / not-recorded |
| `seniorReviewPresent` | enum (yes/no) | 9 — a consultant / senior grade named on the entry |
| `estimatedDischargeDate` | date | 10 — estimated discharge date |
| `dischargeNotEstimable` | enum (yes/no) | 10 — explicit "not yet estimable" flag |
| `clinicalNote` | text | free-text summary note |

**Derived (never stored as input).** `status`, `completenessPercent`,
`documentedComponents[]`, `firedRules[]`, `flags[]`.

## 4. Completeness algorithm

Pure function, no I/O. First evaluate each component's `documented` predicate,
then compute the status.

Required components: `header`, `problems`, `examination`, `investigations`,
`vte`, `medication`, `plan`, `escalation` (8 total). Recommended components:
`overnightEvents`, `estimatedDischarge`.

```
documented(header)         = clinicianName != '' && clinicianGrade != '' && reviewedAt != null
documented(problems)       = problemList != ''
documented(examination)    = examinationSummary != '' && news2Total != null
documented(investigations) = investigationsReviewed != '' || noInvestigationsOutstanding == 'yes'
documented(vte)            = vteStatus != ''
documented(medication)     = medicationChanges != '' || noMedicationChanges == 'yes'
documented(plan)           = planAndJobs != ''
documented(escalation)     = escalationStatus != '' && escalationStatus != 'not-recorded'

documentedRequired  = count of required components where documented == true
completenessPercent = round(documentedRequired / 8 * 100)

status =
  documentedRequired == 8                                    ? 'complete'
  : documented(header) && documented(plan)
      && documentedRequired >= 4                             ? 'partial'
  :                                                            'incomplete'
```

- A component with only its explicit negative flag set (e.g. "no changes", "none
  outstanding") counts as **documented** — a deliberate negative is a valid
  clinical record.
- `completenessPercent` is over required components only; recommended components
  do not affect the status but are surfaced in `documentedComponents[]`.

## 5. Flagged issues (safety flags)

Emitted independently of the status, each with a priority:

- **Deteriorating NEWS2 — escalation needed** (high) —
  `news2Total >= 5 || news2SingleParamThree == 'yes' || observationTrend == 'deteriorating'`,
  and no escalation action recorded in `planAndJobs` / `escalationStatus`.
- **VTE assessment not done** (high) — `vteStatus == 'not-done'`.
- **No plan or jobs documented** (high) — `planAndJobs == ''`.
- **Abnormal results not actioned** (medium) —
  `abnormalResultFlagged == 'yes' && abnormalResultActioned != 'yes'`.
- **No senior review when required** (medium) —
  `(observationTrend == 'deteriorating' || escalationStatus == 'dnacpr' || escalationStatus == 'ward-level-ceiling')`
  and `seniorReviewPresent != 'yes'`.
- **Incomplete entry** (low) — `documentedRequired < 8`.

## 6. Inputs and outputs

**Input.** A typed note object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
validate(note: WardRoundNote): {
  status: 'complete' | 'partial' | 'incomplete';
  completenessPercent: number; // 0..100 over required components
  documentedComponents: ComponentKey[];
  firedRules: FiredRule[];
  flags: FlaggedIssue[];
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

- `bin/test-form ward-round-note` exits cleanly.
- The completeness engine is pure (no side effects, no I/O) and unit-tested,
  covering each status boundary (all required present → complete; header + plan
  + ≥ 4 required → partial; missing header or plan → incomplete) and every flag.
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

- [`index.md`](../index.md) — form description and completeness details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form ward-round-note
```
