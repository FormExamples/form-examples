# Safety case notes

Working safety log for the bone-marrow-donation-assessment software.

## Intended purpose

A donor-evaluation questionnaire that supports HSC donor suitability and
collection-method decisions, aligned with WMDA standards and UK donor
registry policies.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device. The form
supports decisions but final donor clearance is the responsibility of the
registry's medical director.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Splenomegaly missed before G-CSF prescription | Abdominal examination is a mandatory question; positive answer routes to ultrasound and registry medical director review |
| H2 | Anaesthetic risk under-detected for marrow harvest | ASA grading and airway questions surfaced; ASA ≥ 3 routes to RCoA-aligned pre-operative pathway |
| H3 | Donor with positive transmissible-disease marker | Always referred to registry medical director; counselling pathway invoked; data handling per HTA Code E |
| H4 | Donor consent not informed | Form mandates structured information delivery (process, risks, alternatives, withdrawal) and tests donor understanding with comprehension questions |
| H5 | Confidentiality of donor-recipient information | Form enforces anonymisation rules — donor receives only need-to-know recipient information per registry policy |
| H6 | Donor coercion | Form asks "are you donating freely without pressure?" as a non-skippable confirmation |
| H7 | Sickle trait missed in donor of African ancestry | Sickle screen mandatory at evaluation; positive result routes to specialist review and may direct collection method choice |
| H8 | Severe G-CSF reaction risk | Form prompts past splenic disease, autoimmune disease, history of severe bone pain |
| H9 | Posterior iliac crest unsuitable for marrow harvest | Physical exam question captures iliac crest accessibility |
| H10 | HLA typing mis-entered | Two-person verification step required for HLA fields; raw lab report ID recorded |

## Verification artefacts

- `donor-grader.test.ts` — unit tests for eligibility band logic
- Reference vignettes per pathway (suitable PBSC donor, suitable marrow
  harvest donor, conditionally suitable due to anaesthetic risk,
  unsuitable due to infection)

## Outstanding work

- Annual review against WMDA standards and registry policy updates
- BSBMTCT / JACIE accreditation cross-check
- HTA Code E compliance review
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Expert review of consent flow
