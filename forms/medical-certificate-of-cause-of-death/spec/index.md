# Medical Certificate of Cause of Death (MCCD) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `medical-certificate-of-cause-of-death`

## 1. Purpose

A UK statutory documentation instrument for recording the cause of death of a
person for death registration. It captures the deceased's details, the date and
place of death, the Part I direct causal sequence (I(a) → I(b) → I(c)) and the
Part II contributory conditions, the onset-to-death interval of each condition,
and the coroner / medical-examiner referral status. Its engine is a
**completeness and validity-classification** engine, not a numeric score: it
classifies the certificate as **Valid**, **Incomplete**, or **Refer to
coroner**, and raises flagged issues. It does not diagnose, and it does not
replace the statutory judgement of the certifying doctor, coroner, or medical
examiner.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, validation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, stillbirth
certification, and ICD underlying-cause coding.

## 3. Data model

A single logical certificate record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Certification context.**

| Field | Type | Notes |
| --- | --- | --- |
| `certifyingDoctorName` | text | attending practitioner |
| `certifyingDoctorGrade` | enum | consultant / SAS / registrar / foundation / GP / other |
| `gmcReference` | text | GMC registration number |
| `placeOfCertification` | text | hospital / practice / other |
| `certificationDate` | date | date certificate completed |
| `attendedDeceased` | enum | yes / no — attended during last illness |
| `lastSeenAliveDate` | date | date certifier last saw the deceased alive |

**Deceased identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `deceasedName` | text | full name |
| `sex` | enum | female / male / other / unknown |
| `dateOfBirth` | date | |
| `ageYears` | numeric | age at death in years |
| `patientIdentifier` | text | NHS number or local identifier |

**Death details.**

| Field | Type | Notes |
| --- | --- | --- |
| `dateOfDeath` | date | |
| `timeOfDeath` | time | |
| `placeOfDeath` | text | ward / home / hospice / other |
| `seenAfterDeathBy` | enum | certifier / another-practitioner / not-seen |

**Part I — direct causal sequence.** Three lines, each a condition plus interval:

| Field | Type | Line |
| --- | --- | --- |
| `causeIaCondition` | text | I(a) direct cause (required) |
| `causeIaInterval` | text | I(a) onset-to-death interval |
| `causeIbCondition` | text | I(b) antecedent cause |
| `causeIbInterval` | text | I(b) interval |
| `causeIcCondition` | text | I(c) underlying cause |
| `causeIcInterval` | text | I(c) interval |

**Part II — contributory conditions.**

| Field | Type | Notes |
| --- | --- | --- |
| `partIiConditions` | text | other significant conditions contributing to death |
| `partIiInterval` | text | interval (optional) |

**Referral and scrutiny.**

| Field | Type | Notes |
| --- | --- | --- |
| `referredToCoroner` | enum | yes / no |
| `coronerReason` | enum | unnatural / violent / suspicious / unknown-cause / industrial-disease / medical-procedure / custody / no-attending-practitioner / other / none |
| `medicalExaminerStatus` | enum | scrutinized / discussed / pending / not-required |
| `certifierNote` | text | free-text |

**Derived (never stored as input).** `validityClass`, `underlyingCause`,
`coronerReferralIndicated`, `flaggedIssues[]`.

## 4. Validity and referral algorithm

Pure function, no I/O. `validityClass` takes the first matching class in order;
flagged issues are always computed in full.

```
coronerReferralIndicated =
     referredToCoroner == 'yes'
  || coronerReason in { 'unnatural','violent','suspicious','unknown-cause',
                        'industrial-disease','medical-procedure','custody',
                        'no-attending-practitioner' }

# Unacceptable sole "mode of death": the only cause given is a recognised mode
soleCause = the single non-empty Part I condition when exactly one is present
            and Part II is empty
unacceptableSoleCause = soleCause is set && normalise(soleCause) in MODES
  # MODES: cardiac arrest, cardiorespiratory arrest, respiratory arrest,
  #        asystole, old age (alone), organ failure without stated cause,
  #        syncope, coma, shock, brain death, and similar

missingPartIa = causeIaCondition == ''

# Part I lines must read top-down: no completed line below an empty line above.
illogicalSequence =
     (causeIbCondition != '' && causeIaCondition == '')
  || (causeIcCondition != '' && causeIbCondition == '')

validityClass =
    coronerReferralIndicated                      -> 'refer-to-coroner'
    missingPartIa || unacceptableSoleCause        -> 'incomplete'
    otherwise                                     -> 'valid'

underlyingCause = lowest completed Part I condition (I(c) else I(b) else I(a))
```

- `refer-to-coroner` takes precedence: if a referral criterion is met the
  certificate should not be issued regardless of completeness.
- A certificate with I(a) present, a plausible sequence, an acceptable cause,
  and no referral criterion is `valid` — but medical-examiner scrutiny is still
  required before registration (see §5).

## 5. Flagged issues

Emitted independently of the class, each with a priority:

- **Coroner referral required** (high) — `coronerReferralIndicated`: a referral
  criterion is asserted; do not issue the MCCD until the coroner has considered
  the case.
- **Unacceptable sole cause** (high) — `unacceptableSoleCause`: a recognized
  mode of death is the only cause given; state the underlying disease.
- **Missing Part I(a)** (high) — `missingPartIa`: no direct cause of death
  recorded.
- **Illogical sequence** (medium) — `illogicalSequence`: Part I lines are not in
  a plausible downward causal order.
- **Medical-examiner scrutiny required** (medium) — `referredToCoroner != 'yes'`
  and `medicalExaminerStatus` not `scrutinised`: every non-referred death must
  be scrutinized by a medical examiner before registration.
- **Missing interval** (low) — a completed Part I condition line has an empty
  interval.
- **Incomplete certifier details** (low) — `certifyingDoctorName`,
  `certifyingDoctorGrade`, `gmcReference`, or `attendedDeceased` missing.

## 6. Inputs and outputs

**Input.** A typed certificate object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A validation object emitted by the engine:

```ts
{
  validityClass: 'valid' | 'incomplete' | 'refer-to-coroner';
  underlyingCause: string;              // '' when Part I empty
  coronerReferralIndicated: boolean;
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

- `bin/test-form medical-certificate-of-cause-of-death` exits cleanly.
- The validation engine is pure (no side effects, no I/O) and unit-tested,
  covering each validity class, the coroner-referral precedence, the
  unacceptable-sole-cause set, and the illogical-sequence cases.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. The form is written to the UK death-certification
and coroner framework (Births and Deaths Registration Act 1953; Coroners and
Justice Act 2009; the statutory medical-examiner system; ONS MCCD guidance).
Form-specific classification is recorded in [`index.md`](../index.md) and
[`AGENTS.md`](../AGENTS.md) where it differs from the baseline.

## 10. References

- [`index.md`](../index.md) — form description and validity model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form medical-certificate-of-cause-of-death
```
