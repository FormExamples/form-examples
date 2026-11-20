# United States Property Tax Exemption Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Update the spec before changing code.

Slug: `united-states-property-tax-exemption-application`

## 1. Purpose

A county or state application for a residential **homestead exemption** and
related relief (senior, disability, disabled veteran, circuit-breaker), with
assessment-appeal basics. It captures the parcel, ownership and occupancy as of
the assessment date, the exemptions claimed, household income, proof documents,
the filing date and the signed declaration. Its engine is a **completeness and
eligibility** engine, not a numeric score: it classifies the application as
**likely-eligible**, **incomplete** or **likely-ineligible** and raises
prioritized flags. It is documentation support, not legal or tax advice; the
county assessor or state agency decides.

## 2. Scope

In scope: the schema, the engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate and the
generated representations. Out of scope: hosted deployment, authentication,
multi-tenancy, a state's form PDF, tax-bill calculation, and rules for states
outside `STATE_RULES` (they use `DEFAULT_RULE` and raise a verify flag).

## 3. Data model

Single record; unanswered text and enum fields are `''`, unanswered numeric, date
and time fields are `null`.

| Section | Fields |
| --- | --- |
| applicant | `applicantName`, `dateOfBirth`, `ageOnAssessmentDate`, `mailingAddress` |
| property | `state` (2-letter), `county`, `parcelNumber`, `propertyAddress`, `propertyType`, `ownershipType`, `ownerOnAssessmentDate`, `occupiedAsPrimaryResidence`, `occupancyStartDate`, `otherHomesteadClaimed` |
| exemptions | `claimHomestead`, `claimSenior`, `claimDisability`, `claimVeteran`, `claimCircuitBreaker` (yes/no), `veteranDisabilityPercent` |
| income | `householdIncomeDollars`, `incomeTaxYear` |
| documents | `proofOfOwnership`, `proofOfResidency`, `proofOfAge`, `proofOfIncome`, `proofOfDisability` |
| filing | `assessmentYear`, `filingDate`, `applicationType` (initial / renewal / late) |
| appeal | `appealRequested`, `noticeOfValueDate`, `appealFiled` |
| declaration | `penaltyAcknowledged`, `signedByApplicant`, `signatureDate` |

The SQL tables are `applicant`, `assessor`, `property_tax_exemption_application`
and the `_grade` / `_grade_rule` / `_grade_flag` triad. Column names are the
snake_case form of the fields above.

## 4. Engine

### 4.1 State rules

`STATE_RULES` (in `js/rules.js` and `src/lib/engine/rules.ts`) holds, per state:
`homestead` (text), `seniorProgram`, `seniorAge`, `incomeLimit`, `circuitBreaker`,
`deadline` (`month`, `day`, `yearOffset`, or null), `deadlineNote`, `appealNote`
and `verify`. Verified values and sources are in [`../doc/index.md`](../doc/index.md).

| State | Deadline | Senior age | Income limit | Notes |
| --- | --- | --- | --- | --- |
| CA | Feb 15 | none (no statewide senior program) | none | $7,000 Homeowners' Exemption |
| NY | Mar 1 | 65 | $110,750 (Enhanced STAR) | verify |
| TX | Apr 30 | 65 | none | $140,000 + $60,000 |
| FL | Mar 1 | 65 | none | $25,000 + about $25,722; verify |
| IL | none statewide | 65 | $65,000 | verify |
| PA | Mar 1 of the prior year | 65 | $48,110 | rebate due Jun 30 |
| OH | Dec 31 | 65 | $41,000 | $29,000 market value |
| WA | none confirmed | 61 | by county | verify |

An unknown or blank state uses `DEFAULT_RULE` (senior age 65, no limit, no
deadline) and raises `F-STATE-VERIFY-001`.

### 4.2 Classification

First match wins.

1. **likely-ineligible** when any of: not owner on the assessment date, not
   primary residence on it, a homestead claimed elsewhere; the filing date is
   after the state deadline and the application type is not `late`; at least one
   exemption is claimed and every claimed exemption fails its test.
2. **incomplete** when any of: a required identifier is blank (applicant name, state,
   county, parcel number, property address, assessment year, filing date), an
   assessment-date answer is blank, no exemption is claimed, a claimed
   exemption's test lacks an answer (age, income, VA rating), a required proof
   is not attached, or the declaration is unsigned, undated or the penalty is not
   acknowledged.
3. **likely-eligible** otherwise.

### 4.3 Exemption tests

`homestead` passes on base eligibility. `senior` fails with no statewide program
(CA), below `seniorAge`, or over `incomeLimit`. `disability` and
`circuit-breaker` fail over `incomeLimit` (circuit-breaker also with no program in
the state). `veteran` fails below a 10 percent VA rating. A test whose input is
blank is `unknown`, which makes the class incomplete.

### 4.4 Required proofs

Ownership and residency always; age for senior; income for senior, disability and
circuit-breaker; disability or VA rating for disability and veteran.

### 4.5 Deadline

`filingDeadline = (assessmentYear + yearOffset)-MM-DD`; `filedLate` is
`filingDate > filingDeadline`. No clock is read, so results are deterministic.

## 5. Flagged issues

Sorted high, then medium, then low, in insertion order within a tier.

| Id | Priority | Raised when |
| --- | --- | --- |
| `F-OWNERSHIP-001` | high | not owner on the assessment date |
| `F-OCCUPANCY-001` | high | not primary residence on the assessment date |
| `F-DUPLICATE-HOMESTEAD-001` | high | another homestead claimed |
| `F-DEADLINE-LATE-001` | high (medium if type `late`) | filed after the deadline |
| `F-PROGRAM-<EXEMPTION>-001` | medium | the state has no statewide program for the claim |
| `F-AGE-001` | high | below the senior age |
| `F-INCOME-001` | high | income over the limit |
| `F-VETERAN-RATING-001` | high | VA rating below 10 percent |
| `F-SIGNATURE-001` | high | declaration unsigned, undated, or penalty not acknowledged |
| `F-NO-EXEMPTION-001` | medium | nothing claimed |
| `F-MISSING-INFO-001` | medium | identifiers or assessment-date answers blank |
| `F-INCOME-MISSING-001` | medium | a claim's test needs an answer that is blank |
| `F-DOCUMENTS-001` | medium | required proof not attached |
| `F-STATE-VERIFY-001` | medium | state not in the table |
| `F-STATE-NODEADLINE-001` | low | known state with no statewide date |
| `F-STATE-FIGURES-001` | low | known state flagged `verify` |
| `F-APPEAL-001` | low | appeal guidance requested |
| `F-APPEAL-NOTICE-001` | low | appeal guidance requested but no notice date |

Rows map to `property_tax_exemption_application_grade_flag`
(`flag_id`, `category`, `priority`, `description`, `suggested_action`).

## 6. Disclaimer

Documentation support, not legal or tax advice; the county assessor or state
agency decides.

## 7. Verification

`bin/test-form united-states-property-tax-exemption-application`, `bin/test-personas united-states-property-tax-exemption-application`, `bin/test-engines united-states-property-tax-exemption-application`,
`bin/test-examples-conformance united-states-property-tax-exemption-application`, `bin/test-sql-apply united-states-property-tax-exemption-application`,
`bin/test-e2e --html united-states-property-tax-exemption-application`, the Svelte vitest suite and `cargo test`.
