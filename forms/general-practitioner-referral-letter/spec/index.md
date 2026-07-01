# General Practitioner Referral Letter — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `general-practitioner-referral-letter`

## 1. Purpose

A structured primary-care referral letter to a specialist or service. It records
patient and referrer details, the referral destination, urgency, reason and
history, examination and investigation findings, medications and allergies, and
the patient's expectations, consent, and safety-netting. A **documentation
engine** grades completeness (Complete / Incomplete), classifies urgency
(routine / urgent / two-week-wait / emergency), computes a completeness
percentage, and raises flags. It is **not** a numeric-score or diagnostic
instrument; it checks the *letter*, not the patient.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, documentation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, integration with a live
e-Referral Service, and the clinical decision of whether to refer.

## 3. Data model

A single logical referral record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Referrer.**

| Field | Type | Notes |
| --- | --- | --- |
| `referrerName` | text | referring clinician |
| `referrerRole` | enum | gp / gp-registrar / nurse-practitioner / pharmacist / paramedic / other |
| `referrerRegistrationNumber` | text | GMC / NMC / GPhC number |
| `referringPractice` | text | practice name |
| `practiceAddress` | text | practice address |
| `referrerContact` | text | phone / secure email |
| `referralDate` | date | date of referral |

**Patient.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | NHS number or local identifier |
| `patientName` | text | full name |
| `patientDateOfBirth` | date | date of birth |
| `patientSex` | enum | patient sex |
| `patientAddress` | text | address |
| `patientContact` | text | phone / email |
| `accessNeeds` | text | interpreter / accessibility needs |

**Referral destination and urgency.**

| Field | Type | Notes |
| --- | --- | --- |
| `referralSpecialty` | text | specialty / service referred to |
| `namedClinician` | text | named consultant / team (optional) |
| `receivingOrganisation` | text | hospital / trust / community provider |
| `urgency` | enum | routine / urgent / two-week-wait / emergency |
| `urgencyReason` | text | why urgent (mandatory for urgent / two-week-wait) |
| `suspectedCancerCriterion` | text | named NICE NG12 criterion (mandatory for two-week-wait) |
| `suspectedCancerPathway` | text | tumour-site pathway (mandatory for two-week-wait) |

**Clinical content.**

| Field | Type | Notes |
| --- | --- | --- |
| `reasonForReferral` | text | primary reason |
| `relevantHistory` | text | relevant clinical history |
| `presentingProblem` | text | presenting problem |
| `symptomDuration` | text | duration |
| `redFlagSymptoms` | text | documented red-flag symptoms (drives emergency flag) |
| `examinationFindings` | text | examination |
| `investigationResults` | text | bloods, imaging already done |
| `currentMedications` | text | current medications |
| `allergies` | text | allergies and reactions |
| `patientExpectations` | text | patient's expectations / question to specialist |
| `consentToShare` | enum | yes / no / '' — consent documented |
| `safetyNetting` | text | safety-netting advice while waiting |
| `clinicalNote` | text | free-text note |

**Derived (never stored as input).** `status`, `urgency` (echoed classification),
`completenessPercent`, `firedRules[]`, `flags[]`.

## 4. Completeness and urgency algorithm

Pure function, no I/O.

**Mandatory-field sets.** `MANDATORY_ALWAYS` is the always-required field set;
urgency adds conditional fields:

```
MANDATORY_ALWAYS = [
  patientIdentifier, patientName, patientDateOfBirth,
  referrerName, referrerRole, referringPractice,
  referralSpecialty, urgency, reasonForReferral, relevantHistory,
]

mandatory = MANDATORY_ALWAYS
          + (urgency in ['urgent','two-week-wait'] ? [urgencyReason] : [])
          + (urgency == 'two-week-wait' ? [suspectedCancerCriterion, suspectedCancerPathway] : [])

present   = mandatory.filter(isPresent)          // non-'' text, non-null value
completenessPercent = round(100 * present.length / mandatory.length)
status    = present.length == mandatory.length ? 'Complete' : 'Incomplete'
```

- `isPresent` treats `''` (text/enum) and `null` (numeric/date) as absent.
- `urgency` is echoed through as the classification; the four values map
  directly to the pathways in [`index.md`](../index.md).
- The algorithm never blocks — it reports; the referrer decides whether to send.

## 5. Flagged issues

Emitted independently of the status, each with a priority:

- **Suspected-cancer pathway** (high) — `urgency == 'two-week-wait'`: route on
  the suspected-cancer pathway; ensure the criterion and pathway are named.
- **Emergency features** (high) — `urgency == 'emergency'` or `redFlagSymptoms`
  present: arrange same-day assessment / 999; a routine letter is not
  appropriate.
- **Mandatory information missing** (high) — any `MANDATORY_ALWAYS` field
  absent: the receiving service will bounce the referral.
- **Urgency information missing** (medium) — `urgent` / `two-week-wait` selected
  but `urgencyReason`, `suspectedCancerCriterion`, or `suspectedCancerPathway`
  absent.
- **Consent not documented** (medium) — `consentToShare != 'yes'`.
- **No safety-netting recorded** (low) — `safetyNetting` absent.

## 6. Inputs and outputs

**Input.** A typed referral object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
assess(referral: Referral): {
  status: 'Complete' | 'Incomplete';
  urgency: 'routine' | 'urgent' | 'two-week-wait' | 'emergency';
  completenessPercent: number;   // 0..100
  firedRules: FiredRule[];
  flags: Flag[];
}
```

Rendered as a referral letter plus a completeness summary in the browser, and
convertible to FHIR R5 Bundle (ServiceRequest + supporting resources), XML,
JSON, CSV, or TSV.

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

- `bin/test-form general-practitioner-referral-letter` exits cleanly.
- The documentation engine is pure (no side effects, no I/O) and unit-tested,
  covering each urgency's mandatory-field set, the Complete / Incomplete
  boundary, `completenessPercent` at 0 / partial / 100, and every flag.
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

- [`index.md`](../index.md) — form description and completeness/urgency model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form general-practitioner-referral-letter
```
