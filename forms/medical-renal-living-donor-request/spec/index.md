# Medical Renal Living Donor Request: specification

Living domain spec. Update before changing code.

Slug: `medical-renal-living-donor-request`

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
| R-APPROP-01 | A | Virtual crossmatch / match grade with no recipient ABO or antibody information: may-be-appropriate |
| R-APPROP-02 | A | Altruistic pathway with crossmatch tests that need a recipient: usually-not-appropriate |
| R-APPROP-03 | A | Known ABO-incompatible pair without ABO titres: may-be-appropriate |
| R-ID-3PT-01 | B | Fewer than 3 identifiers on sample or form: reject-risk |
| R-ID-MATCH-01 | B | Match between sample and form details not confirmed: caution |
| R-ID-HAND-01 | B | Hand-labelled EDTA required and absent: caution |
| R-ID-CONSENT-01 | B | Consent not confirmed: caution |
| R-COMP-01 | C | Weighted mandatory fields |
| R-TRIAGE-01 | D | Day-of-transplant samples: stat |
| R-TRIAGE-02 | D | Urgent tick: urgent |
| R-TRIAGE-03 | D | Otherwise routine |

Completeness weights: pathway 15, tests 20, donor identity 20, donor ABO 10, recipient 10, relationship 5, sample 10, requester 10 (recipient and relationship count as present for an altruistic donor).

Turnaround targets and tube volumes are **local policy**, configured, not hard-coded.

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
bin/test-form medical-renal-living-donor-request
bin/test-sql-apply medical-renal-living-donor-request
bin/test-form-namespacing medical-renal-living-donor-request
```
