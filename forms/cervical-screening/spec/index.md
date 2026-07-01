# Cervical Screening record — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `cervical-screening`

## 1. Purpose

A structured record of a cervical screening (smear) encounter under the UK NHS
Cervical Screening Programme, using high-risk HPV (hrHPV) primary screening with
reflex cytology on HPV-positive samples. It documents eligibility, consent,
sample adequacy, the primary hrHPV result, and reflex cytology, then classifies
the **result** and the **management outcome** and raises safety flags. It is a
documentation and result-classification form, **not** a numeric-score
calculator.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, colposcopy/histology
follow-up records, and HPV vaccination records.

## 3. Data model

A single logical screening record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Encounter context.**

| Field | Type | Notes |
| --- | --- | --- |
| `sampleTakerName` | text | person taking the sample |
| `sampleTakerRole` | enum | practice-nurse / gp / smear-taker / other |
| `careSetting` | enum | general-practice / sexual-health / other |
| `sampleTakenAt` | timestamp | date and time of sample |

**Patient identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | local identifier |
| `nhsNumber` | text | NHS number |
| `age` | numeric (years) | drives eligibility and recall interval |
| `dateOfBirth` | date | patient date of birth |

**Eligibility.**

| Field | Type | Notes |
| --- | --- | --- |
| `recallInterval` | enum | three-yearly / five-yearly / not-applicable |
| `screenDueDate` | date | date the screen was due |
| `overdue` | enum | yes / no |
| `previouslyCeased` | enum | yes / no — formally ceased screening |

**Consent.**

| Field | Type | Notes |
| --- | --- | --- |
| `consentGiven` | enum | yes / no — informed consent to sample and process |

**Symptoms.**

| Field | Type | Notes |
| --- | --- | --- |
| `symptomatic` | enum | yes / no — abnormal bleeding, discharge, pain |
| `symptomDetail` | text | free-text description |

**Sample adequacy.**

| Field | Type | Notes |
| --- | --- | --- |
| `sampleAdequacy` | enum | adequate / inadequate |
| `inadequateReason` | enum | insufficient-cells / obscuring-blood / inflammation / labelling / other / '' |

**Primary hrHPV test.**

| Field | Type | Notes |
| --- | --- | --- |
| `hpvResult` | enum | negative / positive / not-tested |

**Reflex cytology** (only when `hpvResult == 'positive'`).

| Field | Type | Notes |
| --- | --- | --- |
| `cytologyGrade` | enum | negative / borderline / low-grade / high-grade / not-performed / '' |

**Derived (never stored as input).** `resultClass`, `managementAction`,
`status`, `firedRules[]`, `flags[]`.

## 4. Result / outcome algorithm

Pure function `grade(record)`, no I/O. Applied top-to-bottom; the first matching
branch sets `resultClass` and `managementAction`.

```
if not eligible (age < 25 or age > 64, or previouslyCeased == 'yes'):
    resultClass = 'cease-not-eligible'
    managementAction = 'cease-screening'

else if sampleAdequacy == 'inadequate':
    resultClass = 'inadequate'
    managementAction = 'repeat-sample-3-months'

else if hpvResult == 'negative':
    resultClass = 'hpv-negative'
    managementAction = 'routine-recall'

else if hpvResult == 'positive':
    switch cytologyGrade:
      'negative'                 → resultClass = 'hpv-positive-cytology-normal',      managementAction = 'early-repeat-12-months'
      'borderline' | 'low-grade' → resultClass = 'hpv-positive-cytology-abnormal-low', managementAction = 'colposcopy-referral'
      'high-grade'               → resultClass = 'hpv-positive-cytology-abnormal-high', managementAction = 'urgent-colposcopy-referral'
      else                       → resultClass = 'hpv-positive-cytology-pending',      managementAction = 'awaiting-cytology'

else:  # hpvResult missing / not-tested on an adequate sample
    resultClass = 'pending'
    managementAction = 'awaiting-result'
```

- **Eligibility** is evaluated first: the screen only proceeds for ages 25–64
  who have not ceased. Age outside the range → cease/not-eligible.
- **Adequacy** gates testing: an inadequate sample is never HPV-classified; it is
  repeated (three consecutive inadequate samples escalate to colposcopy — see
  flags).
- **hrHPV primary:** a negative result returns the person to routine recall at
  the age-appropriate interval; only positive results proceed to cytology.
- **Reflex cytology** refines a positive HPV result into normal (12-month
  repeat), low-grade abnormal (routine colposcopy), or high-grade abnormal
  (urgent colposcopy).

`status` is `'complete'` when eligibility, consent, adequacy, and the required
result fields for the reached branch are all present; otherwise `'incomplete'`.

## 5. Flagged issues

Emitted independently of the result class, each with a priority:

- **Urgent colposcopy** (high) — `hpvResult == 'positive'` and
  `cytologyGrade == 'high-grade'`: high-grade dyskaryosis; refer urgently.
- **Symptomatic — refer regardless** (high) — `symptomatic == 'yes'`: symptoms
  are managed on the symptomatic (NG12) pathway irrespective of the screen
  result; a negative screen does not exclude cancer.
- **Missing consent** (high) — `consentGiven != 'yes'`: a result must not be
  reported without recorded consent.
- **Inadequate sample** (medium) — `sampleAdequacy == 'inadequate'`: repeat in
  ~3 months; three consecutive inadequate samples → colposcopy.
- **HPV positive, cytology outstanding** (medium) — `hpvResult == 'positive'`
  and `cytologyGrade` not yet a graded value: reflex cytology required.
- **Patient overdue** (medium) — `overdue == 'yes'` or `screenDueDate` in the
  past: screening is overdue.
- **Age outside eligible range** (medium) — `age < 25` or `age > 64`: not within
  the routine 25–64 programme.

## 6. Inputs and outputs

**Input.** A typed screening object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
grade(record: ScreeningRecord): {
  resultClass:
    | 'inadequate'
    | 'hpv-negative'
    | 'hpv-positive-cytology-normal'
    | 'hpv-positive-cytology-abnormal-low'
    | 'hpv-positive-cytology-abnormal-high'
    | 'hpv-positive-cytology-pending'
    | 'cease-not-eligible'
    | 'pending';
  managementAction:
    | 'routine-recall'
    | 'early-repeat-12-months'
    | 'colposcopy-referral'
    | 'urgent-colposcopy-referral'
    | 'repeat-sample-3-months'
    | 'cease-screening'
    | 'awaiting-cytology'
    | 'awaiting-result';
  status: 'complete' | 'incomplete';
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

- `bin/test-form cervical-screening` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering every result class and management action, the eligibility and
  adequacy gates, and the reflex-cytology branches.
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

- [`index.md`](../index.md) — form description and result-classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form cervical-screening
```
