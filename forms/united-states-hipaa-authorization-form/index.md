# United States HIPAA Authorization Form

A United States Health Insurance Portability and Accountability Act (HIPAA)
authorization form. This is a legal document by which a patient (or their
authorized representative) gives a covered entity — a health-care provider,
health plan, or health-care clearinghouse — explicit, time-bounded permission
to use or disclose specifically described Protected Health Information (PHI)
to a named third-party recipient for a stated purpose. It is the standard
mechanism, defined in **45 CFR § 164.508** of the HIPAA Privacy Rule, for any
use or disclosure of PHI that is **not** otherwise permitted as treatment,
payment, or health-care operations (TPO).

This implementation is modelled on the Tennessee Department of Human Services
form **HS-2557 — HIPAA Authorization for Release of Medical/Health
Information** (revised 12-15), reproduced in [`seed.pdf`](./seed.pdf). The
HS-2557 layout is representative of the standardised state-agency templates
issued by US Departments of Human Services (Tennessee, Pennsylvania, and
others) and complies with the disclosure provisions of:

- Public Law 104-191 ("HIPAA")
- 45 CFR parts 160 and 164 (HIPAA Privacy and Security Rules)
- 42 U.S.C. § 290dd-2 and 42 CFR part 2 (substance-use disorder records)
- 38 U.S.C. § 7332 (US Department of Veterans Affairs sensitive records)

## Scope and intended users

- **Setting:** US health-care providers, hospitals, state Departments of
  Human Services, insurance companies, attorneys, and any covered entity or
  business associate that must obtain written patient authorization before
  using or disclosing PHI for a non-TPO purpose.
- **Operators:** the patient themselves, or an authorized representative
  (parent of a minor, court-appointed guardian, conservator, power of
  attorney for health care, executor of a deceased patient's estate).
- **Output consumers:** the medical-records department of the disclosing
  provider, the named recipient organisation, and the patient (who is
  entitled to a copy of the signed form).

## Scoring system

- **Instrument:** HIPAA-Authorization Validity Check
- **Range:** Valid / Invalid
- **Algorithm:** rule-based validation against the **core elements** and
  **required statements** of 45 CFR § 164.508(c). The form is **Valid** only
  when every required element is present and internally consistent.

### Core elements (45 CFR § 164.508(c)(1))

1. A specific and meaningful description of the PHI to be used or disclosed.
2. The name (or specific identification) of the person(s) or class of
   persons authorised to make the use or disclosure.
3. The name (or specific identification) of the person(s) or class of
   persons to whom the use or disclosure may be made.
4. A description of each purpose of the requested use or disclosure.
5. An expiration date or expiration event ("none" is not permitted).
6. The signature of the individual and the date. If signed by a personal
   representative, a description of the representative's authority to act.

### Required statements (45 CFR § 164.508(c)(2))

- The individual's right to revoke the authorization in writing, the
  procedure for revocation, and any exceptions.
- The fact that treatment, payment, enrollment, or eligibility for benefits
  may not be conditioned on signing (with documented exceptions).
- The potential for the disclosed information to be re-disclosed by the
  recipient and no longer protected by the Privacy Rule.

If any element is missing, the engine returns **Invalid** with a list of
the specific fired rules and a priority-graded list of additional flags
(e.g. sensitive-category gaps for substance use, HIV/AIDS, mental health,
or psychotherapy notes, each of which has heightened consent requirements).

## 9-step single-page wizard

Completed in order on one continuous single-page wizard. No multi-page
forms.

| #   | Step                              | Key fields |
| --- | --------------------------------- | --- |
| 1   | Patient identification            | print name, date of birth, Social Security Number (optional), street address, city, state, ZIP, phone |
| 2   | Signer identification             | signer relationship (self / parent of minor / guardian / other authorized representative), description of representative authority, parent/guardian co-signature when required by state law |
| 3   | Disclosing source                 | specific identification of the person(s) or organisation(s) holding the records, OR an explicit class (doctors, hospitals, clinics, nursing homes, government and private providers, insurance companies, health plans) |
| 4   | Authorized recipient              | recipient name, organisation, role, address, phone, email |
| 5   | Records to disclose               | yes/no plus initials for each sensitive category: general medical / health, mental health, drug or alcohol treatment / referral, HIV-AIDS test or treatment; free-text "other" description |
| 6   | Purpose of disclosure             | one or more of: eligibility determination, continuing treatment, insurance claim, legal proceeding, disability application, personal use, research, employment, "at the request of the individual", other (free-text) |
| 7   | Expiration                        | expiration date OR expiration event (e.g. "12 months from signature", "upon conclusion of my claim"); "none" is not permitted |
| 8   | Patient rights acknowledgements   | right to revoke, exceptions to revocation, no conditioning on signature, possibility of re-disclosure, right to a copy of the signed form |
| 9   | Signature, witness & date         | individual's electronic signature, signature date, witness name and signature, parent/guardian co-signature when applicable, computed validity result, fired rules, additional flags |

## Safety / completeness flags

Computed independently of the Valid / Invalid result. Priority **high /
medium / low**. Categories include:

- Missing PHI description (high) — vague phrases such as "all my records"
  do not satisfy § 164.508(c)(1)(i).
- Missing expiration (high) — no date or event recorded.
- Missing signature (high) or undated signature (high).
- Substance-use disorder records released without the
  **42 CFR Part 2** prohibition-on-redisclosure statement (high).
- HIV/AIDS records released without state-specific consent language (high).
- Mental-health records released without explicit initials (medium).
- Authorization on behalf of a minor without parent/guardian co-signature
  where required by state law (high).
- Expiration > 12 months from signature for routine eligibility
  determinations (medium).
- Conditioning of treatment/payment/enrolment on signing (high) — this is
  prohibited except in narrow cases.
- Compound authorization with research consent or psychotherapy notes
  without the additional § 164.508(b)(3) authorization (high).

## Output

- HTML report preview and downloadable PDF via `pdfmake`.
- FHIR R5 `Consent` resource (category `hipaa-research-authorization` or
  `hipaa-self-pay-disclosure`) bundled with the `Patient` and
  `Organization` resources for archival or interchange.
- XML representation per SQL table for legacy import / export.
- Protocol Buffers schemas for gRPC interop.
- TypeSpec model for OpenAPI generation.

## Directory structure

```
united-states-hipaa-authorization-form/
  index.md                                   # this file
  README.md -> index.md
  AGENTS.md                                  # agent instructions
  CLAUDE.md                                  # @AGENTS.md
  plan.md                                    # implementation roadmap
  tasks.md                                   # task tracking
  seed.md                                    # plain-text seed brief
  seed.pdf                                   # Tennessee DHS HS-2557 reference
  doc/                                       # HIPAA Privacy Rule reference
  sql-migrations/                            # PostgreSQL Liquibase schema
  xml-representations/                       # XML + DTD per SQL table
  fhir-r5/                                   # FHIR HL7 R5 JSON per SQL entity
  protobuf/                                  # Protocol Buffers .proto schemas
  typespec/                                  # TypeSpec models
  front-end-form-with-html/                  # static single-page HTML wizard
  front-end-form-with-svelte/                # SvelteKit single-page wizard
  front-end-dashboard-with-html/             # HTML review table
  front-end-dashboard-with-svelte/           # SVAR DataGrid review
  full-stack-with-loco-tera-htmx-alpine/     # Rust backend + HTMX UI
  full-stack-with-loco-tera-htmx-alpine-setup  # scaffold generator
```

## Patient rights under the HIPAA Privacy Rule

- **Right to decline to sign.** Covered entities may not condition
  treatment, payment, enrolment, or eligibility for benefits on the
  individual's signing the authorization (§ 164.508(b)(4)), with narrow
  exceptions for research-related treatment, pre-enrolment underwriting,
  and disclosures to third parties paid for by the individual.
- **Right to revoke in writing.** Revocation must be in writing; it does
  not apply retroactively to information already disclosed in reliance on
  the authorization.
- **Right to a copy.** The covered entity must provide the individual with
  a copy of the signed authorization.
- **Right to inspect and copy disclosed information.** The individual may
  request a copy of the records that were sent.

## Clinical / legal references

- 45 CFR § 164.508 — Uses and disclosures requiring authorization.
- 45 CFR § 164.524 — Access of individuals to PHI.
- 42 U.S.C. § 290dd-2 / 42 CFR Part 2 — Confidentiality of substance-use
  disorder records.
- 38 U.S.C. § 7332 — VA records of drug abuse, alcoholism, HIV, and
  sickle-cell anaemia.
- HHS Office for Civil Rights guidance on HIPAA authorizations.
- Tennessee Department of Human Services HS-2557 (revised 12-15).
- Pennsylvania Department of Human Services HIPAA Authorization Form.

## Compliance

- HIPAA Privacy Rule (45 CFR parts 160 and 164).
- HITECH Act (42 U.S.C. § 17921 et seq.) — breach-notification and
  enforcement updates to HIPAA.
- 21st Century Cures Act information-blocking rule (45 CFR Part 171).
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users.
- MDCG 2019-11 Rev. 1 — not directly applicable (US form), referenced for
  monorepo consistency.

## Verify

```sh
bin/test-form united-states-hipaa-authorization-form
```
