# Clinical Safety Case — Placeholders

This form is oncology decision-support software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety Officer
process (**DCB0129** for manufacturers, **DCB0160** for deploying
organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> An oncology assessment record that captures cancer diagnosis,
> treatment history, current treatment, symptoms and toxicities, and
> emits an ECOG performance status, CTCAE-aligned toxicity flags, and a
> functional / psychosocial summary. It supports but does not replace
> oncology MDT clinical judgement. The final ECOG grade and treatment
> plan are the responsibility of the registered clinician.

## Intended users

Registered oncologists, oncology clinical nurse specialists, oncology
pharmacists, and palliative-care liaison clinicians.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect ECOG grade displayed | Engine rule bug or mis-read patient self-report | Vitest unit tests on `ecog-grader`; clinician override available; both computed and final stored |
| H-02 | Grade 3+ toxicity not surfaced | CTCAE-aligned field not completed | Step 6 has an explicit toxicity grade field per side-effect category; summary banner if any Grade ≥ 3 |
| H-03 | Wrong cancer site / stage recorded | Free-text data entry error | Step 2 uses ICD-10 / SNOMED-coded fields with structured staging |
| H-04 | Treatment line confused | Step 3 vs Step 4 (history vs current) | Step labels and printed report make line numbering explicit |
| H-05 | Stale assessment used | Days-old ECOG used after clinical change | Each assessment timestamped; report carries completion date |
| H-06 | Mis-identified patient | NHS number entered incorrectly | Demographics step shows name + DOB + NHS for confirmation |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Patient with cognitive / fatigue impairment cannot self-report | Component library follows WCAG 2.2 AA; carer / clinician-assisted completion mode |
| H-09 | Evidence drift | CTCAE / ECOG / NICE TA thresholds updated | Rule catalogue in `ecog-grading-rules.md` reviewed annually |
| H-10 | Palliative referral missed | ECOG 4 not surfaced | Engine raises urgent palliative-care flag at ECOG ≥ 4 |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output informs
systemic-therapy eligibility and supportive-care escalation.

## Verification evidence

- `ecog-grader.test.ts` Vitest unit tests on every ECOG grade and
  decline-detection branch.
- `bin/test-form oncology-assessment` structural tests.
- Manual review against Oken 1982 worked examples.

## Post-market surveillance

Deploying trust to:

- Audit Grade ≥ 3 toxicity flags that did not trigger documented MDT
  review.
- Audit ECOG ≥ 3 results that did not trigger documented palliative-care
  consideration.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
