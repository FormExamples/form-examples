# United States Marriage License Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-states-marriage-license-application`

## 1. Purpose

A documentation-support instrument for applying for a United States marriage
license and, after the ceremony, for the certified marriage certificate. The
applicants record the issuing state and county, both applicants, eligibility
facts (age and consent, prior marriages, relationship, proxy), the license
issuance and fee, and the ceremony (officiant, witnesses, license return). The
engine classifies the application and raises prioritized flags.

**This is documentation support, not legal advice.** There is no federal
marriage license; each state sets its own rules and a county clerk issues the
license. The issuing agency or a court decides, and the rules change, so every
state value must be re-verified with the clerk.

## 2. Scope

In scope: the state-variable rules a clerk applies to a license application and
the steps through to the recorded certificate: minimum age and parental or court
consent, an existing marriage, prohibited relationships, a waiting period, license
validity, witnesses, officiant authority, premarital blood tests (none are
required in any encoded state), proxy marriage, in-person appearance,
identification, Social Security number status, the fee, and the return of the
signed license.

Out of scope: choosing a state, immigration consequences, name change, pre-nuptial
agreements, common-law marriage, covenant marriage, and the legal merits of any
individual case. Same-sex couples may marry in every state (*Obergefell v.
Hodges*, 2015) and every state recognizes a valid out-of-state marriage (Respect
for Marriage Act, 2022); the engine never uses sex or gender as a bar.

## 3. Data model

Six sections, mirroring `sql/04_create_table_united_states_marriage_license_application.sql`
(camelCase here, snake_case in SQL; party details live in the `applicant` and
`county_clerk` tables). Unanswered text and enum fields default to `''`;
unanswered numeric, date, and time fields default to `null`.

| Section | Fields |
| --- | --- |
| `jurisdiction` | `state` (USPS code), `county`, `applicationDate`, `licenseType` (`standard`, `confidential`) |
| `applicantOne`, `applicantTwo` | `name`, `sex`, `dateOfBirth`, `placeOfBirth`, `residenceState`, `idPresented`, `ssnStatus` (`provided`, `none-issued`, `declined`; the number itself is never stored), `maritalStatus` (`never-married`, `divorced`, `widowed`, `annulled`, `currently-married`), `priorMarriageEndedDate` |
| `eligibility` | `relationshipBetweenApplicants` (`not-related`, `related-prohibited`), `minorConsent` (`not-applicable`, `parental-consent`, `court-order`, `none`), `activeDutyMilitary`, `appearInPerson`, `proxyRequested`, `premaritalCourseCompleted`, `bloodTestEvidence` (`provided`, `not-required`, `not-provided`) |
| `issuance` | `feePaidUsd`, `licenseIssuedDate`, `clerkNote` |
| `ceremony` | `ceremonyDate`, `officiantType`, `officiantName`, `officiantAuthorized`, `witnessCount`, `licenseReturnedDate`, `certifiedCopiesRequested` |

## 4. Classification algorithm

The engine is a pure function over the application and the state rule
(`STATE_RULES` in `front-end-with-html/js/rules.js`, with the Svelte port in
`front-end-with-svelte/src/lib/engine/`). First matching class wins:

```
underageBarred || currentlyMarried || prohibitedRelationship || proxyNotPermitted -> 'not-eligible'
missingRequired || minorConsentMissing || idNotPresented || notAppearing
  || priorMarriageUndocumented || bloodTestMissing
  || ceremonyBeforeIssue || waitingNotElapsed || licenseExpired
  || witnessShortfall || officiantProblem                                          -> 'incomplete'
otherwise                                                                          -> 'ready-to-apply'
```

`not-eligible` outranks `incomplete`: a bar that paperwork cannot cure takes
precedence over missing data.

Definitions:

- **Age.** Completed years on the application date (else the ceremony date, else
  today). Under the state minimum age (18 everywhere encoded) the applicant is
  *barred* when the state has no minor path, when the applicant is below the path's
  age floor, or when the age gap exceeds the state limit (Florida 2 years, Ohio 4
  years); otherwise the applicant needs the path's consent (court order, or parental
  consent). California's court-order path closes on 2027-01-01.
- **Waiting period.** Whole days from the issue date (else the application date)
  to the ceremony. Waivers: a premarital course (Texas, Florida), active military
  duty (Texas), both applicants living outside the state (Florida).
- **Validity.** Ceremony more than `validDays` after the issue date is expired.
- **Witnesses.** `witnesses` for a standard license, `confidentialWitnesses` for a
  confidential license (California). A ceremony date with fewer witnesses is a shortfall.
- **Proxy.** Only a state with `proxy: 'military'` and an active-duty applicant.
- **Certificate return.** The signed license is due `returnWithinDays` after the
  ceremony; overdue is judged against today.
- **Derived dates.** `earliestCeremonyDate` = issue date + waiting days;
  `licenseExpiryDate` = issue date + `validDays`.

### State rule table

Values were taken from the sources in section 10 and are indicative; clerks set
fees and some procedures by county, and rules change. An unlisted state uses
`DEFAULT_RULE` (18 to marry, no minor path, no wait, 60-day validity, no
witnesses, 10-day return) and raises `F-USMLA-019` ("verify the state rule").

| State | Min age (minor path) | Wait | Valid | Witnesses | Proxy | Return | Source notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CA | 18 (court order to 2026-12-31; none after) | none | 90 d | 1 public, 0 confidential | military | 10 d | Recording Law, Wikipedia |
| NY | 18 (no exceptions) | 24 h | 60 d | 1 | none | 5 d | Recording Law |
| TX | 18 (court order, floor 16) | 72 h; waived: course, active duty | 90 d | 0 | military | 30 d | Texas Family Code 2.204 |
| FL | 18 (parental consent at 17, partner within 2 years) | 72 h; waived: course, both nonresident | 60 d | 0 | none | 10 d | Recording Law, Wikipedia |
| IL | 18 (parental consent or court at 16-17) | 24 h | 60 d | 0 | none | 10 d | Recording Law |
| PA | 18 (no exceptions) | 72 h | 60 d | 0 (2 for self-uniting) | none | 10 d | Recording Law |
| OH | 18 (juvenile court at 17, partner within 4 years) | none | 60 d | 0 | none | 30 d | Recording Law |
| WA | 18 (no exceptions) | 72 h, no waiver | 60 d | 2 | none | 30 d | RCW 26.04, King and Clark counties |
| GA | 18 (court/emancipation at 17) | none | no statutory expiry (365 d used) | 0 | none | 30 d | Recording Law |
| VA | 18 (no exceptions) | none | 60 d | 0 | none | 30 d | Recording Law |

Fees are not graded; they only inform the report (indicative: CA $91, NY $40,
TX $81, FL $86, IL $60, PA $75, OH $60, WA $162, GA $76, VA $30).

## 5. Flagged issues

Flags are independent of the class and sorted high, medium, low. Ids are stable.

| Id | Category | Priority | Raised when |
| --- | --- | --- | --- |
| F-USMLA-001 | underage | high | an applicant is under the state minimum age with no permitted path |
| F-USMLA-002 | minor-consent | high | a minor may marry on a consent path but consent or the court order is missing |
| F-USMLA-003 | existing-marriage | high | either applicant is currently married |
| F-USMLA-004 | prohibited-relationship | high | the applicants are related within a prohibited degree |
| F-USMLA-005 | proxy-not-permitted | high | a proxy is requested and the state or facts do not allow it |
| F-USMLA-006 | missing-required-data | medium | a required field is empty |
| F-USMLA-007 | prior-marriage-undocumented | high | a prior marriage ended but the end date is missing or after the application |
| F-USMLA-008 | identification | medium | an applicant has not presented photo ID |
| F-USMLA-009 | in-person-appearance | medium | the applicants will not appear in person and no proxy is requested |
| F-USMLA-010 | waiting-period | high | the ceremony is inside the waiting period |
| F-USMLA-011 | license-expired | high | the ceremony is after the license expired |
| F-USMLA-012 | ceremony-timing | high | the ceremony is before the license issued |
| F-USMLA-013 | witnesses | high | fewer witnesses than the state requires |
| F-USMLA-014 | officiant | high | the officiant is not authorized |
| F-USMLA-015 | officiant | medium | the officiant is not identified |
| F-USMLA-016 | certificate-return | medium | the signed license is overdue |
| F-USMLA-017 | certificate-return | low | the signed license was returned late |
| F-USMLA-018 | certificate-return | medium | the return date is before the ceremony |
| F-USMLA-019 | state-rule | medium | the state is not in the rule table |
| F-USMLA-020 | blood-test | medium | the rule requires a blood test and no evidence is recorded (no encoded state does) |
| F-USMLA-021 | fee | low | a license issue date is recorded without a fee |
| F-USMLA-022 | same-sex-couple | low | the applicants are the same sex; not a bar (*Obergefell*) |
| F-USMLA-023 | social-security-number | low | a Social Security number was declined or never issued |
| F-USMLA-024 | waiting-period | low | no ceremony date yet: the earliest ceremony and expiry dates |

## 6. Inputs and outputs

**Input.** A typed application object whose shape mirrors the SQL schema in
`sql/`.

**Output.** A grade object and a flag list:

```ts
{
  applicationClass: 'ready-to-apply' | 'incomplete' | 'not-eligible';
  earliestCeremonyDate: string | null;  // ISO date
  licenseExpiryDate: string | null;     // ISO date
  stateRuleKnown: boolean;
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

- `bin/test-form united-states-marriage-license-application` exits cleanly.
- The engine is pure (no I/O; the only clock read is `today` for the overdue-return
  test), unit-tested, and pinned by `examples/personas.json` (every class and every
  flag except F-USMLA-020).
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)); the SvelteKit
  front-end conforms to the Lily Svelte contract and passes `pnpm check`, `pnpm test`,
  lint, and format.
- The Rust crate builds and `cargo test` passes against a scratch Postgres.
- The report always carries the disclaimer: documentation support, not legal advice.

## 9. Compliance

Documentation-support instrument for a government form; it makes no legal
determination. Inherits the monorepo baseline (MDCG 2019-11 Rev.1 classification
posture for software that supports documentation without deciding, ISO/IEC/IEEE
26514:2022 user information). Legal grounding: the state marriage statutes in
section 10, *Obergefell v. Hodges*, and the Respect for Marriage Act.

## 10. References

- [Cornell LII — Marriage Laws of the Fifty States, District of Columbia and Puerto Rico](https://www.law.cornell.edu/wex/table_marriage)
- [Justia — Getting a Marriage License: 50-State Survey](https://justia.com/family/getting-a-marriage-license-50-state-survey)
- [Recording Law — Marriage License Requirements by State (2026)](https://www.recordinglaw.com/us-laws/marriage-license-requirements/)
- [Wikipedia — Marriageable age in the United States](https://en.wikipedia.org/wiki/Marriageable_age_in_the_United_States)
- [Texas Family Code section 2.204 — 72-hour waiting period and its exceptions](https://codes.findlaw.com/tx/family-code/fam-sect-2-204/)
- [Revised Code of Washington 26.04.180 — license validity](https://law.justia.com/codes/washington/2022/title-26/chapter-26-04/section-26-04-180/?current=1)
- [Clark County, Washington Auditor — three-day waiting period](https://clark.wa.gov/auditor/waiting-period)
- [King County, Washington — marriage licensing](https://www.kingcounty.gov/marriage)
- [*Obergefell v. Hodges*, 576 U.S. 644 (2015)](https://supreme.justia.com/cases/federal/us/576/644/)
- [Respect for Marriage Act, Pub. L. 117-228 (2022)](https://www.congress.gov/bill/117th-congress/house-bill/8404)
- [42 U.S.C. 666(a)(13) — Social Security numbers on marriage license applications](https://www.law.cornell.edu/uscode/text/42/666)
- [8 U.S.C. 1101(a)(35) — proxy marriage and immigration](https://www.law.cornell.edu/uscode/text/8/1101)

- [`index.md`](../index.md) — form description
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`doc/index.md`](../doc/index.md) — research and citations
- [`plan.md`](../plan.md), [`tasks.md`](../tasks.md)
- [`/spec.md`](../../../spec.md) — system-level specification

## 11. Verify

```sh
bin/test-form united-states-marriage-license-application
bin/test-personas united-states-marriage-license-application
bin/test-engines united-states-marriage-license-application
```
