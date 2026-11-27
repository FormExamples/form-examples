# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request: specification

Living domain spec. Update before changing code.

Slug: `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request`

## 1. Purpose

See [`index.md`](../index.md).

## 2. Scope

In scope: schema, scoring engine, form and dashboard front-ends (HTML and SvelteKit), Axum JSON API. Out of scope: hosting, authentication, multi-tenancy, naming any specific health service or laboratory.

## 3. Scoring system

| Axis | Output |
| --- | --- |
| A. Appropriateness (1-9) | usually-appropriate 7-9 / may-be-appropriate 4-6 / usually-not-appropriate 1-3 |
| B. Identity / sample safety | ok / caution / reject-risk |
| C. Completeness | 0-100 % |
| D. Triage | routine / urgent / emergency / stat |

### Rules (initial)

| Id | Axis | Rule |
| --- | --- | --- |
| R-APPROP-01 | A | Potential donor with no recipient name and record number: usually-not-appropriate (score capped at 3) |
| R-APPROP-02 | A | No clinical details: may-be-appropriate (score capped at 5) |
| R-APPROP-03 | A | Donor type unrelated-volunteer with relationship filled: may-be-appropriate (score capped at 5) |
| R-ID-3PT-01 | B | Fewer than 3 identifiers on sample or form: reject-risk |
| R-ID-MATCH-01 | B | Match between sample and form details not confirmed: caution |
| R-ID-VOL-01 | B | Volumes below the role requirement: caution |
| R-ID-CONSENT-01 | B | Consent not confirmed: caution |
| R-COMP-01 | C | Weighted mandatory fields |
| R-TRIAGE-01 | D | Urgent tick: urgent (telephone the laboratory) |
| R-TRIAGE-02 | D | Otherwise routine |

Completeness weights: role 10, identity 20, sex 5, ethnicity 10, clinical details 15, donor type 5, linked recipient 10, report destination 5, sample 10, requester and signature 10 (donor type and linked recipient count as present for a recipient). A request with no clinical details is always queried with the referrer. Tube volumes and turnaround targets are **local policy**, configured, not hard-coded.

## 4. Inputs and outputs

Inputs: the rows described in `sql/`. Output: grade, rule and flag rows.

## 5. Artefacts

SQL (done); XML / FHIR R5 / protobuf / OpenAPI / examples (generated); HTML front-end (done), Svelte front-end (done), Axum crate (done).

## 6. Acceptance criteria

- `bin/test-sql-apply` and `bin/test-form-namespacing` pass.
- No health-service, laboratory or regional proper name appears in the form directory.
- Every sql column is reachable from the API and wizard.

## 7. Compliance

MDCG 2019-11 Rev.1 classification to be confirmed.

## 8. References

[`doc/assessment.md`](../doc/assessment.md), [`doc/clinical-references.md`](../doc/clinical-references.md).

## 9. Verify

```sh
bin/test-form medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-sql-apply medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-form-namespacing medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
```
