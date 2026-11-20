# United States Social Security Card Application (Form SS-5) - specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour - update
the spec before changing code.

Slug: `united-states-social-security-card-application`

## 1. Purpose

A United States federal administrative form: Form SS-5, the application for an
original, replacement, or corrected Social Security card. It captures the
request, the applicant items, the evidence documents presented (identity, age,
US citizenship or lawful alien status, and any legal name change), the replacement
history, the signer, and the death-related Tell-SSA items. Its engine is a
**completeness and eligibility** engine, not a numeric score: it classifies the
application as **Ready to submit**, **Incomplete**, **Evidence missing**, or
**Not eligible**, and raises flagged issues. It is documentation support, not
legal advice, and it does not replace the Social Security Administration's
decision.

Full design description: [`index.md`](../index.md). Research and citations:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, the classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: collecting or storing the Social Security number, submitting to SSA,
hosted deployment, authentication, and multi-tenancy. The rules are federal, so
no `STATE_RULES` table is needed; the two-letter `stateOfResidence` is recorded
and validated against the USPS code list only.

## 3. Data model

The SQL source of truth is `sql/04_create_table_ss5_application.sql`. The
applicant lives in `patient`, an optional preparer in `clinician`. The TypeScript
shape groups the columns into five sections: `request`, `applicant`,
`evidence`, `filer`, `tellSsa`. Text and enum fields default to `''`; numeric
and date fields to `null`.

### Request (SS-5 items 12-15 and replacement history)

| Field | Type | Values |
| --- | --- | --- |
| `applicationDate` | date |  |
| `requestType` | enum | `original`, `replacement`, `correction` |
| `channel` | enum | `in-person`, `mail` |
| `previouslyApplied` | enum | `yes`, `no`, `dont-know` |
| `nameChange` | enum | `yes`, `no` |
| `nameChangeReason` | enum | `marriage`, `divorce`, `court-order`, `other` |
| `dateOfBirthCorrection` | enum | `yes`, `no` |
| `replacementsThisYear` | int |  |
| `replacementsLifetime` | int |  |
| `limitExceptionReason` | enum | `name-change`, `legend-change`, `non-receipt`, `ssa-error`, `hardship` |
| `limitExceptionEvidence` | enum | `yes`, `no` |

### Applicant (SS-5 items 1-11, 13-14, 16-17)

| Field | Type | Values |
| --- | --- | --- |
| `nameOnCard` | text |  |
| `nameAtBirth` | text |  |
| `otherNamesUsed` | text |  |
| `nameOnMostRecentCard` | text |  |
| `dateOfBirth` | date |  |
| `placeOfBirthCity` | text |  |
| `placeOfBirthRegion` | text |  |
| `sex` | enum | `female`, `male` |
| `citizenship` | enum | `us-citizen`, `legal-alien-allowed-to-work`, `legal-alien-not-allowed-to-work`, `other` |
| `nonWorkReasonValid` | enum | `yes`, `no` |
| `motherNameAtBirth` | text |  |
| `fatherName` | text |  |
| `stateOfResidence` | state |  |
| `mailingAddress` | text |  |
| `phone` | text |  |

### Evidence documents

| Field | Type | Values |
| --- | --- | --- |
| `identityDocument` | enum | `us-driver-license`, `state-id-card`, `us-passport`, `military-id`, `employee-id`, `school-id`, `health-insurance-card`, `other`, `none` |
| `identityDocumentExpired` | enum | `yes`, `no` |
| `ageDocument` | enum | `us-birth-certificate`, `us-passport`, `hospital-record`, `religious-record`, `immigration-record`, `other`, `none` |
| `citizenshipDocument` | enum | `us-birth-certificate`, `us-passport`, `certificate-of-naturalization`, `certificate-of-citizenship`, `consular-report-of-birth-abroad`, `permanent-resident-card`, `i-94-with-work-authorization`, `employment-authorization-document`, `other`, `none` |
| `citizenshipOnFile` | enum | `yes`, `no`, `dont-know` |
| `nameChangeDocument` | enum | `marriage-certificate`, `divorce-decree`, `court-order`, `certificate-of-naturalization`, `other`, `none` |
| `documentsOriginalOrCertified` | enum | `yes`, `no` |

### Filer, signature, and death-related items

| Field | Type | Values |
| --- | --- | --- |
| `signerRelationship` | enum | `self`, `parent`, `legal-guardian`, `custodian`, `other` |
| `signerName` | text |  |
| `signerIdentityDocument` | enum | `yes`, `no` |
| `signaturePresent` | enum | `yes`, `no` |
| `applicantDeceased` | enum | `yes`, `no` |
| `deathReportedToSsa` | enum | `yes`, `no` |
| `preparerNote` | text |  |

## 4. Classification algorithm

First matching class wins:

```
not-eligible      applicantDeceased
                  or (requestType = replacement and nameChange != yes
                      and (replacementsThisYear >= 3 or replacementsLifetime >= 10)
                      and no supported exception)
incomplete        any required field blank (see rules.js missingFields)
                  or (requestType = original and age >= 12 and channel = mail)
                  or (age < 18 and the signer is self, other, or unnamed)
evidence-missing  any evidence gap (below)
ready-to-submit   otherwise
```

Age is the whole years between `dateOfBirth` and `applicationDate`. A supported
exception needs both `limitExceptionReason` and `limitExceptionEvidence = yes`.

Evidence gaps:

| Gap | When it counts |
| --- | --- |
| identity | `identityDocument` is not an accepted type, or `identityDocumentExpired = yes` (every request) |
| age | `ageDocument` not accepted, for an original card or a date-of-birth correction |
| citizenship | `citizenshipDocument` does not match the `citizenship` answer; required for original and corrected cards, and for a replacement unless `citizenshipOnFile = yes` |
| work-authorization | original card, `citizenship = legal-alien-not-allowed-to-work`, `nonWorkReasonValid != yes` |
| name-change | `nameChange = yes` and `nameChangeDocument` not accepted |
| originals | `documentsOriginalOrCertified = no` |
| signer-identity | signer is not the applicant and `signerIdentityDocument != yes` |

Outputs: `applicationClass`, `missingEvidenceCount` (number of gaps), and
`replacementLimitReached` (limit reached, whether or not an exception applies).

## 5. Flagged issues

Flags fire independently of the class, with `id`, `category`, `priority`,
`description`, and `suggestedAction`, stable-sorted high, medium, low.

| Id | Category | Priority | Fires when |
| --- | --- | --- | --- |
| `F-APPLICANT-DECEASED-001` | applicant-deceased | high | the applicant has died |
| `F-DEATH-REPORT-001` | applicant-deceased | medium | deceased and the death not reported to SSA |
| `F-REPLACEMENT-LIMIT-001` | replacement-limit | high | limit reached, no supported exception |
| `F-REPLACEMENT-LIMIT-EXCEPTION-001` | replacement-limit | low | limit reached, exception supported |
| `F-REPLACEMENT-LIMIT-EXCEPTION-002` | replacement-limit | medium | limit reached, exception claimed without documents |
| `F-REPLACEMENT-LIMIT-NEAR-001` | replacement-limit | low | 2 this year or 9 in a lifetime |
| `F-IDENTITY-EVIDENCE-001` | identity-evidence | high | identity gap (expired or unacceptable) |
| `F-AGE-EVIDENCE-001` | age-evidence | high | age gap |
| `F-CITIZENSHIP-EVIDENCE-001` | citizenship-evidence | high | citizenship gap |
| `F-WORK-AUTHORIZATION-001` | work-authorization | high | work-authorization gap |
| `F-NAME-CHANGE-EVIDENCE-001` | name-change-evidence | high | name-change gap |
| `F-NAME-DIFFERS-001` | name-change-evidence | medium | card name differs from birth name, no name change recorded |
| `F-DOCUMENT-ORIGINALS-001` | document-quality | medium | documents are not originals or certified copies |
| `F-IN-PERSON-001` | in-person-required | high | original card, age 12 or older, by mail |
| `F-MINOR-SIGNER-001` | signer-authority | high | under 18 and the signer is not a parent or guardian |
| `F-ADULT-SIGNER-001` | signer-authority | medium | adult signed for by another |
| `F-SIGNER-IDENTITY-001` | signer-authority | medium | signer's own identity not shown |
| `F-SIGNATURE-001` | signer-authority | high | application not signed |
| `F-MISSING-FIELDS-001` | missing-field | medium | required items blank |
| `F-PRIOR-APPLICATION-001` | missing-field | medium | replacement or correction but item 12 is no |
| `F-STATE-VERIFY-001` | state-verify | low | state is not a USPS code |

## 6. Inputs and outputs

Input: `SocialSecurityApplication` (section 3). Output:
`validateApplication(d) -> { applicationClass, missingEvidenceCount,
replacementLimitReached }` and `detectFlaggedIssues(d) -> FlaggedIssue[]`. The
HTML engine is `js/rules.js`, `js/grader.js`, `js/flags.js`; the Svelte port is
`src/lib/engine/`.

## 7. Artefacts

`sql/` (source of truth), `xml/`, `fhir/r5/`, `protobuf/`, `openapi/` (generated,
never hand-edited), `front-end-with-html/`, `front-end-with-svelte/`,
`back-end-with-axum/`, `examples/` (fixture, FHIR bundle, `personas.json`),
`doc/`, `skills/`.

## 8. Acceptance criteria

- `bin/test-form`, `bin/test-personas`, `bin/test-engines`,
  `bin/test-examples-conformance`, `bin/test-sql-apply`, and `bin/test-e2e --html`
  pass for the slug.
- `examples/personas.json` covers all four classes and every flag id in section 5.
- The HTML and Svelte engines agree on every persona.
- The Social Security number is never a column, field, or fixture value.

## 9. Compliance

Documentation support, not legal advice; the Social Security Administration
decides every application. The form does not collect the Social Security number
and does not submit anything to SSA.

## 10. References

See [`doc/index.md`](../doc/index.md): SS-5, 20 CFR 422.103 and 422.107, POMS
RM 10205.400, and the 2006 Federal Register rule on replacement-card limits.

## 11. Verify

```sh
bin/test-form united-states-social-security-card-application
bin/test-personas united-states-social-security-card-application
bin/test-engines united-states-social-security-card-application
```
