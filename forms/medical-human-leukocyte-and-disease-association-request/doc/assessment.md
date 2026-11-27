# Assessment and advice: Medical Human Leukocyte and Disease Association Request

Basis: a published two-page paper request form from a transplantation / histocompatibility laboratory, read in full on 2026-11-27. This document is jurisdiction-neutral; regional names, units, contact details and addresses on the source are deliberately not carried over.

## 1. What the source form does

One page of data entry plus one page of instructions. Six sections: recipient identity, consultant / GP details (with copy-to and report email), tests required (seven named HLA tests with an example indication each, "other", and a high-risk-sample box) beside a clinical-details box, requester, sample collector, laboratory-use box. One sample type for all tests: 5-10 mL EDTA.

## 2. Strengths worth keeping

- A separate form per person is mandated, preventing sample mix-ups.
- Minimum 3 identifiers on form and sample, and a "samples not labelled correctly will be discarded" rule.
- The requester owns consent and identification.
- Sample tubes and volumes are tied to the request, with a colour guide.
- Each test is paired with an example disease, which guides appropriate use.
- A high-risk-sample box prompts safe labelling and packaging.
- A report email and a copy-to destination are captured up front.

## 3. Gaps and risks found

| # | Finding | Why it matters | Fix in this form |
| --- | --- | --- | --- |
| 1 | Clinical details are one free-text box with no indication category. | Appropriateness cannot be assessed or audited. | `indication_category` plus free text. |
| 2 | HLA-B*57:01 is a drug-safety (pharmacogenetic) test listed among disease associations. | It must be resulted before the drug is started; it needs urgency and a named drug. | `planned_drug`, flag `abacavir-start-pending`, urgent tier. |
| 3 | No field for previous HLA typing. | HLA type is lifelong; repeat testing wastes a sample and delays care. | `previous_hla_typing_known`; flag. |
| 4 | Disease-association HLA tests have low positive predictive value (for example B27 in the general population). | Over-reading a positive result is a known harm. | Interpretation advice in the report; pre-test probability in axis A. |
| 5 | No ethnicity field. | Allele frequencies differ by population. | `ethnicity` added (the HSCT form requires it). |
| 6 | HLA-DQA1*05 for anti-TNF response is not an established guideline test. | Risk of unvalidated testing. | Documented as emerging; axis A caution. |
| 7 | "Other HLA-disease association" has no field for the allele. | The test is not identifiable from the form alone. | `test_detail` on each test row. |
| 8 | Consent for a genetic test is only the requester's instruction. | Genetic results are lifelong and familial. | Consent confirmation attests genetic-test consent. |
| 9 | Report goes to an unrestricted email. | Health data over email. | Optional field with a secure-address warning. |
| 10 | Fixed organization email domain; paper signature. | Not portable; no audit. | Free email; signed-at timestamp. |

## 4. Advice

1. **Capture an indication category** so appropriateness can be assessed and reported.
2. **Separate the drug-safety test (B*57:01)** from disease associations, or flag it clearly; treat as pre-prescribing and time-critical.
3. **Ask for a previous HLA result** to prevent duplicate testing.
4. **Explain test limits in the report:** most disease-association HLA tests rule out rather than confirm.
5. **Treat DQ2/DQ8** as a negative-predictive test for coeliac disease.
6. **Flag evidence-limited tests** (DQA1*05).
7. **Make consent explicit**, including genetic testing.
8. **Privacy:** special-category health data; send reports only to authorized secure addresses.
9. **Before clinical use**, have a histocompatibility specialist confirm the test list, tube volumes and the 1-9 anchoring. They were transcribed from one laboratory's form and may not match another's.

## 5. Open questions for the maintainer

- Should each HLA test carry a configurable indication whitelist?
- Should the high-risk box capture the infectious hazard type?
- Should the form allow multiple alleles under "other" as separate rows?
