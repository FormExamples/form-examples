# DWP Fit-Note Policy Summary

Source: *Fit note: guidance for patients and employees* (August 2023).
Mirrored in `../seed.md` (full text).

## 1. Form authority and 2022 changes

| Section | Rule | Form impact |
| --- | --- | --- |
| 1.1 | Hand-signature replaced with printed name + profession | `clinician.name`, `clinician.profession` required |
| 1.1 | Digital fit notes delivered through GP IT systems | `fit_note.issued_via = 'digital'` |
| 1.2 | Nurses, OTs, pharmacists, physiotherapists may issue | `clinician.profession` enum expanded |
| 1.3 | Secondary care issuance is rolling out | `fit_note.issue_setting = 'secondary_care'` flag |

## 2. When a fit note is required

| Section | Rule | Form impact |
| --- | --- | --- |
| 2.1 | Self-certification covers ≤ 7 calendar days | `self_cert_range` flag fires when period < 7 days |
| 2.2 | Patient does not pay if absence > 7 days | n/a (informational) |

## 3. General rules

| Section | Rule | Form impact |
| --- | --- | --- |
| 3.1 | Assessment may be in-person, video, telephone, or written report | `fit_note.assessment_method` enum |
| 3.2 | A fit note cannot say "fit for work" | `fitness_for_work` enum has no `fit` option |
| 3.3 | First 6 months of condition → max 3 months per note | `exceeds_initial_max` flag |
| 3.4 | Private practice may issue different formats | `private_practice` flag |
| 3.5 | Discharge clinicians should issue on discharge | `secondary_care_discharge` flag |
| 3.6 | Non-medical problems cannot be certified | `non_medical_reason_detected` flag |
| 3.7 | Must include issuer name, profession, practice address | `invalid_no_*` flags (high priority) |
| 3.8 | Not-fit assessment is SSP evidence | n/a |
| 3.9 | Patient may return early without re-assessment | `ongoing_review_required` flag |

## 4. Benefits of working

Section 4 is patient-facing only; no form impact.

## 5. Assessing fitness for work

| Section | Rule | Form impact |
| --- | --- | --- |
| 5.1 | Assess fitness in general, not just current job | `general_fitness_considered` checkbox |
| 5.2 | Three categories: fit / may be fit / not fit | enum captured |
| 5.3 | HCP advises on what the patient can do | `advice_text` field |
| 5.4 | Four adaptation tick boxes | `adaptation_*` boolean fields |
| 5.5 | Adaptations are not binding | informational |
| 5.6 | Comments box should be practical, not just diagnostic | `may_be_fit_no_comments` flag |
| 5.7 | Patient should consider workplace adjustments | informational |
| 5.8 | HIV, cancer, MS — automatic disability | `automatic_disability` flag |
| 5.9 | Discuss occupational health, location changes, etc | informational |
| 5.10 | Trade-union representation may help | informational |
| 5.11 | HCP may advise no work at all | `not_fit` category |

## 6. Case studies

The DWP guide provides six case studies; they are used as fixtures for
the front-end demo (`sample-data.ts`).

## 7. Further support

Signposting only; no form impact. Captured as link metadata in
`doc/snomed-references.md` (further support section).
