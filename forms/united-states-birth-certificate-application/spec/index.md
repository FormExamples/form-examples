# United States Birth Certificate Application — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust back end) must satisfy. Treat it as the source of truth for behavior: update the spec before changing code.

Slug: `united-states-birth-certificate-application`

## 1. Purpose

Prepare a request for a **certified copy of a US birth certificate** from the state or territory vital records office that registered the birth, and check it before it is sent. There is no national registry: the CDC National Center for Health Statistics (NCHS) publishes *Where to Write for Vital Records*, which points each requester to the issuing office, and each state or territory sets its own eligibility, identification, fee, and format rules. The data collected about the person named follows the US Standard Certificate of Live Birth (name, sex, date, place, facility, mother's name before first marriage, father's name).

The engine is a **completeness / validity / eligibility** engine, not a clinical score. It classifies the filled request into one of three classes and raises prioritized flagged issues.

**Disclaimer.** The form is documentation support, **not legal advice**. The issuing vital records office decides whether a certified copy is issued. State rules and fees change; the engine holds verified values for eight states only and says so when it falls back.

## 2. Scope

In scope: the SQL schema, the classification engine, the two front-ends (`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate, and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of scope: submitting to any office, payment, identity verification, amendments and corrections of a record, delayed registrations, adoption and sealed-record procedures beyond a flag, and deployment.

## 3. Data model

Three entities plus the grading triad (mirrors `sql/`):

| Table | Role |
| --- | --- |
| `applicant` | the requester: name, date of birth (for minimum-age rules), email, phone, mailing address |
| `registrant` | the person named: name, sex, date of birth, city, county, `birth_state` (2-letter), facility, mother's name before first marriage, father's name, `is_deceased`, `is_adopted` |
| `united_states_birth_certificate_application` | the request: `requester_relationship`, `purpose`, `needs_apostille`, `apostille_country`, `certificate_type`, `copies`, `delivery_method`, `fee_enclosed_usd`, ID and supporting-document answers, `declaration_signed`, `application_note` |
| `..._grade`, `..._grade_rule`, `..._grade_flag` | the computed class, the audit trail of fired rules, and the flagged issues |

Enumerations:

- relationship: `self`, `parent`, `legal-guardian`, `legal-representative`, `spouse`, `child`, `sibling`, `grandparent`, `grandchild`, `government-agency`, `other`
- purpose: `passport`, `real-id`, `school`, `employment`, `benefits`, `genealogy`, `foreign-use`, `other`
- copy type: `certified-long-form` (full image of the record), `certified-short-form` (abstract), `informational` (not valid for identity)
- delivery: `online`, `mail`, `in-person`
- ID: `state-driver-license`, `state-id-card`, `us-passport`, `military-id`, `other-photo-id`, `none`

Conventions: `''` for unanswered text and enum fields; `null` for unanswered numeric, date, and time fields. The wizard has seven sections in one continuous single page: Applicant, Person named, Relationship and purpose, Order, ID and documents, Declaration, Summary.

## 4. Classification algorithm

First matching class wins:

```
ineligibleRequester(d)  -> 'ineligible-requester'
anyGap(d)               -> 'incomplete'
otherwise               -> 'ready-to-submit'
```

`ineligible-requester` precedes completeness: finishing the paperwork cannot cure a requester with no right to a certified copy.

**State rule resolution.** `registrant.state` (upper-cased) selects a row of `STATE_RULES`; any other value uses `DEFAULT_RULE` (the Model State Vital Statistics Act "direct and tangible interest" set) and raises `F-BIRTH-STATE-001`.

**ineligibleRequester.** Not exempt by an informational copy (see below), and either the relationship is not in the rule's eligible set (an `open` state such as OH accepts every relationship; `eligibleIfDeceased` extras such as Florida's sibling apply only when `registrant.deceased = yes`), or the relationship is `self` and the applicant's age (from `applicant.dateOfBirth`, against the clock) is below the rule's `minSelfAge`.

**Informational exemption.** When `certificateType = informational` and the state offers informational copies to anyone (CA, WA), eligibility, ID, proof, authority, and notarization are not tested.

**anyGap** (any one makes the request incomplete):

1. missing registrant or order data: registrant name, valid date of birth (not in the future), city, 2-letter state, mother's name before first marriage; applicant name; relationship; purpose; copy type; copies at least 1; delivery method
2. missing or expired photo ID (`idType` blank or `none`, or `idUnexpired` not `yes`)
3. missing proof of relationship for a spouse, child, sibling, grandparent, grandchild, or other requester, or for any non-agency requester when the registrant is deceased
4. missing authority document for a guardian, legal representative, or government agency
5. a mailed request in a state needing a notarized sworn statement (CA) without one
6. a copy type unsuitable for the purpose: informational for passport, REAL ID, school, employment, benefits, or foreign use; any non-long form when an apostille is needed; short form for a passport or foreign use
7. fee short (not tested for online orders, which pay at checkout, or where the state fee is unknown): `feeEnclosedUsd` null or below `feeUsd + (copies - 1) * extraCopyUsd`
8. an apostille wanted with no destination country
9. the declaration under penalty of perjury unsigned

## 5. State rule table

Values encoded in `STATE_RULES` (HTML `rules.js`, Svelte `birth-rules.ts`). "Fee verified" marks values confirmed against an official page or statute in the research pass dated 2026-11-20; the rest came from county pages, CDC listings, or conflicting sources and raise the low-priority verify flag.

| State | Access | Eligible requesters (certified copy) | Min. age (self) | Fee, first / additional copy | Mail needs notarized sworn statement | Informational copy to anyone | Fee verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CA | restricted | self, parent, guardian, legal representative, spouse, child, sibling, grandparent, grandchild, government agency | 18 | $31 / $31 | yes | yes | yes |
| NY (outside NYC) | restricted | self, parent, spouse, child, guardian, legal representative, government agency | 18 | $30 / $30 | no | no | yes |
| TX | restricted | self, parent, spouse, child, sibling, grandparent, grandchild, guardian, legal representative | 18 | $22 / $3 | no | no | yes |
| FL | restricted | self, parent, guardian, legal representative; plus spouse, child, grandchild, sibling when the registrant is deceased | 18 | $15 / $10 | no | no | no |
| IL | restricted | self, parent, guardian, legal representative, government agency | 18 | $15 / $2 | no | no | no |
| PA | restricted | self, spouse, parent, sibling, child, guardian, legal representative | 16 | $20 / $20 | no | no | yes |
| OH | open | anyone | none | $21.50 / $21.50 | no | no | no |
| WA | restricted | self, parent, spouse, child, sibling, grandparent, grandchild, guardian, legal representative, government agency | 18 | $25 / $25 | no | yes | yes |
| other | restricted (default) | self, parent, guardian, legal representative, spouse, child, government agency | 18 | unknown | no | no | no |

Sources and caveats are in [`../doc/index.md`](../doc/index.md).

## 6. Flagged issues

Stable ids, category, priority; ordered high, medium, low, with insertion order inside a tier.

| Id | Category | Priority | Fires when |
| --- | --- | --- | --- |
| `F-BIRTH-INELIGIBLE-001` | ineligible-requester | high | relationship not eligible under the rule (not for the underage case) |
| `F-BIRTH-UNDERAGE-001` | requester-underage | high | self-requester below the state minimum age |
| `F-BIRTH-DATA-001` | missing-registrant-data | high | gap 1 |
| `F-BIRTH-ID-001` | missing-id | high | gap 2 |
| `F-BIRTH-PROOF-001` | missing-proof | high | gap 3 |
| `F-BIRTH-AUTHORITY-001` | missing-authority | high | gap 4 |
| `F-BIRTH-NOTARY-001` | missing-notarization | high | gap 5 |
| `F-BIRTH-TYPE-001` | certificate-type-unacceptable | high | gap 6 |
| `F-BIRTH-DECLARATION-001` | missing-declaration | high | gap 9 |
| `F-BIRTH-FEE-001` | fee-shortfall | medium | gap 7 |
| `F-BIRTH-APOSTILLE-001` | apostille | medium | gap 8 |
| `F-BIRTH-APOSTILLE-002` | apostille | medium | apostille wanted and destination named: the Secretary of State issues it on a recent certified long form; Hague membership decides apostille versus legalization |
| `F-BIRTH-ADOPTED-001` | adopted-registrant | medium | `is_adopted = yes`: original sealed, amended certificate, decree may be needed |
| `F-BIRTH-DECEASED-001` | deceased-registrant | medium | `is_deceased = yes`: proof of death and relationship |
| `F-BIRTH-STATE-001` | state-rule-unverified | low | unknown state, or the state fee is not verified |
| `F-BIRTH-NYC-001` | state-rule-unverified | low | state is NY: New York City births are issued by the NYC Health Department |

## 7. Inputs and outputs

**Input.** A typed `BirthCertificateApplication` (sections `applicant`, `registrant`, `purpose`, `order`, `evidence`, `declaration`) mirroring `sql/`.

**Output.** `validateApplication(d)` returns `{ applicationClass, expectedFeeUsd, stateRuleApplied }` in HTML (the flag detector `detectFlaggedIssues(state)` is separate, composed by `form-app.js`); the Svelte port returns the same plus `flaggedIssues` and `timestamp`. Exports: JSON, XML, CSV, TSV. FHIR R5 and PDF reports are generated.

## 8. Artefacts

| Artefact | Path |
| --- | --- |
| SQL migrations | `sql/` |
| XML, FHIR R5, protobuf, OpenAPI | `xml/`, `fhir/r5/`, `protobuf/`, `openapi/` (generated) |
| HTML wizard and dashboard | `front-end-with-html/` |
| SvelteKit wizard and dashboard | `front-end-with-svelte/` |
| Axum JSON API | `back-end-with-axum/` |
| Personas (regression oracle) | `examples/personas.json` |

## 9. Acceptance criteria

- every class is reachable; every flag id above fires in at least one persona or unit test
- the eight verified states resolve to their rows; an unknown state falls back to the default and raises `F-BIRTH-STATE-001`
- a self-requester below the minimum age is `ineligible-requester`
- an informational copy is exempt from eligibility checks only where the state offers one
- the HTML and Svelte engines agree on every persona
- `bin/test-form`, `bin/test-personas`, `bin/test-engines`, `bin/test-sql-apply`, `bin/test-examples-conformance` pass

## 10. Compliance

This is a non-clinical administrative form, so the medical-device software notes in the root `AGENTS.md` do not apply. It is documentation support, not legal advice, and makes no determination for any agency. Personal data (names, dates of birth, parents' names) is held in the browser's local storage only until exported.

## 11. References

See [`../doc/index.md`](../doc/index.md) for the full citation list: CDC/NCHS Where to Write for Vital Records, the Model State Vital Statistics Act, the US Standard Certificate of Live Birth, the state statutes and agency pages per state, the US Department of State birth-certificate requirements for passports, the REAL ID Act, and the Hague Apostille Convention.

## 12. Verify

```sh
bin/test-form united-states-birth-certificate-application
bin/test-personas united-states-birth-certificate-application
bin/test-engines united-states-birth-certificate-application
bin/test-sql-apply united-states-birth-certificate-application
bin/test-examples-conformance united-states-birth-certificate-application
```
