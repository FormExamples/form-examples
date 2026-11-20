# United Kingdom Marriage Certificate Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-kingdom-marriage-certificate-application`

## 1. Purpose

A completeness and validity check for giving notice of marriage or civil
partnership in England and Wales and ordering marriage certificate copies from
the General Register Office (GRO). It captures the notice, the planned ceremony,
each party's age, residence, previous-relationship and immigration evidence,
whether the parties are closely related, the witnesses, and the certificate
order. Its engine is a **completeness and validity-classification** engine, not
a score: it classifies the application as **ready-to-submit**, **incomplete**,
**needs-evidence**, or **ineligible**, computes the permitted ceremony window,
and raises flagged issues. It gives no legal advice; the register office decides
each notice.

Full design description: [`index.md`](../index.md). Source rules and citations:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: England and Wales; the schema, validation engine, two front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: Scotland and Northern Ireland, Anglican banns and licences, Quaker and
Jewish ceremonies, housebound or detained persons, Registrar General's licence,
fee calculation, hosted deployment, authentication and multi-tenancy.

## 3. Data model

A single logical application record. Fields default to `''` (text/enum) or
`null` (number/date). camelCase in the front-ends; snake_case columns in SQL.
The two parties' columns are prefixed `party_one_` / `party_two_` in SQL and
grouped under `partyOne` / `partyTwo` in the front-ends.

| Section (state key) | Field | Type | Values |
| --- | --- | --- | --- |
| notice | `noticeType` | enum | `marriage`, `civil-partnership` |
| notice | `noticeDate` | date | ISO date |
| notice | `registrationDistrict` | text | |
| notice | `noticeGivenTogether` | enum | `yes`, `no` |
| ceremony | `ceremonyType` | enum | `civil-register-office`, `civil-approved-premises`, `religious-registered-building`, `anglican` |
| ceremony | `ceremonyDate` | date | ISO date |
| ceremony | `venueName` | text | |
| ceremony | `venueConfirmed` | enum | `yes`, `no` |
| ceremony | `witnessCount` | integer | |
| party (x2) | `name` | text | |
| party (x2) | `dateOfBirth` | date | ISO date |
| party (x2) | `daysResidentInDistrict` | integer | whole days |
| party (x2) | `nationalityStatus` | enum | `british-or-irish`, `eu-settlement-scheme`, `other` |
| party (x2) | `maritalStatus` | enum | `never-married`, `divorced`, `widowed`, `dissolved-civil-partnership`, `annulled`, `currently-married-or-civil-partnered` |
| party (x2) | `identityProvided` | enum | `yes`, `no` |
| party (x2) | `addressProofProvided` | enum | `yes`, `no` |
| party (x2) | `priorEndEvidenceProvided` | enum | `yes`, `no`, `not-applicable` |
| party (x2) | `immigrationEvidenceProvided` | enum | `yes`, `no`, `not-applicable` |
| relationship | `closelyRelated` | enum | `yes`, `no` |
| certificate | `certificateCopies` | integer | |
| certificate | `certificateService` | enum | `standard`, `priority` |
| certificate | `groIndexReference` | text | |
| certificate | `applicantNote` | text | |

SQL tables: `applicant` (who submits), `registrar` (the register-office officer),
the main `united_kingdom_marriage_certificate_application`, and the result
triad `_grade` (class, earliest and latest ceremony dates, immigration referral),
`_grade_rule` (audit trail of fired rules) and `_grade_flag` (flagged issues).
Every table has a UUIDv4 primary key and `created_at`, `updated_at`, `deleted_at`.

## 4. Validity algorithm

Constants: minimum age 18, minimum residence 7 days, notice period 29 days,
notice validity 12 months, minimum witnesses 2. Dates are ISO strings compared
without a clock; age is judged on the ceremony date, else the notice date.

```text
earliestCeremonyDate = noticeDate + 29 days
latestCeremonyDate   = noticeDate + 12 months      (month end clamped)

ineligible      := any party under 18 on the reference date
                   OR any party currently married or civil-partnered
                   OR closelyRelated = yes
incomplete      := any required field missing
                   OR (certificateCopies >= 1 AND certificateService = '')
needs-evidence  := for any party: daysResidentInDistrict < 7
                                  OR previous relationship ended but evidence != yes
                                  OR nationality other/EU-settlement-scheme and immigration evidence != yes
                                  OR identityProvided != yes OR addressProofProvided != yes
                   OR ceremonyDate < earliestCeremonyDate
                   OR ceremonyDate > latestCeremonyDate
                   OR witnessCount < 2
                   OR venueConfirmed != yes
                   OR (any party nationality = other AND noticeGivenTogether != yes)

class = ineligible > incomplete > needs-evidence > ready-to-submit   (first match)
immigrationReferralIndicated := any party nationality other/EU-settlement-scheme
                                with immigration evidence != yes
```

Required fields: notice type, notice date, registration district, ceremony type,
ceremony date, venue name, witness count, and for each party the name, date of
birth, days resident, nationality route and marital status, plus
`closelyRelated`.

`ineligible` outranks `incomplete` because no evidence cures it.

## 5. Flagged issues

Flags are independent of the class and sorted high, medium, low (stable within a
tier). Each has an id, category, priority, description and suggested action.

| Priority | Id | Category | Raised when |
| --- | --- | --- | --- |
| high | `F-PARTY-UNDER-18-001` | `party-under-18` | a party is under 18 on the reference date |
| high | `F-ALREADY-MARRIED-001` | `already-married-or-civil-partnered` | a party is currently married or civil-partnered |
| high | `F-CLOSELY-RELATED-001` | `closely-related` | `closelyRelated = yes` |
| high | `F-NOTICE-PERIOD-TOO-SHORT-001` | `notice-period-too-short` | ceremony earlier than notice + 29 days |
| high | `F-NOTICE-EXPIRES-BEFORE-CEREMONY-001` | `notice-expires-before-ceremony` | ceremony later than notice + 12 months |
| high | `F-PRIOR-RELATIONSHIP-EVIDENCE-MISSING-001` | `prior-relationship-evidence-missing` | a previous relationship ended without evidence |
| high | `F-IMMIGRATION-REFERRAL-001` | `immigration-status-referral` | immigration evidence missing for a party who needs it |
| high | `F-JOINT-NOTICE-REQUIRED-001` | `joint-notice-required` | a party from outside the UK and Ireland and notice not joint |
| medium | `F-RESIDENCE-UNDER-7-DAYS-001` | `residence-under-7-days` | days resident under 7 |
| medium | `F-IDENTITY-MISSING-001` | `identity-missing` | identity not confirmed |
| medium | `F-ADDRESS-PROOF-MISSING-001` | `address-proof-missing` | proof of address not confirmed |
| medium | `F-VENUE-NOT-CONFIRMED-001` | `venue-not-confirmed` | venue not confirmed |
| medium | `F-WITNESSES-INSUFFICIENT-001` | `witnesses-insufficient` | fewer than two witnesses |
| medium | `F-REQUIRED-FIELDS-MISSING-001` | `required-fields-missing` | any required field missing |
| low | `F-CERTIFICATE-SERVICE-MISSING-001` | `certificate-service-missing` | copies requested without a service |
| low | `F-CERTIFICATE-COPIES-INVALID-001` | `certificate-copies-invalid` | copies below 1 |
| low | `F-GRO-INDEX-REFERENCE-MISSING-001` | `gro-index-reference-missing` | copies requested without a GRO index reference |
| low | `F-PRIOR-EVIDENCE-CHECK-FEE-001` | `prior-evidence-check-fee` | previous-relationship evidence supplied (a document-checking fee applies) |

**Process note (not scored).** Notice is given in person at the register office;
the notice is displayed for 28 days; the ceremony may take place from 29 days
after notice and within 12 months. Certificates are ordered from the GRO or the
local register office after the ceremony.

## 6. Inputs and outputs

**Input.** A typed application object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric and date
fields default to `null`.

**Output.** A validation object emitted by the engine:

```ts
{
  validityClass: 'ready-to-submit' | 'incomplete' | 'needs-evidence' | 'ineligible';
  earliestCeremonyDate: string | null;   // notice + 29 days
  latestCeremonyDate: string | null;     // notice + 12 months
  immigrationReferralIndicated: boolean;
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
| `back-end-with-axum` | Rust + Axum JSON API |
| `back-end-with-axum-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form united-kingdom-marriage-certificate-application` exits cleanly.
- The validation engine is pure (no side effects, no I/O, no clock) and
  unit-tested, covering each class, the ineligible-over-incomplete precedence,
  the 29-day and 12-month boundaries, the under-18 boundary, joint notice and
  the EU Settlement Scheme exception.
- `examples/personas.json` has at least six personas covering every class and
  every flag; `bin/test-personas` passes, and the Svelte engine port agrees with
  the HTML engine on every persona.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check`, `pnpm exec vitest run`, `pnpm lint` and `pnpm format:check`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo baseline. This form is not a medical device: it is a
completeness aid for a UK civil process (Marriage Act 1949; Civil Partnership
Act 2004; Marriage and Civil Partnership (Minimum Age) Act 2022; Immigration Act
2014 Part 4), checked against GOV.UK and GRO guidance on 2026-11-20. It gives no
legal advice.

## 10. References

- [GOV.UK — Give notice of marriage or civil partnership](https://www.gov.uk/marriages-civil-partnerships/give-notice)
- [GOV.UK — Legal requirements](https://www.gov.uk/marriages-civil-partnerships/legal-requirements)
- [GOV.UK — Documents you'll need to give notice](https://www.gov.uk/marriages-civil-partnerships/documents-youll-need-to-give-notice)
- [GOV.UK — Plan your ceremony](https://www.gov.uk/marriages-civil-partnerships/plan-your-ceremony)
- [GOV.UK — Order a copy of a marriage certificate (GRO)](https://www.gov.uk/order-copy-birth-death-marriage-certificate)
- [Marriage and Civil Partnership (Minimum Age) Act 2022](https://www.legislation.gov.uk/ukpga/2022/28/contents)

- [`index.md`](../index.md) — form description and validity model
- [`doc/index.md`](../doc/index.md) — rule-by-rule sources
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-kingdom-marriage-certificate-application
```
