# Clinical Safety Case — Placeholders

This form is dental decision-support software and, under UK regulation,
falls within scope of the NHS Digital Clinical Safety Officer process
(**DCB0129** for manufacturers, **DCB0160** for deploying
organisations). Dental software in the NHS is also subject to the
General Dental Council Standards.

This document is a **placeholder** intended to be populated during a
practice deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A dentist-administered oral-health assessment that records a DMFT
> per-tooth examination, BPE periodontal screen, intraoral findings,
> medical history and radiographic findings, and emits flags for
> periodontal disease (BPE 3 / 4 / *) and suspected head-and-neck
> cancer (NICE NG12). It supports but does not replace clinical
> judgement.

## Intended users

UK-registered dentists, dental therapists / hygienists, and dental
nurses operating within their scope of practice (per GDC Standards).

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect DMFT total | Engine summation bug | Vitest unit tests on `dmft-grader`; explicit DMFT = D + M + F formula |
| H-02 | Non-carious missing tooth counted as M | Field labelling | Step 4 has explicit "missing for non-carious reason" option that is excluded from M |
| H-03 | BPE * not surfaced | Sextant field defaults to 0 | Step 5 requires each sextant to be answered; * is a separate boolean per sextant |
| H-04 | Suspected oral cancer missed | Patient does not understand "non-healing ulcer" | Plain-English wording on Step 6; banner if NG12 criterion met |
| H-05 | Medical-history interaction missed | Polypharmacy with bisphosphonates and planned extraction | Step 7 surfaces ONJ-risk drugs as a flag |
| H-06 | Mis-identified patient | Patient identifier entered incorrectly | Demographics step confirms name + DOB |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Clinician with motor / vision impairment | Component library follows WCAG 2.2 AA |
| H-09 | Evidence drift | BSP BPE / NICE / AAP-EFP guidance updated | Rule catalogue in `dmft-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
periodontal-treatment planning and 2-week-wait referral for suspected
oral cancer.

## Verification evidence

- `dmft-grader.test.ts` Vitest unit tests for D / M / F counting,
  third-molar handling, and BPE banding.
- `bin/test-form dental-assessment` structural tests.
- Manual review against WHO Oral Health Surveys 5th edition worked
  examples.

## Post-market surveillance

Deploying practice to:

- Audit BPE 3 / 4 / * results to confirm periodontal treatment plan
  recorded.
- Audit suspected-oral-cancer flags to confirm 2-week-wait pathway
  followed.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
