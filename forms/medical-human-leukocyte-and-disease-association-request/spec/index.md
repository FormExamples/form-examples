# Medical Human Leukocyte and Disease Association Request: specification

Living domain spec. Update before changing code.

Slug: `medical-human-leukocyte-and-disease-association-request`

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
| R-APPROP-01 | A | No clinical details: may-be-appropriate (score capped at 5) |
| R-APPROP-02 | A | Previous HLA typing known: usually-not-appropriate |
| R-APPROP-03 | A | HLA-B*57:01 with no planned drug or indication: may-be-appropriate |
| R-APPROP-04 | A | Other HLA association with no specified allele: may-be-appropriate |
| R-APPROP-05 | A | HLA-DQA1*05 (anti-TNF response, emerging evidence): may-be-appropriate (score capped at 6) |
| R-ID-3PT-01 | B | Fewer than 3 identifiers on sample or form: reject-risk |
| R-ID-MATCH-01 | B | Match between sample and form details not confirmed: caution |
| R-ID-VOL-01 | B | Volume outside 5-10 mL: caution |
| R-ID-RISK-01 | B | High-risk sample without description: caution |
| R-ID-CONSENT-01 | B | Consent not confirmed: caution |
| R-COMP-01 | C | Weighted mandatory fields |
| R-TRIAGE-01 | D | Pre-treatment drug-hypersensitivity test (indication, or HLA-B*57:01 with a planned drug): urgent |
| R-TRIAGE-02 | D | Urgent tick: urgent |
| R-TRIAGE-03 | D | Otherwise routine |

Completeness weights: tests 20, clinical details 20, indication 10, patient identity 15, ethnicity 5, report destination 10, sample 10, requester and signature 10.

A request with no clinical details is always queried with the referrer. Turnaround targets and the EDTA volume range are **local policy**, configured, not hard-coded.

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
bin/test-form medical-human-leukocyte-and-disease-association-request
bin/test-sql-apply medical-human-leukocyte-and-disease-association-request
bin/test-form-namespacing medical-human-leukocyte-and-disease-association-request
```
