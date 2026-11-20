# US Standard Certificate of Death: specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behavior: update the
spec before changing code.

Slug: `united-states-standard-certificate-of-death`

## 1. Purpose

A documentation-support instrument for the U.S. Standard Certificate of Death
(CDC/NCHS, 2003 revision) as completed by the funeral director and the medical
certifier. It captures the decedent and death facts, the certifier, the Part I
cause-of-death chain (lines (a) to (d), each with an interval), Part II, the
manner of death, the tobacco, pregnancy and injury items, the medical examiner or
coroner referral, the funeral director's disposition, and the order of certified
copies. Its engine is a **completeness and validity classification** engine, not
a numeric score: it classifies the certificate as `valid`, `incomplete`, or
`refer-to-medical-examiner-or-coroner`, derives the underlying cause, and raises
prioritized flags. It does not diagnose.

**Disclaimer.** Documentation support, not legal advice. Death registration is
governed by state law; the registering state agency decides whether a
certificate is accepted, and the medical examiner or coroner decides jurisdiction.

## 2. Scope

In scope: the schema, the classification engine, two front-ends, the Rust Axum
JSON API, and the generated representations (XML, FHIR R5, protobuf, OpenAPI).
Out of scope: transmission to a state electronic death registration system,
authentication, multi-tenancy, fetal death reports, and the NCHS items not
modeled (education, race, Hispanic origin, occupation, parents' names,
informant, SSN).

## 3. Data model

Eleven sections, each an object in the wizard state; property names mirror the
snake_case columns of `sql/04_create_table_united_states_standard_certificate_of_death.sql`.

| Section | Properties |
|---|---|
| `jurisdiction` | `state` (USPS two letters; selects the `STATE_RULES` row) |
| `decedent` | `decedentName`, `sex` (female, male, unknown), `dateOfBirth`, `ageYears`, `maritalStatus`, `veteranStatus`, `stateOfResidence` |
| `death` | `placeOfDeathType`, `placeOfDeathFacility`, `dateOfDeath`, `timeOfDeath` |
| `certifier` | `certifierName`, `certifierType` (certifying-physician, pronouncing-and-certifying-physician, medical-examiner, coroner, other), `certifierLicenseNumber`, `certificationDate`, `attendedDeceased`, `lastSeenAliveDate` |
| `partI` | `causeIa/Ib/Ic/Id` `Condition` and `Interval` |
| `partII` | `partIiConditions`, `autopsyPerformed`, `autopsyFindingsAvailable` |
| `manner` | `mannerOfDeath` (natural, accident, suicide, homicide, pending-investigation, could-not-be-determined), `tobaccoUseContributed` (yes, probably, no, unknown), `pregnancyStatus` (six NCHS values) |
| `injury` | `injuryDate`, `injuryTime`, `injuryPlace`, `injuryAtWork`, `injuryLocation`, `injuryDescription`, `transportationInjuryRole` |
| `referral` | `referredToMedicalExaminer`, `referralReason` (14 reasons plus `none`), `certifierNote` |
| `funeral` | `funeralDirectorName`, `funeralDirectorLicenseNumber`, `dispositionMethod`, `dispositionDate`, `dispositionPlace`, `filedDate` |
| `copies` | `certifiedCopiesRequested`, `requesterRelationship`, `requesterIdentityVerified`, `feePaidInUsd` |

Conventions: `''` for unanswered text and enum fields; `null` for unanswered
numeric, date and time fields. SQL tables: `patient` (the decedent), `clinician`
(the certifier), the certificate table, and `_grade` (1:1), `_grade_rule`,
`_grade_flag` (children of the grade).

## 4. Validity and referral algorithm

First matching class wins:

```
referralIndicated                                -> refer-to-medical-examiner-or-coroner
missingPartIa || mechanismAsSoleCause ||
  missingRequired(d).length > 0                  -> incomplete
otherwise                                        -> valid

underlyingCause = lowest completed Part I line (d, else c, else b, else a)
```

**referralIndicated** is false when `certifierType` is `medical-examiner` or
`coroner` (that office has taken the case). Otherwise it is true when any of:

- `referredToMedicalExaminer` is `yes`, or `referralReason` is a listed reason (anything but `none`);
- `mannerOfDeath` is accident, suicide, homicide, pending-investigation or could-not-be-determined;
- the cause lines contain injury, poisoning, toxicity or procedure wording (`trauma`, `injur`, `fall`, `fractur`, `poison`, `overdose`, `toxicity`, `gunshot`, `drown`, `blunt force`, and similar);
- `attendedDeceased` is `no` (a death unattended by a physician).

**mechanismAsSoleCause.** Exactly one Part I line is filled, Part II is empty, and
the normalized line (lower case, collapsed whitespace, trailing punctuation
removed) is in the mechanism list: cardiac arrest, cardiopulmonary arrest,
respiratory arrest, asystole, ventricular fibrillation, arrhythmia, respiratory
failure, heart failure, renal failure, liver failure, organ failure, shock, coma,
brain death, asphyxia, exsanguination, old age, senescence, natural causes, and
similar. A mechanism is acceptable when an etiology follows on a lower line.

**missingRequired.** State, decedent name, sex, date of birth, date of death,
place of death, certifier name, type and license, date certified, tobacco item,
pregnancy item (female aged 10 to 54, or age unknown), funeral director name, and
method of disposition.

**Part I order.** A completed line below an empty line is an illogical sequence (flag only).

**Abbreviations** to write in full (flag only): MI, CHF, COPD, CVA, CAD, ESRD,
CKD, DM, HTN, UTI, DVT, PE, TIA, AF, ARDS, AKI, MVC, GSW, ETOH, and similar.
HIV and AIDS are accepted.

**State rules (`STATE_RULES`).** Per state: `fileDays`, `certifyDays`, `business`
(count business days), `copyFee`, `additionalCopyFee`, and `verified` markers.
Unknown states use the default (5 and 3 days, no fee) and raise F-VERIFY-STATE-001.

| State | File | Certify | Fee, first copy | Additional |
|---|---|---|---|---|
| CA | 8 days | 1 day (15 hours) | $24 | same |
| NY | 3 days | none held | $30 | same |
| TX | 10 days | 5 days | $20 | $3 |
| FL | 5 days | 3 days | $5 | $4 |
| IL | 7 days | 2 days | $19 | $4 |
| PA | 4 days | 2 days | $20 | same |
| OH | 3 days | 2 days | $21 | same |
| WA | 3 business days | 2 business days | $25 | same |

Which values were verified against a primary source on 2026-11-20 is in
[`doc/index.md`](../doc/index.md); a deadline flag whose value is unverified
carries a "not independently verified" note.

## 5. Flagged issues

Computed independently of the class, sorted high, medium, low (stable within a
tier). Each has `id`, `category`, `priority`, `description`, `suggestedAction`,
mirroring the `_grade_flag` table.

| Id | Priority | Raised when |
|---|---|---|
| F-ME-REFERRAL-001 | high | `referralIndicated` |
| F-MECHANISM-001 | high | `mechanismAsSoleCause` |
| F-MISSING-PART-I-001 | high | Part I line (a) blank |
| F-MANNER-001 | high | manner of death blank |
| F-CREMATION-HOLD-001 | high | cremation planned and (referral indicated, or manner pending or undetermined) |
| F-SEQUENCE-001 | medium | illogical Part I sequence |
| F-ABBREVIATION-001 | medium | a listed abbreviation in a cause line |
| F-SPECIFICITY-001 | medium | diabetes without a type, else cancer without a cell type |
| F-PREGNANCY-001 | medium | item blank where it applies; status given where it does not; `not-applicable` where it applies |
| F-INJURY-001 | medium | accident, suicide or homicide with injury date, place, at work or description blank |
| F-MANNER-MISMATCH-001 | medium | natural with injury wording or injury date; or accident, suicide or homicide with no injury wording |
| F-PENDING-001 | medium | manner pending or undetermined |
| F-CERTIFIER-001, F-DECEDENT-001, F-FUNERAL-DIRECTOR-001 | medium | the required items for that party blank |
| F-DATES-001 | medium | death before birth, certified before death, disposition before death, last seen alive or injury after death, stated age more than one year from the dates |
| F-CERTIFY-DEADLINE-001 | medium | days from death to certification exceed `certifyDays` |
| F-FILING-DEADLINE-001 | medium | days from death to `filedDate` exceed `fileDays` |
| F-COPIES-001 | medium | copies requested and relationship blank, identity unverified, relationship `other`, or certificate not final |
| F-INTERVAL-001 | low | a completed Part I line has no interval |
| F-TOBACCO-001 | low | tobacco item blank |
| F-AUTOPSY-001 | low | manner pending or undetermined, autopsy item blank |
| F-FEE-001 | low | fee paid differs from the state fee for the copies |
| F-VERIFY-STATE-001 | low | state not in `STATE_RULES` |

## 6. Inputs and outputs

- `validateCertificate(d)` returns `{ validityClass, underlyingCause, referralIndicated }`; the Svelte port also returns `flaggedIssues` and `timestamp`.
- `detectFlaggedIssues(d)` returns the sorted `FlaggedIssue[]`.
- Export and import: JSON, XML, CSV, TSV through the shared `form-export.js` and `form-import.js`.
- HTTP: list (signed-cursor paging), `POST`, `GET`, `PUT`, `PATCH`, `DELETE` per SQL table; `GET /api/openapi.yaml`.

## 7. Artifacts

`sql/`, `xml/`, `fhir/r5/`, `protobuf/`, `openapi/`, `front-end-with-html/`,
`front-end-with-svelte/`, `back-end-with-axum/`, `back-end-with-axum-setup`,
`examples/`, `skills/`, `llms.txt`, `CHANGELOG.md`.

## 8. Acceptance criteria

1. `bin/test-sql-apply` applies all migrations.
2. `bin/test-personas` passes for ten personas covering all three classes and all 24 flag ids.
3. A blank certificate classifies `incomplete` and never throws.
4. A mechanism alone is `incomplete`; with an etiology below it, `valid`.
5. A non-natural manner is a referral unless the certifier is the medical examiner or coroner.
6. A state outside `STATE_RULES` raises F-VERIFY-STATE-001.
7. The HTML and Svelte engines agree on every persona.
8. `cargo test` passes against a scratch Postgres.

## 9. Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR software classification): documentation and completeness checking; no diagnosis or treatment.
- UK Medical Devices Regulations 2002; UK MHRA, *Software and AI as a Medical Device*: same position.
- ISO/IEC/IEEE 26514:2022 for user information.
- Documentation support, not legal advice; no state agency has endorsed this tool.

## 10. References

See [`doc/index.md`](../doc/index.md): NCHS *Physicians' Handbook on Medical
Certification of Death*; NCHS *Instructions for Completing the Cause-of-Death
Section*; NCHS *Medical Examiners' and Coroners' Handbook*; NCHS *U.S. Standard
Certificate of Death* (2003); NCHS *Model State Vital Statistics Act* (2011);
state statutes cited per state.

## 11. Verify

```sh
bin/test-form united-states-standard-certificate-of-death
bin/test-sql-apply united-states-standard-certificate-of-death
bin/test-personas united-states-standard-certificate-of-death
bin/test-engines united-states-standard-certificate-of-death
bin/test-examples-conformance united-states-standard-certificate-of-death
bin/test-e2e --html united-states-standard-certificate-of-death
```
