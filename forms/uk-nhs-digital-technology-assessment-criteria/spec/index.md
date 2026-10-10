# UK NHS Digital Technology Assessment Criteria — specification

This file is the **living domain spec** for this form. Update it before changing code.

Slug: `uk-nhs-digital-technology-assessment-criteria`

## 1. Purpose

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

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema and generated representations (this stage), then the scoring engine,
front-ends (HTML and SvelteKit) and Loco back-end. Out of scope: hosted deployment,
authentication, evidence document storage, and formal DTAC certification.

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

## 4. Data model

Entities: `supplier`, `assessor`, `product`, the main
`uk_nhs_digital_technology_assessment_criteria` table (one `VARCHAR` status column per
criterion plus per-section notes), and the `_grade`, `_grade_rule`, `_grade_flag` triad. SQL in
[`sql/`](../sql) is the source of truth.

## 5. Conventions

Empty string for unanswered enum/text; `NULL` for unanswered date. Criterion columns are named
`<id>_<key>` (e.g. `c2_clinical_risk_management_plan`).

## 6. Open questions

- Pin the DTAC version the criteria wording is summarized from (currently recorded per
  assessment in `dtac_version`).
