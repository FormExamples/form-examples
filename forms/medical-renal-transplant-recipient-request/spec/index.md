# Medical Renal Transplant Recipient Request: specification

Living domain spec. Update before changing code.

Slug: `medical-renal-transplant-recipient-request`

## 1. Purpose

See [`index.md`](../index.md): a generic histocompatibility / immunogenetics request for a kidney, kidney/pancreas or pancreas transplant recipient, with a four-axis vetting grade.

## 2. Scope

In scope: schema, scoring engine, form and dashboard front-ends (HTML and SvelteKit), Axum JSON API. Out of scope: hosting, authentication, multi-tenancy, naming any specific health service or laboratory.

## 3. Scoring system

| Axis | Output |
| --- | --- |
| A. Test-selection appropriateness (1-9) | usually-appropriate 7-9 / may-be-appropriate 4-6 / usually-not-appropriate 1-3 |
| B. Identity / sample safety | ok / caution / reject-risk |
| C. Completeness | 0-100 % |
| D. Triage | routine / urgent / emergency / stat |

### Rules (initial)

| Id | Axis | Rule |
| --- | --- | --- |
| R-APPROP-01 | A | Virtual crossmatch with no HLA-antibody monitoring or prior profile: may-be-appropriate |
| R-APPROP-02 | A | Rejection investigation for a recipient with no transplant (not failing-transplant, no previous transplant): usually-not-appropriate |
| R-APPROP-03 | A | Post-transfusion monitoring with transfusion count 0 or null: may-be-appropriate |
| R-APPROP-04 | A | ABO-incompatible monitoring without a DFPP status: may-be-appropriate |
| R-ID-3PT-01 | B | Fewer than 3 identifiers on sample or form: reject-risk |
| R-ID-MATCH-01 | B | Match between sample and form details not confirmed: caution |
| R-ID-HAND-01 | B | Tests needing hand-labelled EDTA with none recorded: caution |
| R-ID-CONSENT-01 | B | Consent and identity not confirmed: caution |
| R-COMP-01 | C | Weighted mandatory fields: organ, tests, sensitization counts, ABO group, sample details, requester |
| R-TRIAGE-01 | D | Day-of-transplant test: stat |
| R-TRIAGE-02 | D | Urgent tick: urgent (policy default 1 working day) |
| R-TRIAGE-03 | D | Rejection investigation: urgent unless marked otherwise (policy default 3-5 working days) |
| R-TRIAGE-04 | D | Otherwise routine |

Turnaround targets and tube volumes are **local policy**, set in configuration, not hard-coded.

## 4. Inputs and outputs

Inputs: the `request` row and its `request_test` rows (see `sql/`). Output: the grade, rule and flag rows.

## 5. Artefacts

SQL (done), XML / FHIR R5 / protobuf / OpenAPI / examples (generated), HTML front-end (done), Svelte front-end (done), Axum crate (done).

## 6. Acceptance criteria

- `bin/test-sql-apply` and `bin/test-form-namespacing` pass.
- No health-service, laboratory or regional proper name appears anywhere in the form directory.
- Every sql column is reachable from the API and wizard.

## 7. Compliance

MDCG 2019-11 Rev.1 classification to be confirmed; see [`doc/clinical-references.md`](../doc/clinical-references.md).

## 8. References

[`doc/assessment.md`](../doc/assessment.md), [`doc/clinical-references.md`](../doc/clinical-references.md).

## 9. Verify

```sh
bin/test-form medical-renal-transplant-recipient-request
bin/test-sql-apply medical-renal-transplant-recipient-request
bin/test-form-namespacing medical-renal-transplant-recipient-request
```
