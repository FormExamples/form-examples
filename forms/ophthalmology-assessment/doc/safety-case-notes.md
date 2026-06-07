# Clinical Safety Case — Placeholders

This form is ophthalmology decision-support software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety Officer
process (**DCB0129** for manufacturers, **DCB0160** for deploying
organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A clinician-administered ophthalmology assessment that captures visual
> acuity, anterior and posterior segment findings, visual field, and
> systemic comorbidities, and emits a WHO visual-impairment band and a
> set of urgent-referral flags aligned to RCOphth and NICE guidance.

## Intended users

Registered ophthalmologists, optometrists, ophthalmic nurses, and
orthoptists working in NHS and equivalent regulated settings.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect impairment band | Engine rule bug or wrong VA notation conversion | Vitest unit tests on `va-grader`; every Snellen / decimal / logMAR conversion validated against Bailey & Lovie 1976 |
| H-02 | Retinal detachment red flag missed | Patient does not understand "flashes / floaters" wording | Plain-English help text on Step 2 chief complaint |
| H-03 | IOP critical value not surfaced | Mis-entry of IOP units | Step 5 IOP field is mmHg only; validation range 0-80; > 30 mmHg fires R-OPH-IOP-CRIT |
| H-04 | Wet AMD red flag missed | Sudden distortion not asked | Step 2 has explicit "sudden distortion or central scotoma" item |
| H-05 | Stale VA used for treatment | VA recorded days before injection clinic | Each assessment timestamped |
| H-06 | Mis-identified patient | NHS number entered incorrectly | Demographics step shows name + DOB + NHS |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Patient with visual impairment cannot read on-screen text | Component library supports high-contrast theme and large fonts |
| H-09 | Evidence drift | RCOphth / NICE / WHO thresholds updated | Rule catalogue in `visual-acuity-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
referral urgency for sight-threatening conditions.

## Verification evidence

- `va-grader.test.ts` Vitest unit tests on every Snellen/logMAR mapping
  and every red-flag rule.
- `bin/test-form ophthalmology-assessment` structural tests.
- Manual review against WHO ICD-11 visual-impairment categories.

## Post-market surveillance

Deploying trust to:

- Audit retinal detachment, suspected wet AMD, and acute glaucoma flags
  to confirm same-day or 2-week-wait pathway was followed.
- Audit "Consider CVI" flag results that did not lead to a CVI
  certification decision within the trust's SLA.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
