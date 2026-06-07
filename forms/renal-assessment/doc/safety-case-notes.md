# Clinical Safety Case — Placeholders

This form is renal decision-support software and, under UK regulation,
falls within scope of the NHS Digital Clinical Safety Officer process
(**DCB0129** for manufacturers, **DCB0160** for deploying
organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A clinician-administered renal assessment that records eGFR,
> albuminuria, comorbidities, imaging, and medications, applies the
> KDIGO 2012/2024 CKD heatmap to produce a composite risk band, and
> emits referral, AKI-suspicion, and medication-review flags aligned to
> NICE NG203 and the KDIGO guideline series.

## Intended users

Registered renal physicians, general physicians, primary-care
clinicians, renal nurse specialists, and renal pharmacists.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect CKD stage displayed | Engine rule bug or wrong eGFR unit | Vitest unit tests on `kdigo-grader` for every G/A cell; eGFR field validates mL/min/1.73 m² |
| H-02 | AKI missed | Baseline creatinine not entered | If baseline is null, AKI rule defaults to "indeterminate" and prompts clinician |
| H-03 | Wrong eGFR equation assumed | Lab supplies MDRD; report says CKD-EPI | Step 5 records the equation name when supplied; report carries provenance |
| H-04 | Drug not dose-adjusted | Step 8 reviewed superficially | Step 8 lists each medication with eGFR threshold from BNF / Renal Drug Database for clinician review |
| H-05 | Stale eGFR used | Months-old value drives composite | Step 5 fields require sample date; rule fires if eGFR > 6 months old |
| H-06 | Mis-identified patient | NHS number entered incorrectly | Demographics step confirms name + DOB + NHS |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Clinician with visual / motor impairment | Component library follows WCAG 2.2 AA |
| H-09 | Evidence drift | KDIGO / NICE NG203 thresholds updated | Rule catalogue in `kdigo-staging-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
nephrology referral and informs medication review for renally cleared
drugs.

## Verification evidence

- `kdigo-grader.test.ts` Vitest unit tests for every cell of the
  6 × 3 KDIGO heatmap and every AKI stage.
- `bin/test-form renal-assessment` structural tests.
- Manual review against KDIGO 2012 Figure 6 worked examples.

## Post-market surveillance

Deploying trust to:

- Audit Stage G4 / G5 results that did not trigger a documented
  referral.
- Audit AKI flags that did not trigger an investigation.
- Audit medication-review prompts that did not result in a documented
  decision.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
