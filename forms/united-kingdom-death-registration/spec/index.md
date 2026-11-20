# United Kingdom death registration (England and Wales) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-kingdom-death-registration`

## 1. Purpose

The registrar-side and family-side process **after** a doctor has completed a
medical certificate of cause of death (MCCD): registering a death in England and
Wales within 5 days, with a qualified informant, once the medical examiner has
confirmed the death can be registered or the coroner has released it; then the
certificate for burial or cremation (the "green form"), Tell Us Once, and ordering
certified copies of the death certificate.

Its engine is a **completeness and validity** engine, not a clinical score. It
classifies a registration as **ready to register**, **incomplete**,
**referred to coroner - pending**, or **registered**, derives the 5-day deadline
status, and raises flagged issues. It is not legal advice and does not replace the
registrar.

This form is **distinct from** the doctor-completed
[`medical-certificate-of-cause-of-death`](../../medical-certificate-of-cause-of-death/spec/index.md):
that form records the cause of death on the certificate; this one starts when the
certificate exists and ends when the death is registered and copies are ordered. It
does not duplicate the certificate's content.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: Scotland and Northern Ireland (different deadlines and processes; the
engine flags and refuses them), deaths abroad, stillbirths, hosted deployment,
authentication, multi-tenancy, and probate.

## 3. Data model

Six logical sections. Fields default to `''` (text/enum) or `null`
(numeric/date); the camelCase names below mirror the snake_case columns in
`sql/04_create_table_united_kingdom_death_registration.sql`.

| Section | Fields |
| --- | --- |
| `deceased` | `deceasedName`, `sex`, `dateOfBirth`, `dateOfDeath`, `placeOfDeath`, `deathJurisdiction` (`england-wales`/`scotland`/`northern-ireland`/`abroad`), `deceasedParticularsKnown` |
| `medical` | `mccdReceived`, `medicalExaminerStatus` (`confirmed`/`pending`), `medicalExaminerConfirmationDate` |
| `coroner` | `referredToCoroner`, `coronerStage` (`investigating`/`post-mortem`/`inquest-opened`/`released-no-inquest`/`inquest-concluded`), `coronerCertificateReceived` |
| `informant` | `informantName`, `informantRelationship` (six qualified categories or `not-qualified`), `informantAddress` |
| `registration` | `registerOffice`, `appointmentBooked`, `supportingDocumentsAvailable`, `registrationDate`, `asOfDate` |
| `aftercare` | `disposalMethod`, `disposalCertificateIssued`, `tellUsOnceStatus`, `tellUsOnceReference`, `copiesRequested`, `copyOrderChannel`, `groIndexReference`, `priorityService` |

`asOfDate` is supplied explicitly (the front-ends default it to today) so grading is
deterministic and never reads the wall clock.

SQL tables: `patient` (the deceased), `informant`, the main
`united_kingdom_death_registration`, and the child triad
`united_kingdom_death_registration_grade` (1:1), `..._grade_rule`, `..._grade_flag`.

Qualified informant categories (section 16, Births and Deaths Registration Act
1953, as summarized by GOV.UK): a relative present at the death; a relative in
attendance during the last illness; a relative living in the registration
district; a person present at the death; the occupier of the premises where the
death occurred; the person arranging the funeral.

## 4. Classification algorithm

First matching class wins:

```txt
coronerReferred AND coronerCertificateReceived != 'yes'  -> referred-to-coroner-pending
any blocking rule fires                                  -> incomplete
registrationDate is set                                  -> registered
otherwise                                                -> ready-to-register
```

A coroner referral with the coroner's certificate in hand (form CN2 or the
certificate after inquest) is treated as released: the MCCD and medical-examiner
rules no longer apply.

Blocking rules:

| Rule | Dimension | Fires when |
| --- | --- | --- |
| `R-DECEASED-001` | deceased | `deceasedName` is blank or `dateOfDeath` is not a valid date |
| `R-JURISDICTION-001` | deceased | `deathJurisdiction` is not `england-wales` |
| `R-CORONER-001` | coroner | `referredToCoroner` is unanswered |
| `R-MEDICAL-001` | medical | no coroner referral and `mccdReceived` is not `yes` |
| `R-MEDICAL-002` | medical | no coroner referral and the medical examiner has not `confirmed`, or no confirmation date |
| `R-INFORMANT-001` | informant | `informantName` is blank |
| `R-INFORMANT-002` | informant | the informant relationship is not one of the six qualified categories |

5-day clock. Days are counted from `medicalExaminerConfirmationDate` to
`registrationDate` when registered, otherwise to `asOfDate`; weekends and bank
holidays count. `deadlineStatus`:

| Status | Meaning |
| --- | --- |
| `registered` / `registered-late` | registered within / after 5 days |
| `paused-coroner` | unregistered with a coroner referral pending |
| `not-started` | no confirmation date or no assessment date |
| `on-track` | 0 to 3 days |
| `due-soon` | 4 or 5 days |
| `overdue` | more than 5 days |

## 5. Flagged issues

Independent of the class; sorted high, medium, then low (stable).

| Flag | Category | Priority | Raised when |
| --- | --- | --- | --- |
| `F-JURISDICTION-001` | jurisdiction | high | the death is not in England or Wales |
| `F-CORONER-PENDING-001` | coroner | high | reported to a coroner and no coroner certificate yet |
| `F-CORONER-RELEASED-001` | coroner | low | the coroner has released the death (certificate in hand) |
| `F-MCCD-MISSING-001` | medical-certificate | high | not a coroner case and the MCCD has not been received |
| `F-MEDICAL-EXAMINER-001` | medical-examiner | high | not a coroner case and the medical examiner has not confirmed |
| `F-INFORMANT-001` | informant | high | the named informant is not a qualified informant |
| `F-PARTICULARS-001` | informant | medium | the informant cannot give the deceased's full particulars |
| `F-DEADLINE-OVERDUE-001` | deadline | high | more than 5 days since confirmation and unregistered |
| `F-DEADLINE-DUE-SOON-001` | deadline | medium | 4 or 5 days since confirmation and unregistered |
| `F-DEADLINE-LATE-001` | deadline | medium | registered more than 5 days after confirmation |
| `F-APPOINTMENT-001` | appointment | low | unregistered, no coroner referral pending, no appointment booked |
| `F-DOCUMENTS-001` | documents | low | unregistered and supporting documents are not to hand |
| `F-DISPOSAL-CERTIFICATE-001` | disposal-certificate | medium | registered, burial or cremation chosen, green form not issued |
| `F-DISPOSAL-UNDECIDED-001` | disposal-certificate | low | disposal method is `undecided` |
| `F-TELL-US-ONCE-001` | tell-us-once | low | registered and no Tell Us Once reference (or decline) recorded |
| `F-COPIES-001` | copies | low | no certified copies planned (blank or zero) |
| `F-GRO-INDEX-001` | copies | low | copies ordered online with no GRO index reference |
| `F-PRIORITY-001` | copies | low | priority service requested other than through GRO online |

## 6. Inputs and outputs

**Input.** A typed registration object whose shape mirrors the SQL schema.

**Output.**

```ts
{
  registrationClass: 'ready-to-register' | 'incomplete' | 'referred-to-coroner-pending' | 'registered';
  deadlineStatus: 'not-started' | 'paused-coroner' | 'on-track' | 'due-soon' | 'overdue' | 'registered' | 'registered-late';
  daysSinceConfirmation: number | null;
  informantQualified: boolean;
  blockingRules: { ruleId, dimension, category, description }[];
  flaggedIssues: FlaggedIssue[];
}
```

The HTML engine splits this: `validateRegistration(state)` returns the class, deadline
status, days, informant qualification and blocking rules; `detectFlaggedIssues(state)`
returns the flags. The Svelte engine composes both and adds a timestamp.

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
| `back-end-with-axum` | Rust + Axum JSON API |
| `back-end-with-axum-setup` | generated scaffold script |
| `examples/personas.json` | nine hand-authored personas pinning every class, deadline status, rule and flag |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form united-kingdom-death-registration` exits cleanly.
- The engine is pure and unit-tested, covering each registration class, the coroner
  precedence, the qualified-informant list, and the 5-day boundaries (day 3 on-track,
  day 4 and 5 due-soon, day 6 overdue).
- `bin/test-personas united-kingdom-death-registration` passes: personas cover all four
  classes, every deadline status that can be reached, every blocking rule and all 18 flags.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)); the SvelteKit
  front-end to the Lily Svelte contract ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and passes `pnpm check`, `pnpm exec vitest run`, `pnpm lint` and `pnpm format:check`.
- The Rust crate builds and `cargo test` passes against PostgreSQL.

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1, UK Medical Devices
Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical
Device. This form is an administrative readiness checker for a civil-registration
process, not a medical device function: it makes no clinical decision. The
registrar's own checks remain definitive.

## 10. References

See [`doc/index.md`](../doc/index.md) for the full list with what each source
establishes.

- [GOV.UK: Register a death](https://www.gov.uk/register-a-death)
- [GOV.UK: Register the death (after a death)](https://www.gov.uk/after-a-death/register-the-death)
- [GOV.UK: When a death is reported to a coroner](https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner)
- [GOV.UK: Order a copy of a birth, death, marriage or civil partnership certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate)
- [GOV.UK: Tell Us Once](https://www.gov.uk/tell-us-once)
- Births and Deaths Registration Act 1953, section 16 (qualified informants)

- [`index.md`](../index.md) — form description
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification

## 11. Verify

```sh
bin/test-form united-kingdom-death-registration
bin/test-personas united-kingdom-death-registration
```
