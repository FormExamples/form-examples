# Clinical Safety Case — Placeholders

This form is rheumatology decision-support software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety Officer
process (**DCB0129** for manufacturers, **DCB0160** for deploying
organizations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A clinician-administered rheumatology assessment that records 28-joint
> tender and swollen counts, ESR/CRP, patient global health VAS, and
> extra-articular features, computes DAS28-ESR / DAS28-CRP and a EULAR
> activity band, and emits "consider biologic eligibility",
> extra-articular MDT-referral, and EULAR-response flags aligned to NICE
> NG100, BSR, EULAR and ACR guidance.

## Intended users

Registered rheumatologists, rheumatology specialist nurses, and the
rheumatology MDT.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect DAS28 displayed | Engine rule bug or wrong formula variant | Vitest unit tests on `das28-grader` using DAS28 spreadsheet worked examples; explicit `variant` flag in output (ESR vs CRP) |
| H-02 | DAS28 reported with self-report joint counts | Patient performs joint count | Step 3 requires "examiner identifier"; report carries provenance |
| H-03 | Wrong joint set | MTP / ankle joints inadvertently included | Step 3 UI lists the 28 joints explicitly; cannot record outside the set |
| H-04 | Stale ESR / CRP used | Acute-phase marker recorded days before | Step 6 lab fields require sample date |
| H-05 | Biologic eligibility threshold misunderstood | DAS28 > 5.1 flagged but eligibility requires sustained activity over time | Flag wording reads "consider biologic eligibility per NICE TA — confirm sustained activity" |
| H-06 | Mis-identified patient | NHS number entered incorrectly | Demographics step confirms name + DOB + NHS |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Clinician with motor / vision impairment | Component library follows WCAG 2.2 AA |
| H-09 | Evidence drift | NICE TA / EULAR / ACR thresholds updated | Rule catalogue in `das28-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
treatment intensification and biologic eligibility consideration.

## Verification evidence

- `das28-grader.test.ts` Vitest unit tests on DAS28-ESR and DAS28-CRP
  formulae and every EULAR band cut-off.
- `bin/test-form rheumatology-assessment` structural tests.
- Manual review against the Nijmegen DAS-Score spreadsheet worked
  examples (https://www.das-score.nl/).

## Post-market surveillance

Deploying trust to:

- Audit DAS28 > 5.1 results that did not lead to a documented treatment
  decision.
- Audit extra-articular feature flags that did not lead to MDT discussion.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
