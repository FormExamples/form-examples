# United Kingdom Council Tax Discount Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-kingdom-council-tax-discount-application`

## 1. Purpose

A single-page, step-by-step application to a local council (the *billing
authority*) in England for a Council Tax **discount, exemption, disregard or
reduction**: the single person discount (25%), the 50% discount where every
resident is disregarded, the full-time-student exemption, the severe mental
impairment (SMI) disregard, the disabled band reduction, care-leaver relief, and
Council Tax Reduction (CTR, also called Council Tax Support).

The engine is a **completeness and eligibility** engine, not a clinical score.
It classifies the application as **likely eligible**, **incomplete** or **likely
ineligible**, states the indicative outcome, and raises flagged issues. It is a
pre-submission check only.

> **Disclaimer.** Eligibility is decided by the billing authority, not by this
> form. A "likely eligible" result is not a decision, an award or a promise of
> any discount. The authority may ask for more evidence and applies its own
> local Council Tax Reduction scheme.

Full design description: [`index.md`](../index.md). Source research and
citations: [`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, eligibility engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: England only (Wales and Scotland run their own rules; Northern Ireland
has domestic rates), means-testing of CTR (income, savings and capital are
assessed by the authority), band valuation appeals, bill calculation, payment,
hosted deployment, authentication and multi-tenancy.

## 3. Data model

Fields default to `''` (text/enum) or `null` (numeric/date) when unanswered.
The state is grouped into six sections.

**`claim`**

| Field | Type | Notes |
| --- | --- | --- |
| `claimType` | enum | `single-person-discount` / `all-disregarded-discount` / `student-exemption` / `severe-mental-impairment` / `disabled-band-reduction` / `care-leaver-relief` / `council-tax-reduction` |
| `billingAuthority` | text | the council the application goes to |
| `accountReference` | text | Council Tax account reference, if known |
| `applicationDate` | date | date the application is made |
| `effectiveDate` | date | date the discount should start from |

**`applicant`** (the liable person)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | text | |
| `birthDate` | date | |
| `email`, `phone` | text | |
| `status` | enum | the applicant's own status on the roster: `counted-adult` (default) or a disregarded status (below) |

**`property`**

| Field | Type | Notes |
| --- | --- | --- |
| `addressAsFullText` | text | |
| `postcode` | text | |
| `band` | enum | valuation band `A`–`H` |
| `mainResidence` | enum | `yes` / `no` — the property is the applicant's main home |
| `liableRole` | enum | `owner-occupier` / `tenant` / `landlord` / `other` |

**`household`** — the occupant roster

| Field | Type | Notes |
| --- | --- | --- |
| `othersLive` | yes/no | whether anyone other than the applicant lives in the property |
| `occupants[]` | array | each: `name`, `birthDate`, `status`, `evidenceHeld` (`yes`/`no`) |

Occupant `status` values: `counted-adult`, `full-time-student`,
`severely-mentally-impaired`, `under-18`, `apprentice`, `education-18-19`,
`live-in-carer`, `care-leaver`, `other-disregarded`. A roster row stores only
the occupants other than the applicant.

**`evidence`**

| Field | Type | Notes |
| --- | --- | --- |
| `smiCertificate` | yes/no | a registered medical practitioner's certificate of severe mental impairment |
| `qualifyingBenefit` | yes/no | the SMI person receives a qualifying benefit (for example Attendance Allowance, higher-rate DLA care component, PIP daily living component) |
| `studentCertificate` | yes/no | course-provider certificate |
| `studentCourseMonths` | number | course length |
| `studentHoursPerWeek` | number | weekly study hours |
| `disabilityAdaptation` | enum | `extra-bathroom` / `extra-kitchen` / `extra-room` / `wheelchair-space` / `none` |
| `disabledPersonMainHome` | yes/no | the property is a disabled person's main home |
| `apprenticeDeclaration` | yes/no | employer declaration (paid no more than £195 a week; Ofqual-accredited training) |
| `careLeaverProof` | yes/no | proof from the local authority that looked after the applicant |
| `careLeaverAgeYears` | number | |
| `notes` | text | supporting documents list |

**`declaration`**

| Field | Type | Notes |
| --- | --- | --- |
| `declaredTrue` | yes/no | the information is true and complete |
| `agreesToReportChanges` | yes/no | duty to report a change within 21 days |
| `fraudWarningAcknowledged` | yes/no | penalty and prosecution warning |
| `declarantName` | text | |
| `declarationDate` | date | |

SQL tables (`sql/`): `applicant`, `billing_authority`,
`united_kingdom_council_tax_discount_application` (main), `occupant` (roster),
plus the `_grade` / `_grade_rule` / `_grade_flag` triad.

## 4. Classification algorithm

Pure functions in `rules.js` / `grader.js` / `flags.js` (HTML) and the
equivalent TypeScript (Svelte). First match wins:

1. **likely-ineligible** — a disqualifying fact is present (see below).
2. **incomplete** — a required answer or item of evidence is missing.
3. **likely-eligible** — otherwise.

*Counted adults* = the applicant (when `status` is `''` or `counted-adult`) plus
every occupant whose status is `''` or `counted-adult`.

Disqualifiers, by claim type:

| Claim | Disqualified when |
| --- | --- |
| any discount or exemption except CTR | `mainResidence = no` |
| `single-person-discount` | counted adults ≠ 1 (≥2: not alone; 0: the 50% discount applies instead) |
| `all-disregarded-discount` | counted adults ≠ 0, or no resident is listed |
| `student-exemption` | counted adults ≥ 1 (discount only, not exemption), or no resident is a full-time student, or course criteria not met |
| `severe-mental-impairment` | `smiCertificate = no` or `qualifyingBenefit = no` |
| `disabled-band-reduction` | `disabilityAdaptation = none`, or `disabledPersonMainHome = no` |
| `care-leaver-relief` | `careLeaverAgeYears` ≥ 25 |

Course criteria (GOV.UK): at least 1 year and at least 21 hours of study a week
(12 hours and 3 months for under-20s studying up to A level).

Incompleteness: missing claim type, authority, applicant name, postcode, band,
effective date or any of the three declaration answers; missing evidence for the
claim type (SMI certificate and benefit, student certificate and course
details, adaptation, care-leaver proof); a disregarded occupant with
`evidenceHeld = ''`.

*Indicative outcome* (grader output `indicativeOutcome`): `25-percent-discount`,
`50-percent-discount`, `full-exemption`, `smi-disregard`, `band-reduction`,
`care-leaver-relief`, `means-tested-reduction`, or `none`.

Grader output: `{ eligibilityClass, countedAdults, indicativeOutcome }`.

## 5. Flagged issues

`detectFlaggedIssues(state)` returns `{ id, category, priority, description,
suggestedAction }[]`, stable-sorted high > medium > low.

| Category | Priority | Raised when |
| --- | --- | --- |
| `adult-count-mismatch` | high | the counted-adult count does not match the claim type |
| `not-main-residence` | high | `mainResidence = no` on a discount claim |
| `student-evidence` | high | student claim without a certificate, or a course under the criteria |
| `smi-evidence` | high | SMI claim without the certificate or a qualifying benefit |
| `disability-adaptation` | high | band-reduction claim without a qualifying adaptation or main home |
| `disregard-evidence` | medium | a disregarded occupant with no evidence held |
| `age-status-mismatch` | medium | an occupant's date of birth conflicts with their status (for example `under-18` but over 18, or `counted-adult` but under 18 on the effective date) |
| `backdating` | medium | `effectiveDate` is before `applicationDate`: backdating is at the authority's discretion and needs evidence for the whole period |
| `care-leaver-age` | medium | care-leaver claim at age 25 or over |
| `duty-to-report-changes` | medium | the duty to report a change within 21 days is not accepted |
| `fraud-warning` | medium | the penalty and prosecution warning is not acknowledged |
| `band-a-percentage` | low | disabled band reduction in Band A: a 17% reduction applies instead of a lower band |
| `means-tested` | low | a Council Tax Reduction claim: the authority assesses income, savings and capital under its local scheme |
| `incomplete-application` | low | identity or property details are missing |

## 6. Front-ends

Both front-ends are one continuous single-page wizard of six steps: (1) Claim,
(2) Applicant and property, (3) Household roster, (4) Evidence, (5) Declaration,
(6) Summary and eligibility. Answers autosave locally. The report always carries
the disclaimer that eligibility is decided by the billing authority.

## 7. Back-end

A Rust Axum JSON API (axa + sqlx), a RESTful controller per SQL table, signed
cursor paging, soft delete, and RFC 9457 problems. See
[`AGENTS/back-end-with-axum.md`](../../../AGENTS/back-end-with-axum.md).

## 8. Verification

`bin/test-form`, `bin/test-personas`, `bin/test-engines`,
`bin/test-examples-conformance`, `bin/test-sql-apply`, `bin/test-e2e --html`,
and `cargo test` in the crate. `examples/personas.json` pins every class and
flag.

## 9. References

See [`doc/index.md`](../doc/index.md).
