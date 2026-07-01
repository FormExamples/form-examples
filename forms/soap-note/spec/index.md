# SOAP Note — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `soap-note`

## 1. Purpose

A structured clinical progress note recording a single patient encounter in the
four SOAP sections (Subjective, Objective, Assessment, Plan). The engine grades
the note for **documentation completeness** — it does not compute a clinical
risk score. It classifies the note as **Complete**, **Partial**, or
**Incomplete**, reports a completeness percentage, and raises safety flags. A
completeness grade reflects the quality of the *record*, not the correctness of
the *care*.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, natural-language
grading of free-text clinical content (presence of a component is detected by a
non-empty field, not by semantic analysis).

## 3. Data model

A single logical note record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | authoring clinician |
| `clinicianRole` | enum | doctor / nurse / paramedic / pharmacist / allied-health / other |
| `encounteredAt` | timestamp | date and time of the encounter |
| `careSetting` | enum | general-practice / outpatient / ward / emergency-department / community / telehealth / other |
| `encounterType` | enum | new-problem / follow-up / review / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | patient age band |
| `sex` | enum | patient sex |

**Subjective.**

| Field | Type | Notes |
| --- | --- | --- |
| `presentingComplaint` | text | required component |
| `historyOfPresentingComplaint` | text | required component |
| `patientReportedSymptoms` | text | optional |
| `relevantHistory` | text | past history / medication / allergies |
| `redFlagSymptomsPresent` | enum (yes/no) | drives conditional safety-netting requirement |

**Objective.**

| Field | Type | Notes |
| --- | --- | --- |
| `examinationFindings` | text | satisfies Objective when non-empty |
| `vitalSigns` | text | satisfies Objective when non-empty |
| `abnormalVitalsPresent` | enum (yes/no) | drives the abnormal-vitals-not-addressed flag |
| `investigationResults` | text | satisfies Objective when non-empty |

**Assessment.**

| Field | Type | Notes |
| --- | --- | --- |
| `primaryAssessment` | text | primary diagnosis or problem — required component |
| `problemList` | text | optional |
| `differentialDiagnoses` | text | optional |
| `clinicalImpression` | text | optional |

**Plan.**

| Field | Type | Notes |
| --- | --- | --- |
| `investigationsPlanned` | text | plan item |
| `treatment` | text | plan item |
| `referrals` | text | plan item |
| `followUp` | text | plan item + satisfies conditional follow-up requirement |
| `safetyNetting` | text | conditional safety component |

**Free text.** `clinicalNote` — optional narrative shown in the summary.

**Derived (never stored as input).** `subjectivePresent`, `objectivePresent`,
`assessmentPresent`, `planPresent`, `status`, `completenessPercent`,
`firedRules[]`, `flags[]`.

## 4. Completeness algorithm

Pure function, no I/O. "Present" means the corresponding field (or any field in
an at-least-one group) is a non-empty string.

```
subjectivePresent  = presentingComplaint != '' && historyOfPresentingComplaint != ''
objectivePresent   = examinationFindings != '' || vitalSigns != '' || investigationResults != ''
assessmentPresent  = primaryAssessment != '' || problemList != '' || differentialDiagnoses != ''
planPresent        = investigationsPlanned != '' || treatment != '' || referrals != '' || followUp != ''

// Conditionally required components for THIS encounter
safetyNettingRequired = redFlagSymptomsPresent == 'yes'         // (or patient managed at home)
followUpRequired      = planPresent                             // a plan implies a review arrangement

// Required-component tally
required = [subjective(x2 components), objective, assessment, plan]
         + (safetyNettingRequired ? [safetyNetting] : [])
         + (followUpRequired      ? [followUp]      : [])
present  = count of the above that are satisfied
completenessPercent = round(present / required * 100)   // 0..100

status =
  (!assessmentPresent || !planPresent)                 ? 'incomplete'
  : (completenessPercent == 100 && no high-priority flag) ? 'complete'
  : (assessmentPresent && planPresent)                 ? 'partial'
  :                                                       'incomplete'
```

- **Incomplete** whenever a critical section (Assessment or Plan) is absent.
- **Complete** only when every required component — core plus any conditionally
  required for this encounter — is present and no high-priority flag has fired.
- **Partial** otherwise (both critical sections present, but a gap remains).

## 5. Flagged issues (safety flags)

Emitted independently of the status, each with a priority:

- **Missing assessment** (high) — `assessmentPresent == false`.
- **Missing plan** (high) — `planPresent == false`.
- **Red-flag symptoms without a plan** (high) —
  `redFlagSymptomsPresent == 'yes' && planPresent == false`.
- **No safety-netting** (medium) —
  `safetyNettingRequired && safetyNetting == ''`.
- **Abnormal vitals not addressed** (medium) —
  `abnormalVitalsPresent == 'yes' && !assessmentPresent && !planPresent`.
- **Incomplete documentation** (low) — `completenessPercent < 100`.

## 6. Inputs and outputs

**Input.** A typed note object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
validate(note: SoapNote): {
  status: 'complete' | 'partial' | 'incomplete';
  completenessPercent: number;   // 0..100
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

- `bin/test-form soap-note` exits cleanly.
- The completeness engine is pure (no side effects, no I/O) and unit-tested,
  covering each status boundary (Complete / Partial / Incomplete), the
  conditional safety-netting and follow-up requirements, and every flag.
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
bin/test-form soap-note
```
