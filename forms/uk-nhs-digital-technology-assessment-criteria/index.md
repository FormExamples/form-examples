# UK NHS Digital Technology Assessment Criteria (DTAC)

A UK NHS–aligned assessment of a digital health technology against the NHS England
**Digital Technology Assessment Criteria (DTAC)**. A commissioner, procurement lead or
assurance team records, for each of 47 criteria in seven sections (company information,
value proposition, clinical safety, data protection, technical security, interoperability,
usability and accessibility), whether the supplier's evidence shows the criterion is
**met**, **partially met**, **not met** or **not applicable**. The engine computes a
per-section result, an overall outcome (**meets**, **conditional**, **does-not-meet** or
**incomplete**) and a list of flagged issues, and the wizard produces a signed assessment
report.

The criteria text here is a faithful *summary* intended for structured recording, not a
replacement for the published DTAC. Always assess against the version of the DTAC
published by NHS England and record that version in the `dtac_version` field.

## Scope and intended users

- **Setting:** NHS trusts, integrated care boards, GP practices, local authorities and
  care providers procuring or approving digital health technologies.
- **Users:** procurement leads, Clinical Safety Officers, information governance and
  information security leads, digital leads.
- **Subjects:** apps, web services, software-as-a-service, remote-monitoring and
  clinical-decision-support products (medical device or not).
- **Not in scope:** formal regulatory approval — this form records an assessment and does not
  confer DTAC compliance, MHRA registration or DCB0129/DCB0160 sign-off.

## Scoring system

- **Per criterion:** `met` / `partially-met` / `not-met` / `not-applicable` / unanswered.
- **Mandatory criteria (34 of 47):** drive the outcome. **Advisory criteria (13):**
  counted and reported but never fail an assessment.
- **Section result:** `met` when every applicable criterion is met; `not-met` when any
  applicable mandatory criterion is not met; `partially-met` otherwise; `incomplete` when any
  applicable mandatory criterion is unanswered and none is not met.
- **Overall outcome:**
  - `does-not-meet` — any applicable mandatory criterion is `not-met`;
  - `incomplete` — otherwise, any applicable mandatory criterion is unanswered;
  - `conditional` — otherwise, any applicable mandatory criterion is `partially-met`;
  - `meets` — every applicable mandatory criterion is `met`.
- **Assessor override:** the assessor may sign off a different `final_outcome` with a
  mandatory `assessor_override_reason`.

Full criteria: [`doc/criteria-catalogue.md`](doc/criteria-catalogue.md).

## Wizard steps

| Step | Section | Criteria | Mandatory |
| --- | --- | --- | --- |
| 1 | Supplier and product | — | — |
| 2 | A — Company information | 4 | 3 |
| 3 | B — Value proposition | 4 | 2 |
| 4 | C — Clinical safety | 7 | 6 |
| 5 | D — Data protection | 9 | 8 |
| 6 | E — Technical security | 9 | 8 |
| 7 | F — Interoperability | 7 | 3 |
| 8 | G — Usability and accessibility | 7 | 4 |
| 9 | Review and outcome | — | — |

## Flagged issues

Flags are raised for: missing or unverified Clinical Safety Officer; no DCB0129 hazard log or
safety case; medical device without registration; no DPIA; DSPT not met; no current penetration
test; no Cyber Essentials Plus / ISO 27001; no MFA; no NHS Number support; no WCAG AA
conformance; no published accessibility statement; and `completeness` flags for unanswered
mandatory criteria.

## Standards and references

- [NHS England — Digital Technology Assessment Criteria (DTAC)](https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/)
- DCB0129 / DCB0160 — clinical risk management standards for manufacturers and deployers
- Data Security and Protection Toolkit (DSPT); UK GDPR and Data Protection Act 2018
- Cyber Essentials Plus; ISO/IEC 27001
- UK Medical Devices Regulations 2002 (MHRA)
- WCAG 2.2 and the Public Sector Bodies Accessibility Regulations 2018
