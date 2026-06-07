# Clinical Safety Case — Placeholders

This form is urology decision-support software and, under UK regulation,
falls within scope of the NHS Digital Clinical Safety Officer process
(**DCB0129** for manufacturers, **DCB0160** for deploying
organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A patient-completed urology questionnaire that records the IPSS,
> quality-of-life bother score, urinary symptoms, renal function
> indicators, sexual-health items, and medical history. It computes an
> IPSS severity band and emits red-flag alerts aligned to NICE CG97 /
> NG12 / NG203 and BAUS / AUA guidance.

## Intended users

Patients with LUTS or general urological symptoms, and the urology /
primary-care clinicians who review the report.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect IPSS band displayed | Engine rule bug | Vitest unit tests on `ipss-grader` covering each cut-off |
| H-02 | Visible haematuria missed | Patient does not understand "visible blood in urine" | Step 5 has plain-English question with example wording |
| H-03 | PSA misinterpreted | PSA value entered in wrong unit | Step 8 PSA field validates µg/L only |
| H-04 | eGFR field treated as transcription | Patient self-reports a remembered eGFR | Field marked clinician-verified; report carries provenance |
| H-05 | IPSS used in non-male / paediatric context | Form deployed to wrong cohort | Form is restricted to adult males in deployment guidance |
| H-06 | Stale assessment used | Days-old IPSS used at clinic appointment | Each assessment timestamped |
| H-07 | Mis-identified patient | NHS number entered incorrectly | Demographics step confirms name + DOB + NHS |
| H-08 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-09 | Accessibility failure | Patient with motor / vision impairment | Component library follows WCAG 2.2 AA |
| H-10 | Evidence drift | NICE NG12 PSA thresholds updated | Rule catalogue in `ipss-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
referral urgency for suspected urological cancer and treatment
escalation for LUTS.

## Verification evidence

- `ipss-grader.test.ts` Vitest unit tests on every IPSS band and
  haematuria / PSA / eGFR rule.
- `bin/test-form urology-assessment` structural tests.
- Manual review against Barry 1992 worked examples.

## Post-market surveillance

Deploying trust to:

- Audit haematuria red-flag firings to confirm 2-week-wait pathway was
  followed.
- Audit PSA-trigger flags that did not lead to a documented decision.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
