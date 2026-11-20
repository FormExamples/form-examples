# United Kingdom Divorce Application - specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behavior - update
the spec before changing code.

Slug: `united-kingdom-divorce-application`

## 1. Purpose

A completeness and time-gate checker for applying for a divorce (or the
dissolution of a civil partnership) in England and Wales under the Divorce,
Dissolution and Separation Act 2020, across the application (D8 or online), the
conditional order (D84) and the final order (D36). It classifies the application
as **Ready to apply**, **Incomplete**, or **Not eligible yet** and raises flagged
issues. It gives no legal advice; the court decides every application.

Full design description: [`index.md`](../index.md). Cited rules:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, the engine, two consolidated front-ends, the Rust Axum
JSON-API crate and the generated representations. Out of scope: judicial
separation, nullity, the content of financial or children orders, residual
jurisdiction, hosted deployment, authentication and legal advice.

## 3. Data model

Sections and fields (camelCase; SQL columns are the snake_case equivalents on
`united_kingdom_divorce_application`):

| Section | Fields |
| --- | --- |
| `application` | `applicationType` (divorce, dissolution), `applicationMode` (sole, joint), `stage` (application, conditional-order, final-order), `asOfDate`, `domesticAbuseRisk` |
| `marriage` | `marriageDate`, `marriagePlace`, `marriageCountry`, `legallyRecognised`, `breakdownConfirmed`, `marriageCertificateType` (original, certified-copy, not-held), `certificateInEnglish`, `certifiedTranslation`, `nameChanged`, `nameChangeProof` (marriage-certificate, deed-poll, none) |
| `jurisdiction` | `applicantHabitualResident`, `applicantResidenceMonths`, `applicantDomiciled`, `respondentHabitualResident`, `respondentDomiciled`, `lastHabituallyResidentTogether` |
| `parties` | `applicantName`, `applicantAddress`, `applicantEmail`, `respondentName`, `respondentAddress`, `respondentEmail`, `respondentAddressKnown`, `serviceMethod` (email, post, alternative-service) |
| `children` | `childrenUnder18`, `childrenCount`, `childrenArrangements` (agreed, not-agreed, undecided), `childrenNote` |
| `finances` | `financialOrderIntended` (yes, no, undecided), `financialOrderApplied`, `feeStatus` (paid, help-with-fees-approved, help-with-fees-pending, unpaid) |
| `progress` | `applicationIssuedDate`, `respondentAcknowledged`, `conditionalOrderGrantedDate`, `finalOrderDelayExplained` |

Yes/no fields are `'yes' | 'no' | ''`. Persistence: tables `applicant`,
`caseworker`, `united_kingdom_divorce_application`, and its `_grade`,
`_grade_rule` and `_grade_flag` children.

## 4. Classification algorithm

```text
Dates are ISO days in UTC; `asOf` = application.asOfDate.

oneYearDate        = marriageDate + 1 year                  (first anniversary)
conditionalDate    = applicationIssuedDate + 140 days       (20 weeks)
finalDate          = conditionalOrderGrantedDate + 43 days  (6 weeks and 1 day)
finalDeadline      = conditionalOrderGrantedDate + 1 year

stageGateNotMet:
  stage = application        -> asOf <  oneYearDate
  stage = conditional-order  -> asOf <  conditionalDate
  stage = final-order        -> asOf <  finalDate
  (a gate whose input date or asOf is missing is not "not met"; the missing
   input is an `incomplete` rule instead)

applicationClass (first match wins):
  stageGateNotMet          -> 'not-eligible-yet'
  any readiness rule fires -> 'incomplete'
  otherwise                -> 'ready-to-apply'

earliestEligibleDate = oneYearDate | conditionalDate | finalDate for the stage, else ''

jurisdictionGrounds (DMPA 1973 s.5(2)), met when any holds:
  both habitually resident; lastHabituallyResidentTogether; sole and respondent
  habitually resident; applicant habitually resident for >= 12 months; applicant
  domiciled and habitually resident for >= 6 months; both domiciled; either
  domiciled.
```

Readiness rules (each fires an audit row `R-...-01` in `_grade_rule`): setup
fields missing; marriage date missing; recognition not confirmed; breakdown not
confirmed; domestic-abuse answer missing; joint despite abuse; no jurisdiction
ground; certificate not held or language unanswered; translation missing; name
proof missing; party names missing; sole service answers missing or address
unusable; children answers missing; financial intent unanswered; fee not paid
(application stage); issue date missing (conditional-order stage); conditional
order date missing, 12-month delay unexplained and financial order status
unanswered (final-order stage); and the time gate itself.

## 5. Flagged issues

Computed independently of the class, sorted high, medium, low:

| Flag | Category | Priority |
| --- | --- | --- |
| One-year rule not met | timing | high |
| 20-week reflection period running | timing | high |
| 6 weeks and 1 day wait running | timing | high |
| Relationship not recognized | relationship-status | high |
| Breakdown not stated | relationship-status | high |
| Joint application despite domestic-abuse risk | domestic-abuse | high |
| No jurisdiction ground met | jurisdiction | high |
| Marriage certificate missing | marriage-certificate | high |
| Certified translation missing | translation | high |
| Service address unusable (sole) | service-address | high |
| Financial order wanted, not applied for | financial-order | medium; high at final order |
| Children arrangements not agreed | children-arrangements | medium |
| Fee not paid (application stage) | fee | medium |
| Acknowledgement not returned (conditional order, sole) | acknowledgement | medium |
| Final order delayed more than 12 months | final-order-delay | medium |
| Name-change proof missing | name-change-proof | low |

## 6. Inputs and outputs

**Input.** A typed application object mirroring `sql/`. Unanswered text and enum
fields default to `''`; unanswered numeric and date fields to `null`.

**Output.** `{ applicationClass, earliestEligibleDate, jurisdictionMet, rules }`
from `validateApplication`, and `FlaggedIssue[]` from `detectFlaggedIssues`
(a split engine; `form-app.js` composes them).

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml`, `fhir`, `protobuf`, `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-axum` | Rust + Axum JSON API |
| `back-end-with-axum-setup` | generated scaffold script |

Generated artefacts are never hand-edited.

## 8. Acceptance criteria

- `bin/test-form united-kingdom-divorce-application` exits cleanly.
- The engine is pure and unit-tested: each class, the three time gates on both
  sides of the boundary, each jurisdiction ground, and the flags.
- `examples/personas.json` pins every class and flag.
- The front-ends conform to the Lily HTML and Svelte contracts.
- The Rust crate builds and `cargo test` passes.

## 9. Compliance

Inherits the monorepo baseline. The form is an administrative legal-process
completeness aid and gives no legal advice.

## 10. References

- [GOV.UK: Get a divorce](https://www.gov.uk/divorce)
- [GOV.UK: Get a divorce, printable guide](https://www.gov.uk/divorce/print)
- [Divorce, Dissolution and Separation Act 2020](https://www.legislation.gov.uk/ukpga/2020/11/contents)
- [Matrimonial Causes Act 1973](https://www.legislation.gov.uk/ukpga/1973/18/contents)
- [Civil Partnership Act 2004](https://www.legislation.gov.uk/ukpga/2004/33/contents)
- [Domicile and Matrimonial Proceedings Act 1973 s.5](https://www.legislation.gov.uk/ukpga/1973/45/section/5)
- [Family Procedure Rules 2010](https://www.legislation.gov.uk/uksi/2010/2955/contents)
- [`doc/index.md`](../doc/index.md) - the rule-to-source table
- [`/spec.md`](../../../spec.md) - system-level specification

## 11. Verify

```sh
bin/test-form united-kingdom-divorce-application
```
