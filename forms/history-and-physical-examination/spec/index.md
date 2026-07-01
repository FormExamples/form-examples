# History and Physical Examination (H&P) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `history-and-physical-examination`

## 1. Purpose

The comprehensive clerking and admission document: history (presenting
complaint, history of presenting complaint, past medical/surgical history, drug
history and allergies, family history, social history, systems review) and
physical examination (vital signs and examination by body system), followed by
investigations, an impression / problem list, and a management plan. It is a
**documentation / completeness form**, not a scored instrument: the engine grades
clerking completeness (**Complete** / **Partial** / **Incomplete**), reports a
completeness percentage, and raises safety flags. It does not compute a
diagnostic or risk score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, specialty-specific
clinical scoring, and validation of the clinical correctness of the recorded
findings (the engine grades completeness of documentation only).

## 3. Data model

A single logical clerking record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Encounter and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | clerking clinician |
| `clinicianRole` | enum | doctor / acp / physician-associate / other |
| `registrationNumber` | text | GMC / NMC / HCPC number |
| `clerkedAt` | timestamp | date and time of clerking |
| `careSetting` | enum | emergency-department / acute-medical-unit / ward / other |
| `admissionSource` | enum | self / gp / ambulance / transfer / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**History.**

| Field | Type | Component |
| --- | --- | --- |
| `presentingComplaint` | text | required — presenting complaint |
| `historyOfPresentingComplaint` | text | required — history of presenting complaint |
| `pastMedicalSurgicalHistory` | text | required (or explicit "nil") |
| `drugHistory` | text | required — current medications |
| `allergyStatus` | enum | none-known / has-allergies / not-documented |
| `allergyDetail` | text | reactions when `allergyStatus == has-allergies` |
| `familyHistory` | text | optional (or explicit "nil") |
| `socialHistory` | text | required — smoking, alcohol, occupation, living situation |
| `systemsReview` | text | required — systems review narrative / structured findings |

**Vital signs** (numeric, `null` when not measured).

| Field | Type | Normal range (flag if outside) |
| --- | --- | --- |
| `temperature` | numeric (°C) | 36.1–38.0 |
| `heartRate` | numeric (bpm) | 51–90 |
| `respiratoryRate` | numeric (/min) | 12–20 |
| `systolicBloodPressure` | numeric (mmHg) | 111–219 |
| `oxygenSaturation` | numeric (%) | ≥ 96 |
| `consciousnessLevel` | enum | alert / voice / pain / unresponsive (flag if not alert) |

**Examination, investigations, and plan.**

| Field | Type | Component |
| --- | --- | --- |
| `examCardiovascular` | text | core system — findings or "deferred" |
| `examRespiratory` | text | core system — findings or "deferred" |
| `examAbdominal` | text | core system — findings or "deferred" |
| `examNeurological` | text | core system — findings or "deferred" |
| `examOther` | text | other systems / general inspection |
| `investigations` | text | bedside, laboratory, imaging results |
| `impression` | text | required — working impression / problem list |
| `redFlagFindings` | text | red-flag examination or history findings |
| `managementPlan` | text | required — treatment, referrals, escalation, disposition |
| `clinicalNote` | text | free-text note |

**Derived (never stored as input).** `status`, `completenessPercent`,
`satisfiedComponents[]`, `missingComponents[]`, `firedRules[]`, `flags[]`.

## 4. Completeness algorithm

Pure function, no I/O. Ten **required components** are each evaluated as
satisfied or missing:

```
components = [
  presentingComplaint            != '',
  historyOfPresentingComplaint   != '',
  pastMedicalSurgicalHistory     != '',
  drugHistory != '' && allergyStatus != '' && allergyStatus != 'not-documented',
  socialHistory                  != '',
  systemsReview                  != '',
  anyVitalSignRecorded(),
  coreExamAddressed(),   // all four core systems examined or explicitly deferred
  impression                     != '',
  managementPlan                 != '',
]
completenessPercent = round(100 * count(satisfied) / 10)
```

**Blocking flags** force **Incomplete** regardless of the percentage:

- allergies undocumented (`allergyStatus == '' || allergyStatus ==
  'not-documented'`), or
- no impression **and** no plan (`impression == '' && managementPlan == ''`).

**Status:**

```
coreNarrative = presentingComplaint != ''
             && historyOfPresentingComplaint != ''
             && coreExamAddressed()
             && (impression != '' || managementPlan != '')

if blockingFlag || !coreNarrative        -> 'incomplete'
else if all ten components satisfied      -> 'complete'
else                                      -> 'partial'
```

## 5. Flagged issues (flags)

Emitted independently of the status, each with a priority:

- **Allergies not documented** (high) — `allergyStatus == '' ||
  allergyStatus == 'not-documented'`; blocking.
- **No impression or plan** (high) — `impression == '' && managementPlan == ''`;
  blocking.
- **Red-flag finding without a plan** (high) — `redFlagFindings != '' &&
  managementPlan == ''`.
- **Abnormal vital signs** (medium) — any recorded vital sign outside its normal
  range (see §3), or `consciousnessLevel` not `alert`.
- **Incomplete systems examination** (medium) — one or more core examination
  systems neither examined nor explicitly deferred.
- **Incomplete history** (low) — one or more required history sections missing.

## 6. Inputs and outputs

**Input.** A typed clerking object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  status: 'complete' | 'partial' | 'incomplete';
  completenessPercent: number; // 0..100
  satisfiedComponents: ComponentId[];
  missingComponents: ComponentId[];
  firedRules: FiredRule[];
  flags: Flag[];
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

- `bin/test-form history-and-physical-examination` exits cleanly.
- The completeness engine is pure (no side effects, no I/O) and unit-tested,
  covering each status class (Complete / Partial / Incomplete), the two blocking
  flags, and every vital-sign boundary.
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
bin/test-form history-and-physical-examination
```
