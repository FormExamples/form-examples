# Clinical Safety Case — Placeholders

This form is patient-facing dermatology quality-of-life software and,
under UK regulation, falls within scope of the NHS Digital Clinical Safety
Officer process (**DCB0129** for manufacturers, **DCB0160** for deploying
organizations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A patient-facing dermatology questionnaire that records the Dermatology
> Life Quality Index (DLQI) and a structured lesion / medical history. It
> generates a clinical report with severity banding and lesion red-flag
> alerts. It supports but does not replace clinical assessment by a
> dermatologist or general practitioner.

## Intended users

Patients with dermatological symptoms (self-report or with carer
assistance), and the dermatology / primary care clinicians who review the
report.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect DLQI band displayed | Engine rule bug | Vitest unit tests on `dlqi-grader`; band thresholds taken verbatim from Hongbo 2005 |
| H-02 | Missed melanoma red flag | Lesion checkbox not surfaced to clinician | Step 4 surfaces NICE NG12 7-point checklist features; banner on summary step if any major or ≥ 3 points |
| H-03 | DLQI Q7 mis-scored | Special-case handling for work/study item | Unit test fixtures for Q7 = "yes" / "no" / "not relevant" |
| H-04 | Self-report bias | Patient under- or over-reports impact | Report explicitly states "patient self-report"; clinician reviews before clinical decisions |
| H-05 | Stale DLQI used for biologic eligibility | Score recorded weeks before NICE TA review | Each completion is timestamped; report carries the completion date |
| H-06 | Mis-identified patient | NHS / personal identifier entered incorrectly | Demographics step shows printed name back to patient for confirmation |
| H-07 | Data loss | Browser crash before submit | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Patient with vision / motor / cognitive impairment cannot self-complete | Component library follows WCAG 2.2 AA; carer-completion mode acceptable per DLQI guidance |
| H-09 | Clinical evidence drift | DLQI banding or NICE TA thresholds change | Banding catalogue in `dlqi-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. The output drives
clinician triage and informs NICE TA biologic eligibility discussions.
Final clinical decision rests with a registered clinician.

## Verification evidence

- `dlqi-grader.test.ts` Vitest unit tests for every banding cut-off and
  Q7 edge case.
- `bin/test-form dermatology-assessment` structural tests.
- Manual review against Hongbo 2005 worked examples.

## Post-market surveillance

Deploying trust to:

- Audit any DLQI > 10 result that did not lead to a documented clinician
  review.
- Audit any lesion red-flag firing that did not lead to a 2-week-wait
  referral or documented clinical decision otherwise.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
