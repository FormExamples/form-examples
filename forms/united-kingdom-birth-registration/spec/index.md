# United Kingdom Birth Registration — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behavior: update the
spec before changing code.

Slug: `united-kingdom-birth-registration`

## 1. Purpose

An administrative form for preparing to register a birth in England and Wales
(GOV.UK "Register a birth") and to order the birth certificate from the General
Register Office. It captures the child, the mother, the second parent and the
basis for recording them, the informant and identity evidence, and the
certificate order. Its engine is a **completeness and validity** engine, not a
numeric score: it classifies the application as **ready-to-submit**,
**incomplete**, **needs-additional-evidence**, or **out-of-scope**, and raises
flagged issues. It does not register a birth and is not legal advice; the
registrar's entry in the register remains the legal record.

Full design description: [`index.md`](../index.md). Rule sources:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, the engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, stillbirth registration,
registration in Scotland, Northern Ireland or abroad, adoption and re-registration
of an existing entry, payment processing, and re-ordering a certificate for an
existing entry (which needs the GRO index reference).

## 3. Data model

The SQL in `sql/` is the source of truth. Tables: `patient` (the child),
`clinician` (the registrar or staff member), `united_kingdom_birth_registration`
(the application), and the triad `united_kingdom_birth_registration_grade`,
`_grade_rule`, `_grade_flag`. Every table has a UUIDv4 primary key and
`created_at`, `updated_at`, `deleted_at`.

The application is five sections (TypeScript / JavaScript camelCase; SQL
snake_case):

- **child**: `childForenames`, `childSurname`, `sex` (female, male,
  indeterminate), `dateOfBirth`, `timeOfBirth`, `placeOfBirthType`,
  `placeOfBirth`, `birthCountry` (england, wales, scotland, northern-ireland,
  abroad), `multipleBirth`, `stillbirth`.
- **mother**: `motherName`, `motherMaidenSurname`, `motherDateOfBirth`,
  `motherPlaceOfBirth`, `motherOccupation`, `motherAddress`.
- **parentage**: `parentsRelationship` (married-or-civil-partners, unmarried,
  female-couple-married, female-couple-unmarried, male-couple, mother-only),
  `marriageDate`, `secondParentIncluded`, `secondParentName`,
  `secondParentDateOfBirth`, `secondParentPlaceOfBirth`,
  `secondParentOccupation`, `paternityBasis`, `paternityEvidenceHeld`,
  `licensedClinicTreatment`.
- **informant**: `informantRelationship`, `informantName`,
  `parentsUnableToRegister`, `registrationRoute`, `registrationDate`,
  `identityPrimaryDocument`, `identitySecondaryCount`, `identityOriginals`,
  `redBookPresented`.
- **certificate**: `certificatesRequested`, `serviceLevel`, `deliveryAddress`,
  `paymentConfirmed`, `applicantNote`.

Unanswered text and enum fields are `''`; unanswered numeric, date and time
fields are `null`.

## 4. Readiness algorithm

```text
outOfScopeReason(d) != ''                                  -> out-of-scope
missingItems(d).length > 0 || dateInconsistencies(d).length > 0 -> incomplete
evidenceGaps(d).length > 0                                 -> needs-additional-evidence
otherwise                                                  -> ready-to-submit

daysSinceBirth  = whole days from dateOfBirth to registrationDate (UTC); null if either is missing
lateRegistration = 'yes' if daysSinceBirth > 42, 'no' if <= 42, '' if unknown
```

First match wins, so `out-of-scope` takes precedence over completeness.

**Out of scope**: `stillbirth === 'yes'`, or `birthCountry` answered and not
england or wales.

**Missing items** (required, conditional items only when they apply): the child's
forenames, surname, sex, date of birth, type and place of birth, country, and the
live-birth answer; the mother's name, maiden surname, date of birth, place of
birth and address; the parents' relationship and whether a second parent is
recorded; the marriage date when married or civil partners; for a second parent,
the name, date and place of birth and the basis; the informant's relationship and
name; whether the parents are unable to register when the informant is not a
parent; the registration route and date; the number of certificates (0 allowed),
and when above 0 the service level, delivery address and payment answer.

**Date inconsistencies**: registration before the birth; the mother's date of
birth on or after the child's.

**Evidence gaps** (each moves a complete application to
`needs-additional-evidence`):

1. *Informant.* `other` is never qualified. Someone present at the birth, someone
   responsible for the child, or hospital administrative staff may register only
   when `parentsUnableToRegister === 'yes'`. A father, second parent or both
   parents as informant requires a second parent to be recorded.
2. *Paternity route.* With a second parent included, the basis must be valid for
   the parents' relationship: married or civil partners (and married female
   couples): `married-or-civil-partners`; unmarried (and unmarried female
   couples): `joint-registration`, `statutory-declaration` or
   `court-order-parental-responsibility`; male couple: `parental-order`;
   mother only: no second parent. `joint-registration` requires
   `informantRelationship === 'both-parents'`. An unmarried female couple also
   requires `licensedClinicTreatment === 'yes'`.
3. *Paternity evidence.* A `statutory-declaration`, court order or parental order
   basis requires `paternityEvidenceHeld === 'yes'`.
4. *Identity.* One accepted primary document, or at least two secondary
   documents; and `identityOriginals !== 'no'`.
5. *More than 12 months.* `daysSinceBirth > 365` (assumption, see section 9).

A late registration of 43 to 365 days raises `F-LATE-REGISTRATION-001` but does
not by itself change the class.

## 5. Flagged issues

Flags are computed independently of the class and listed with id, category,
priority, description and suggested action (mirroring the
`_grade_flag` table).

| Id | Category | Priority | Raised when |
| --- | --- | --- | --- |
| F-OUT-OF-SCOPE-STILLBIRTH-001 | out-of-scope | high | stillbirth yes |
| F-OUT-OF-SCOPE-COUNTRY-001 | out-of-scope | high | country other than england or wales |
| F-MISSING-REQUIRED-001 | missing-required | high | any missing item |
| F-DATE-REGISTRATION-BEFORE-BIRTH-001 | date-inconsistent | high | registration before birth |
| F-DATE-MOTHER-BORN-AFTER-CHILD-001 | date-inconsistent | high | mother born on or after child |
| F-LATE-REGISTRATION-001 | late-registration | high | days since birth above 42 |
| F-DEADLINE-APPROACHING-001 | deadline-approaching | medium | 35 to 42 days |
| F-INFORMANT-NOT-QUALIFIED-001 | informant-not-qualified | high | informant `other` |
| F-INFORMANT-PARENTS-ABLE-001 | informant-not-qualified | high | non-parent informant, parents not stated unable |
| F-INFORMANT-SECOND-PARENT-001 | informant-not-qualified | high | father or second parent informant, none recorded |
| F-PATERNITY-ROUTE-001 | paternity-route | high | basis not valid for the parents |
| F-PATERNITY-JOINT-001 | paternity-route | high | joint registration without both parents |
| F-PATERNITY-CLINIC-001 | paternity-route | high | unmarried female couple without licensed-clinic treatment |
| F-PATERNITY-MOTHER-ONLY-001 | paternity-route | high | second parent included for mother only |
| F-PATERNITY-EVIDENCE-001 | paternity-evidence | high | signed form or court document not in hand |
| F-UNMARRIED-FATHER-001 | unmarried-father | low | unmarried, no second parent recorded |
| F-IDENTITY-EVIDENCE-001 | identity-evidence | high | no accepted document and fewer than two secondary |
| F-IDENTITY-ORIGINALS-001 | identity-evidence | medium | documents not originals |
| F-CERTIFICATE-DELIVERY-001 | certificate-order | medium | ordered without a delivery address |
| F-CERTIFICATE-PAYMENT-001 | certificate-order | medium | payment answered no |
| F-MULTIPLE-BIRTH-001 | multiple-birth | low | twins or more |
| F-RED-BOOK-001 | other | low | red book will not be brought |

## 6. Inputs and outputs

```ts
validateRegistration(data: BirthRegistration): {
  readinessClass: 'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope';
  daysSinceBirth: number | null;
  lateRegistration: 'yes' | 'no' | '';
  missingItemCount: number;
}
detectFlaggedIssues(data: BirthRegistration): FlaggedIssue[]
```

The engine is a split engine: the form composes the grader result and the flags
at render time. The Axum crate stores the result in the `_grade`, `_grade_rule`
and `_grade_flag` tables; it exposes one RESTful JSON route per table.

## 7. Artifacts

`sql/`, `xml/`, `fhir/r5/`, `protobuf/`, `openapi/`, `front-end-with-html/`,
`front-end-with-svelte/`, `back-end-with-axum/`, `back-end-with-axum-setup`,
`examples/` (including `personas.json`), `CHANGELOG.md`, `llms.txt`, `skills/`.

## 8. Acceptance criteria

- Each of the four classes is produced by at least one persona in
  `examples/personas.json`, and every flag in section 5 is produced by at least
  one persona.
- Out-of-scope takes precedence over incomplete, and incomplete over
  needs-additional-evidence.
- A registration 40 days after the birth is `ready-to-submit` with the
  deadline-approaching flag; 63 days raises the late flag; 396 days is
  `needs-additional-evidence`.
- The wizard is one continuous single-page form; a blank submit never crashes.
- `bin/test-form united-kingdom-birth-registration` passes.

## 9. Compliance

This is an administrative tool, not a medical device and not legal advice. It
reads no health data beyond the facts of the birth. The statutory position is the
Births and Deaths Registration Act 1953 and the Registration of Births and Deaths
Regulations 1987; the engine encodes only the GOV.UK guidance summarized in
[`doc/index.md`](../doc/index.md).

Assumptions to confirm against legislation.gov.uk and with the General Register
Office before reuse: (a) that a registration more than 12 months after the birth
needs the Registrar General's authority; (b) that a stillbirth is registered
separately, which the fetched GOV.UK pages do not cover; (c) the "indeterminate"
sex option, offered because the registrar's practice for it varies; (d) the
35-day warning threshold, which is this form's own choice. Fees are quoted as
GOV.UK stated them on 2026-11-20 and change; they are shown as guidance, never
calculated.

## 10. References

- [GOV.UK: Register a birth](https://www.gov.uk/register-birth) — the 42-day period in England, Wales and Northern Ireland; where to register (local register office, or the hospital); the information the registrar asks for; what to bring (red book, proof of identity, proof of paternity if attending alone).
- [GOV.UK: Who can register a birth](https://www.gov.uk/register-birth/who-can-register-a-birth) — parents register; married or civil-partner parents (either may register alone); unmarried parents (register together, signed statutory declaration of parentage, or a court document giving parental responsibility); same-sex female couples; same-sex male couples (parental order); other qualified informants (someone present at the birth, someone responsible for the child, hospital administrative staff) when the parents cannot.
- [GOV.UK: Proving your identity (register a birth)](https://www.gov.uk/register-birth/proving-your-identity) — one accepted original document (passport, photocard driving licence, UK birth or adoption certificate, biometric immigration document, travel documents, EU identity card, proof-of-age card) or two from the secondary list (utility bill but not a mobile phone bill, council tax, bank statement, benefit or tax letter, P45 or P60, marriage certificate, NHS or HMRC letter, and others).
- [GOV.UK: Order a copy of a birth, death, marriage or civil partnership certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate) — General Register Office (GRO) orders for England and Wales: 12.50 pounds a standard certificate, 38.50 pounds for the priority service (next working day when ordered by 4pm), an extra 3.50 pounds a search without a GRO index reference, card payment.
- [GOV.UK: Register a birth abroad](https://www.gov.uk/register-birth-abroad) — a birth outside the UK is registered under that country's rules; optional UK registration.
- Births and Deaths Registration Act 1953 and the Registration of Births and Deaths Regulations 1987 — the statutory basis for the 42-day period, qualified informants, and the register entry. Section numbers are deliberately not cited here; check the Acts on legislation.gov.uk before relying on a specific provision.
- *Human Fertilisation and Embryology Act 2008* — the legal parenthood rules for a female second parent and for parental orders.

## 11. Verify

```sh
bin/test-form united-kingdom-birth-registration
bin/test-personas united-kingdom-birth-registration
bin/test-engines united-kingdom-birth-registration
```
