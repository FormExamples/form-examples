# Plan: United States HIPAA Authorization Form

## Current status

Scaffolded 2026-05-18. Design based on the Tennessee Department of Human
Services HS-2557 form (revised 12-15), reproduced in `seed.pdf`, extended
to the full monorepo stack (SQL, FHIR, XML, Protobuf, TypeSpec, HTML,
SvelteKit, Rust full-stack).

## Why this form exists

The HIPAA Privacy Rule prohibits any use or disclosure of Protected Health
Information for a non-treatment, non-payment, non-operations purpose
without a **written authorization** that contains the exact set of core
elements and required statements in **45 CFR § 164.508(c)**. State
agencies — Tennessee, Pennsylvania, and others — issue their own
HIPAA-compliant templates for eligibility determinations, but the
underlying structure is the same: identify the patient, identify the
disclosing source, identify the recipient, describe the PHI, state the
purpose, give an expiration, and capture a dated signature alongside the
patient-rights statements.

This implementation captures that structure once, in a normalised SQL
schema, and renders it in every interchange format (XML, FHIR, Protobuf,
TypeSpec) and every UI stack (HTML, SvelteKit, Rust + HTMX) used in the
monorepo.

## Design principles

- **One authorization per submission.** A HIPAA authorization is a
  single legal document; compound authorizations (research consent +
  treatment, psychotherapy notes + other PHI) require separate forms and
  are flagged by the engine.
- **Specific over vague.** The PHI description must be specific; the
  engine fires a rule when the description is empty or matches obvious
  catch-all phrases ("all my records", "everything", "any and all").
- **Sensitive categories are first-class.** Substance-use,
  HIV/AIDS, mental health, and psychotherapy notes each have their own
  yes/no plus initials field and their own rule.
- **Expiration is mandatory.** Either a calendar date or a defined
  event; the engine refuses "none".
- **Patient rights are acknowledged, not assumed.** Right to revoke,
  right to a copy, right not to be conditioned on signing, and the
  re-disclosure warning are each tracked as a yes/no acknowledgement.
- **Single-page wizard.** 9 steps on one continuous page (monorepo rule).
- **Symmetric with `medical-records-release-permission`.** The schemas
  share `patient`, `authorized_recipient`, and similar entity boundaries
  so that side-by-side comparison and code-sharing are possible.
- **Pure validation engine.** `validateAuthorization()` is a pure
  function fully unit-tested with Vitest.
- **FHIR-first interchange.** The canonical interchange format is FHIR
  R5 `Consent`; XML is an archival fallback; Protobuf is for gRPC; XML
  TypeSpec drives OpenAPI generation.

## Validation engine

The validity engine runs each 45 CFR § 164.508(c) requirement as a
separate rule and reports the union of fired rules. Sensitive-category
rules and re-disclosure rules run in parallel and contribute
additional-flag entries. Final validity is `valid` iff zero rules fire
and no high-priority flag is raised.

| Rule ID                          | § 164.508 reference     | Priority |
| -------------------------------- | ----------------------- | -------- |
| `phi-description-specific`       | (c)(1)(i)               | high     |
| `disclosing-source-identified`   | (c)(1)(ii)              | high     |
| `recipient-identified`           | (c)(1)(iii)             | high     |
| `purpose-stated`                 | (c)(1)(iv)              | high     |
| `expiration-stated`              | (c)(1)(v)               | high     |
| `signature-and-date`             | (c)(1)(vi)              | high     |
| `representative-authority`       | (c)(1)(vi)(B)           | high     |
| `right-to-revoke-statement`      | (c)(2)(i)               | medium   |
| `no-conditioning-statement`      | (c)(2)(ii)              | medium   |
| `redisclosure-warning`           | (c)(2)(iii)             | medium   |
| `substance-use-part-2-consent`   | 42 CFR Part 2           | high     |
| `hiv-aids-state-consent`         | state-specific          | high     |
| `mental-health-separate-initial` | state-specific          | medium   |
| `psychotherapy-separate-auth`    | (a)(2)                  | high     |

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
3. [ ] Write `doc/*.md` reference documents.
4. [ ] Author SQL Liquibase migrations for `patient`,
       `hipaa_authorization`, `signer`, `disclosing_source`,
       `authorized_recipient`, `records_to_disclose`, `purpose_of_disclosure`,
       `expiration`, `patient_rights_acknowledgement`,
       `signature_witness`, `validation_result`, `validation_fired_rule`,
       `validation_additional_flag`.
5. [ ] Generate XML + DTD with `bin/xml-representations/generate-xml-representations.py`.
6. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
7. [ ] Generate Protobuf with
       `bin/protobuf/generate-protobuf-representations.py`.
8. [ ] Author TypeSpec models in `typespec/`.
9. [ ] Build SvelteKit form (single-page authorization wizard).
10. [ ] Build HTML form (static single-page, Alpine.js).
11. [ ] Build SvelteKit dashboard (SVAR DataGrid).
12. [ ] Build HTML dashboard (static review table).
13. [ ] Build Rust full-stack (Loco + axum + SeaORM + Tera + HTMX + Alpine).
14. [ ] Unit-test the validation engine (Vitest).
15. [ ] `bin/test-form united-states-hipaa-authorization-form` passes.

## Future enhancements

- Zod runtime validation on the SvelteKit client.
- Axe-core accessibility audit.
- End-to-end tests with Playwright.
- LocalStorage autosave with draft recovery.
- State-specific overlays (Tennessee HS-2557, Pennsylvania, California
  CMIA, New York Article 27-F).
- Spanish-language UI (a meaningful share of HIPAA authorizations are
  signed by Spanish-speaking patients).
- Integration with the HHS Office for Civil Rights breach-notification
  workflow.
- Audit log of every revocation.
- Electronic signature captured as SVG path plus federated identity
  claim from the disclosing provider's IdP.
- Compound-authorization detector that splits research + treatment
  authorizations into separate sub-forms.
