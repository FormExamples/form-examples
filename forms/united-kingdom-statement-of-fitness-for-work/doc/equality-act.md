# Equality Act 2010 — Automatic Disability

Under the *Definition of disability under the Equality Act 2010*, three
specific conditions are treated as a disability from the day of diagnosis,
without the patient needing to demonstrate substantial and long-term
adverse effects:

1. HIV infection
2. Cancer
3. Multiple sclerosis

DWP fit-note policy 5.8 instructs healthcare professionals to discuss
these conditions with patients to explore workplace adjustments.

## Form implementation

When a diagnosis matches any of the three conditions (via the
`is_automatic_disability` checkbox or by text-pattern match against the
diagnosis description), the grader fires the `automatic_disability` safety
flag with `medium` priority and the recommendation becomes
`refer_access_to_work` (Access to Work is a government grant supporting
disabled workers with workplace adjustments beyond reasonable adjustment).

## Why this matters

A clinician issuing a fit note for a newly diagnosed HIV-positive patient,
for example, should signpost the patient to:

- the [Access to Work grant](https://www.gov.uk/access-to-work),
- the [Health Adjustment Passport (HAP)](https://www.gov.uk/government/publications/health-adjustment-passport),
- the patient's employer for a conversation about reasonable adjustments,
- specialist support charities (e.g. Macmillan for cancer, MS Society).

Capturing the automatic-disability flag in the structured grade allows
employer-facing systems to triage these notes for additional support
without requiring the clinician to repeat the signposting in free text.

## Further reading

- UK Government. *Definition of disability under the Equality Act 2010*.
  <https://www.gov.uk/definition-of-disability-under-equality-act-2010>
- UK Government. *Access to Work*. <https://www.gov.uk/access-to-work>
- UK Government. *Health Adjustment Passport (HAP)*.
- Macmillan. *Work and cancer*.
- MS Society. *Work and MS*.
