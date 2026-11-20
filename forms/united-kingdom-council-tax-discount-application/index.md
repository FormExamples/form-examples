# United Kingdom Council Tax Discount Application

A single-page, step-by-step application to a local council in England for a
Council Tax discount, exemption, disregard or reduction. It captures the claim
type (single person discount, 50% all-disregarded discount, student exemption,
severe mental impairment, disabled band reduction, care-leaver relief or Council
Tax Reduction), the applicant and property (band A to H), the occupant roster,
the supporting evidence, the effective date and the declaration.

The engine is a **completeness and eligibility** engine, not a clinical score.
It classifies the application as **likely eligible**, **incomplete** or **likely
ineligible**, gives the indicative outcome and raises flagged issues:

- adult count versus discount type
- student status evidence (1 year, 21 hours a week)
- disregarded occupants and their evidence
- severe mental impairment certificate and qualifying benefit
- disabled band reduction adaptation
- backdating
- the duty to report changes within 21 days
- the fraud-warning penalty

**Disclaimer.** Eligibility is decided by the billing authority, not by this
form. A "likely eligible" result is not a decision or an award.

## Steps

| Step | Section | Content |
| --- | --- | --- |
| 1 | Claim | claim type, billing authority, account reference, application and effective dates |
| 2 | Applicant and property | applicant, own status, address, postcode, band, main home, liable role |
| 3 | Household | the occupant roster |
| 4 | Evidence | SMI certificate and benefit, student certificate and course, adaptation, apprentice, care leaver |
| 5 | Declaration | true and complete, 21-day duty, fraud warning, name and date |
| 6 | Summary | live eligibility class, then the report |

## Classification

First match wins: a disqualifying fact gives **likely ineligible**; a missing
answer or evidence gives **incomplete**; otherwise **likely eligible**. See
[`spec/index.md`](spec/index.md) for the rules and flags and
[`doc/index.md`](doc/index.md) for the GOV.UK sources.

## Layers

`sql/` (source of truth), generated `xml/`, `fhir/r5/`, `protobuf/`,
`openapi/`, `front-end-with-html/`, `front-end-with-svelte/`,
`back-end-with-axum/`, `examples/` (fixtures and `personas.json`).
